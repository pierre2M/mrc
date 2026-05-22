import { env } from '$env/dynamic/private';
import Anthropic from '@anthropic-ai/sdk';
import { DEMO_SYSTEM_PROMPT, PII_PATTERNS } from '$lib/demo-prompt';
import type { RequestHandler } from './$types';

// Best-effort in-memory rate limiter (not cross-instance on serverless)
const rateLimitMap = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (rateLimitMap.get(ip) ?? []).filter(t => now - t < 60_000);
  if (recent.length >= 20) return true;
  recent.push(now);
  rateLimitMap.set(ip, recent);
  return false;
}

function hasPii(text: string): boolean {
  return PII_PATTERNS.some(p => p.test(text));
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

export const POST: RequestHandler = async ({ request, getClientAddress }) => {
  if (isRateLimited(getClientAddress())) {
    return new Response(
      JSON.stringify({ error: 'Trop de requêtes — réessayez dans une minute.' }),
      { status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': '60' } }
    );
  }

  const apiKey = env.ANTHROPIC_API_KEY;
  if (!apiKey) return json({ error: 'Clé API non configurée.' }, 500);

  let body: { question?: string; document?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Corps de requête invalide.' }, 400);
  }

  const { question, document: docContent } = body;
  if (!question?.trim()) return json({ error: 'Question manquante.' }, 400);

  // Layer 1: regex pre-screen before calling Claude
  const fullText = [question, docContent].filter(Boolean).join('\n');
  if (hasPii(fullText)) {
    return json(
      { error: 'Le texte soumis contient des données personnelles identifiantes (email, téléphone, NIR, IBAN…). Anonymisez le document avant de le soumettre.' },
      422
    );
  }

  const userContent = docContent?.trim()
    ? `Document soumis :\n\n${docContent.trim()}\n\n---\n\nQuestion : ${question.trim()}`
    : question.trim();

  const client = new Anthropic({ apiKey });

  let raw: string;
  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      system: DEMO_SYSTEM_PROMPT,
      messages: [
        { role: 'user', content: userContent },
        { role: 'assistant', content: '{' }  // prefill : force la sortie JSON
      ]
    });
    // Le prefill '{' n'est pas répété dans la réponse, on le rajoute
    raw = '{' + (message.content[0].type === 'text' ? message.content[0].text : '');
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return json({ error: `Erreur API : ${msg}` }, 502);
  }

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return json({ error: 'Réponse du modèle invalide. Réessayez.' }, 502);
  }

  // Layer 2: Claude's own PII assessment
  if (parsed.alerte_donnees_personnelles === true) {
    return json(
      { error: 'Le modèle a détecté des données personnelles dans votre document. Anonymisez-le avant de le soumettre.' },
      422
    );
  }

  return json(parsed);
};
