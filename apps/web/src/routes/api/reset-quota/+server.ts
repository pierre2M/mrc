import { env } from '$env/dynamic/private';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

function unauthorized(): Response {
  return new Response(JSON.stringify({ error: 'Non autorisé.' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  });
}

// GET /api/reset-quota?secret=... — ouvrir dans le navigateur
export const GET: RequestHandler = async ({ cookies, url }) => {
  const secret = env.RESET_QUOTA_SECRET;
  if (!secret) throw redirect(302, '/');

  if (url.searchParams.get('secret') !== secret) return unauthorized();

  cookies.delete('mrc_quota', { path: '/' });
  throw redirect(302, '/usage-1');
};

// POST /api/reset-quota (Authorization: Bearer ...) — usage curl
export const POST: RequestHandler = async ({ cookies, request }) => {
  const secret = env.RESET_QUOTA_SECRET;
  if (!secret) {
    return new Response(JSON.stringify({ error: 'Non configuré.' }), {
      status: 501,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const auth = request.headers.get('Authorization') ?? '';
  if (auth !== `Bearer ${secret}`) return unauthorized();

  cookies.delete('mrc_quota', { path: '/' });
  return new Response(JSON.stringify({ ok: true, message: 'Quota réinitialisé.' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
