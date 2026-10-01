import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutGrid, List, SearchX, RefreshCw, MessageCircle } from 'lucide-react';

import { useProperties, DEFAULT_PROPERTIES_PAGE_SIZE } from '../hooks/useProperties';
import { useFavouriteState } from '../hooks/useFavouriteState';
import PropertyFilters, {
  usePropertyFiltersFromUrl,
  DEFAULT_SORT_BY,
} from '../components/property/PropertyFilters';
import PropertyCard from '../components/PropertyCard';
import WhatsAppButton from '../components/shared/WhatsAppButton';
import SEOHead from '../components/shared/SEOHead';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import Pagination from '../components/ui/Pagination';
import { useLanguage } from '../i18n/LanguageContext';
import './Properties.css';
import './Properties.modern.css';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

const SKELETON_COUNT = 6;
const HERO_SEARCH_DEBOUNCE_MS = 400;

function ResultsSkeleton({ viewMode }) {
  return (
    <div className={`properties-grid properties-grid--${viewMode}`} aria-label="Loading properties">
      {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
        <div className="property-skeleton-card" key={i}>
          <Skeleton variant="rect" height={220} />
          <div className="property-skeleton-card__body">
            <Skeleton variant="text" width="70%" />
            <Skeleton variant="text" width="50%" />
            <Skeleton variant="text" width="40%" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ onReset, t }) {
  return (
    <div className="properties-empty-state">
      <SearchX size={48} className="properties-empty-state__icon" aria-hidden="true" />
      <h2>{t('properties.emptyTitle')}</h2>
      <p>{t('properties.emptyText')}</p>
      <div className="properties-state-actions">
        <Button variant="secondary" onClick={onReset}>
          {t('properties.adjustFilters')}
        </Button>
        <Button as={Link} to="/contact-us" variant="primary">
          <MessageCircle size={17} aria-hidden="true" />
          {t('properties.tellRequirement')}
        </Button>
      </div>
    </div>
  );
}

function ErrorState({ onRetry, t }) {
  return (
    <div className="properties-empty-state properties-error-state" role="alert">
      <RefreshCw size={42} className="properties-empty-state__icon" aria-hidden="true" />
      <h2>{t('properties.errorTitle')}</h2>
      <p>{t('properties.errorText')}</p>
      <div className="properties-state-actions">
        <Button variant="secondary" onClick={onRetry}>{t('properties.retry')}</Button>
        <Button as={Link} to="/contact-us" variant="primary">{t('nav.contact')}</Button>
      </div>
    </div>
  );
}

const Properties = () => {
  const { t } = useLanguage();
  const [filters, setFilters] = usePropertyFiltersFromUrl();
  const [viewMode, setViewMode] = React.useState('grid');
  const [heroSearch, setHeroSearch] = React.useState(filters.search || '');

  React.useEffect(() => {
    setHeroSearch(filters.search || '');
  }, [filters.search]);

  const heroSearchDebounceRef = React.useRef(null);
  React.useEffect(() => {
    if (heroSearchDebounceRef.current) clearTimeout(heroSearchDebounceRef.current);
    heroSearchDebounceRef.current = setTimeout(() => {
      if (heroSearch !== (filters.search || '')) {
        setFilters({ search: heroSearch || undefined });
      }
    }, HERO_SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(heroSearchDebounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [heroSearch]);

  const { data, isLoading, isFetching, error, refetch } = useProperties({
    ...filters,
    pageSize: DEFAULT_PROPERTIES_PAGE_SIZE,
  });

  const { isFavourite, toggleFavourite } = useFavouriteState();
  const properties = data?.data ?? [];
  const totalCount = data?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / DEFAULT_PROPERTIES_PAGE_SIZE));

  const handleHeroSearchSubmit = (e) => {
    e.preventDefault();
    if (heroSearchDebounceRef.current) clearTimeout(heroSearchDebounceRef.current);
    setFilters({ search: heroSearch || undefined });
  };

  const handleSortChange = (e) => {
    setFilters({ sortBy: e.target.value }, { resetPage: false });
  };

  const handlePageChange = (page) => {
    setFilters({ page }, { resetPage: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetAll = () => {
    setFilters({
      listingType: 'all',
      propertyTypes: [],
      bhk: [],
      city: undefined,
      locality: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      isFeatured: false,
      search: undefined,
      sortBy: DEFAULT_SORT_BY,
    });
  };

  const rangeStart = totalCount === 0 ? 0 : (filters.page - 1) * DEFAULT_PROPERTIES_PAGE_SIZE + 1;
  const rangeEnd = Math.min(filters.page * DEFAULT_PROPERTIES_PAGE_SIZE, totalCount);

  return (
    <div className="properties-page">
      <SEOHead
        title="Properties in Gandhinagar & Ahmedabad"
        description="Browse residential properties for sale and rent across Gandhinagar and Ahmedabad with UrbanEdge Living Space."
        path="/properties"
      />

      <header className="properties-hero" role="banner">
        <div className="hero-overlay" />
        <div className="hero-content">
          <nav className="properties-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">{t('nav.home')}</Link>
            <span aria-hidden="true">&rsaquo;</span>
            <span aria-current="page">{t('properties.breadcrumb')}</span>
          </nav>
          <h1>{t('properties.title')}</h1>
          <form className="hero-search" onSubmit={handleHeroSearchSubmit} role="search">
            <input
              type="search"
              placeholder={t('properties.searchPlaceholder')}
              value={heroSearch}
              onChange={(e) => setHeroSearch(e.target.value)}
              aria-label={t('properties.searchPlaceholder')}
            />
            <button type="submit">{t('properties.search')}</button>
          </form>
        </div>
      </header>

      <main className="container properties-main">
        <aside className="properties-sidebar" aria-label="Property filters">
          <PropertyFilters />
        </aside>

        <section className="results-section" aria-live="polite">
          <div className="results-info">
            <div className="results-count">
              {totalCount === 0 && !isLoading ? (
                t('properties.noResults')
              ) : (
                <>
                  {t('properties.showing')} <strong>{rangeStart}-{rangeEnd}</strong>{' '}
                  {t('properties.of')} <strong>{totalCount}</strong>
                </>
              )}
            </div>
            <div className="results-controls">
              <div className="results-sorting">
                <label htmlFor="sort-options">{t('properties.sortBy')}</label>
                <select id="sort-options" value={filters.sortBy} onChange={handleSortChange}>
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div className="view-toggle" role="group" aria-label="Toggle grid or list view">
                <button
                  type="button"
                  className={`view-toggle__btn ${viewMode === 'grid' ? 'is-active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  aria-pressed={viewMode === 'grid'}
                  aria-label="Grid view"
                >
                  <LayoutGrid size={18} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className={`view-toggle__btn ${viewMode === 'list' ? 'is-active' : ''}`}
                  onClick={() => setViewMode('list')}
                  aria-pressed={viewMode === 'list'}
                  aria-label="List view"
                >
                  <List size={18} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <ResultsSkeleton viewMode={viewMode} />
          ) : error ? (
            <ErrorState onRetry={() => refetch()} t={t} />
          ) : properties.length === 0 ? (
            <EmptyState onReset={handleResetAll} t={t} />
          ) : (
            <div className={`properties-grid properties-grid--${viewMode} ${isFetching ? 'is-refetching' : ''}`}>
              {properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  viewMode={viewMode}
                  isFavourite={isFavourite(property.id)}
                  onToggleFavourite={() => toggleFavourite(property.id)}
                />
              ))}
            </div>
          )}

          {!error && properties.length > 0 && (
            <Pagination
              currentPage={filters.page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              className="properties-pagination"
            />
          )}
        </section>
      </main>

      <WhatsAppButton variant="floating" />
    </div>
  );
};

export default Properties;
