// Espelho de packages/core/src/types.ts (as Edge Functions só
// conseguem importar arquivos dentro de supabase/functions).
export type MediaType = 'movie' | 'series' | 'game' | 'book' | 'place' | 'anime' | 'album';

export const MEDIA_TYPES: MediaType[] = ['movie', 'series', 'game', 'book', 'place', 'anime', 'album'];

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
