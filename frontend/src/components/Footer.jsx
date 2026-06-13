import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border)', marginTop: 'auto' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 24px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px' }}>
        {/* Brand */}
        <div>
          <div style={{ fontSize: '20px', fontWeight: 800, marginBottom: '12px' }}>
            <span style={{ background: 'linear-gradient(135deg, #a78bfa, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Shop</span>
            <span style={{ color: 'var(--accent)' }}>Flow</span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-subtle)', lineHeight: '1.7' }}>Premium e-commerce platform for electronics and fashion. Built with Spring Boot & React.</p>
        </div>
        {/* Quick Links */}
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>Quick Links</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link to="/" style={{ fontSize: '13px', color: 'var(--text-subtle)', transition: 'color 0.2s' }}>Home</Link>
            <Link to="/products" style={{ fontSize: '13px', color: 'var(--text-subtle)', transition: 'color 0.2s' }}>Products</Link>
            <Link to="/orders" style={{ fontSize: '13px', color: 'var(--text-subtle)', transition: 'color 0.2s' }}>My Orders</Link>
            <Link to="/profile" style={{ fontSize: '13px', color: 'var(--text-subtle)', transition: 'color 0.2s' }}>Profile</Link>
          </div>
        </div>
        {/* Contact */}
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>Contact</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: 'var(--text-subtle)' }}>
            <span>📧 support@shopflow.com</span>
            <span>📞 +91 98765 43210</span>
            <span>📍 Bengaluru, Karnataka</span>
          </div>
        </div>
      </div>
      {/* Bottom Bar */}
      <div style={{ borderTop: '1px solid var(--border)', padding: '16px 24px', textAlign: 'center', fontSize: '12px', color: 'var(--text-subtle)' }}>
        © 2024 ShopFlow. All rights reserved. Built with ❤️ using Spring Boot & React.
      </div>
    </footer>
  );
}
