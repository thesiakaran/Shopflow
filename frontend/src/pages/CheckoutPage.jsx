import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function CheckoutPage() {
  const { user } = useAuth();
  const { cartItems, cartTotal } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ shippingName: user?.name || '', shippingPhone: '', shippingAddress: '', shippingCity: '', shippingState: '', shippingPincode: '' });
  const [error, setError] = useState('');
  const deliveryCharge = cartTotal < 999 ? 49 : 0;

  if (cartItems.length === 0) return (
    <div className="page" style={{ paddingTop: '32px', textAlign: 'center' }}>
      <h2>Your cart is empty</h2>
      <Link to="/products" className="btn btn-primary" style={{ marginTop: '16px' }}>Shop Now</Link>
    </div>
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (form.shippingPhone.length !== 10) { setError('Phone must be 10 digits'); return; }
    if (form.shippingPincode.length !== 6) { setError('Pincode must be 6 digits'); return; }
    navigate('/payment', { state: { shipping: form } });
  };

  return (
    <div className="page" style={{ paddingTop: '32px' }}>
      <h1 className="section-title animate-fadeIn" style={{ marginBottom: '32px' }}>Checkout</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '32px', alignItems: 'start' }} className="animate-fadeIn">
        {/* Shipping Form */}
        <div className="card" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '24px' }}>📦 Shipping Address</h2>
          {error && <div style={{ padding: '12px', background: 'rgba(239,68,68,0.1)', borderRadius: 'var(--radius)', marginBottom: '16px' }}><p className="error-msg" style={{ margin: 0 }}>⚠ {error}</p></div>}
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ gridColumn: '1/-1' }}><label>Full Name</label><input className="input" value={form.shippingName} onChange={e => setForm({...form, shippingName: e.target.value})} required placeholder="Recipient name" /></div>
            <div><label>Phone</label><input className="input" type="tel" value={form.shippingPhone} onChange={e => setForm({...form, shippingPhone: e.target.value})} required placeholder="10-digit" pattern="[0-9]{10}" /></div>
            <div><label>Pincode</label><input className="input" value={form.shippingPincode} onChange={e => setForm({...form, shippingPincode: e.target.value})} required placeholder="6-digit" pattern="[0-9]{6}" /></div>
            <div style={{ gridColumn: '1/-1' }}><label>Address</label><input className="input" value={form.shippingAddress} onChange={e => setForm({...form, shippingAddress: e.target.value})} required placeholder="House no, Street, Area" /></div>
            <div><label>City</label><input className="input" value={form.shippingCity} onChange={e => setForm({...form, shippingCity: e.target.value})} required placeholder="City" /></div>
            <div><label>State</label><input className="input" value={form.shippingState} onChange={e => setForm({...form, shippingState: e.target.value})} required placeholder="State" /></div>
            <div style={{ gridColumn: '1/-1' }}><button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>Continue to Payment →</button></div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="card" style={{ padding: '24px', position: 'sticky', top: '96px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>Order Summary</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {cartItems.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-muted)' }}>
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.productName} × {item.quantity}</span>
                <span>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
              </div>
            ))}
            <div className="divider" style={{ margin: '8px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--text-muted)' }}><span>Subtotal</span><span>₹{cartTotal.toLocaleString('en-IN')}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--text-muted)' }}><span>Delivery</span><span style={{ color: deliveryCharge === 0 ? 'var(--success)' : '' }}>{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}</span></div>
            <div className="divider" style={{ margin: '4px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 700 }}><span>Total</span><span className="gradient-text">₹{(cartTotal + deliveryCharge).toLocaleString('en-IN')}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
