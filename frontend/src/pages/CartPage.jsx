import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { cartItems, cartTotal, updateQuantity, removeItem, loading } = useCart();
  const navigate = useNavigate();
  const deliveryCharge = cartTotal < 999 ? 49 : 0;
  const finalTotal = cartTotal + deliveryCharge;

  if (loading) return <div className="page" style={{ paddingTop: '96px', display: 'flex', justifyContent: 'center' }}><div className="spinner" /></div>;

  return (
    <div className="page" style={{ paddingTop: '96px' }}>
      <h1 className="section-title animate-fadeIn" style={{ marginBottom: '32px' }}>Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="animate-fadeIn" style={{ textAlign: 'center', padding: '80px 0' }}>
          <div style={{ fontSize: '80px', marginBottom: '16px' }}>🛒</div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Your cart is empty</h2>
          <p style={{ color: 'var(--text-subtle)', marginBottom: '24px' }}>Looks like you haven't added anything yet</p>
          <Link to="/products" className="btn btn-primary btn-lg">Start Shopping →</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '32px', alignItems: 'start' }} className="animate-fadeIn">
          {/* Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {cartItems.map(item => (
              <div key={item.id} className="card" style={{ padding: '20px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                <img src={item.productImage} alt={item.productName}
                  style={{ width: '80px', height: '80px', borderRadius: 'var(--radius)', objectFit: 'cover', background: 'var(--bg-hover)' }}
                  onError={e => e.target.style.display = 'none'} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>{item.productName}</h3>
                  <span className="badge badge-info" style={{ fontSize: '11px' }}>{item.category}</span>
                  <p style={{ fontSize: '16px', fontWeight: 700, color: 'var(--accent)', marginTop: '8px' }}>₹{item.price?.toLocaleString('en-IN')}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button className="qty-btn" onClick={() => updateQuantity(item.id, Number(item.quantity || 1) - 1)}>−</button>
                  <span style={{ fontSize: '15px', fontWeight: 600, minWidth: '24px', textAlign: 'center' }}>{Number(item.quantity || 1)}</span>
                  <button className="qty-btn" onClick={() => updateQuantity(item.id, Number(item.quantity || 1) + 1)}>+</button>
                </div>
                <div style={{ textAlign: 'right', minWidth: '100px' }}>
                  <p style={{ fontSize: '16px', fontWeight: 700 }}>₹{(Number(item.price || 0) * Number(item.quantity || 1)).toLocaleString('en-IN')}</p>
                  <button onClick={() => removeItem(item.id)} style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', fontSize: '13px', fontWeight: 500, marginTop: '4px' }}>Remove</button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="card" style={{ padding: '24px', position: 'sticky', top: '96px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>Order Summary</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Subtotal ({cartItems.length} items)</span><span>₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Delivery</span>
                <span style={{ color: deliveryCharge === 0 ? 'var(--success)' : '' }}>{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}</span>
              </div>
              {deliveryCharge > 0 && <p style={{ fontSize: '12px', color: 'var(--success)' }}>Add ₹{(999 - cartTotal).toLocaleString('en-IN')} more for free delivery!</p>}
              <div className="divider" style={{ margin: '4px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: 700 }}>
                <span>Total</span><span className="gradient-text">₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <button className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '20px' }} onClick={() => navigate('/checkout')}>
              Proceed to Checkout →
            </button>
            <Link to="/products" style={{ display: 'block', textAlign: 'center', marginTop: '12px', fontSize: '13px', color: 'var(--text-subtle)' }}>← Continue Shopping</Link>
          </div>
        </div>
      )}
    </div>
  );
}
