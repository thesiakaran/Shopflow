import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';
import ProductCard from '../components/ProductCard';

export default function ProductDetailPage() {
  const { category, id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { addRecentlyViewed } = useRecentlyViewed();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/products/${category}/${id}`);
        const p = res.data;
        setProduct(p);
        addRecentlyViewed({ ...p, _category: category });
        
        // Fetch similar
        const endpoint = category === 'electronics' ? '/api/products/electronics' : '/api/products/fashion';
        const simRes = await api.get(endpoint, { params: { size: 5 } });
        setSimilarProducts(simRes.data.content.filter(sp => (sp.id || sp.mongoID) !== id).slice(0, 4));
      } catch (err) {
        console.error('Failed to fetch product:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [category, id]);

  const isElectronics = category === 'electronics';
  const name = product ? (isElectronics ? product.name : product.productDisplayName) : '';
  const image = product ? (isElectronics ? (product.imageUrl?.split('-http')[0] || '') : `/images/${product.id}.jpg`) : '';
  const price = product?.price;

  const handleAddToCart = async () => {
    if (!user) { navigate('/login'); return; }
    try {
      setAdding(true);
      for (let i = 0; i < quantity; i++) {
        await addToCart({
          productId: isElectronics ? product.id : product.mongoID,
          productName: name,
          productImage: image,
          price: price,
          category: category,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setAdding(false), 800);
    }
  };

  if (loading) return <div className="page" style={{ paddingTop: '32px', display: 'flex', justifyContent: 'center' }}><div className="spinner" /></div>;
  if (!product) return <div className="page" style={{ paddingTop: '32px', textAlign: 'center' }}><p>Product not found</p><Link to="/products" className="btn btn-primary" style={{ marginTop: '16px' }}>Back to Products</Link></div>;

  const specs = isElectronics
    ? [{ label: 'Brand', value: product.brand }, { label: 'Condition', value: product.condition }, { label: 'Weight', value: product.weight }, { label: 'Manufacturer', value: product.manufacturer }]
    : [{ label: 'Gender', value: product.gender }, { label: 'Season', value: product.season }, { label: 'Colour', value: product.baseColour }, { label: 'Usage', value: product.usage }, { label: 'Category', value: product.masterCategory }, { label: 'Type', value: product.articleType }];

  return (
    <div className="page" style={{ paddingTop: '32px' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', gap: '8px', fontSize: '13px', color: 'var(--text-subtle)', marginBottom: '32px' }} className="animate-fadeIn">
        <Link to="/" style={{ color: 'var(--text-subtle)' }}>Home</Link> <span>/</span>
        <Link to="/products" style={{ color: 'var(--text-subtle)' }}>Products</Link> <span>/</span>
        <span style={{ color: 'var(--text-muted)' }}>{name}</span>
      </div>

      <div className="product-detail-container animate-fadeIn">
        {/* Image */}
        <div className="card" style={{ overflow: 'hidden', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-card)' }}>
          {!imgError && image ? (
            <img src={image} alt={name} onError={() => setImgError(true)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              <span style={{ fontSize: '16px', marginTop: '16px', fontWeight: 500 }}>No Image Available</span>
            </div>
          )}
        </div>

        {/* Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <span className="badge badge-info">{isElectronics ? '⚡ Electronics' : '👗 Fashion'}</span>
          <h1 style={{ fontSize: '28px', fontWeight: 800 }}>{name}</h1>
          {isElectronics && product.brand && <p style={{ fontSize: '15px', color: 'var(--text-muted)' }}>by {product.brand}</p>}

          <div style={{ fontSize: '32px', fontWeight: 800 }} className="gradient-text">
            {price != null ? `₹${price.toLocaleString('en-IN')}` : 'Price N/A'}
          </div>

          {isElectronics && product.isSale === 'true' && <span className="badge badge-warning">🔥 On Sale</span>}

          <div className="divider" />

          {/* Specs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {specs.filter(s => s.value).map((s, i) => (
              <div key={i} style={{ padding: '12px', background: 'var(--bg-surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                <p style={{ fontSize: '11px', color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</p>
                <p style={{ fontSize: '14px', fontWeight: 600, marginTop: '4px' }}>{s.value}</p>
              </div>
            ))}
          </div>

          <div className="divider" />

          {/* Quantity + Add to Cart */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button className="qty-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
              <span style={{ fontSize: '16px', fontWeight: 600, minWidth: '30px', textAlign: 'center' }}>{quantity}</span>
              <button className="qty-btn" onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
            <button onClick={handleAddToCart} disabled={adding} className="btn btn-primary btn-lg" style={{ flex: 1 }}>
              {adding ? '✓ Added to Cart!' : `Add to Cart — ₹${((price || 0) * quantity).toLocaleString('en-IN')}`}
            </button>
          </div>

          {/* Delivery Info */}
          <div style={{ padding: '16px', background: 'var(--bg-surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
            <span>🚚 {(price || 0) >= 999 ? 'FREE Delivery' : 'Delivery: ₹49'}</span>
            <span>🔒 Secure Payment</span>
            <span>↩️ Easy Returns</span>
          </div>
        </div>
      </div>

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <div style={{ marginTop: '64px', marginBottom: '40px' }} className="animate-fadeIn">
          <div className="divider" />
          <h2 className="section-title" style={{ fontSize: '24px', marginBottom: '24px' }}>Similar Products</h2>
          <div className="product-grid">
            {similarProducts.map((p, i) => (
              <ProductCard key={p.id || p.mongoID || i} product={p} category={category} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
