import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

function jsonResp(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const POST: RequestHandler = async ({ request }) => {
  let body: { name?: string; email?: string; noteCode?: string; noteLabel?: string };
  try {
    body = await request.json();
  } catch {
    return jsonResp({ error: 'Corps invalide.' }, 400);
  }

  const { name, email, noteCode, noteLabel } = body;
  if (!name?.trim() || !email?.trim()) return jsonResp({ error: 'Nom et email requis.' }, 400);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return jsonResp({ error: 'Adresse email invalide.' }, 400);

  const resendKey = env.RESEND_API_KEY;
  const toEmail   = env.CONTACT_TO_EMAIL;

  if (resendKey && toEmail) {
    const html = [
      `<h2>Demande de note MRC — ${noteCode ?? 'Note'}</h2>`,
      `<p><strong>Nom :</strong> ${name}</p>`,
      `<p><strong>Email :</strong> ${email}</p>`,
      `<p><strong>Note demandée :</strong> ${noteLabel ?? noteCode ?? '—'}</p>`,
    ].join('\n');

    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${resendKey}` },
        body: JSON.stringify({
          from: 'MRC Notes <onboarding@resend.dev>',
          to: [toEmail],
          reply_to: email,
          subject: `Demande note MRC — ${noteCode} — ${name}`,
          html,
        }),
      });
    } catch { /* don't block user on email failure */ }
  }

  return jsonResp({ ok: true });
};
