import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product, category }) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [tiltStyle, setTiltStyle] = useState({});
  const [showQuickView, setShowQuickView] = useState(false);

  const isElectronics = category === 'electronics';
  const name = isElectronics ? product.name : product.productDisplayName;
  const price = product.price;
  const image = isElectronics ? (product.imageUrl?.split('-http')[0] || '') : `/images/${product.id}.jpg`;
  const subtitle = isElectronics ? product.brand : product.articleType;
  const detailPath = isElectronics ? `/products/electronics/${product.id}` : `/products/fashion/${product.mongoID}`;

  const handleAddToCart = async (e) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
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

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((centerY - y) / centerY) * 10; 
    const rotateY = ((x - centerX) / centerX) * 10;
    
    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: 'none',
      zIndex: 10,
      boxShadow: `0 20px 40px rgba(0,0,0,0.2)`
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.4s ease, box-shadow 0.4s ease, z-index 0.4s',
      zIndex: 1,
      boxShadow: 'var(--shadow)'
    });
  };

  const openQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowQuickView(true);
  };

  const closeQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowQuickView(false);
  };

  return (
    <>
      <Link 
        to={detailPath} 
        className="card animate-fadeIn" 
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          overflow: 'hidden', display: 'flex', flexDirection: 'column',
          textDecoration: 'none', position: 'relative',
          ...tiltStyle
        }}
      >
        {isElectronics && product.isSale === 'true' && (
          <span className="badge badge-warning" style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 2 }}>SALE</span>
        )}

        <div style={{
          width: '100%', height: '200px', overflow: 'hidden', position: 'relative',
          background: 'var(--bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {!imgError ? (
            <img src={image} alt={name} className="product-image" onError={() => setImgError(true)} style={{
              width: '100%', height: '100%', objectFit: 'cover',
              transition: 'transform 0.4s ease',
            }} />
          ) : (
            <div style={{ color: 'var(--text-subtle)', fontSize: '40px' }}>📦</div>
          )}
          <button onClick={openQuickView} className="btn btn-outline quick-view-btn" style={{
            position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)',
            opacity: 0, transition: 'opacity 0.2s', background: 'var(--bg-card)', padding: '6px 12px', fontSize: '12px'
          }}>Quick View</button>
        </div>

        <div style={{ padding: '18px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <p style={{ fontSize: '13px', color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 500 }}>{subtitle}</p>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: '1.4',
            overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          }}>{name}</h3>
          <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--accent)' }}>
              {price != null ? `₹${price.toLocaleString('en-IN')}` : 'Price N/A'}
            </span>
            <button onClick={handleAddToCart} disabled={adding}
              className="btn btn-primary" style={{ fontSize: '13px', padding: '8px 16px' }}>
              {adding ? '✓ Added' : '+ Cart'}
            </button>
          </div>
        </div>
      </Link>

      {/* Quick View Modal */}
      {showQuickView && createPortal(
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)'
        }} className="animate-fadeIn" onClick={closeQuickView}>
          <div className="card glass animate-slideInRight" onClick={e => e.stopPropagation()} style={{
            width: '90%', maxWidth: '800px', display: 'flex', overflow: 'hidden', position: 'relative', maxHeight: '90vh'
          }}>
            <button onClick={closeQuickView} style={{
              position: 'absolute', top: '16px', right: '16px', background: 'var(--bg-hover)', border: 'none',
              width: '32px', height: '32px', borderRadius: '50%', color: 'var(--text-primary)', cursor: 'pointer', zIndex: 10
            }}>✕</button>
            
            <div style={{ flex: 1, background: 'var(--bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {!imgError ? <img src={image} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ fontSize: '64px' }}>📦</div>}
            </div>
            
            <div style={{ flex: 1, padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
              <span className="badge badge-info" style={{ alignSelf: 'flex-start' }}>{isElectronics ? '⚡ Electronics' : '👗 Fashion'}</span>
              <h2 style={{ fontSize: '24px', fontWeight: 800 }}>{name}</h2>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{subtitle}</p>
              <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--accent)' }}>
                {price != null ? `₹${price.toLocaleString('en-IN')}` : 'Price N/A'}
              </div>
              <p style={{ fontSize: '14px', color: 'var(--text-subtle)', lineHeight: 1.6 }}>
                Experience premium quality and stunning design. This product is one of our top-rated items, ensuring you get the best value and style.
              </p>
              
              <div style={{ marginTop: 'auto', display: 'flex', gap: '12px' }}>
                <button onClick={handleAddToCart} disabled={adding} className="btn btn-primary btn-lg" style={{ flex: 1 }}>
                  {adding ? '✓ Added' : 'Add to Cart'}
                </button>
                <Link to={detailPath} className="btn btn-outline btn-lg" style={{ flex: 1, textAlign: 'center' }}>
                  Full Details
                </Link>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
