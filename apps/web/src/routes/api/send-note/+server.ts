import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';
import { vulgarisationNotes } from '$lib/vulgarisation-notes';

function jsonResp(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const POST: RequestHandler = async ({ request }) => {
  let body: { email?: string; code?: string };
  try {
    body = await request.json();
  } catch {
    return jsonResp({ error: 'Corps invalide.' }, 400);
  }

  const { email, code } = body;

  if (!email?.trim()) {
    return jsonResp({ error: 'Email requis.' }, 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return jsonResp({ error: 'Adresse email invalide.' }, 400);
  }

  const note = code ? vulgarisationNotes[code] : null;
  if (!note) {
    return jsonResp({ error: 'Note non disponible.' }, 404);
  }

  const resendKey = env.RESEND_API_KEY;

  if (resendKey) {
    // Convert plain text to HTML paragraphs
    const htmlBody = note.texte
      .split('\n\n')
      .filter((p) => p.trim())
      .map((p) => `<p>${p.replace(/\n/g, '<br>')}</p>`)
      .join('\n');

    const html = [
      `<h2>${note.titre}</h2>`,
      `<hr>`,
      htmlBody,
      `<hr>`,
      `<p style="color:#666;font-size:12px;">Note théorique MRC — Modèle de Registres de Communalité · La Coop des Communs</p>`,
    ].join('\n');

    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: 'MRC <onboarding@resend.dev>',
          to: [email],
          subject: note.titre,
          html,
        }),
      });
    } catch {
      // Don't block the user if email delivery fails
    }
  }

  return jsonResp({ ok: true });
};
