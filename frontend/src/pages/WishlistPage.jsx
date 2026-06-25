import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';

export default function WishlistPage() {
  const { wishlist } = useWishlist();

  return (
    <div className="page" style={{ paddingTop: '96px', maxWidth: '1280px', margin: '0 auto' }}>
      <div className="animate-fadeIn">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <h1 className="section-title" style={{ margin: 0 }}>My Wishlist</h1>
          <span className="badge badge-info">{wishlist.length} items</span>
        </div>

        {wishlist.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-subtle)' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>❤️</div>
            <p style={{ fontSize: '16px', fontWeight: 500 }}>Your wishlist is empty</p>
            <p style={{ fontSize: '13px', marginTop: '8px', marginBottom: '24px' }}>Save items you love to find them easily later.</p>
            <Link to="/products" className="btn btn-primary">Browse Products</Link>
          </div>
        ) : (
          <div className="product-grid">
            {wishlist.map((p, i) => <ProductCard key={p.id || p.mongoID || i} product={p} category={p._category || (p.id ? 'electronics' : 'fashion')} />)}
          </div>
        )}
      </div>
    </div>
  );
}
