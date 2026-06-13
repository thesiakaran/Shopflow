import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.phone);
      navigate('/login', { state: { successMessage: 'Successfully registered! Please login.' } });
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.fields ? Object.values(err.response?.data?.fields || {}).join('. ') : 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)', paddingTop: '80px' }}>
      <div className="card glass auth-card animate-fadeIn">
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>
            <span className="gradient-text">Create Account</span>
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-subtle)' }}>Join ShopFlow and start shopping</p>
        </div>

        {error && <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.1)', borderRadius: 'var(--radius)', marginBottom: '20px', border: '1px solid rgba(239,68,68,0.2)' }}><p className="error-msg" style={{ margin: 0 }}>⚠ {error}</p></div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div><label>Full Name</label><input className="input" type="text" placeholder="John Doe" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
          <div><label>Email</label><input className="input" type="email" placeholder="john@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required /></div>
          <div><label>Password</label><input className="input" type="password" placeholder="Min 6 characters" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required minLength={6} /></div>
          <div><label>Phone</label><input className="input" type="tel" placeholder="10-digit number" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required pattern="[0-9]{10}" /></div>
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ marginTop: '8px' }}>
            {loading ? <><div className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} /> Creating...</> : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--text-subtle)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Login</Link>
        </p>
      </div>
    </div>
  );
}
