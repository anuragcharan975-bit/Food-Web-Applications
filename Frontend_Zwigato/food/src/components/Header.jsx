import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Header({ currentSearch, setCurrentSearch }) {
  const { cart, currentUser, setIsCartOpen, setIsAuthModalOpen, logout } = useContext(AppContext);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const navigate = useNavigate();

  const handleUserClick = () => {
    if (currentUser) {
      navigate('/profile');
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const scrollToMenu = () => {
    const menu = document.getElementById('menu-section');
    if (menu) {
      menu.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="header">
      <div className="container nav-container">
        
        {/* Brand Logo & Location */}
        <div className="logo-area">
          <Link to="/" className="brand-logo" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <span className="brand-icon">🍔</span>
            Zwig<span>ato</span>
          </Link>

          <div className="location-badge" title="Delivery Location">
            <span>📍</span>
            <span>Deliver to: <strong>Jaipur, Rajasthan</strong></span>
          </div>
        </div>

        {/* Live Search Bar */}
        <div className="search-container">
          <span className="search-icon">🔍</span>
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search for pizza, biryani, burgers or restaurants..." 
            value={currentSearch}
            onChange={(e) => setCurrentSearch(e.target.value)}
          />
        </div>

        {/* Navigation Actions */}
        <div className="nav-actions">
          {/* Navigation Links */}
          <Link to="/restaurants" className="nav-btn" style={{ textDecoration: 'none', color: 'inherit' }}>
            <span>🏪</span>
            <span>Restaurants</span>
          </Link>

          <Link to="/foods" className="nav-btn" style={{ textDecoration: 'none', color: 'inherit' }}>
            <span>🍔</span>
            <span>Foods</span>
          </Link>

          {/* Cart Button */}
          <button className="nav-btn nav-btn-primary" onClick={() => setIsCartOpen(true)}>
            <span>🛒</span>
            <span>Cart</span>
            <span className="cart-badge">{cartItemCount}</span>
          </button>

          {/* User Profile / Login */}
          <button 
            className={`nav-btn ${currentUser ? 'user-badge' : ''}`} 
            onClick={handleUserClick}
          >
            {currentUser ? `👤 ${currentUser.name.split(" ")[0]}` : 'Sign In'}
          </button>
        </div>

      </div>
    </header>
  );
}
