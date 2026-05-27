import { env } from '$env/dynamic/private';
import Anthropic from '@anthropic-ai/sdk';
import {
  SYSTEM_PROMPTS,
  PII_PATTERNS,
  isJsonMode,
  type Mode,
} from '$lib/demo-prompt';
import { readQuota, encodeQuota, QUOTA_LIMIT } from '$lib/token-quota';
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

function json(body: unknown, status = 200, extra?: HeadersInit): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...extra },
  });
}

async function verifyTurnstile(token: string, ip: string, secret: string): Promise<boolean> {
  // Cloudflare test secret key → always passes (dev / CI)
  if (secret === '1x0000000000000000000000000000000AA') return true;
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, response: token, remoteip: ip }),
    });
    const data = await res.json() as { success: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

const VALID_MODES: Mode[] = ['decouverte', 'analyse', 'expert'];

// ─── Handler principal ────────────────────────────────────────────────────────

export const POST: RequestHandler = async ({ request, getClientAddress, cookies }) => {
  const ip = getClientAddress();

  if (isRateLimited(ip)) {
    return new Response(
      JSON.stringify({ error: 'Trop de requêtes — réessayez dans une minute.' }),
      { status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': '60' } },
    );
  }

  const apiKey            = env.ANTHROPIC_API_KEY;
  const quotaSecret       = env.QUOTA_SECRET;
  const turnstileSecret   = env.TURNSTILE_SECRET_KEY;

  if (!apiKey) return json({ error: 'Clé API non configurée.' }, 500);

  // ── Parsing du corps ──────────────────────────────────────────────────────
  let body: { question?: string; document?: string; mode?: string; turnstileToken?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Corps de requête invalide.' }, 400);
  }

  const { question, document: docContent, mode: rawMode, turnstileToken } = body;

  if (!question?.trim()) return json({ error: 'Question manquante.' }, 400);

  // ── Vérification Turnstile ────────────────────────────────────────────────
  if (turnstileSecret) {
    if (!turnstileToken) {
      return json({ error: 'Vérification anti-bot manquante. Rechargez la page.' }, 403);
    }
    const ok = await verifyTurnstile(turnstileToken, ip, turnstileSecret);
    if (!ok) {
      return json({ error: 'Vérification anti-bot échouée. Rechargez la page et réessayez.' }, 403);
    }
  }

  // ── Vérification quota ────────────────────────────────────────────────────
  const quotaData = quotaSecret
    ? readQuota(cookies.get('mrc_quota'), quotaSecret)
    : { used: 0, day: '' };

  if (quotaSecret && quotaData.used >= QUOTA_LIMIT) {
    return json(
      {
        error: `Quota journalier atteint (${QUOTA_LIMIT.toLocaleString('fr')} tokens). Revenez demain.`,
        quotaUsed: quotaData.used,
        quotaLimit: QUOTA_LIMIT,
      },
      429,
    );
  }

  const mode: Mode = VALID_MODES.includes(rawMode as Mode) ? (rawMode as Mode) : 'decouverte';

  // ── Détection PII niveau 1 (regex) ────────────────────────────────────────
  const fullText = [question, docContent].filter(Boolean).join('\n');
  if (hasPii(fullText)) {
    return json(
      { error: 'Le texte soumis contient des données personnelles identifiantes (email, téléphone, NIR, IBAN…). Anonymisez le document avant de le soumettre.' },
      422,
    );
  }

  // ── Construction du message utilisateur ───────────────────────────────────
  const userContent = docContent?.trim()
    ? `Document soumis :\n\n${docContent.trim()}\n\n---\n\nQuestion : ${question.trim()}`
    : question.trim();

  // ── Appel Anthropic ───────────────────────────────────────────────────────
  const client = new Anthropic({ apiKey });
  const useJson = isJsonMode(mode);

  let rawText: string;
  let tokensUsed = 0;

  try {
    if (useJson) {
      const message = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: mode === 'expert' ? 6144 : 3072,
        system: SYSTEM_PROMPTS[mode],
        messages: [
          { role: 'user', content: userContent },
          { role: 'assistant', content: '{' },
        ],
      });
      rawText = '{' + (message.content[0].type === 'text' ? message.content[0].text : '');
      tokensUsed = message.usage.input_tokens + message.usage.output_tokens;
    } else {
      const message = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        system: SYSTEM_PROMPTS[mode],
        messages: [{ role: 'user', content: userContent }],
      });
      rawText = message.content[0].type === 'text' ? message.content[0].text : '';
      tokensUsed = message.usage.input_tokens + message.usage.output_tokens;
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return json({ error: `Erreur API : ${msg}` }, 502);
  }

  // ── Mise à jour du quota ──────────────────────────────────────────────────
  const newUsed = quotaData.used + tokensUsed;
  if (quotaSecret) {
    cookies.set('mrc_quota', encodeQuota(newUsed, quotaSecret), {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      maxAge: 60 * 60 * 48, // 48 h pour survivre au changement de jour
    });
  }

  const quotaHeaders = {
    'X-Quota-Used':      String(newUsed),
    'X-Quota-Remaining': String(Math.max(0, QUOTA_LIMIT - newUsed)),
    'X-Quota-Limit':     String(QUOTA_LIMIT),
  };

  // ── Traitement de la réponse ──────────────────────────────────────────────
  if (!useJson) {
    return json(
      { reponse: rawText, signaux: [], alerte_donnees_personnelles: false },
      200,
      quotaHeaders,
    );
  }

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    return json({ error: 'Réponse du modèle invalide. Réessayez.' }, 502);
  }

  if (parsed.alerte_donnees_personnelles === true) {
    return json(
      { error: 'Le modèle a détecté des données personnelles dans votre document. Anonymisez-le avant de le soumettre.' },
      422,
    );
  }

  return json(parsed, 200, quotaHeaders);
};
