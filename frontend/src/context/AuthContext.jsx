import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const validateSession = async () => {
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (!savedToken || !savedUser) {
        // No saved session — treat as new guest
        setLoading(false);
        return;
      }

      try {
        // Validate the token by calling the profile endpoint
        const res = await api.get('/api/user/profile', {
          headers: { Authorization: `Bearer ${savedToken}` },
        });
        // Token is valid — restore the session with fresh data from the server
        const freshUser = {
          name: res.data.name,
          email: res.data.email,
          role: res.data.role,
          userId: res.data.userId || res.data.id,
        };
        localStorage.setItem('user', JSON.stringify(freshUser));
        setToken(savedToken);
        setUser(freshUser);
      } catch (err) {
        // Token is expired or invalid — clear stale data, treat as new guest
        console.log('Session expired or invalid, clearing stored data.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    validateSession();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/api/auth/login', { email, password });
    const data = res.data;
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify({ name: data.name, email: data.email, role: data.role, userId: data.userId }));
    setToken(data.token);
    setUser({ name: data.name, email: data.email, role: data.role, userId: data.userId });
    return data;
  };

  const register = async (name, email, password, phone) => {
    const res = await api.post('/api/auth/register', { name, email, password, phone });
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
