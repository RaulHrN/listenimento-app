-- =====================================================================
-- Listenimento — troca música por jogos de tabuleiro
-- • remove o tipo 'album' (a busca de música via Deezer foi retirada)
-- • adiciona o tipo 'boardgame' (BoardGameGeek)
--
-- O Postgres não remove valores de um enum existente, então o tipo é
-- recriado. ATENÇÃO: itens já salvos como 'album' são apagados.
-- =====================================================================

begin;

delete from public.user_items where media_type = 'album';

-- a view depende da coluna; é recriada no fim
drop view if exists public.user_item_stats;

alter type public.media_type rename to media_type_old;

create type public.media_type as enum (
  'movie',     -- filmes (TMDB)
  'series',    -- séries (TMDB)
  'game',      -- jogos eletrônicos (RAWG)
  'book',      -- livros (Google Books)
  'place',     -- lugares para visitar (OpenTripMap)
  'anime',     -- animes (Jikan / MyAnimeList)
  'boardgame'  -- jogos de tabuleiro (BoardGameGeek)
);

alter table public.user_items
  alter column media_type type public.media_type
  using media_type::text::public.media_type;

drop type public.media_type_old;

create view public.user_item_stats
with (security_invoker = true) as
select
  user_id,
  media_type,
  status,
  count(*)::int                          as total,
  round(avg(rating)::numeric, 2)::float  as avg_rating
from public.user_items
group by user_id, media_type, status;

grant select on public.user_item_stats to authenticated;

commit;
