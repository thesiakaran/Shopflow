import { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';

export default function ConfirmationPage() {
  const location = useLocation();
  const order = location.state?.order;

  useEffect(() => {
    if (order) {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#7c3aed', '#f97316', '#22c55e', '#3b82f6', '#ec4899'],
        zIndex: 1000
      });
    }
  }, [order]);

  if (!order) return (
    <div className="page" style={{ paddingTop: '96px', textAlign: 'center' }}>
      <h2>No order data found</h2>
      <Link to="/" className="btn btn-primary" style={{ marginTop: '16px' }}>Go Home</Link>
    </div>
  );

  return (
    <div className="page" style={{ paddingTop: '96px', maxWidth: '640px', margin: '0 auto' }}>
      {/* Success Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }} className="animate-fadeIn">
        <div className="animate-successPop" style={{
          width: '80px', height: '80px', borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--success), #16a34a)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px', fontSize: '36px', color: 'white',
        }}>✓</div>
        <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>
          <span className="gradient-text">Order Placed Successfully!</span>
        </h1>
        <p style={{ color: 'var(--text-subtle)', fontSize: '15px' }}>Thank you for shopping with ShopFlow</p>
      </div>

      {/* Order Info */}
      <div className="card animate-fadeIn" style={{ padding: '24px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-subtle)' }}>ORDER NUMBER</span>
          <span style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'monospace' }} className="gradient-text">{order.orderNumber}</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
          <div style={{ padding: '12px', background: 'var(--bg-surface)', borderRadius: 'var(--radius)' }}>
            <p style={{ color: 'var(--text-subtle)' }}>Status</p>
            <p style={{ fontWeight: 600, marginTop: '4px' }} className={`status-${order.status}`}>{order.status}</p>
          </div>
          <div style={{ padding: '12px', background: 'var(--bg-surface)', borderRadius: 'var(--radius)' }}>
            <p style={{ color: 'var(--text-subtle)' }}>Payment</p>
            <p style={{ fontWeight: 600, marginTop: '4px' }}>{order.paymentMethod} — {order.paymentStatus}</p>
          </div>
          <div style={{ padding: '12px', background: 'var(--bg-surface)', borderRadius: 'var(--radius)' }}>
            <p style={{ color: 'var(--text-subtle)' }}>Total</p>
            <p style={{ fontWeight: 700, marginTop: '4px', color: 'var(--accent)' }}>₹{order.totalAmount?.toLocaleString('en-IN')}</p>
          </div>
          <div style={{ padding: '12px', background: 'var(--bg-surface)', borderRadius: 'var(--radius)' }}>
            <p style={{ color: 'var(--text-subtle)' }}>Delivery To</p>
            <p style={{ fontWeight: 600, marginTop: '4px' }}>{order.shippingCity}, {order.shippingState}</p>
          </div>
        </div>
      </div>

      {/* Items */}
      {order.items && order.items.length > 0 && (
        <div className="card animate-fadeIn" style={{ padding: '24px', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>Items Ordered</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {order.items.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', padding: '8px 0', borderBottom: i < order.items.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <span style={{ color: 'var(--text-muted)' }}>{item.productName} × {item.quantity}</span>
                <span style={{ fontWeight: 600 }}>₹{item.subtotal?.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: '12px' }} className="animate-fadeIn">
        <Link to="/orders" className="btn btn-primary btn-lg" style={{ flex: 1 }}>View My Orders</Link>
        <Link to="/products" className="btn btn-outline btn-lg" style={{ flex: 1 }}>Continue Shopping</Link>
      </div>
    </div>
  );
}
