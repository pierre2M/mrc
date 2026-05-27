import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

function jsonResp(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const POST: RequestHandler = async ({ request }) => {
  let body: { name?: string; email?: string; message?: string };
  try {
    body = await request.json();
  } catch {
    return jsonResp({ error: 'Corps invalide.' }, 400);
  }

  const { name, email, message } = body;
  if (!name?.trim() || !email?.trim()) {
    return jsonResp({ error: 'Nom et email requis.' }, 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return jsonResp({ error: 'Adresse email invalide.' }, 400);
  }

  const resendKey = env.RESEND_API_KEY;
  const toEmail   = env.CONTACT_TO_EMAIL;

  if (resendKey && toEmail) {
    const html = [
      '<h2>Nouveau contact — Démonstrateur MRC</h2>',
      `<p><strong>Nom :</strong> ${name}</p>`,
      `<p><strong>Email :</strong> ${email}</p>`,
      `<p><strong>Message :</strong></p>`,
      `<p>${message ? message.replace(/\n/g, '<br>') : '(aucun message)'}</p>`,
    ].join('\n');

    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: 'MRC Démonstrateur <onboarding@resend.dev>',
          to: [toEmail],
          reply_to: email,
          subject: `Contact démonstrateur MRC — ${name}`,
          html,
        }),
      });
    } catch {
      // Don't block the user if email fails — contact is acknowledged
    }
  }

  return jsonResp({ ok: true });
};
