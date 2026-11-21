import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types';
import type {
  ItemFilters,
  ItemStatus,
  MediaType,
  Profile,
  SearchResponse,
  SearchResult,
  StatRow,
  UserItem,
  UserItemUpdate,
} from './types';
import { itemKey } from './types';

export type AcervoClient = SupabaseClient<Database>;

export class AcervoError extends Error {}

function fail(message: string, cause?: unknown): never {
  const detail = cause && typeof cause === 'object' && 'message' in cause ? `: ${(cause as { message: string }).message}` : '';
  throw new AcervoError(`${message}${detail}`);
}

// ---------------------------------------------------------------------
// Busca nas APIs externas (via Edge Function)
// ---------------------------------------------------------------------
export async function searchMedia(
  client: AcervoClient,
  type: MediaType,
  query: string,
  page = 1,
): Promise<SearchResponse> {
  const { data, error } = await client.functions.invoke<SearchResponse & { error?: string }>('search', {
    body: { type, query, page },
  });
  if (error) {
    // FunctionsHttpError traz a resposta original no context
    let message = 'Não foi possível buscar';
    try {
      const ctx = (error as { context?: Response }).context;
      const body = ctx ? await ctx.json() : null;
      if (body?.error) message = body.error;
    } catch {
      /* mantém mensagem padrão */
    }
    throw new AcervoError(message);
  }
  if (!data) throw new AcervoError('Resposta vazia da busca');
  return data;
}

// ---------------------------------------------------------------------
// Itens do usuário
// ---------------------------------------------------------------------
export async function listItems(client: AcervoClient, filters: ItemFilters = {}): Promise<UserItem[]> {
  const { mediaType, status, search, sort = 'recent', limit = 60, offset = 0 } = filters;
  let query = client.from('user_items').select('*');

  if (mediaType) query = query.eq('media_type', mediaType);
  if (status) query = query.eq('status', status);
  if (search?.trim()) query = query.ilike('title', `%${search.trim().replace(/[%_]/g, '\\$&')}%`);

  switch (sort) {
    case 'priority':
      query = query.order('priority', { ascending: false }).order('created_at', { ascending: false });
      break;
    case 'title':
      query = query.order('title', { ascending: true });
      break;
    case 'rating':
      query = query.order('rating', { ascending: false, nullsFirst: false }).order('title');
      break;
    default:
      query = query.order('created_at', { ascending: false });
  }

  const { data, error } = await query.range(offset, offset + limit - 1);
  if (error) fail('Erro ao carregar a lista', error);
  return data as UserItem[];
}

export async function getItem(client: AcervoClient, id: string): Promise<UserItem | null> {
  const { data, error } = await client.from('user_items').select('*').eq('id', id).maybeSingle();
  if (error) fail('Erro ao carregar o item', error);
  return data as UserItem | null;
}

/** Retorna as chaves (tipo:provider:id) dos itens já salvos, para marcar na busca. */
export async function getSavedKeys(client: AcervoClient, mediaType: MediaType): Promise<Map<string, string>> {
  const { data, error } = await client
    .from('user_items')
    .select('id, media_type, provider, external_id')
    .eq('media_type', mediaType);
  if (error) fail('Erro ao verificar itens salvos', error);
  return new Map((data ?? []).map((row) => [itemKey(row), row.id]));
}

export async function addItem(
  client: AcervoClient,
  result: SearchResult,
  status: ItemStatus = 'wishlist',
): Promise<UserItem> {
  const { data, error } = await client
    .from('user_items')
    .upsert(
      {
        media_type: result.mediaType,
        provider: result.provider,
        external_id: result.externalId,
        title: result.title,
        subtitle: result.subtitle,
        image_url: result.imageUrl,
        year: result.year,
        metadata: result.metadata as Database['public']['Tables']['user_items']['Insert']['metadata'],
        status,
      },
      { onConflict: 'user_id,media_type,provider,external_id' },
    )
    .select('*')
    .single();
  if (error) fail('Erro ao salvar o item', error);
  return data as UserItem;
}

export async function updateItem(client: AcervoClient, id: string, patch: UserItemUpdate): Promise<UserItem> {
  const { data, error } = await client.from('user_items').update(patch).eq('id', id).select('*').single();
  if (error) fail('Erro ao atualizar o item', error);
  return data as UserItem;
}

export async function removeItem(client: AcervoClient, id: string): Promise<void> {
  const { error } = await client.from('user_items').delete().eq('id', id);
  if (error) fail('Erro ao remover o item', error);
}

// ---------------------------------------------------------------------
// Estatísticas e perfil
// ---------------------------------------------------------------------
export interface StatsSummary {
  total: number;
  byStatus: Record<ItemStatus, number>;
  byType: Record<MediaType, { total: number; completed: number; avgRating: number | null }>;
}

export async function getStats(client: AcervoClient): Promise<StatsSummary> {
  const { data, error } = await client.from('user_item_stats').select('media_type, status, total, avg_rating');
  if (error) fail('Erro ao carregar estatísticas', error);
  return summarizeStats((data ?? []) as StatRow[]);
}

export function summarizeStats(rows: StatRow[]): StatsSummary {
  const byStatus = { wishlist: 0, in_progress: 0, completed: 0, dropped: 0 } as Record<ItemStatus, number>;
  const byType = {} as StatsSummary['byType'];
  const ratingAcc = {} as Record<string, { sum: number; n: number }>;
  let total = 0;

  for (const r of rows) {
    total += r.total;
    byStatus[r.status] += r.total;
    const t = (byType[r.media_type] ??= { total: 0, completed: 0, avgRating: null });
    t.total += r.total;
    if (r.status === 'completed') t.completed += r.total;
    if (r.avg_rating != null) {
      const acc = (ratingAcc[r.media_type] ??= { sum: 0, n: 0 });
      acc.sum += r.avg_rating * r.total;
      acc.n += r.total;
    }
  }
  for (const [type, acc] of Object.entries(ratingAcc)) {
    const t = byType[type as MediaType];
    if (t && acc.n) t.avgRating = Math.round((acc.sum / acc.n) * 10) / 10;
  }
  return { total, byStatus, byType };
}

export async function getProfile(client: AcervoClient): Promise<Profile | null> {
  const { data, error } = await client.from('profiles').select('id, display_name, avatar_url').maybeSingle();
  if (error) fail('Erro ao carregar o perfil', error);
  return data;
}
