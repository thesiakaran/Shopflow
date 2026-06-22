import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/api';
import ProductCard from '../components/ProductCard';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const [category, setCategory] = useState(initialCategory);
  const [electronics, setElectronics] = useState([]);
  const [fashion, setFashion] = useState([]);
  
  // New States for Pagination & Categories
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [electronicsCategories, setElectronicsCategories] = useState([]);
  const [fashionCategories, setFashionCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState('');

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [loading, setLoading] = useState(true);

  // 1. Fetch distinct categories once on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const [elecCats, fashCats] = await Promise.all([
          api.get('/api/products/electronics/categories'),
          api.get('/api/products/fashion/categories'),
        ]);
        setElectronicsCategories(elecCats.data);
        setFashionCategories(fashCats.data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Debounce effect: update debouncedSearch only after user stops typing for 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0);
    }, 300);

    return () => clearTimeout(handler);
  }, [search]);

  // 2. Fetch products when filters, category, or page changes
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          page,
          size: 20,
          search: debouncedSearch || '',
          category: selectedSubCategory || '',
          sortBy: sortBy || 'default',
        };

        if (category === 'electronics') {
          const res = await api.get('/api/products/electronics', { params });
          setElectronics(res.data.content);
          setFashion([]);
          setTotalPages(res.data.totalPages);
        } else if (category === 'fashion') {
          const res = await api.get('/api/products/fashion', { params });
          setFashion(res.data.content);
          setElectronics([]);
          setTotalPages(res.data.totalPages);
        } else {
          // "all" tab - fetch a smaller page from both databases and merge
          const allParams = { ...params, size: 10 };
          const [elecRes, fashRes] = await Promise.all([
            api.get('/api/products/electronics', { params: allParams }),
            api.get('/api/products/fashion', { params: allParams }),
          ]);
          setElectronics(elecRes.data.content);
          setFashion(fashRes.data.content);
          setTotalPages(Math.max(elecRes.data.totalPages, fashRes.data.totalPages));
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category, page, debouncedSearch, selectedSubCategory, sortBy]);

  // Sync category state with search parameters
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setCategory(cat);
    }
  }, [searchParams]);

  // Reset pagination & subcategories when main category tab changes
  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setPage(0);
    setSelectedSubCategory('');
    if (cat === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  // Reset page to 0 on searching
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setPage(0);
  };

  const handleSubCategoryChange = (subCat) => {
    setSelectedSubCategory(subCat);
    setPage(0);
  };

  let products = [];
  if (category === 'all' || category === 'electronics') {
    products.push(...electronics.map(p => ({ ...p, _category: 'electronics' })));
  }
  if (category === 'all' || category === 'fashion') {
    products.push(...fashion.map(p => ({ ...p, _category: 'fashion' })));
  }

  const tabs = [
    { key: 'all', label: 'All Products' },
    { key: 'electronics', label: '⚡ Electronics' },
    { key: 'fashion', label: '👗 Fashion' }
  ];

  return (
    <div className="page" style={{ paddingTop: '96px' }}>
      <div className="animate-fadeIn">
        <h1 className="section-title" style={{ marginBottom: '24px' }}>Products</h1>

        {/* Filters Bar */}
        <div className="filters-bar">
          {/* Category Tabs */}
          <div className="filter-tabs">
            {tabs.map(tab => (
              <button key={tab.key} onClick={() => handleCategoryChange(tab.key)}
                style={{
                  padding: '8px 16px', borderRadius: '8px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', border: 'none', transition: 'all 0.2s',
                  background: category === tab.key ? 'var(--primary)' : 'transparent',
                  color: category === tab.key ? 'white' : 'var(--text-muted)',
                }}>{tab.label}</button>
            ))}
          </div>

          {/* Search */}
          <input className="input filter-search" placeholder="Search products..." value={search} onChange={handleSearchChange} />

          {/* Sort */}
          <select value={sortBy} onChange={handleSortChange} className="input filter-sort">
            <option value="default">Sort: Default</option>
            <option value="price-low">Price: Low → High</option>
            <option value="price-high">Price: High → Low</option>
          </select>

          <span className="filter-count">Showing {products.length} items</span>
        </div>

        {/* Category-based Division Filters */}
        {(category === 'electronics' || category === 'fashion') && (
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '24px' }} className="no-scrollbar">
            <button onClick={() => handleSubCategoryChange('')}
              style={{
                padding: '6px 14px', borderRadius: '20px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', border: '1px solid var(--border)', transition: 'all 0.2s',
                background: selectedSubCategory === '' ? 'var(--accent)' : 'var(--bg-surface)',
                color: selectedSubCategory === '' ? 'white' : 'var(--text-muted)',
              }}>All Sub-categories</button>
            {(category === 'electronics' ? electronicsCategories : fashionCategories).map(catName => (
              <button key={catName} onClick={() => handleSubCategoryChange(catName)}
                style={{
                  padding: '6px 14px', borderRadius: '20px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', border: '1px solid var(--border)', transition: 'all 0.2s',
                  background: selectedSubCategory === catName ? 'var(--accent)' : 'var(--bg-surface)',
                  color: selectedSubCategory === catName ? 'white' : 'var(--text-primary)',
                }}>{catName}</button>
            ))}
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}><div className="spinner" /></div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-subtle)' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            <p style={{ fontSize: '16px', fontWeight: 500 }}>No products found</p>
            <p style={{ fontSize: '13px', marginTop: '8px' }}>Try a different search or category</p>
          </div>
        ) : (
          <>
            <div className="product-grid">
              {products.map((p, i) => <ProductCard key={p.id || p.mongoID || i} product={p} category={p._category} />)}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center', marginTop: '40px', paddingBottom: '40px' }}>
                <button className="btn btn-outline btn-sm" disabled={page === 0} onClick={() => setPage(page - 1)}>
                  ← Previous
                </button>
                <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 500 }}>
                  Page {page + 1} of {totalPages}
                </span>
                <button className="btn btn-outline btn-sm" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}