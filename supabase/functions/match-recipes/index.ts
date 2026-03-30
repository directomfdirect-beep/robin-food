import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const OPENAI_API_URL = 'https://api.openai.com/v1/embeddings';
const EMBEDDING_MODEL = 'text-embedding-3-small';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CartItem {
  title: string;
  category: string;
}

interface IngredientGroup {
  id: bigint;
  name: string;
  category_hint: string | null;
  excludes: string[];
}

interface MatchRequest {
  cart_items: CartItem[];
  min_completion?: number;
  result_limit?: number;
}

/**
 * Returns true if the cart item title is NOT excluded by the group's excludes list.
 * This prevents e.g. "творожный сыр" from matching the "сыр твёрдый" group.
 */
function passesExclusionFilter(cartTitle: string, group: IngredientGroup): boolean {
  const t = cartTitle.toLowerCase();
  return !group.excludes.some((ex) => t.includes(ex.toLowerCase()));
}

/**
 * Get OpenAI embedding for a text string.
 * Uses text-embedding-3-small (1536 dims, cheap & fast).
 */
async function getEmbedding(text: string, apiKey: string): Promise<number[]> {
  const resp = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model: EMBEDDING_MODEL, input: text }),
  });
  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`OpenAI embedding error: ${err}`);
  }
  const data = await resp.json();
  return data.data[0].embedding as number[];
}

/**
 * Find ingredient group IDs that semantically match a cart item.
 * After vector similarity, applies the group's `excludes` list to prevent
 * false positives like "творожный сыр" → "сыр твёрдый".
 */
async function matchCartItemToGroups(
  supabase: ReturnType<typeof createClient>,
  cartTitle: string,
  embedding: number[],
  threshold = 0.70,
): Promise<bigint[]> {
  const { data, error } = await supabase.rpc('match_ingredient_groups', {
    query_embedding: embedding,
    similarity_threshold: threshold,
    match_count: 5,
  });
  if (error) {
    console.error('match_ingredient_groups error', error);
    return [];
  }

  // Load excludes for all candidate groups
  const candidateIds = (data ?? []).map((row: { id: bigint }) => row.id);
  if (candidateIds.length === 0) return [];

  const { data: groups } = await supabase
    .from('ingredient_groups')
    .select('id, name, category_hint, excludes')
    .in('id', candidateIds);

  const groupMap: Record<string, IngredientGroup> = {};
  (groups ?? []).forEach((g: IngredientGroup) => {
    groupMap[String(g.id)] = g;
  });

  // Keep only groups that pass the exclusion filter for this specific cart item
  return candidateIds.filter((id: bigint) => {
    const group = groupMap[String(id)];
    return group ? passesExclusionFilter(cartTitle, group) : true;
  });
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const openAiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAiKey) throw new Error('OPENAI_API_KEY not set');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const body: MatchRequest = await req.json();
    const { cart_items = [], min_completion = 0.30, result_limit = 3 } = body;

    if (cart_items.length === 0) {
      return new Response(JSON.stringify({ recipes: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Build deduplicated query texts from cart items
    const queryTexts = [...new Set(
      cart_items.map((item) => `${item.title} ${item.category}`.trim()),
    )];

    // Embed all cart texts in parallel
    const embeddings = await Promise.all(
      queryTexts.map((text) => getEmbedding(text, openAiKey)),
    );

    // Match each embedding to ingredient groups (with exclusion filter per item)
    const groupIdSets = await Promise.all(
      queryTexts.map((text, i) => matchCartItemToGroups(supabase, text, embeddings[i])),
    );

    // Flatten + deduplicate matched group IDs
    const allGroupIds: bigint[] = [...new Set(groupIdSets.flat())];

    if (allGroupIds.length === 0) {
      return new Response(JSON.stringify({ recipes: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Query recipes ranked by completion ratio
    const { data: recipeRows, error: recipeError } = await supabase.rpc(
      'match_recipes_by_cart',
      {
        cart_group_ids: allGroupIds,
        min_completion,
        result_limit,
      },
    );

    if (recipeError) throw recipeError;

    // Enrich missing groups with names for the client
    const missingGroupIds: bigint[] = [
      ...new Set((recipeRows ?? []).flatMap((r: { missing_group_ids: bigint[] }) => r.missing_group_ids ?? [])),
    ];

    let groupNames: Record<string, { name: string; category_hint: string }> = {};
    if (missingGroupIds.length > 0) {
      const { data: groups } = await supabase
        .from('ingredient_groups')
        .select('id, name, category_hint, excludes')
        .in('id', missingGroupIds);
      (groups ?? []).forEach((g: { id: bigint; name: string; category_hint: string; excludes: string[] }) => {
        groupNames[String(g.id)] = { name: g.name, category_hint: g.category_hint };
      });
    }

    const recipes = (recipeRows ?? []).map((r: {
      recipe_id: bigint;
      recipe_name: string;
      emoji: string;
      steps_json: unknown;
      total_required: bigint;
      matched_count: bigint;
      completion_ratio: number;
      missing_group_ids: bigint[];
    }) => ({
      id: r.recipe_id,
      name: r.recipe_name,
      emoji: r.emoji,
      steps: r.steps_json,
      completionRatio: r.completion_ratio,
      matchedCount: Number(r.matched_count),
      totalRequired: Number(r.total_required),
      missingGroups: (r.missing_group_ids ?? []).map((gid) => ({
        id: gid,
        ...(groupNames[String(gid)] ?? { name: 'ингредиент', category_hint: null }),
      })),
    }));

    return new Response(JSON.stringify({ recipes }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('match-recipes error', err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
