import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="page-full">
      {/* Hero Section */}
      <section style={{
        padding: '120px 24px 80px', textAlign: 'center',
        background: 'linear-gradient(180deg, rgba(124,58,237,0.12) 0%, transparent 60%)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '720px', margin: '0 auto', position: 'relative', zIndex: 1 }} className="animate-fadeIn">
          <span className="badge badge-info" style={{ marginBottom: '16px' }}>✨ Premium E-Commerce Platform</span>
          <h1 style={{ fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 900, lineHeight: 1.1, marginBottom: '20px' }}>
            Discover <span className="gradient-text">Premium</span> Products
          </h1>
          <p style={{ fontSize: '18px', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '32px', maxWidth: '560px', margin: '0 auto 32px' }}>
            Shop the latest electronics and trending fashion — all in one place. Fast delivery, secure payments, and premium quality.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/products" className="btn btn-primary btn-lg">Shop Now →</Link>
            <Link to="/products" className="btn btn-outline btn-lg">Browse Categories</Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{
        display: 'flex', justifyContent: 'center', gap: '48px', padding: '32px 24px',
        borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
        background: 'var(--bg-surface)', flexWrap: 'wrap',
      }}>
        {[{ num: '10,000+', label: 'Products' }, { num: '500+', label: 'Brands' }, { num: 'FREE', label: 'Delivery over ₹999' }, { num: '24/7', label: 'Support' }].map((stat, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 800 }} className="gradient-text">{stat.num}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-subtle)', marginTop: '4px' }}>{stat.label}</div>
          </div>
        ))}
      </section>

      {/* Categories */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '64px 24px' }}>
        <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '40px' }}>Shop by Category</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {[{ name: 'Electronics', icon: '⚡', desc: 'Laptops, Phones, Gadgets & More', color: '#7c3aed', cat: 'electronics' },
            { name: 'Fashion', icon: '👗', desc: 'Trending Styles & Accessories', color: '#f97316', cat: 'fashion' }].map(cat => (
            <Link to={`/products?category=${cat.cat}`} key={cat.cat} className="card" style={{
              padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center',
              textAlign: 'center', gap: '16px', cursor: 'pointer', textDecoration: 'none',
            }}>
              <div style={{ fontSize: '48px' }}>{cat.icon}</div>
              <h3 style={{ fontSize: '20px', fontWeight: 700 }}>{cat.name}</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{cat.desc}</p>
              <span className="btn btn-outline btn-sm">Explore →</span>
            </Link>
          ))}
        </div>
      </section>


    </div>
  );
}
