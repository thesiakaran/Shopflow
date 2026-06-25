import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import AnimatedDatePicker from '../components/AnimatedDatePicker';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', birthDate: '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/api/user/profile');
        setProfile(res.data);
        setForm({ name: res.data.name, phone: res.data.phone || '', birthDate: res.data.birthDate || '' });
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const res = await api.put('/api/user/profile', form);
      setProfile({ ...profile, name: res.data.name, phone: res.data.phone, birthDate: res.data.birthDate });
      setEditing(false);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="page" style={{ paddingTop: '96px', display: 'flex', justifyContent: 'center' }}><div className="spinner" /></div>;

  const initials = profile?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??';

  return (
    <div className="page" style={{ paddingTop: '96px', maxWidth: '640px', margin: '0 auto' }}>
      <div className="animate-fadeIn">
        {/* Profile Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary), #9333ea)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px', fontSize: '28px', fontWeight: 800, color: 'white',
          }}>{initials}</div>
          <h1 style={{ fontSize: '24px', fontWeight: 800 }}>{profile?.name}</h1>
          <p style={{ color: 'var(--text-subtle)', fontSize: '14px', marginTop: '4px' }}>{profile?.email}</p>
          <span className="badge badge-info" style={{ marginTop: '8px' }}>{profile?.role}</span>
        </div>

        {message && <div className={`animate-fadeIn ${message.includes('success') ? 'success-msg' : 'error-msg'}`} style={{ textAlign: 'center', marginBottom: '16px', padding: '12px', background: message.includes('success') ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', borderRadius: 'var(--radius)' }}>{message}</div>}

        {/* Profile Card */}
        <div className="card" style={{ padding: '24px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700 }}>Profile Information</h2>
            <button onClick={() => { if (editing) { handleSave(); } else { setEditing(true); } }}
              className={editing ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'} disabled={saving}>
              {saving ? 'Saving...' : editing ? 'Save Changes' : 'Edit Profile'}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label>Name</label>
              {editing ? <input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /> : <p style={{ fontSize: '15px', fontWeight: 500, padding: '12px 0' }}>{profile?.name}</p>}
            </div>
            <div>
              <label>Email</label>
              <p style={{ fontSize: '15px', fontWeight: 500, padding: '12px 0', color: 'var(--text-subtle)' }}>{profile?.email} <span className="badge badge-info" style={{ marginLeft: '8px', fontSize: '10px' }}>Cannot change</span></p>
            </div>
            <div>
              <label>Phone</label>
              {editing ? <input className="input" value={form.phone} maxLength={10} onChange={e => setForm({ ...form, phone: e.target.value.replace(/\D/g, '') })} placeholder="10-digit phone" /> : <p style={{ fontSize: '15px', fontWeight: 500, padding: '12px 0' }}>{profile?.phone || 'Not set'}</p>}
            </div>
            <div>
              <label>Date of Birth</label>
              {editing ? <AnimatedDatePicker value={form.birthDate} onChange={val => setForm({ ...form, birthDate: val })} /> : <p style={{ fontSize: '15px', fontWeight: 500, padding: '12px 0' }}>{profile?.birthDate ? (() => { const [y, m, d] = profile.birthDate.split('-'); return new Date(y, m - 1, d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }); })() : 'Not set'}</p>}
            </div>
          </div>
          {editing && <button onClick={() => { setEditing(false); setForm({ name: profile?.name || '', phone: profile?.phone || '', birthDate: profile?.birthDate || '' }); }} className="btn btn-ghost btn-sm" style={{ marginTop: '8px' }}>Cancel</button>}
        </div>

        {/* Quick Links */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
          <Link to="/orders" className="card" style={{ padding: '20px', textAlign: 'center', textDecoration: 'none' }}>
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>📦</div>
            <p style={{ fontSize: '14px', fontWeight: 600 }}>My Orders</p>
          </Link>
          <Link to="/cart" className="card" style={{ padding: '20px', textAlign: 'center', textDecoration: 'none' }}>
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>🛒</div>
            <p style={{ fontSize: '14px', fontWeight: 600 }}>My Cart</p>
          </Link>
        </div>

        <button onClick={logout} className="btn btn-outline" style={{ width: '100%', color: 'var(--error)', borderColor: 'var(--error)' }}>Logout</button>
      </div>
    </div>
  );
}
