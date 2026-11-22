import { XMLParser } from 'npm:fast-xml-parser@4.5.7';
import type { MediaType, SearchResponse, SearchResult } from '../_shared/types.ts';

const PAGE_SIZE = 20;

export class ProviderError extends Error {
  constructor(message: string, public status = 502) {
    super(message);
  }
}

function env(name: string): string {
  const value = Deno.env.get(name);
  if (!value) throw new ProviderError(`Variável ${name} não configurada na Edge Function`, 500);
  return value;
}

async function getJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) {
    throw new ProviderError(`Falha na API externa (${new URL(url).host}): HTTP ${res.status}`);
  }
  return (await res.json()) as T;
}

function yearOf(date?: string | null): number | null {
  if (!date) return null;
  const y = Number.parseInt(date.slice(0, 4), 10);
  return Number.isFinite(y) ? y : null;
}

function https(url?: string | null): string | null {
  return url ? url.replace(/^http:\/\//, 'https://') : null;
}

// ---------------------------------------------------------------------
// TMDB — filmes e séries (https://developer.themoviedb.org)
// ---------------------------------------------------------------------
const TMDB_IMG = 'https://image.tmdb.org/t/p/w342';

interface TmdbPage<T> { page: number; total_pages: number; results: T[] }
interface TmdbMovie {
  id: number; title: string; original_title: string; poster_path: string | null;
  release_date?: string; overview: string; vote_average: number; genre_ids: number[];
}
interface TmdbTv {
  id: number; name: string; original_name: string; poster_path: string | null;
  first_air_date?: string; overview: string; vote_average: number; genre_ids: number[];
}

function tmdbHeaders() {
  return { Authorization: `Bearer ${env('TMDB_READ_TOKEN')}`, accept: 'application/json' };
}

async function searchMovies(query: string, page: number): Promise<SearchResponse> {
  const url = `https://api.themoviedb.org/3/search/movie?language=pt-BR&include_adult=false&page=${page}&query=${encodeURIComponent(query)}`;
  const data = await getJson<TmdbPage<TmdbMovie>>(url, { headers: tmdbHeaders() });
  return {
    page,
    hasMore: data.page < data.total_pages,
    results: data.results.map((m) => ({
      mediaType: 'movie',
      provider: 'tmdb',
      externalId: String(m.id),
      title: m.title,
      subtitle: m.original_title !== m.title ? m.original_title : null,
      imageUrl: m.poster_path ? `${TMDB_IMG}${m.poster_path}` : null,
      year: yearOf(m.release_date),
      metadata: { overview: m.overview, score: m.vote_average, genreIds: m.genre_ids },
    })),
  };
}

async function searchSeries(query: string, page: number): Promise<SearchResponse> {
  const url = `https://api.themoviedb.org/3/search/tv?language=pt-BR&include_adult=false&page=${page}&query=${encodeURIComponent(query)}`;
  const data = await getJson<TmdbPage<TmdbTv>>(url, { headers: tmdbHeaders() });
  return {
    page,
    hasMore: data.page < data.total_pages,
    results: data.results.map((s) => ({
      mediaType: 'series',
      provider: 'tmdb',
      externalId: String(s.id),
      title: s.name,
      subtitle: s.original_name !== s.name ? s.original_name : null,
      imageUrl: s.poster_path ? `${TMDB_IMG}${s.poster_path}` : null,
      year: yearOf(s.first_air_date),
      metadata: { overview: s.overview, score: s.vote_average, genreIds: s.genre_ids },
    })),
  };
}

// ---------------------------------------------------------------------
// RAWG — jogos (https://rawg.io/apidocs)
// ---------------------------------------------------------------------
interface RawgPage {
  next: string | null;
  results: Array<{
    id: number; name: string; released: string | null; background_image: string | null;
    rating: number; metacritic: number | null;
    platforms: Array<{ platform: { name: string } }> | null;
    genres: Array<{ name: string }>;
  }>;
}

async function searchGames(query: string, page: number): Promise<SearchResponse> {
  const url = `https://api.rawg.io/api/games?key=${env('RAWG_API_KEY')}&page=${page}&page_size=${PAGE_SIZE}&search=${encodeURIComponent(query)}`;
  const data = await getJson<RawgPage>(url);
  return {
    page,
    hasMore: Boolean(data.next),
    results: data.results.map((g) => {
      const platforms = (g.platforms ?? []).map((p) => p.platform.name);
      return {
        mediaType: 'game',
        provider: 'rawg',
        externalId: String(g.id),
        title: g.name,
        subtitle: platforms.slice(0, 3).join(', ') || null,
        imageUrl: g.background_image,
        year: yearOf(g.released),
        metadata: { platforms, genres: g.genres.map((x) => x.name), score: g.rating, metacritic: g.metacritic },
      };
    }),
  };
}

// ---------------------------------------------------------------------
// Google Books — livros (chave opcional)
// ---------------------------------------------------------------------
interface GoogleBooksPage {
  totalItems: number;
  items?: Array<{
    id: string;
    volumeInfo: {
      title: string; subtitle?: string; authors?: string[]; publishedDate?: string;
      description?: string; pageCount?: number; categories?: string[];
      imageLinks?: { thumbnail?: string; smallThumbnail?: string };
    };
  }>;
}

async function searchBooks(query: string, page: number): Promise<SearchResponse> {
  const start = (page - 1) * PAGE_SIZE;
  const key = Deno.env.get('GOOGLE_BOOKS_API_KEY');
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&startIndex=${start}&maxResults=${PAGE_SIZE}&printType=books${key ? `&key=${key}` : ''}`;
  const data = await getJson<GoogleBooksPage>(url);
  const items = data.items ?? [];
  return {
    page,
    hasMore: start + items.length < data.totalItems,
    results: items.map((b) => {
      const v = b.volumeInfo;
      return {
        mediaType: 'book',
        provider: 'google_books',
        externalId: b.id,
        title: v.title,
        subtitle: v.authors?.join(', ') ?? null,
        imageUrl: https(v.imageLinks?.thumbnail ?? v.imageLinks?.smallThumbnail),
        year: yearOf(v.publishedDate),
        metadata: { overview: v.description, pages: v.pageCount, categories: v.categories, authors: v.authors },
      };
    }),
  };
}

// ---------------------------------------------------------------------
// OpenTripMap — lugares para visitar (https://opentripmap.io/product)
// Busca a cidade/região pelo nome e retorna a própria cidade + pontos
// turísticos num raio de 15 km.
// ---------------------------------------------------------------------
interface OtmGeoname { name: string; country: string; lat: number; lon: number; status: string }
interface OtmPlace { xid: string; name: string; kinds: string; rate: number; dist: number; point: { lat: number; lon: number } }

async function searchPlaces(query: string, page: number): Promise<SearchResponse> {
  const key = env('OPENTRIPMAP_API_KEY');
  const geo = await getJson<OtmGeoname>(
    `https://api.opentripmap.com/0.1/pt/places/geoname?name=${encodeURIComponent(query)}&apikey=${key}`,
  );
  if (geo.status !== 'OK') return { page, hasMore: false, results: [] };

  const offset = (page - 1) * PAGE_SIZE;
  const places = await getJson<OtmPlace[]>(
    `https://api.opentripmap.com/0.1/pt/places/radius?radius=15000&lon=${geo.lon}&lat=${geo.lat}` +
      `&kinds=interesting_places&rate=2&format=json&limit=${PAGE_SIZE + 1}&offset=${offset}&apikey=${key}`,
  );

  const results: SearchResult[] = places
    .filter((p) => p.name)
    .slice(0, PAGE_SIZE)
    .map((p) => ({
      mediaType: 'place',
      provider: 'opentripmap',
      externalId: p.xid,
      title: p.name,
      subtitle: `${geo.name}, ${geo.country}`,
      imageUrl: null,
      year: null,
      metadata: { kinds: p.kinds.split(','), lat: p.point.lat, lon: p.point.lon, city: geo.name, country: geo.country },
    }));

  if (page === 1) {
    results.unshift({
      mediaType: 'place',
      provider: 'opentripmap',
      externalId: `geo:${geo.lat.toFixed(4)},${geo.lon.toFixed(4)}`,
      title: geo.name,
      subtitle: `Cidade/região — ${geo.country}`,
      imageUrl: null,
      year: null,
      metadata: { kinds: ['city'], lat: geo.lat, lon: geo.lon, country: geo.country },
    });
  }

  return { page, hasMore: places.length > PAGE_SIZE, results };
}

// ---------------------------------------------------------------------
// Jikan (MyAnimeList) — animes, sem chave (https://docs.api.jikan.moe)
// ---------------------------------------------------------------------
interface JikanPage {
  pagination: { has_next_page: boolean };
  data: Array<{
    mal_id: number; title: string; title_english: string | null; year: number | null;
    episodes: number | null; score: number | null; synopsis: string | null; type: string | null;
    images: { jpg: { image_url: string; large_image_url?: string } };
    aired?: { from?: string | null };
  }>;
}

async function searchAnime(query: string, page: number): Promise<SearchResponse> {
  const url = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&page=${page}&limit=${PAGE_SIZE}&sfw=true`;
  const data = await getJson<JikanPage>(url);
  return {
    page,
    hasMore: data.pagination.has_next_page,
    results: data.data.map((a) => ({
      mediaType: 'anime',
      provider: 'jikan',
      externalId: String(a.mal_id),
      title: a.title,
      subtitle: a.title_english && a.title_english !== a.title ? a.title_english : a.type,
      imageUrl: a.images.jpg.large_image_url ?? a.images.jpg.image_url,
      year: a.year ?? yearOf(a.aired?.from),
      metadata: { overview: a.synopsis, episodes: a.episodes, score: a.score, format: a.type },
    })),
  };
}

// ---------------------------------------------------------------------
// BoardGameGeek — jogos de tabuleiro (XML API2)
// Desde o fim de 2025 exige token de aplicação (https://boardgamegeek.com/applications).
// Licença: uso estritamente não comercial, com o selo "Powered by BGG".
// A busca devolve só id/nome/ano; os detalhes (capa, jogadores, tempo,
// nota) vêm do endpoint /thing, que aceita até 20 ids por chamada.
// ---------------------------------------------------------------------
const BGG = 'https://boardgamegeek.com/xmlapi2';

const xml = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '',
  processEntities: true,
  htmlEntities: true,
  parseTagValue: false,
  isArray: (name) => name === 'item' || name === 'name' || name === 'link',
});

type BggValue = { value?: string } | undefined;
interface BggName { type?: string; value?: string }
interface BggSearchItem { type?: string; id: string; name?: BggName[]; yearpublished?: BggValue }
interface BggThing {
  id: string;
  type?: string;
  thumbnail?: string;
  image?: string;
  name?: BggName[];
  description?: string;
  yearpublished?: BggValue;
  minplayers?: BggValue;
  maxplayers?: BggValue;
  playingtime?: BggValue;
  minage?: BggValue;
  link?: Array<{ type?: string; value?: string }>;
  statistics?: { ratings?: { average?: BggValue } };
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function bggGet<T>(path: string): Promise<T> {
  const headers = { Authorization: `Bearer ${env('BGG_API_TOKEN')}`, Accept: 'application/xml' };
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(`${BGG}${path}`, { headers });
    // 202 = pedido na fila; 429 = muitas requisições. Espera e tenta de novo.
    if (res.status === 202 || res.status === 429) {
      await sleep(1500 * (attempt + 1));
      continue;
    }
    if (res.status === 401 || res.status === 403) {
      throw new ProviderError('O BoardGameGeek recusou o token (confira o secret BGG_API_TOKEN)', 502);
    }
    if (!res.ok) throw new ProviderError(`Falha na API externa (boardgamegeek.com): HTTP ${res.status}`);
    return xml.parse(await res.text()) as T;
  }
  throw new ProviderError('O BoardGameGeek está ocupado; tente de novo em instantes', 503);
}

function primaryName(names?: BggName[]): string {
  return names?.find((n) => n.type === 'primary')?.value ?? names?.[0]?.value ?? 'Sem título';
}

function num(v: BggValue): number | null {
  const n = Number.parseFloat(v?.value ?? '');
  return Number.isFinite(n) && n > 0 ? n : null;
}

/** Relevância simples: título exato > começa com > contém > resto; depois o mais recente. */
function rankSearch(items: BggSearchItem[], query: string): BggSearchItem[] {
  const q = query.toLocaleLowerCase('pt-BR');
  const score = (it: BggSearchItem) => {
    const n = primaryName(it.name).toLocaleLowerCase('pt-BR');
    return n === q ? 0 : n.startsWith(q) ? 1 : n.includes(q) ? 2 : 3;
  };
  const seen = new Set<string>();
  return items
    .filter((it) => it.type === 'boardgame' && !seen.has(it.id) && seen.add(it.id))
    .sort((a, b) => score(a) - score(b) || (num(b.yearpublished) ?? 0) - (num(a.yearpublished) ?? 0));
}

async function searchBoardGames(query: string, page: number): Promise<SearchResponse> {
  const found = await bggGet<{ items?: { item?: BggSearchItem[] } }>(
    `/search?type=boardgame&query=${encodeURIComponent(query)}`,
  );
  const ranked = rankSearch(found.items?.item ?? [], query);
  const start = (page - 1) * PAGE_SIZE;
  const pageItems = ranked.slice(start, start + PAGE_SIZE);
  if (pageItems.length === 0) return { page, hasMore: false, results: [] };

  const details = await bggGet<{ items?: { item?: BggThing[] } }>(
    `/thing?stats=1&id=${pageItems.map((i) => i.id).join(',')}`,
  );
  const byId = new Map((details.items?.item ?? []).map((t) => [t.id, t]));

  const results: SearchResult[] = pageItems.map((it) => {
    const t = byId.get(it.id);
    const min = num(t?.minplayers);
    const max = num(t?.maxplayers);
    const time = num(t?.playingtime);
    const players = min && max ? (min === max ? `${min} jogadores` : `${min}–${max} jogadores`) : null;
    const rating = num(t?.statistics?.ratings?.average);
    return {
      mediaType: 'boardgame',
      provider: 'bgg',
      externalId: it.id,
      title: primaryName(t?.name ?? it.name),
      subtitle: [players, time ? `${time} min` : null].filter(Boolean).join(' · ') || null,
      imageUrl: https(t?.image ?? t?.thumbnail ?? null),
      year: num(t?.yearpublished ?? it.yearpublished),
      metadata: {
        overview: t?.description?.trim().slice(0, 1200) || null,
        minPlayers: min,
        maxPlayers: max,
        playingTime: time,
        minAge: num(t?.minage),
        score: rating ? Math.round(rating * 10) / 10 : null,
        categories: (t?.link ?? []).filter((l) => l.type === 'boardgamecategory').map((l) => l.value).slice(0, 5),
        url: `https://boardgamegeek.com/boardgame/${it.id}`,
      },
    };
  });

  return { page, hasMore: start + PAGE_SIZE < ranked.length, results };
}

export const providers: Record<MediaType, (query: string, page: number) => Promise<SearchResponse>> = {
  movie: searchMovies,
  series: searchSeries,
  game: searchGames,
  book: searchBooks,
  place: searchPlaces,
  anime: searchAnime,
  boardgame: searchBoardGames,
};
