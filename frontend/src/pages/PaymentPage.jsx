import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../api/api';
import { useCart } from '../context/CartContext';

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartTotal, clearCart } = useCart();
  const shipping = location.state?.shipping;
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const deliveryCharge = cartTotal < 999 ? 49 : 0;

  if (!shipping) return (
    <div className="page" style={{ paddingTop: '32px', textAlign: 'center' }}>
      <h2>No shipping info</h2>
      <Link to="/checkout" className="btn btn-primary" style={{ marginTop: '16px' }}>Go to Checkout</Link>
    </div>
  );

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/api/orders/place', { ...shipping, paymentMethod });
      await clearCart(true);
      navigate('/confirmation', { state: { order: res.data } });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const methods = [
    { key: 'CARD', icon: '💳', title: 'Pay with Card', desc: 'Mock payment — always succeeds', badge: 'PAID instantly' },
    { key: 'COD', icon: '📦', title: 'Cash on Delivery', desc: 'Pay when you receive your order', badge: 'Pay later' },
  ];

  return (
    <div className="page" style={{ paddingTop: '32px', maxWidth: '640px', margin: '0 auto' }}>
      <h1 className="section-title animate-fadeIn" style={{ marginBottom: '32px' }}>Payment</h1>
      <div className="animate-fadeIn" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {methods.map(m => (
          <div key={m.key} className="card" onClick={() => setPaymentMethod(m.key)}
            style={{
              padding: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px',
              borderColor: paymentMethod === m.key ? 'var(--primary)' : 'var(--border)',
              boxShadow: paymentMethod === m.key ? '0 0 0 2px rgba(124,58,237,0.3)' : 'none',
            }}>
            <div style={{ fontSize: '32px' }}>{m.icon}</div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600 }}>{m.title}</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-subtle)', marginTop: '4px' }}>{m.desc}</p>
            </div>
            <span className={paymentMethod === m.key ? 'badge badge-success' : 'badge badge-info'}>{m.badge}</span>
          </div>
        ))}

        <div className="divider" />

        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}><span>Subtotal</span><span>₹{cartTotal.toLocaleString('en-IN')}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--text-muted)', marginBottom: '12px' }}><span>Delivery</span><span>{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}</span></div>
          <div className="divider" style={{ margin: '8px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '22px', fontWeight: 800 }}><span>Total</span><span className="gradient-text">₹{(cartTotal + deliveryCharge).toLocaleString('en-IN')}</span></div>
        </div>

        {error && <div style={{ padding: '12px', background: 'rgba(239,68,68,0.1)', borderRadius: 'var(--radius)' }}><p className="error-msg" style={{ margin: 0 }}>⚠ {error}</p></div>}

        <button onClick={handlePlaceOrder} disabled={loading} className="btn btn-accent btn-lg" style={{ width: '100%' }}>
          {loading ? 'Placing Order...' : `Place Order — ₹${(cartTotal + deliveryCharge).toLocaleString('en-IN')}`}
        </button>
      </div>
    </div>
  );
}
