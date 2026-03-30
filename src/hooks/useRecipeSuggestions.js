import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { FALLBACK_RECIPES, titleMatches } from '@/data/recipes';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'http://localhost:9000';
const EDGE_FN_URL = `${SUPABASE_URL}/functions/v1/match-recipes`;
const CACHE_TTL_MS = 60_000; // 60 seconds — avoid API spam on every +/-
const MIN_CART_ITEMS = 1;

/**
 * Local fallback matcher — uses the 3-layer system from FALLBACK_RECIPES:
 *   category gate → required keywords → exclusion keywords.
 * Returns top-3 recipes ranked by completionRatio.
 */
function matchFallbackRecipes(cartItems, availableProducts) {
  if (!cartItems || cartItems.length === 0) return [];

  const scored = FALLBACK_RECIPES.map((recipe) => {
    const matched = recipe.ingredients.filter((ing) =>
      cartItems.some((cartItem) => {
        const title = cartItem.title || cartItem.name || '';
        const cat = cartItem.category || '';
        return titleMatches(title, cat, ing);
      })
    );

    const total = recipe.ingredients.length;
    const matchedCount = matched.length;
    const missingIngredients = recipe.ingredients.filter((ing) => !matched.includes(ing));

    // Find the best matching catalog product for each missing ingredient,
    // applying the same exclusion rules so we never suggest the wrong product.
    const missingWithProducts = missingIngredients.map((ing) => {
      const suggestion = (availableProducts || []).find((p) => {
        const title = p.title || p.name || '';
        const cat = p.category || '';
        return titleMatches(title, cat, ing);
      });
      return {
        groupName: ing.group,
        categoryHint: ing.categoryHint,
        product: suggestion || null,
      };
    });

    return {
      id: recipe.id,
      name: recipe.name,
      emoji: recipe.emoji,
      steps: recipe.steps,
      completionRatio: total > 0 ? matchedCount / total : 0,
      matchedCount,
      totalRequired: total,
      missingGroups: missingWithProducts,
    };
  });

  return scored
    .filter((r) => r.completionRatio >= 0.25 && r.matchedCount > 0)
    .sort((a, b) => b.completionRatio - a.completionRatio)
    .slice(0, 3);
}

/**
 * useRecipeSuggestions — returns top-3 recipe matches for current cart.
 *
 * Flow:
 * 1. Try Supabase Edge Function (AI embeddings + pgvector)
 * 2. Fallback to local keyword matcher if Edge Function unavailable
 * 3. Results are cached for CACHE_TTL_MS to avoid spam on every +/-
 */
export const useRecipeSuggestions = (cartItems, availableProducts) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const cacheRef = useRef({ key: null, data: null, ts: 0 });
  const debounceRef = useRef(null);

  const fetchSuggestions = useCallback(async (items, products) => {
    if (!items || items.length < MIN_CART_ITEMS) {
      setSuggestions([]);
      return;
    }

    // Build stable cache key from cart item ids + quantities
    const cacheKey = items.map((i) => `${i.id}:${i.qty}`).sort().join('|');
    const now = Date.now();

    // Return cached result if still fresh
    if (
      cacheRef.current.key === cacheKey &&
      now - cacheRef.current.ts < CACHE_TTL_MS &&
      cacheRef.current.data
    ) {
      setSuggestions(cacheRef.current.data);
      return;
    }

    setLoading(true);

    try {
      // Try Edge Function first
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;

      const payload = {
        cart_items: items.map((item) => ({
          title: item.title || item.name || '',
          category: item.category || '',
        })),
        min_completion: 0.25,
        result_limit: 3,
      };

      const resp = await fetch(EDGE_FN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY || '',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(5000),
      });

      if (resp.ok) {
        const { recipes } = await resp.json();
        // Enrich missing groups with real catalog products.
        // Use category_hint as a gate and match group name against title —
        // but we don't have excludes here so do a conservative title substring check.
        const enriched = (recipes || []).map((recipe) => ({
          ...recipe,
          missingGroups: (recipe.missingGroups || []).map((mg) => {
            const catHint = (mg.category_hint || '').toLowerCase();
            const groupWords = (mg.name || '').toLowerCase().split(/[\s/]+/);
            const product = (products || []).find((p) => {
              const title = (p.title || p.name || '').toLowerCase();
              const cat = (p.category || '').toLowerCase();
              // Category gate
              if (catHint && cat !== catHint) return false;
              // At least one word of the group name appears in the product title
              return groupWords.some((w) => w.length > 3 && title.includes(w));
            });
            return { ...mg, product: product || null };
          }),
        }));
        cacheRef.current = { key: cacheKey, data: enriched, ts: now };
        setSuggestions(enriched);
        return;
      }
    } catch {
      // Edge function unavailable — use fallback
    }

    // Local fallback
    const fallback = matchFallbackRecipes(items, products);
    cacheRef.current = { key: cacheKey, data: fallback, ts: now };
    setSuggestions(fallback);
  }, []);

  useEffect(() => {
    // Debounce 800ms to avoid firing on every rapid +/-
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(cartItems, availableProducts);
    }, 800);
    return () => clearTimeout(debounceRef.current);
  }, [cartItems, availableProducts, fetchSuggestions]);

  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      setSuggestions([]);
    }
  }, [cartItems]);

  return { suggestions, loading };
};
