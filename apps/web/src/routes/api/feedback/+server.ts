import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

function jsonResp(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const POST: RequestHandler = async ({ request }) => {
  let body: { name?: string; email?: string; page?: string; message?: string };
  try {
    body = await request.json();
  } catch {
    return jsonResp({ error: 'Corps invalide.' }, 400);
  }

  const { name, email, page, message } = body;
  if (!name?.trim() || !email?.trim()) {
    return jsonResp({ error: 'Nom et email requis.' }, 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return jsonResp({ error: 'Adresse email invalide.' }, 400);
  }

  const resendKey   = env.RESEND_API_KEY;
  const toEmail     = env.CONTACT_TO_EMAIL;
  const fromAddress = env.RESEND_FROM || 'MRC <onboarding@resend.dev>';

  if (resendKey && toEmail) {
    const pageLabel = page?.trim() || '(inconnue)';
    const html = [
      `<h2>Retour visiteur — ${pageLabel}</h2>`,
      `<p><strong>Nom :</strong> ${name}</p>`,
      `<p><strong>Email :</strong> ${email}</p>`,
      `<p><strong>Page :</strong> ${pageLabel}</p>`,
      `<p><strong>Commentaire :</strong></p>`,
      `<p>${message?.trim() ? message.replace(/\n/g, '<br>') : '(aucun commentaire)'}</p>`,
    ].join('\n');

    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: fromAddress,
          to: [toEmail],
          reply_to: email,
          subject: `Retour MRC — ${pageLabel} — ${name}`,
          html,
        }),
      });
    } catch {
      // Ne bloque pas l'utilisateur si l'envoi échoue
    }
  }

  return jsonResp({ ok: true });
};
