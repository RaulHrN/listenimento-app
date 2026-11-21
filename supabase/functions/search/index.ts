// Edge Function "search"
// Recebe { type, query, page } e devolve resultados normalizados.
// As chaves das APIs externas ficam só aqui (secrets do Supabase),
// nunca no app ou no site. Exige usuário logado (verify_jwt = true).
import { json, corsHeaders } from '../_shared/cors.ts';
import { MEDIA_TYPES, type MediaType } from '../_shared/types.ts';
import { ProviderError, providers } from './providers.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Use POST' }, 405);

  let body: { type?: string; query?: string; page?: number };
  try {
    body = await req.json();
  } catch {
    return json({ error: 'JSON inválido' }, 400);
  }

  const type = body.type as MediaType;
  const query = (body.query ?? '').trim();
  const page = Math.max(1, Math.min(50, Math.trunc(Number(body.page) || 1)));

  if (!MEDIA_TYPES.includes(type)) return json({ error: `Tipo inválido: ${body.type}` }, 400);
  if (query.length < 2) return json({ error: 'Digite ao menos 2 caracteres' }, 400);
  if (query.length > 200) return json({ error: 'Busca muito longa' }, 400);

  try {
    const result = await providers[type](query, page);
    return json(result);
  } catch (err) {
    console.error(`[search:${type}]`, err);
    const status = err instanceof ProviderError ? err.status : 500;
    const message = err instanceof Error ? err.message : 'Erro inesperado';
    return json({ error: message }, status);
  }
});
