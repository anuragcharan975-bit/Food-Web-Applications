import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('zwigato_cart')) || []);
  const [wishlist, setWishlist] = useState(() => JSON.parse(localStorage.getItem('zwigato_wishlist')) || []);
  const [currentUser, setCurrentUser] = useState(() => JSON.parse(localStorage.getItem('zwigato_user')) || null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    localStorage.setItem('zwigato_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('zwigato_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('zwigato_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('zwigato_user');
    }
  }, [currentUser]);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const addToCart = (food) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.foodId === food._id);
      if (existing) {
        return prev.map((item) => item.foodId === food._id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { foodId: food._id, name: food.name, price: food.price, image: food.image, quantity: 1 }];
    });
    showToast(`Added ${food.name} to cart!`, 'success');
  };

  const changeQuantity = (foodId, change) => {
    setCart((prev) => {
      return prev.map((item) => {
        if (item.foodId === foodId) {
          return { ...item, quantity: item.quantity + change };
        }
        return item;
      }).filter((item) => {
        if (item.foodId === foodId && item.quantity <= 0) {
          showToast('Item removed from cart', 'error');
          return false;
        }
        return true;
      });
    });
  };

  const toggleWishlist = (foodId) => {
    setWishlist((prev) => {
      if (prev.includes(foodId)) {
        showToast('Removed from wishlist', 'error');
        return prev.filter(id => id !== foodId);
      }
      showToast('Added to your wishlist ❤️', 'success');
      return [...prev, foodId];
    });
  };

  const logout = () => {
    if (window.confirm(`Logged in as ${currentUser.name} (${currentUser.email}).\n\nDo you want to log out?`)) {
      setCurrentUser(null);
      showToast('Logged out successfully', 'success');
    }
  };

  const clearCart = () => setCart([]);

  return (
    <AppContext.Provider value={{
      cart, addToCart, changeQuantity, isCartOpen, setIsCartOpen, clearCart,
      wishlist, toggleWishlist,
      currentUser, setCurrentUser, logout,
      isAuthModalOpen, setIsAuthModalOpen, authMode, setAuthMode,
      toasts, showToast
    }}>
      {children}
    </AppContext.Provider>
  );
};
