// src/hooks/useProperties.js
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { supabase } from "../lib/supabaseClient";

/**
 * useProperties
 *
 * Central data-fetching hook for property listings, replacing the
 * ad hoc `supabase.from('properties').select('*')` calls previously
 * duplicated across `Properties.jsx`, `HomePage.jsx`, and the admin
 * modules (Part A Section 5 / gap item #20). Filtering, sorting, and
 * pagination all happen server-side via PostgREST so payload size stays
 * proportional to the current page, not the full table (Section 9L).
 *
 * This hook only fetches and caches data — it does not own filter UI
 * state. Package 3.4 (PropertyFilters) is expected to hold the filter
 * values (e.g. in state synced to the URL) and pass them in as `filters`.
 *
 * @param {object} filters
 * @param {number} [filters.page=1]
 * @param {number} [filters.pageSize=6] - matches the current `propertiesPerPage` in Properties.jsx
 * @param {'buy'|'rent'|'commercial'|'all'} [filters.listingType] - maps to the new `listing_type` column (2.1)
 * @param {string[]} [filters.propertyTypes] - matches against `property_type`
 * @param {(number|'6+')[]} [filters.bhk] - matches against the `bhk_min`/`bhk_max` range (2.1 backfill)
 * @param {string} [filters.city] - matches `city` (defaults to 'Gandhinagar' per 2.1)
 * @param {string} [filters.locality] - partial match against `locality`
 * @param {number} [filters.minPrice]
 * @param {number} [filters.maxPrice]
 * @param {boolean} [filters.isFeatured] - maps to `is_featured`
 * @param {string} [filters.search] - matches `name`, `location`, `description` via a
 *   hybrid substring (`ilike`) + Postgres full-text search (`websearch_to_tsquery`,
 *   via the PostgREST `wfts` operator / supabase-js `.textSearch(..., { type: 'websearch' })`
 *   equivalent) match, so multi-word queries, word-order variation, plurals, and other
 *   stemmable variants return relevant results in addition to plain substring matches (6.3)
 * @param {'newest'|'oldest'|'price_asc'|'price_desc'} [filters.sortBy='newest']
 * @param {boolean} [filters.includeUnpublished=false] - admin usage only; public pages must never set this
 * @param {import('@tanstack/react-query').UseQueryOptions} [options]
 */

export const propertyKeys = {
  all: ["properties"],
  lists: () => [...propertyKeys.all, "list"],
  list: (filters) => [...propertyKeys.lists(), filters],
  details: () => [...propertyKeys.all, "detail"],
  detail: (identifier) => [...propertyKeys.details(), identifier],
  counts: () => [...propertyKeys.all, "count"],
  count: (filters) => [...propertyKeys.counts(), filters],
};

export const DEFAULT_PROPERTIES_PAGE_SIZE = 6;

/**
 * Builds the OR/AND PostgREST filter string for a multi-select BHK filter
 * against the `bhk_min`/`bhk_max` range columns (2.1's text->range backfill
 * means a single `bhk` value can no longer be matched with a plain `.eq`).
 * '6+' is treated as "bhk_max is at least 6".
 */
function buildBhkFilter(bhkValues) {
  const clauses = bhkValues
    .map((value) => {
      if (value === "6+") {
        return "and(bhk_max.gte.6)";
      }
      const numeric = Number(value);
      if (!Number.isFinite(numeric)) return null;
      return `and(bhk_min.lte.${numeric},bhk_max.gte.${numeric})`;
    })
    .filter(Boolean);

  return clauses.length > 0 ? clauses.join(",") : null;
}

/**
 * Applies every WHERE-clause filter (publish state, listing type, property
 * type, bhk range, location, price range, featured flag, search) to a
 * Supabase query builder. Shared by `fetchProperties` (full rows, paged)
 * and `fetchPropertiesCount` (count only, no rows) so the two can never
 * drift apart and silently return mismatched counts vs. listings.
 */
function applyPropertyFilters(query, filters = {}) {
  const {
    listingType,
    propertyTypes,
    bhk,
    city,
    locality,
    minPrice,
    maxPrice,
    isFeatured,
    search,
    includeUnpublished = false,
  } = filters;

  if (!includeUnpublished) {
    query = query.eq("is_published", true);
  }
  if (listingType && listingType !== "all") {
    query = query.eq("listing_type", listingType);
  }
  if (Array.isArray(propertyTypes) && propertyTypes.length > 0) {
    query = query.in("property_type", propertyTypes);
  }
  if (Array.isArray(bhk) && bhk.length > 0) {
    const bhkFilter = buildBhkFilter(bhk);
    if (bhkFilter) query = query.or(bhkFilter);
  }
  if (city) {
    query = query.eq("city", city);
  }
  if (locality) {
    query = query.ilike("locality", `%${locality}%`);
  }
  if (typeof minPrice === "number") {
    query = query.gte("price", minPrice);
  }
  if (typeof maxPrice === "number") {
    query = query.lte("price", maxPrice);
  }
  if (typeof isFeatured === "boolean") {
    query = query.eq("is_featured", isFeatured);
  }
  if (search) {
    // 6.3 — Full-Text Search: layers Postgres full-text search on top of the
    // pre-existing substring match rather than replacing it. `wfts(english)`
    // is the PostgREST full-text operator behind supabase-js's
    // `.textSearch(column, term, { type: 'websearch' })` — it runs
    // `websearch_to_tsquery()` against `to_tsvector(column)` computed on the
    // fly per query, so multi-word queries, word order, and stemmable word
    // forms (plurals, verb tense, etc.) match without requiring a stored
    // tsvector column or a schema change. The `ilike` clauses are kept
    // alongside it so short/partial substrings (e.g. mid-word typing, or
    // terms too short for the text-search parser to treat as meaningful
    // lexemes) still match as before this package.
    //
    // True typo/misspelling tolerance (e.g. "appartment" -> "apartment")
    // requires trigram similarity matching, which needs the `pg_trgm`
    // Postgres extension enabled and a GIN trigram index created — a
    // database-side change outside this package's file scope (Database
    // Rules). See IMPLEMENTATION_STATE.md Known Deviations for the
    // follow-up this leaves open.
    //
    // Commas and parentheses are stripped from the term before building the
    // `.or()` filter string, since PostgREST's `.or()` syntax uses both
    // characters as filter-list delimiters and an unescaped one in raw user
    // input would break filter parsing (a pre-existing risk shared with the
    // prior ilike-only implementation, not introduced by this change).
    const safeTerm = search.trim().replace(/[(),]/g, " ").trim();
    if (safeTerm) {
      query = query.or(
        [
          `name.ilike.%${safeTerm}%`,
          `location.ilike.%${safeTerm}%`,
          `about_property.ilike.%${safeTerm}%`,
          `name.wfts(english).${safeTerm}`,
          `location.wfts(english).${safeTerm}`,
          `about_property.wfts(english).${safeTerm}`,
        ].join(","),
      );
    }
  }

  return query;
}

export async function fetchProperties(filters = {}) {
  const {
    page = 1,
    pageSize = DEFAULT_PROPERTIES_PAGE_SIZE,
    sortBy = "newest",
  } = filters;

  let query = supabase.from("properties").select("*", { count: "exact" });
  query = applyPropertyFilters(query, filters);

  if (sortBy === "price_asc") {
    query = query.order("price", { ascending: true });
  } else if (sortBy === "price_desc") {
    query = query.order("price", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: sortBy === "oldest" });
  }

  const safePage = Math.max(1, page);
  const from = (safePage - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;
  if (error) throw error;

  return { data: data ?? [], count: count ?? 0 };
}

/**
 * fetchPropertiesCount
 *
 * Returns just the number of properties matching `filters` — no rows are
 * transferred (`head: true`), so this stays cheap no matter how large the
 * `properties` table grows. This backs the homepage hero's live "N+
 * Properties" stat (previously a hardcoded "50+"): whatever this returns
 * is the number shown, with no upper limit baked in.
 *
 * Reuses `applyPropertyFilters` so the count can never disagree with what
 * `fetchProperties` would actually list for the same filters.
 */
export async function fetchPropertiesCount(filters = {}) {
  let query = supabase
    .from("properties")
    .select("*", { count: "exact", head: true });
  query = applyPropertyFilters(query, filters);

  const { error, count } = await query;
  if (error) throw error;

  return { count: count ?? 0 };
}

export function useProperties(filters = {}, options = {}) {
  return useQuery({
    queryKey: propertyKeys.list(filters),
    queryFn: () => fetchProperties(filters),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
    ...options,
  });
}

/**
 * usePropertiesCount
 *
 * Lightweight companion to `useProperties` for when only the total count
 * is needed (e.g. the hero "N+ Properties" stat, or a results-count badge)
 * — avoids pulling full rows just to read `.length`.
 */
export function usePropertiesCount(filters = {}, options = {}) {
  return useQuery({
    queryKey: propertyKeys.count(filters),
    queryFn: () => fetchPropertiesCount(filters),
    staleTime: 60_000,
    ...options,
  });
}

export default useProperties;
