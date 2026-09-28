import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { fetchRestaurantById, fetchFoods } from '../services/api';

export default function RestaurantDetails() {
  const { id } = useParams();
  const { addToCart, showToast } = useContext(AppContext);
  
  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [isVegOnly, setIsVegOnly] = useState(false);

  useEffect(() => {
    const loadRestaurantData = async () => {
      setLoading(true);
      // Fetch restaurant
      const resData = await fetchRestaurantById(id);
      
      // We'll fetch all foods and filter since backend doesn't have by-restaurant endpoint
      const allFoods = await fetchFoods();
      const resFoods = allFoods.filter(f => f.restaurant && (f.restaurant._id === id || f.restaurant === id));
      
      setRestaurant(resData);
      setFoods(resFoods);
      setLoading(false);
    };
    
    loadRestaurantData();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: '100px 20px', textAlign: 'center' }}>
        <h2>Loading Menu... 🍽️</h2>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div style={{ padding: '100px 20px', textAlign: 'center' }}>
        <h2>Restaurant not found 😢</h2>
        <Link to="/" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Go Back Home</Link>
      </div>
    );
  }

  // Filter foods based on search and veg only
  const filteredFoods = foods.filter(food => {
    const matchSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchVeg = isVegOnly ? (food.type === 'Veg' || food.isVeg) : true;
    return matchSearch && matchVeg;
  });

  // Fix image URL resolution
  const getImageUrl = (img) => {
    if (!img) return 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200';
    if (img.startsWith('http')) return img;
    return `http://localhost:5000/uploads/${img}`;
  };

  const getFoodImageUrl = (img) => {
    if (!img) return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500';
    if (img.startsWith('http')) return img;
    return `http://localhost:5000/uploads/${img}`;
  };

  const mapQuery = (restaurant.latitude && restaurant.longitude) 
    ? `${restaurant.latitude},${restaurant.longitude}` 
    : encodeURIComponent(restaurant.address || restaurant.name);

  return (
    <div className="restaurant-details-page">
      {/* Restaurant Header */}
      <div className="restaurant-hero" style={{ 
        backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${getImageUrl(restaurant.image)})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '60px 20px',
        color: 'white',
        textAlign: 'center'
      }}>
        <div className="container">
          <h1 style={{ fontSize: '42px', marginBottom: '10px' }}>{restaurant.name}</h1>
          <p style={{ fontSize: '18px', opacity: 0.9, marginBottom: '20px' }}>{restaurant.description || 'Delicious food delivered to you.'}</p>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ background: 'var(--success)', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                ★ {restaurant.rating || '4.5'}
              </span>
              <span>Ratings</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📍 {restaurant.address}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>⏱️ 30-40 mins</span>
            </div>
            
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                background: 'rgba(255,255,255,0.2)', 
                padding: '6px 12px', 
                borderRadius: '20px', 
                color: 'white', 
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                border: '1px solid rgba(255,255,255,0.5)',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            >
              🗺️ Open in Google Maps
            </a>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 20px' }}>
        
        {/* Filters */}
        <div className="controls-bar">
          <div className="filter-group">
            <label className="veg-toggle">
              <input 
                type="checkbox" 
                checked={isVegOnly} 
                onChange={(e) => setIsVegOnly(e.target.checked)} 
                style={{ display: 'none' }}
              />
              <div className="toggle-switch"></div>
              Veg Only
            </label>
          </div>
          
          <div className="search-container" style={{ maxWidth: '300px' }}>
            <span className="search-icon">🔍</span>
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search in menu..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Menu Grid */}
        <div style={{ marginTop: '30px' }}>
          <h2 style={{ fontSize: '28px', color: 'var(--secondary)', marginBottom: '20px', borderBottom: '2px solid var(--border)', paddingBottom: '10px' }}>
            Menu ({filteredFoods.length})
          </h2>
          
          {filteredFoods.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <h3>No items found matching your search.</h3>
            </div>
          ) : (
            <div className="food-grid">
              {filteredFoods.map(food => (
                <div key={food._id} className="food-card">
                  <div className="food-img-container">
                    <img src={getFoodImageUrl(food.image)} alt={food.name} className="food-img" />
                    <div className="veg-indicator">
                      {food.type === 'Veg' ? (
                        <div className="veg-icon"><div className="veg-dot"></div></div>
                      ) : (
                        <div className="non-veg-icon"><div className="non-veg-dot"></div></div>
                      )}
                    </div>
                  </div>
                  <div className="food-details">
                    <h3 className="food-title">{food.name}</h3>
                    <p className="food-desc">{food.description}</p>
                    <div className="food-footer">
                      <div className="price-box">
                        <span className="current-price">₹{food.discountPrice || food.price}</span>
                        {food.discountPrice && food.discountPrice < food.price && (
                          <span className="original-price">₹{food.price}</span>
                        )}
                      </div>
                      <button 
                        className="add-cart-btn"
                        onClick={() => {
                          addToCart(food);
                          showToast(`Added ${food.name} to cart!`, "success");
                        }}
                      >
                        ADD +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
