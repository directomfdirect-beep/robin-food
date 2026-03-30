-- ============================================================
-- Robin Food: Recipe Constructor — Supabase migration
-- Requires: pgvector extension
-- ============================================================

-- Enable pgvector
create extension if not exists vector;

-- ── Ingredient groups (semantic buckets) ──────────────────────
-- Each group is an abstracted ingredient type (e.g. "рыба", "твёрдый сыр").
-- The embedding maps the group name into vector space for cosine similarity.
create table if not exists ingredient_groups (
  id          bigserial primary key,
  name        text        not null unique,       -- "рыба", "твёрдый сыр", "паста"
  category_hint text,                            -- hints to catalog category: "Рыба", "Молоко" etc.
  aliases     text[]      default '{}',          -- ["лосось","сёмга","форель","горбуша"]
  excludes    text[]      default '{}',          -- ["консерв","паштет","икра"] — negative filter
  embedding   vector(1536)                        -- text-embedding-3-small
);

create index if not exists ingredient_groups_embedding_idx
  on ingredient_groups using ivfflat (embedding vector_cosine_ops)
  with (lists = 50);

-- ── Recipes ───────────────────────────────────────────────────
create table if not exists recipes (
  id          bigserial primary key,
  name        text        not null,
  emoji       text        not null default '🍽️',
  cuisine     text        default 'русская',
  tags        text[]      default '{}',          -- ['быстро','завтрак','вегетарианское']
  steps_json  jsonb       default '[]',          -- [{"step":1,"text":"Отварить макароны..."}]
  created_at  timestamptz default now()
);

-- ── Recipe ↔ Ingredient group join ───────────────────────────
-- Many-to-many. required=false means nice-to-have (optional)
create table if not exists recipe_ingredients (
  id                bigserial primary key,
  recipe_id         bigint references recipes(id) on delete cascade,
  ingredient_group_id bigint references ingredient_groups(id) on delete cascade,
  required          boolean default true,
  display_order     int     default 0,
  unique (recipe_id, ingredient_group_id)
);

create index if not exists recipe_ingredients_recipe_idx on recipe_ingredients(recipe_id);
create index if not exists recipe_ingredients_group_idx  on recipe_ingredients(ingredient_group_id);

-- ── RPC: match_ingredient_groups (called from Edge Function) ─
-- Finds ingredient groups whose embeddings are closest to the query vector.
create or replace function match_ingredient_groups(
  query_embedding vector(1536),
  similarity_threshold float default 0.70,
  match_count int default 3
)
returns table (id bigint, name text, category_hint text, similarity float)
language sql stable as $$
  select
    id,
    name,
    category_hint,
    1 - (embedding <=> query_embedding) as similarity
  from ingredient_groups
  where 1 - (embedding <=> query_embedding) >= similarity_threshold
  order by embedding <=> query_embedding
  limit match_count;
$$;

-- ── RPC: match_recipes_by_cart ────────────────────────────────
-- Given a set of ingredient group IDs found in the cart,
-- returns recipes ranked by completion ratio (matched / total required).
create or replace function match_recipes_by_cart(
  cart_group_ids bigint[],
  min_completion  float default 0.3,
  result_limit    int   default 3
)
returns table (
  recipe_id       bigint,
  recipe_name     text,
  emoji           text,
  steps_json      jsonb,
  total_required  bigint,
  matched_count   bigint,
  completion_ratio float,
  missing_group_ids bigint[]
)
language sql stable as $$
  with recipe_stats as (
    select
      r.id                as recipe_id,
      r.name              as recipe_name,
      r.emoji,
      r.steps_json,
      count(ri.ingredient_group_id) filter (where ri.required)       as total_required,
      count(ri.ingredient_group_id) filter (
        where ri.required and ri.ingredient_group_id = any(cart_group_ids)
      )                                                                as matched_count,
      array_agg(ri.ingredient_group_id) filter (
        where ri.required and not (ri.ingredient_group_id = any(cart_group_ids))
      )                                                                as missing_group_ids
    from recipes r
    join recipe_ingredients ri on ri.recipe_id = r.id
    group by r.id, r.name, r.emoji, r.steps_json
  )
  select
    recipe_id,
    recipe_name,
    emoji,
    steps_json,
    total_required,
    matched_count,
    case when total_required > 0
         then matched_count::float / total_required::float
         else 0 end                                                    as completion_ratio,
    coalesce(missing_group_ids, '{}')
  from recipe_stats
  where total_required > 0
    and (matched_count::float / total_required::float) >= min_completion
  order by completion_ratio desc, matched_count desc
  limit result_limit;
$$;
