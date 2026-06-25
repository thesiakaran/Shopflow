import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import PageTransition from './components/PageTransition';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import { WishlistProvider } from './context/WishlistContext';
import { RecentlyViewedProvider } from './context/RecentlyViewedContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';
import RecentlyViewedSidebar from './components/RecentlyViewedSidebar';

// Lazy Loaded Pages
const HomePage = React.lazy(() => import('./pages/HomePage'));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const ProductsPage = React.lazy(() => import('./pages/ProductsPage'));
const ProductDetailPage = React.lazy(() => import('./pages/ProductDetailPage'));
const CartPage = React.lazy(() => import('./pages/CartPage'));
const CheckoutPage = React.lazy(() => import('./pages/CheckoutPage'));
const PaymentPage = React.lazy(() => import('./pages/PaymentPage'));
const ConfirmationPage = React.lazy(() => import('./pages/ConfirmationPage'));
const OrdersPage = React.lazy(() => import('./pages/OrdersPage'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
const WishlistPage = React.lazy(() => import('./pages/WishlistPage'));

// Protected Route Wrapper
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="page" style={{ paddingTop: '96px', display: 'flex', justifyContent: 'center' }}><div className="spinner" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function AppContent() {
  const location = useLocation();

  return (
    <>
      <Navbar />
      <CartSidebar />
      <RecentlyViewedSidebar />
      <main style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <Suspense fallback={<div className="page" style={{ paddingTop: '32px', display: 'flex', justifyContent: 'center' }}><div className="spinner" /></div>}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              {/* Public Routes */}
              <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
              <Route path="/register" element={<PageTransition><RegisterPage /></PageTransition>} />
              <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
              <Route path="/products" element={<PageTransition><ProductsPage /></PageTransition>} />
              <Route path="/products/:category/:id" element={<PageTransition><ProductDetailPage /></PageTransition>} />

              {/* Protected Routes */}
              <Route path="/cart" element={<ProtectedRoute><PageTransition><CartPage /></PageTransition></ProtectedRoute>} />
              <Route path="/checkout" element={<ProtectedRoute><PageTransition><CheckoutPage /></PageTransition></ProtectedRoute>} />
              <Route path="/payment" element={<ProtectedRoute><PageTransition><PaymentPage /></PageTransition></ProtectedRoute>} />
              <Route path="/confirmation" element={<ProtectedRoute><PageTransition><ConfirmationPage /></PageTransition></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute><PageTransition><OrdersPage /></PageTransition></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><PageTransition><ProfilePage /></PageTransition></ProtectedRoute>} />
              <Route path="/wishlist" element={<ProtectedRoute><PageTransition><WishlistPage /></PageTransition></ProtectedRoute>} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <GoogleOAuthProvider clientId="284693680629-hf99kpo1ifk6i09b71mtrpu719flqijg.apps.googleusercontent.com">
      <Router>
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <RecentlyViewedProvider>
                  <AppContent />
                </RecentlyViewedProvider>
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;