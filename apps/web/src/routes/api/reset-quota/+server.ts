import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies, request }) => {
  const secret = env.RESET_QUOTA_SECRET;

  if (!secret) {
    return new Response(JSON.stringify({ error: 'Non configuré.' }), {
      status: 501,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const auth = request.headers.get('Authorization') ?? '';
  if (auth !== `Bearer ${secret}`) {
    return new Response(JSON.stringify({ error: 'Non autorisé.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  cookies.delete('mrc_quota', { path: '/' });

  return new Response(JSON.stringify({ ok: true, message: 'Quota réinitialisé.' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
