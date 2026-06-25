import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useWishlist } from '../context/WishlistContext';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount, openCart } = useCart();
  const { isDark, toggleTheme } = useTheme();
  const { wishlist } = useWishlist();
  const { openDrawer } = useRecentlyViewed();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="glass" style={{
      position: 'sticky', top: 0, height: '64px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px', zIndex: 50, borderBottom: '1px solid var(--border)',
    }}>
      {/* Logo */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '22px', fontWeight: 800 }}>
        <span style={{ background: 'linear-gradient(135deg, #a78bfa, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Shop</span>
        <span style={{ color: 'var(--accent)' }}>Flow</span>
      </Link>

      {/* Desktop Nav Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }} className="nav-links-desktop">
        <Link to="/" style={{ fontSize: '14px', fontWeight: 500, color: isActive('/') ? 'var(--primary)' : 'var(--text-muted)', transition: 'color 0.2s' }}>Home</Link>
        <Link to="/products" style={{ fontSize: '14px', fontWeight: 500, color: isActive('/products') ? 'var(--primary)' : 'var(--text-muted)', transition: 'color 0.2s' }}>Products</Link>
        {user && <Link to="/orders" style={{ fontSize: '14px', fontWeight: 500, color: isActive('/orders') ? 'var(--primary)' : 'var(--text-muted)', transition: 'color 0.2s' }}>My Orders</Link>}
      </div>

      {/* Right Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        
        {/* Theme Toggle Button */}
        <button onClick={toggleTheme} style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)'
        }} title="Toggle Dark/Light Mode">
          {isDark ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          )}
        </button>

        {user ? (
          <>
            {/* Recently Viewed Button */}
            <button onClick={openDrawer} style={{
              position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }} title="Recently Viewed">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
              </svg>
            </button>

            {/* Wishlist Button */}
            <Link to="/wishlist" style={{
              position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              {wishlist.length > 0 && (
                <span style={{
                  position: 'absolute', top: '2px', right: '0px',
                  background: '#ef4444', color: 'white',
                  fontSize: '10px', fontWeight: 700, width: '18px', height: '18px',
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{wishlist.length > 9 ? '9+' : wishlist.length}</span>
              )}
            </Link>

            {/* Cart Button */}
            <button onClick={openCart} style={{
              position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: '8px',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute', top: '2px', right: '0px',
                  background: 'var(--accent)', color: 'white',
                  fontSize: '10px', fontWeight: 700, width: '18px', height: '18px',
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{cartCount > 9 ? '9+' : cartCount}</span>
              )}
            </button>

            {/* Profile Link */}
            <Link to="/profile" className="nav-links-desktop" style={{
              fontSize: '13px', fontWeight: 500, color: 'var(--text-muted)',
              padding: '6px 12px', borderRadius: 'var(--radius)', transition: 'all 0.2s',
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              {user.picture && <img src={user.picture} alt="Profile" style={{ width: '20px', height: '20px', borderRadius: '50%' }} />}
              {user.name?.split(' ')[0]}
            </Link>

            <button onClick={logout} className="btn btn-ghost btn-sm nav-links-desktop" style={{ fontSize: '13px' }}>Logout</button>
          </>
        ) : (
          <>
            {/* Guest Profile Icon */}
            <Link to="/login" className="nav-links-desktop" style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'var(--bg-hover)', border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s', cursor: 'pointer',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-subtle)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </Link>
            <Link to="/login" className="btn btn-ghost btn-sm nav-links-desktop">Login</Link>
            <Link to="/register" className="btn btn-primary btn-sm nav-links-desktop">Sign Up</Link>
          </>
        )}

        {/* Mobile Hamburger */}
        <button onClick={() => setMobileOpen(!mobileOpen)} style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: '8px',
        }} className="mobile-menu-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2">
            {mobileOpen ? <path d="M18 6L6 18M6 6l12 12"/> : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div style={{
          position: 'absolute', top: '64px', left: 0, right: 0,
          background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)',
          padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '12px',
        }} className="animate-fadeIn">
          <Link to="/" onClick={() => setMobileOpen(false)} style={{ fontSize: '14px', color: 'var(--text-muted)', padding: '8px 0' }}>Home</Link>
          <Link to="/products" onClick={() => setMobileOpen(false)} style={{ fontSize: '14px', color: 'var(--text-muted)', padding: '8px 0' }}>Products</Link>
          {user ? (
            <>
              <Link to="/orders" onClick={() => setMobileOpen(false)} style={{ fontSize: '14px', color: 'var(--text-muted)', padding: '8px 0' }}>My Orders</Link>
              <Link to="/profile" onClick={() => setMobileOpen(false)} style={{ fontSize: '14px', color: 'var(--text-muted)', padding: '8px 0' }}>My Profile</Link>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px', marginTop: '4px' }}>
                <button onClick={() => { logout(); setMobileOpen(false); }} className="btn btn-outline btn-sm" style={{ width: '100%', color: 'var(--error)', borderColor: 'var(--error)' }}>Logout</button>
              </div>
            </>
          ) : (
            <>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px', marginTop: '4px', display: 'flex', gap: '12px' }}>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="btn btn-ghost btn-sm" style={{ flex: 1, textAlign: 'center' }}>Login</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="btn btn-primary btn-sm" style={{ flex: 1, textAlign: 'center' }}>Sign Up</Link>
              </div>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
