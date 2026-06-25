import { createContext, useContext, useState, useEffect } from 'react';

const RecentlyViewedContext = createContext();

export const useRecentlyViewed = () => useContext(RecentlyViewedContext);

export const RecentlyViewedProvider = ({ children }) => {
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    const saved = localStorage.getItem('shopflow_recently_viewed');
    return saved ? JSON.parse(saved) : [];
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('shopflow_recently_viewed', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  const addRecentlyViewed = (product) => {
    setRecentlyViewed(prev => {
      // Remove if exists to move it to the front
      const filtered = prev.filter(p => (p.id || p.mongoID) !== (product.id || product.mongoID));
      return [product, ...filtered].slice(0, 10); // Keep max 10
    });
  };

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <RecentlyViewedContext.Provider value={{ recentlyViewed, addRecentlyViewed, isDrawerOpen, openDrawer, closeDrawer }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
};
