import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/api/orders/my-orders');
        setOrders(res.data);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="page" style={{ paddingTop: '32px', display: 'flex', justifyContent: 'center' }}><div className="spinner" /></div>;

  return (
    <div className="page" style={{ paddingTop: '32px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 className="section-title animate-fadeIn" style={{ marginBottom: '32px' }}>My Orders</h1>

      {orders.length === 0 ? (
        <div className="animate-fadeIn" style={{ textAlign: 'center', padding: '80px 0' }}>
          <div style={{ fontSize: '80px', marginBottom: '16px' }}>📦</div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>No orders yet</h2>
          <p style={{ color: 'var(--text-subtle)', marginBottom: '24px' }}>Start shopping to see your orders here</p>
          <Link to="/products" className="btn btn-primary btn-lg">Shop Now →</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} className="animate-fadeIn">
          {orders.map(order => (
            <div key={order.id} className="card" style={{ overflow: 'hidden' }}>
              {/* Order Header */}
              <div onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                style={{ padding: '20px 24px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <p style={{ fontSize: '11px', color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>ORDER</p>
                  <p style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'monospace', marginTop: '4px' }}>{order.orderNumber}</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>DATE</p>
                  <p style={{ fontSize: '13px', fontWeight: 500, marginTop: '4px' }}>{new Date(order.placedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>STATUS</p>
                  <span className={`badge badge-${order.status === 'CONFIRMED' ? 'success' : order.status === 'SHIPPED' ? 'info' : 'warning'}`} style={{ marginTop: '4px' }}>{order.status}</span>
                </div>
                <div style={{ textAlign: 'right', minWidth: '100px' }}>
                  <p style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>TOTAL</p>
                  <p style={{ fontSize: '16px', fontWeight: 700, color: 'var(--accent)', marginTop: '4px' }}>₹{order.totalAmount?.toLocaleString('en-IN')}</p>
                </div>
                <span style={{ fontSize: '18px', transform: expandedId === order.id ? 'rotate(180deg)' : '', transition: 'transform 0.2s' }}>▾</span>
              </div>

              {/* Expanded Details */}
              {expandedId === order.id && (
                <div style={{ padding: '0 24px 20px', borderTop: '1px solid var(--border)' }} className="animate-fadeIn">
                  <div style={{ padding: '16px 0' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px', fontSize: '13px' }}>
                      <div><span style={{ color: 'var(--text-subtle)' }}>Payment: </span><span style={{ fontWeight: 500 }}>{order.paymentMethod} ({order.paymentStatus})</span></div>
                      <div><span style={{ color: 'var(--text-subtle)' }}>Delivery: </span><span style={{ fontWeight: 500 }}>{order.shippingCity}, {order.shippingState}</span></div>
                    </div>
                    <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-subtle)', marginBottom: '12px' }}>ITEMS</h4>
                    {order.items?.map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: i < order.items.length - 1 ? '1px solid var(--border)' : 'none' }}>
                        <img src={item.productImage} alt={item.productName} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', background: 'var(--bg-hover)' }} onError={e => e.target.style.display = 'none'} />
                        <span style={{ flex: 1, fontSize: '14px' }}>{item.productName}</span>
                        <span style={{ fontSize: '13px', color: 'var(--text-subtle)' }}>×{item.quantity}</span>
                        <span style={{ fontSize: '14px', fontWeight: 600 }}>₹{item.subtotal?.toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
