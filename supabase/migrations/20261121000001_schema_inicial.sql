-- =====================================================================
-- Listenimento — schema inicial
-- Perfis de usuário + itens de entretenimento salvos por usuário.
-- Os dados das APIs externas são guardados como "snapshot" no item,
-- para a lista carregar rápido sem depender das APIs.
-- =====================================================================

create type public.media_type as enum (
  'movie',   -- filmes (TMDB)
  'series',  -- séries (TMDB)
  'game',    -- jogos (RAWG)
  'book',    -- livros (Google Books)
  'place',   -- lugares para visitar (OpenTripMap)
  'anime',   -- animes (Jikan / MyAnimeList)
  'album'    -- álbuns de música (Deezer)
);

create type public.item_status as enum (
  'wishlist',     -- quero consumir
  'in_progress',  -- consumindo agora
  'completed',    -- concluído
  'dropped'       -- abandonado
);

-- ---------------------------------------------------------------------
-- Perfis
-- ---------------------------------------------------------------------
create table public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  avatar_url   text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

comment on table public.profiles is 'Dados públicos do usuário (1:1 com auth.users).';

-- ---------------------------------------------------------------------
-- Itens do usuário
-- ---------------------------------------------------------------------
create table public.user_items (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null default auth.uid() references auth.users (id) on delete cascade,

  -- identificação na API de origem
  media_type   public.media_type not null,
  provider     text not null,
  external_id  text not null,

  -- snapshot dos dados da API
  title        text not null check (char_length(title) between 1 and 500),
  subtitle     text,
  image_url    text,
  year         int check (year between 0 and 3000),
  metadata     jsonb not null default '{}'::jsonb,

  -- dados do usuário
  status       public.item_status not null default 'wishlist',
  rating       smallint check (rating between 1 and 5),
  priority     smallint not null default 0 check (priority between 0 and 3),
  notes        text check (char_length(notes) <= 5000),
  tags         text[] not null default '{}',
  started_at   date,
  finished_at  date,

  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),

  constraint user_items_unique_per_user unique (user_id, media_type, provider, external_id),
  constraint user_items_dates_ok check (finished_at is null or started_at is null or finished_at >= started_at)
);

comment on table public.user_items is 'Entretenimento salvo pelo usuário (filmes, jogos, livros, lugares...).';

create index user_items_user_status_idx on public.user_items (user_id, status);
create index user_items_user_type_idx   on public.user_items (user_id, media_type);
create index user_items_user_created_idx on public.user_items (user_id, created_at desc);
create index user_items_tags_idx        on public.user_items using gin (tags);

-- ---------------------------------------------------------------------
-- updated_at automático
-- ---------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger user_items_set_updated_at
  before update on public.user_items
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- Datas automáticas ao mudar de status
-- ---------------------------------------------------------------------
create or replace function public.user_items_status_dates()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.status = 'in_progress' and new.started_at is null then
    new.started_at = current_date;
  end if;
  if new.status = 'completed' and new.finished_at is null then
    new.finished_at = current_date;
  end if;
  return new;
end;
$$;

create trigger user_items_status_dates
  before insert or update of status on public.user_items
  for each row execute function public.user_items_status_dates();

-- ---------------------------------------------------------------------
-- Cria o perfil quando um usuário se cadastra
-- ---------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------
-- Row Level Security — cada usuário só enxerga os próprios dados
-- ---------------------------------------------------------------------
alter table public.profiles   enable row level security;
alter table public.user_items enable row level security;

create policy "profiles: ler o próprio"
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id);

create policy "profiles: atualizar o próprio"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy "user_items: ler os próprios"
  on public.user_items for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "user_items: inserir os próprios"
  on public.user_items for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "user_items: atualizar os próprios"
  on public.user_items for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "user_items: apagar os próprios"
  on public.user_items for delete to authenticated
  using ((select auth.uid()) = user_id);

-- ---------------------------------------------------------------------
-- Estatísticas (respeita RLS via security_invoker)
-- ---------------------------------------------------------------------
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
