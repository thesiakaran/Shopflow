import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import ProductCard from '../components/ProductCard';

export default function HomePage() {
  const [electronics, setElectronics] = useState([]);
  const [fashion, setFashion] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch the first page with a small size of 4 directly from backend
        const [elecRes, fashRes] = await Promise.all([
          api.get('/api/products/electronics', { params: { size: 4 } }),
          api.get('/api/products/fashion', { params: { size: 4 } }),
        ]);
        setElectronics(elecRes.data.content);
        setFashion(fashRes.data.content);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

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

      {/* Tech Stack for Recruiters */}
      <section style={{ maxWidth: '1000px', margin: '0 auto 64px', padding: '40px', background: 'linear-gradient(135deg, rgba(124,58,237,0.05), rgba(249,115,22,0.05))', borderRadius: '24px', border: '1px solid var(--border)' }}>
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <span className="badge badge-warning" style={{ fontSize: '10px', letterSpacing: '1px' }}>RECRUITER QUICK-GLANCE</span>
        </div>
        <h2 style={{ textAlign: 'center', fontSize: '22px', fontWeight: 800, marginBottom: '24px', color: 'var(--text-primary)' }}>Powered by Enterprise Microservices</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px' }}>
          {['☕ Java 17', '🍃 Spring Boot 3', '🧩 6x Microservices', '⚡ Apache Kafka', '🔍 Elasticsearch', '🍃 MongoDB', '🐬 MySQL', '⚛️ React.js', '🚀 Vite'].map(tech => (
            <span key={tech} className="badge" style={{ padding: '8px 16px', fontSize: '14px', background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)', boxShadow: 'var(--shadow)' }}>
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* Featured Electronics */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px 64px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 className="section-title">Featured Electronics</h2>
          <Link to="/products?category=electronics" className="btn btn-ghost btn-sm">View All →</Link>
        </div>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}><div className="spinner" /></div>
        ) : (
          <div className="product-grid">{electronics.map(p => <ProductCard key={p.id} product={p} category="electronics" />)}</div>
        )}
      </section>

      {/* Featured Fashion */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px 64px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 className="section-title">Trending Fashion</h2>
          <Link to="/products?category=fashion" className="btn btn-ghost btn-sm">View All →</Link>
        </div>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}><div className="spinner" /></div>
        ) : (
          <div className="product-grid">{fashion.map(p => <ProductCard key={p.mongoID} product={p} category="fashion" />)}</div>
        )}
      </section>
    </div>
  );
}
