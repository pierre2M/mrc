import { env } from '$env/dynamic/private';
import Anthropic from '@anthropic-ai/sdk';
import { SYSTEM_PROMPTS } from '$lib/mrc-schema';
import type { RequestHandler } from './$types';

const JOURNAL_RE = /\[MRC_JOURNAL\][\s\S]*?\[\/MRC_JOURNAL\]/g;

function stripJournal(text: string): string {
  return text.replace(JOURNAL_RE, '').trim();
}

export const POST: RequestHandler = async ({ request }) => {
  const ANTHROPIC_API_KEY = env.ANTHROPIC_API_KEY;

  if (!ANTHROPIC_API_KEY) {
    return new Response(JSON.stringify({ error: 'ANTHROPIC_API_KEY non configurée' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const { message, mode, history, context } = await request.json();

  const systemPrompt = SYSTEM_PROMPTS[mode as keyof typeof SYSTEM_PROMPTS] ?? SYSTEM_PROMPTS.vulgarisation;

  // Clean journal blocks from history before sending to the API
  const cleanHistory = (history ?? []).map((m: { role: string; content: string }) => ({
    role: m.role,
    content: stripJournal(m.content)
  }));

  const userContent = context?.trim()
    ? `Contexte du document :\n\n${context.trim()}\n\n---\n\n${message}`
    : message;

  const messages = [...cleanHistory, { role: 'user', content: userContent }];

  const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      try {
        const stream = client.messages.stream({
          model: 'claude-sonnet-4-6',
          max_tokens: 2048,
          system: systemPrompt,
          messages
        });

        for await (const event of stream) {
          if (
            event.type === 'content_block_delta' &&
            event.delta.type === 'text_delta'
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        controller.enqueue(encoder.encode(`\n\n[Erreur API : ${msg}]`));
      } finally {
        controller.close();
      }
    }
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
      'X-Content-Type-Options': 'nosniff'
    }
  });
};
