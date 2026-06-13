import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const successMessage = location.state?.successMessage || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)', paddingTop: '80px' }}>
      <div className="card glass auth-card animate-fadeIn">
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>
            <span className="gradient-text">Welcome Back</span>
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-subtle)' }}>Login to your ShopFlow account</p>
        </div>

        {successMessage && !error && (
          <div style={{ padding: '12px 16px', background: 'rgba(34,197,94,0.1)', borderRadius: 'var(--radius)', marginBottom: '20px', border: '1px solid rgba(34,197,94,0.2)' }}>
            <p className="success-msg" style={{ margin: 0, color: '#22c55e', fontSize: '14px', fontWeight: 600 }}>✓ {successMessage}</p>
          </div>
        )}

        {error && <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.1)', borderRadius: 'var(--radius)', marginBottom: '20px', border: '1px solid rgba(239,68,68,0.2)' }}><p className="error-msg" style={{ margin: 0 }}>⚠ {error}</p></div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div><label>Email</label><input className="input" type="email" placeholder="john@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required /></div>
          <div><label>Password</label><input className="input" type="password" placeholder="Enter your password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required /></div>
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ marginTop: '8px' }}>
            {loading ? <><div className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} /> Logging in...</> : 'Login'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--text-subtle)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Register</Link>
        </p>
      </div>
    </div>
  );
}
