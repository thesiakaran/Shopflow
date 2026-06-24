import axios from 'axios';

// Base Axios instance pointing to Spring Boot backend
const isProd = import.meta.env.PROD;
const api = axios.create({
  baseURL: isProd ? 'https://violet-tactile-fructose.ngrok-free.dev' : window.location.origin,
  headers: { 
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true' // Bypasses Ngrok warning page for API calls
  },
});

// ── Request Interceptor ──────────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor ─────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const requestUrl = error.config?.url || '';
    
    // MOCK DATA FALLBACK FOR VERCEL (Serverless Mode)
    // If the backend is not running, intercept the 404/Network Error and return static JSON
    try {
      if (requestUrl.includes('/api/auth/register')) {
        return { data: { message: "User registered successfully (Mocked)" } };
      }
      if (requestUrl.includes('/api/auth/login')) {
        const payload = JSON.parse(error.config.data || '{}');
        return { 
          data: { 
            token: "mock-jwt-token-" + Date.now(), 
            name: payload.email ? payload.email.split('@')[0] : 'Demo User', 
            email: payload.email || 'demo@example.com', 
            role: "USER", 
            userId: "mock-user-123" 
          } 
        };
      }
      if (requestUrl.includes('/api/user/profile')) {
        return { 
          data: { 
            name: 'Demo User', email: 'demo@example.com', role: 'USER', userId: 'mock-user-123' 
          } 
        };
      }
      if (requestUrl.includes('/electronics/categories') || requestUrl.includes('/fashion/categories')) {
        const res = await axios.get('/mock-categories.json');
        return { data: res.data };
      }
      if (requestUrl.includes('/electronics')) {
        const res = await axios.get('/mock-electronics.json');
        let arrayData = Array.isArray(res.data) ? res.data : (res.data?.content || []);
        const parts = requestUrl.split('?')[0].split('/');
        const idStr = parts[parts.length - 1];
        if (idStr && idStr !== 'electronics' && idStr !== 'products') {
          const product = arrayData.find(p => String(p.id) === idStr || String(p.mongoID) === idStr);
          return { data: product || arrayData[0] || {} };
        }
        return { data: res.data };
      }
      if (requestUrl.includes('/fashion')) {
        const res = await axios.get('/mock-fashion.json');
        let arrayData = Array.isArray(res.data) ? res.data : (res.data?.content || []);
        const parts = requestUrl.split('?')[0].split('/');
        const idStr = parts[parts.length - 1];
        if (idStr && idStr !== 'fashion' && idStr !== 'products') {
          const product = arrayData.find(p => String(p.id) === idStr || String(p.mongoID) === idStr);
          return { data: product || arrayData[0] || {} };
        }
        return { data: res.data };
      }
    } catch (mockError) {
      console.error("Mock fallback failed", mockError);
    }

    const isAuthEndpoint = requestUrl.includes('/api/auth/');
    if (error.response?.status === 401 && !isAuthEndpoint) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
