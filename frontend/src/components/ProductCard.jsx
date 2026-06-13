import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product, category }) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [imgError, setImgError] = useState(false);

  const isElectronics = category === 'electronics';
  const name = isElectronics ? product.name : product.productDisplayName;
  const price = product.price;
  const image = isElectronics ? (product.imageUrl?.split('-http')[0] || '') : `/images/${product.id}.jpg`;
  const subtitle = isElectronics ? product.brand : product.articleType;
  const detailPath = isElectronics ? `/products/electronics/${product.id}` : `/products/fashion/${product.mongoID}`;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { navigate('/login'); return; }
    try {
      setAdding(true);
      await addToCart({
        productId: isElectronics ? product.id : product.mongoID,
        productName: name,
        productImage: image,
        price: price,
        category: category,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setAdding(false), 600);
    }
  };

  return (
    <Link to={detailPath} className="card animate-fadeIn" style={{
      overflow: 'hidden', display: 'flex', flexDirection: 'column',
      textDecoration: 'none', position: 'relative',
    }}>
      {/* Sale Badge */}
      {isElectronics && product.isSale === 'true' && (
        <span className="badge badge-warning" style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 2 }}>SALE</span>
      )}

      {/* Image */}
      <div style={{
        width: '100%', height: '200px', overflow: 'hidden',
        background: 'var(--bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {!imgError ? (
          <img src={image} alt={name} onError={() => setImgError(true)} style={{
            width: '100%', height: '100%', objectFit: 'cover',
            transition: 'transform 0.4s ease',
          }} onMouseOver={e => e.target.style.transform = 'scale(1.08)'} onMouseOut={e => e.target.style.transform = 'scale(1)'} />
        ) : (
          <div style={{ color: 'var(--text-subtle)', fontSize: '40px' }}>📦</div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <p style={{ fontSize: '12px', color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{subtitle}</p>
        <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: '1.4',
          overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
        }}>{name}</h3>
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--accent)' }}>
            {price != null ? `₹${price.toLocaleString('en-IN')}` : 'Price N/A'}
          </span>
          <button onClick={handleAddToCart} disabled={adding}
            className="btn btn-primary btn-sm" style={{ fontSize: '12px', padding: '6px 14px' }}>
            {adding ? '✓ Added' : '+ Cart'}
          </button>
        </div>
      </div>
    </Link>
  );
}
