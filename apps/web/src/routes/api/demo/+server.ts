import { env } from '$env/dynamic/private';
import Anthropic from '@anthropic-ai/sdk';
import {
  SYSTEM_PROMPTS,
  PII_PATTERNS,
  isJsonMode,
  type Mode,
} from '$lib/demo-prompt';
import type { RequestHandler } from './$types';

// ─── Rate limiter en mémoire (best-effort, non cross-instance) ────────────────

const rateLimitMap = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (rateLimitMap.get(ip) ?? []).filter(t => now - t < 60_000);
  if (recent.length >= 20) return true;
  recent.push(now);
  rateLimitMap.set(ip, recent);
  return false;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function hasPii(text: string): boolean {
  return PII_PATTERNS.some(p => p.test(text));
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

const VALID_MODES: Mode[] = ['decouverte', 'analyse', 'expert'];

// ─── Handler principal ────────────────────────────────────────────────────────

export const POST: RequestHandler = async ({ request, getClientAddress }) => {
  if (isRateLimited(getClientAddress())) {
    return new Response(
      JSON.stringify({ error: 'Trop de requêtes — réessayez dans une minute.' }),
      { status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': '60' } },
    );
  }

  const apiKey = env.ANTHROPIC_API_KEY;
  if (!apiKey) return json({ error: 'Clé API non configurée.' }, 500);

  // ── Parsing du corps ──────────────────────────────────────────────────────
  let body: { question?: string; document?: string; mode?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Corps de requête invalide.' }, 400);
  }

  const { question, document: docContent, mode: rawMode } = body;

  if (!question?.trim()) return json({ error: 'Question manquante.' }, 400);

  const mode: Mode = VALID_MODES.includes(rawMode as Mode)
    ? (rawMode as Mode)
    : 'decouverte';

  // ── Détection PII niveau 1 (regex) ────────────────────────────────────────
  const fullText = [question, docContent].filter(Boolean).join('\n');
  if (hasPii(fullText)) {
    return json(
      {
        error:
          'Le texte soumis contient des données personnelles identifiantes (email, téléphone, NIR, IBAN…). Anonymisez le document avant de le soumettre.',
      },
      422,
    );
  }

  // ── Construction du message utilisateur ───────────────────────────────────
  const userContent =
    docContent?.trim()
      ? `Document soumis :\n\n${docContent.trim()}\n\n---\n\nQuestion : ${question.trim()}`
      : question.trim();

  // ── Appel Anthropic ───────────────────────────────────────────────────────
  const client = new Anthropic({ apiKey });
  const useJson = isJsonMode(mode);

  let rawText: string;
  try {
    if (useJson) {
      // Préfill JSON pour forcer la sortie structurée
      const message = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: useJson && mode === 'expert' ? 6144 : 3072,
        system: SYSTEM_PROMPTS[mode],
        messages: [
          { role: 'user', content: userContent },
          { role: 'assistant', content: '{' },
        ],
      });
      rawText = '{' + (message.content[0].type === 'text' ? message.content[0].text : '');
    } else {
      // Mode découverte : texte libre
      const message = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        system: SYSTEM_PROMPTS[mode],
        messages: [{ role: 'user', content: userContent }],
      });
      rawText = message.content[0].type === 'text' ? message.content[0].text : '';
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return json({ error: `Erreur API : ${msg}` }, 502);
  }

  // ── Traitement de la réponse ──────────────────────────────────────────────
  if (!useJson) {
    // Mode découverte : on renvoie le texte brut dans le même enveloppe JSON
    return json({ reponse: rawText, signaux: [], alerte_donnees_personnelles: false });
  }

  // Modes analyse/expert : on parse le JSON
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    return json({ error: 'Réponse du modèle invalide. Réessayez.' }, 502);
  }

  // Détection PII niveau 2 (évaluation du modèle)
  if (parsed.alerte_donnees_personnelles === true) {
    return json(
      {
        error:
          'Le modèle a détecté des données personnelles dans votre document. Anonymisez-le avant de le soumettre.',
      },
      422,
    );
  }

  return json(parsed);
};
