export type MediaType = 'movie' | 'series' | 'game' | 'book' | 'place' | 'anime' | 'boardgame';
export type ItemStatus = 'wishlist' | 'in_progress' | 'completed' | 'dropped';

export const MEDIA_TYPES: MediaType[] = ['movie', 'series', 'game', 'book', 'place', 'anime', 'boardgame'];
export const ITEM_STATUSES: ItemStatus[] = ['wishlist', 'in_progress', 'completed', 'dropped'];

/** Resultado normalizado vindo da Edge Function `search`. */
export interface SearchResult {
  mediaType: MediaType;
  provider: string;
  externalId: string;
  title: string;
  subtitle: string | null;
  imageUrl: string | null;
  year: number | null;
  metadata: Record<string, unknown>;
}

export interface SearchResponse {
  results: SearchResult[];
  page: number;
  hasMore: boolean;
}

/** Item salvo pelo usuário (linha de `user_items`). */
export interface UserItem {
  id: string;
  user_id: string;
  media_type: MediaType;
  provider: string;
  external_id: string;
  title: string;
  subtitle: string | null;
  image_url: string | null;
  year: number | null;
  metadata: Record<string, unknown>;
  status: ItemStatus;
  rating: number | null;
  priority: number;
  notes: string | null;
  tags: string[];
  started_at: string | null;
  finished_at: string | null;
  created_at: string;
  updated_at: string;
}

export type UserItemUpdate = Partial<
  Pick<UserItem, 'status' | 'rating' | 'priority' | 'notes' | 'tags' | 'started_at' | 'finished_at'>
>;

export interface ItemFilters {
  mediaType?: MediaType | null;
  status?: ItemStatus | null;
  search?: string;
  sort?: 'recent' | 'priority' | 'title' | 'rating';
  limit?: number;
  offset?: number;
}

export interface StatRow {
  media_type: MediaType;
  status: ItemStatus;
  total: number;
  avg_rating: number | null;
}

export interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
}

/** Chave única de um item numa API — usada para marcar o que já está salvo. */
export function itemKey(x: { mediaType?: MediaType; media_type?: MediaType; provider: string; externalId?: string; external_id?: string }): string {
  return `${x.mediaType ?? x.media_type}:${x.provider}:${x.externalId ?? x.external_id}`;
}
