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

  // Client-Side Mock Filtering & Sorting
  if (debouncedSearch) {
    const searchLower = debouncedSearch.toLowerCase();
    products = products.filter(p => {
      const name = (p.name || p.productDisplayName || '').toLowerCase();
      const brand = (p.brand || p.articleType || '').toLowerCase();
      return name.includes(searchLower) || brand.includes(searchLower);
    });
  }

  if (selectedSubCategory) {
    products = products.filter(p => 
      p.brand === selectedSubCategory || 
      p.articleType === selectedSubCategory || 
      p.masterCategory === selectedSubCategory
    );
  }

  if (sortBy === 'price-low') {
    products.sort((a, b) => (a.price || 0) - (b.price || 0));
  } else if (sortBy === 'price-high') {
    products.sort((a, b) => (b.price || 0) - (a.price || 0));
  }

  // Client-Side Pagination (Exactly 15 items per page as requested)
  const ITEMS_PER_PAGE = 15;
  const displayTotalPages = Math.ceil(products.length / ITEMS_PER_PAGE) || 1;
  const paginatedProducts = products.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  const tabs = [
    { key: 'all', label: 'All Products' },
    { key: 'electronics', label: '⚡ Electronics' },
    { key: 'fashion', label: '👗 Fashion' }
  ];

  return (
    <div className="page" style={{ paddingTop: '32px' }}>
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

          {/* Search with Autocomplete */}
          <div style={{ position: 'relative', flex: 1, maxWidth: '280px' }}>
            <input className="input filter-search" style={{ width: '100%', maxWidth: '100%' }} placeholder="Search products..." value={search} onChange={handleSearchChange} onFocus={() => setSearch(search)} />
            
            {search && debouncedSearch && products.length > 0 && (
              <div className="card glass animate-fadeIn" style={{
                position: 'absolute', top: '110%', left: 0, right: 0, zIndex: 100, 
                maxHeight: '320px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px', padding: '8px'
              }}>
                <div style={{ fontSize: '11px', color: 'var(--text-subtle)', padding: '4px 8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Top Suggestions</div>
                {products.slice(0, 5).map(p => {
                  const isElec = p._category === 'electronics';
                  const name = isElec ? p.name : p.productDisplayName;
                  const img = isElec ? (p.imageUrl?.split('-http')[0] || '') : `/images/${p.id}.jpg`;
                  return (
                    <a href={`/products/${p._category}/${isElec ? p.id : p.mongoID}`} key={isElec ? p.id : p.mongoID} style={{
                      display: 'flex', alignItems: 'center', gap: '12px', padding: '8px', 
                      borderRadius: '8px', textDecoration: 'none', transition: 'background 0.2s'
                    }} className="hover-bg">
                      <img src={img} alt="" style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} onError={(e) => e.target.style.display='none'} />
                      <div style={{ flex: 1, overflow: 'hidden' }}>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: 700 }}>₹{p.price?.toLocaleString('en-IN')}</div>
                      </div>
                    </a>
                  )
                })}
              </div>
            )}
          </div>

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
          <div className="product-grid">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card skeleton-card" style={{ height: '340px', display: 'flex', flexDirection: 'column' }}>
                <div className="skeleton-img" style={{ height: '200px', width: '100%', borderRadius: 0 }} />
                <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                  <div className="skeleton-text" style={{ width: '40%', height: '12px' }} />
                  <div className="skeleton-text" style={{ width: '90%', height: '16px' }} />
                  <div className="skeleton-text" style={{ width: '60%', height: '16px' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                    <div className="skeleton-text" style={{ width: '35%', height: '20px' }} />
                    <div className="skeleton-text" style={{ width: '70px', height: '32px', borderRadius: '8px' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-subtle)' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            <p style={{ fontSize: '16px', fontWeight: 500 }}>No products found</p>
            <p style={{ fontSize: '13px', marginTop: '8px' }}>Try a different search or category</p>
          </div>
        ) : (
          <>
            <div className="product-grid">
              {paginatedProducts.map((p, i) => <ProductCard key={p.id || p.mongoID || i} product={p} category={p._category} />)}
            </div>

            {/* Pagination Controls */}
            {displayTotalPages > 1 && (
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center', marginTop: '40px', paddingBottom: '40px' }}>
                <button className="btn btn-outline btn-sm" disabled={page === 0} onClick={() => { setPage(page - 1); window.scrollTo({top: 0, behavior: 'smooth'}); }}>
                  ← Previous
                </button>
                <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 500 }}>
                  Page {page + 1} of {displayTotalPages}
                </span>
                <button className="btn btn-outline btn-sm" disabled={page >= displayTotalPages - 1} onClick={() => { setPage(page + 1); window.scrollTo({top: 0, behavior: 'smooth'}); }}>
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