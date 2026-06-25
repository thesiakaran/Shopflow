import { useRecentlyViewed } from '../context/RecentlyViewedContext';
import { Link } from 'react-router-dom';

export default function RecentlyViewedSidebar() {
  const { isDrawerOpen, closeDrawer, recentlyViewed } = useRecentlyViewed();

  if (!isDrawerOpen) return null;

  return (
    <>
      <div className="cart-overlay" onClick={closeDrawer} style={{ zIndex: 104 }} />
      <div className="cart-drawer" style={{ zIndex: 105 }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            Recently Viewed
          </h2>
          <button onClick={closeDrawer} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--text-muted)' }}>✕</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {recentlyViewed.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-subtle)', marginTop: '40px' }}>
              <div style={{ fontSize: '40px', marginBottom: '16px' }}>👁️</div>
              <p>You haven't viewed any products yet.</p>
            </div>
          ) : (
            recentlyViewed.map(p => {
              const isElec = p._category === 'electronics';
              const id = isElec ? p.id : p.mongoID;
              const name = isElec ? p.name : p.productDisplayName;
              const img = isElec ? (p.imageUrl?.split('-http')[0] || '') : `/images/${p.id}.jpg`;
              
              return (
                <div key={id} className="card hover-bg" style={{ padding: '12px', display: 'flex', gap: '16px', alignItems: 'center', borderRadius: '12px' }}>
                  <img src={img} alt="" style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} onError={e => e.target.style.display='none'} />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 600, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{name}</h4>
                    <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent)', marginTop: '4px' }}>₹{p.price?.toLocaleString('en-IN')}</p>
                  </div>
                  <Link to={`/products/${p._category}/${id}`} onClick={closeDrawer} className="btn btn-outline btn-sm" style={{ padding: '6px 12px', fontSize: '12px' }}>View</Link>
                </div>
              )
            })
          )}
        </div>
      </div>
    </>
  );
}
