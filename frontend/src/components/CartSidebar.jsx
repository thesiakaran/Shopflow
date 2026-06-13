import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartSidebar() {
  const { cartItems, cartTotal, isCartOpen, closeCart, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const deliveryCharge = cartTotal < 999 ? 49 : 0;
  const finalTotal = cartTotal + deliveryCharge;

  return (
    <>
      <div className="cart-overlay" onClick={closeCart} />
      <div className="cart-drawer">
        {/* Header */}
        <div style={{
          padding: '20px 24px', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Your Cart
            <span style={{ fontSize: '13px', fontWeight: 400, color: 'var(--text-subtle)', marginLeft: '8px' }}>({cartItems.length} items)</span>
          </h2>
          <button onClick={closeCart} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '20px', padding: '4px' }}>✕</button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-subtle)' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>🛒</div>
              <p style={{ fontSize: '16px', fontWeight: 500 }}>Your cart is empty</p>
              <p style={{ fontSize: '13px', marginTop: '8px' }}>Add products to get started!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {cartItems.map(item => (
                <div key={item.id} className="animate-fadeIn" style={{
                  display: 'flex', gap: '12px', padding: '12px',
                  background: 'var(--bg-card)', borderRadius: 'var(--radius)',
                  border: '1px solid var(--border)',
                }}>
                  <img src={item.productImage} alt={item.productName}
                    style={{ width: '64px', height: '64px', borderRadius: '8px', objectFit: 'cover', background: 'var(--bg-hover)' }}
                    onError={e => e.target.src = ''} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '13px', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.productName}</p>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--accent)', marginTop: '4px' }}>₹{item.price?.toLocaleString('en-IN')}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                      <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                      <span style={{ fontSize: '14px', fontWeight: 600, minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                      <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                      <button onClick={() => removeItem(item.id)} style={{
                        marginLeft: 'auto', background: 'none', border: 'none',
                        color: 'var(--error)', cursor: 'pointer', fontSize: '13px', fontWeight: 500,
                      }}>Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border)', background: 'var(--bg-card)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>
              <span>Subtotal</span><span>₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px', color: 'var(--text-muted)' }}>
              <span>Delivery</span>
              <span style={{ color: deliveryCharge === 0 ? 'var(--success)' : 'var(--text-muted)' }}>
                {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
              </span>
            </div>
            <div className="divider" style={{ margin: '12px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '18px', fontWeight: 700 }}>
              <span>Total</span><span className="gradient-text">₹{finalTotal.toLocaleString('en-IN')}</span>
            </div>
            <button className="btn btn-primary btn-lg" style={{ width: '100%' }}
              onClick={() => { closeCart(); navigate('/checkout'); }}>
              Proceed to Checkout →
            </button>
          </div>
        )}
      </div>
    </>
  );
}
