// src/components/property/PropertyFilters.jsx
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSearchParams } from "react-router-dom";
import {
  SlidersHorizontal,
  X,
  ChevronDown,
} from "lucide-react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Badge from "../ui/Badge";
import { supabase } from "../../lib/supabaseClient";
import { useLanguage } from "../../i18n/LanguageContext";
import "./PropertyFilters.css";

/**
 * PropertyFilters (Package 3.4)
 *
 * Replaces `Properties.jsx`'s duplicated `FilterContent` / `MobileFilterContent`
 * (Part A Section 3d/3e, Part B gap item #23) with a single component whose
 * filter state lives in the URL via `useSearchParams`, satisfying 3.4's
 * completion criteria: every filter combination produces a correct
 * server-side query, and filter state round-trips through browser
 * back/forward.
 *
 * This component owns the URL <-> filter-object mapping. It does not fetch
 * property results itself (that's `useProperties`, Package 3.3) and it does
 * not render the results grid or pagination controls (that's Package 4.2's
 * `Properties.jsx` rebuild). `usePropertyFiltersFromUrl` is exported so 4.2
 * can read the same parsed filters (plus `page`) and pass them straight into
 * `useProperties(filters)` without re-deriving the URL mapping a second time.
 *
 * Known gap (see IMPLEMENTATION_STATE.md): the redesign plan's filter
 * sidebar spec includes an "amenities accordion". `useProperties` (3.3) has
 * no `amenities` filter parameter, so no amenities control is rendered here
 * — adding one now would produce a filter that silently does nothing,
 * which would violate 3.4's own completion criterion. Left for whichever
 * package next touches `useProperties`.
 */

export const LISTING_TYPE_OPTIONS = [
  { value: "all", label: "All" },
  { value: "buy", label: "Buy" },
  { value: "rent", label: "Rent" },
  { value: "commercial", label: "Commercial" },
];

// Matches the existing static list in the current `Properties.jsx` (kept
// as-is per "existing naming conventions" rather than invented fresh).
export const PROPERTY_TYPE_OPTIONS = [
  "Residential",
  "Commercial",
  "Group Housing",
  "Apartment",
  "Villa",
  "Penthouse",
];

// Matches `useProperties`' documented `filters.bhk` shape: (number|'6+')[].
export const BHK_OPTIONS = ["1", "2", "3", "4", "5", "6+"];

export const DEFAULT_SORT_BY = "newest";

function parseListValue(raw) {
  if (!raw) return [];
  return raw
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

function parseBhkValue(raw) {
  return parseListValue(raw).map((v) => (v === "6+" ? "6+" : v));
}

function parseNumberOrUndefined(raw) {
  if (raw === null || raw === undefined || raw === "") return undefined;
  const n = Number(raw);
  return Number.isFinite(n) ? n : undefined;
}

/**
 * Reads the current URLSearchParams and returns a filters object shaped
 * exactly like `useProperties`' `filters` argument (Package 3.3), plus
 * `page`. Every key is omitted (falls back to its default) rather than
 * written explicitly when it's at its default value, so default-state URLs
 * stay clean (e.g. `/properties` rather than `/properties?listing=all&page=1`).
 */
export function parsePropertyFilters(searchParams) {
  const listingType = searchParams.get("listing") || "all";
  const propertyTypes = parseListValue(searchParams.get("types"));
  const bhk = parseBhkValue(searchParams.get("bhk"));
  const city = searchParams.get("city") || undefined;
  const locality = searchParams.get("locality") || undefined;
  const minPrice = parseNumberOrUndefined(searchParams.get("minPrice"));
  const maxPrice = parseNumberOrUndefined(searchParams.get("maxPrice"));
  const isFeatured = searchParams.has("featured")
    ? searchParams.get("featured") === "1"
    : undefined;
  const search = searchParams.get("q") || undefined;
  const sortBy = searchParams.get("sort") || DEFAULT_SORT_BY;
  const page = parseNumberOrUndefined(searchParams.get("page")) || 1;

  return {
    page,
    listingType,
    propertyTypes,
    bhk,
    city,
    locality,
    minPrice,
    maxPrice,
    isFeatured,
    search,
    sortBy,
  };
}

/**
 * Inverse of `parsePropertyFilters`. Returns a plain object of only the
 * non-default params that should be present in the URL. Pass the result to
 * `setSearchParams`.
 */
export function propertyFiltersToParams(filters) {
  const params = {};
  if (filters.listingType && filters.listingType !== "all") {
    params.listing = filters.listingType;
  }
  if (filters.propertyTypes?.length)
    params.types = filters.propertyTypes.join(",");
  if (filters.bhk?.length) params.bhk = filters.bhk.join(",");
  if (filters.city) params.city = filters.city;
  if (filters.locality) params.locality = filters.locality;
  if (typeof filters.minPrice === "number")
    params.minPrice = String(filters.minPrice);
  if (typeof filters.maxPrice === "number")
    params.maxPrice = String(filters.maxPrice);
  if (filters.isFeatured) params.featured = "1";
  if (filters.search) params.q = filters.search;
  if (filters.sortBy && filters.sortBy !== DEFAULT_SORT_BY)
    params.sort = filters.sortBy;
  if (filters.page && filters.page > 1) params.page = String(filters.page);
  return params;
}

/**
 * Shared hook so any page (this component, and Package 4.2's `Properties.jsx`)
 * reads/writes the exact same URL <-> filters mapping — a single source of
 * truth rather than two independent parsers drifting apart.
 *
 * `setFilters` merges a partial patch into the current filters. Unless
 * `{ resetPage: false }` is passed, any patch that doesn't explicitly set
 * `page` resets `page` back to 1 (changing a filter should return you to
 * page 1 of the new result set).
 */
export function usePropertyFiltersFromUrl() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(
    () => parsePropertyFilters(searchParams),
    [searchParams],
  );

  const setFilters = useCallback(
    (patch, { resetPage = true, replace = true } = {}) => {
      setSearchParams(
        (prev) => {
          const current = parsePropertyFilters(prev);
          const next = { ...current, ...patch };
          if (resetPage && !("page" in patch)) {
            next.page = 1;
          }
          return propertyFiltersToParams(next);
        },
        { replace },
      );
    },
    [setSearchParams],
  );

  return [filters, setFilters];
}

function countActiveFilters(filters) {
  let count = 0;
  if (filters.listingType && filters.listingType !== "all") count += 1;
  count += filters.propertyTypes?.length ?? 0;
  count += filters.bhk?.length ?? 0;
  if (filters.city) count += 1;
  if (filters.locality) count += 1;
  if (typeof filters.minPrice === "number") count += 1;
  if (typeof filters.maxPrice === "number") count += 1;
  if (filters.isFeatured) count += 1;
  if (filters.search) count += 1;
  return count;
}

function toggleInArray(arr, value) {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

/**
 * PropertyFilters
 *
 * Renders as a static left-rail panel on desktop and, via CSS breakpoints
 * only (no separate mobile component/state), as a floating trigger + bottom
 * sheet drawer on small screens. Desktop edits commit to the URL
 * immediately (debounced for the free-text search field); the mobile
 * drawer stages edits locally and commits them on "Apply" (or discards them
 * on "Reset"/close), matching the redesign plan's mobile spec, without
 * duplicating the filter state itself — both modes read/write the same
 * `draft` state below.
 */
function PropertyFilters({ className = "" }) {
  const { t } = useLanguage();
  const [urlFilters, setUrlFilters] = usePropertyFiltersFromUrl();

  // Local draft mirrors the URL filters. Desktop controls commit on every
  // change (search is debounced); the mobile drawer only commits on Apply.
  const [draft, setDraft] = useState(urlFilters);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [localities, setLocalities] = useState([]);
  const triggerRef = useRef(null);
  const drawerRef = useRef(null);

  // Keep the draft in sync when the URL changes from outside this
  // component (back/forward navigation, a "Clear all" link elsewhere, etc.).
  useEffect(() => {
    setDraft(urlFilters);
  }, [urlFilters]);

  // One-off distinct-locality lookup to replace the hardcoded
  // `locationOptions = ['Coming Soon']` noted in Part A Section 9A. Read-only,
  // scoped to this file — does not touch `useProperties.js`.
  useEffect(() => {
    let cancelled = false;
    async function loadLocalities() {
      const { data, error } = await supabase
        .from("properties")
        .select("locality")
        .eq("is_published", true)
        .not("locality", "is", null);
      if (cancelled || error || !data) return;
      const unique = Array.from(
        new Set(data.map((row) => row.locality).filter(Boolean)),
      ).sort((a, b) => a.localeCompare(b));
      setLocalities(unique);
    }
    loadLocalities();
    return () => {
      cancelled = true;
    };
  }, []);

  const activeCount = useMemo(
    () => countActiveFilters(urlFilters),
    [urlFilters],
  );
  const draftActiveCount = useMemo(() => countActiveFilters(draft), [draft]);

  useEffect(() => {
    if (!isDrawerOpen) return undefined;
    const drawer = drawerRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const backgroundNodes = [
      document.querySelector(".site-header"),
      document.querySelector(".properties-hero"),
      document.querySelector(".results-section"),
      document.querySelector(".footer"),
    ].filter(Boolean);
    const priorInert = backgroundNodes.map((node) => ({ node, inert: node.inert }));
    backgroundNodes.forEach((node) => {
      node.inert = true;
    });

    const getFocusable = () =>
      Array.from(
        drawer?.querySelectorAll(
          'button:not([disabled]), input:not([disabled]), select:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
        ) || [],
      ).filter((element) => element.getClientRects().length > 0);

    requestAnimationFrame(() => getFocusable()[0]?.focus());

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setDraft(urlFilters);
        setIsDrawerOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = getFocusable();
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      priorInert.forEach(({ node, inert }) => {
        node.inert = inert;
      });
      triggerRef.current?.focus();
    };
  }, [isDrawerOpen, urlFilters]);

  const closeDrawer = useCallback(() => {
    setDraft(urlFilters);
    setIsDrawerOpen(false);
  }, [urlFilters]);

  const commitDraft = useCallback(() => {
    setUrlFilters(draft);
    setIsDrawerOpen(false);
  }, [draft, setUrlFilters]);

  const clearAll = useCallback(() => {
    const cleared = {
      listingType: "all",
      propertyTypes: [],
      bhk: [],
      city: undefined,
      locality: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      isFeatured: false,
      search: undefined,
      sortBy: DEFAULT_SORT_BY,
    };
    setDraft((prev) => ({ ...prev, ...cleared }));
  }, []);

  const setListingType = (value) => {
    setDraft((prev) => ({ ...prev, listingType: value }));
  };

  const togglePropertyType = (type) => {
    setDraft((prev) => ({
      ...prev,
      propertyTypes: toggleInArray(prev.propertyTypes, type),
    }));
  };

  const toggleBhk = (value) => {
    setDraft((prev) => ({ ...prev, bhk: toggleInArray(prev.bhk, value) }));
  };

  const setLocality = (value) => {
    setDraft((prev) => ({ ...prev, locality: value || undefined }));
  };

  const setMinPrice = (value) => {
    setDraft((prev) => ({
      ...prev,
      minPrice: value === "" ? undefined : Number(value),
    }));
  };

  const setMaxPrice = (value) => {
    setDraft((prev) => ({
      ...prev,
      maxPrice: value === "" ? undefined : Number(value),
    }));
  };

  // Desktop: every discrete control (chips, locality, price) commits
  // immediately too, so the panel behaves the same as the drawer minus the
  // extra Apply tap. Only the drawer relies on the explicit Apply button.
  useEffect(() => {
    if (isDrawerOpen) return; // drawer stages changes until Apply
    const { search: _searchIgnored, ...rest } = draft;
    const { search: _urlSearchIgnored, ...urlRest } = urlFilters;
    if (JSON.stringify(rest) !== JSON.stringify(urlRest)) {
      setUrlFilters(draft);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft, isDrawerOpen]);

  const renderChip = (label, active, onClick, key) => (
    <button
      key={key ?? label}
      type="button"
      className={`property-filters__chip ${active ? "property-filters__chip--active" : ""}`}
      aria-pressed={active}
      onClick={onClick}
    >
      {label}
    </button>
  );

  const renderPanel = (idPrefix) => (
    <div className="property-filters__panel">
      <div className="property-filters__panel-header">
        <h3 className="property-filters__title">{t("filters.title")}</h3>
        <button
          type="button"
          className="property-filters__drawer-close"
          onClick={closeDrawer}
          aria-label={t("filters.close")}
        >
          <X size={20} />
        </button>
      </div>

      <div className="property-filters__section">
        <span className="property-filters__label">{t("filters.listingType")}</span>
        <div
          className="property-filters__toggle-group"
          role="group"
          aria-label={t("filters.listingType")}
        >
          {LISTING_TYPE_OPTIONS.map((opt) =>
            renderChip(
              t(`filters.${opt.value}`),
              draft.listingType === opt.value,
              () => setListingType(opt.value),
              opt.value,
            ),
          )}
        </div>
      </div>

      <div className="property-filters__section">
        <label
          className="property-filters__label"
          htmlFor={`${idPrefix}-locality`}
        >
          {t("filters.location")}
        </label>
        <div className="property-filters__select-wrap">
          <select
            id={`${idPrefix}-locality`}
            className="property-filters__select"
            value={draft.locality || ""}
            onChange={(e) => setLocality(e.target.value)}
          >
            <option value="">{t("filters.allLocations")}</option>
            {localities.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="property-filters__select-icon"
            aria-hidden="true"
          />
        </div>
      </div>

      <div className="property-filters__section">
        <span className="property-filters__label">{t("filters.bhk")}</span>
        <div className="property-filters__chip-group">
          {BHK_OPTIONS.map((bhk) =>
            renderChip(
              bhk === "6+" ? "6+ BHK" : `${bhk} BHK`,
              draft.bhk.includes(bhk),
              () => toggleBhk(bhk),
              bhk,
            ),
          )}
        </div>
      </div>

      <div className="property-filters__section">
        <span className="property-filters__label">{t("filters.propertyType")}</span>
        <div className="property-filters__chip-group">
          {PROPERTY_TYPE_OPTIONS.map((type) =>
            renderChip(
              type,
              draft.propertyTypes.includes(type),
              () => togglePropertyType(type),
              type,
            ),
          )}
        </div>
      </div>

      <div className="property-filters__section">
        <span className="property-filters__label">{t("filters.priceRange")}</span>
        <div className="property-filters__price-row">
          <Input
            label={null}
            id={`${idPrefix}-min-price`}
            type="number"
            placeholder={t("filters.min")}
            aria-label={t("filters.min")}
            value={draft.minPrice ?? ""}
            onChange={(e) => setMinPrice(e.target.value)}
            fullWidth={false}
          />
          <span className="property-filters__price-sep" aria-hidden="true">
            &ndash;
          </span>
          <Input
            label={null}
            id={`${idPrefix}-max-price`}
            type="number"
            placeholder={t("filters.max")}
            aria-label={t("filters.max")}
            value={draft.maxPrice ?? ""}
            onChange={(e) => setMaxPrice(e.target.value)}
            fullWidth={false}
          />
        </div>
      </div>

      <div className="property-filters__footer">
        <Button
          variant="outline"
          size="small"
          onClick={clearAll}
          disabled={draftActiveCount === 0}
        >
          {t("filters.clearAll")}
        </Button>
        <Button
          variant="primary"
          size="small"
          className="property-filters__apply-btn"
          onClick={commitDraft}
        >
          {t("filters.apply")}
        </Button>
      </div>
    </div>
  );

  return (
    <div className={`property-filters ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        className="property-filters__trigger"
        onClick={() => {
          setDraft(urlFilters);
          setIsDrawerOpen(true);
        }}
        aria-haspopup="dialog"
        aria-expanded={isDrawerOpen}
      >
        <SlidersHorizontal size={16} />
        <span>{t("filters.title")}</span>
        {activeCount > 0 && (
          <Badge
            variant="accent"
            size="small"
            className="property-filters__trigger-badge"
          >
            {activeCount}
          </Badge>
        )}
      </button>

      <div className="property-filters__desktop">{renderPanel("desktop-property-filters")}</div>

      {isDrawerOpen && (
        <div
          className="property-filters__scrim"
          onClick={closeDrawer}
          aria-hidden="true"
        />
      )}
      <div
        className={`property-filters__drawer ${isDrawerOpen ? "property-filters__drawer--open" : ""}`}
        ref={drawerRef}
        role={isDrawerOpen ? "dialog" : undefined}
        aria-modal={isDrawerOpen ? "true" : undefined}
        aria-hidden={!isDrawerOpen}
        aria-label={t("filters.dialog")}
      >
        {renderPanel("mobile-property-filters")}
      </div>
    </div>
  );
}

export default PropertyFilters;
