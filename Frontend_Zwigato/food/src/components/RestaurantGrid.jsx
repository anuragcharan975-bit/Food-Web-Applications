import React from 'react';
import { Link } from 'react-router-dom';
import { getRestaurantImageUrl } from '../utils/imageUtils';

export default function RestaurantGrid({ restaurants }) {
  if (!restaurants || restaurants.length === 0) return null;

  return (
    <section className="section" style={{ background: '#ffffff', marginTop: '30px', padding: '40px 0' }}>
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Popular Restaurants Near You</h2>
        </div>

        <div className="restaurant-grid">
          {restaurants.map((res) => (
            <Link to={`/restaurant/${res._id}`} key={res._id} style={{ textDecoration: 'none' }}>
              <div className="restaurant-card">
                <div className="restaurant-img-wrap">
                  <img 
                    src={getRestaurantImageUrl(res.image)} 
                    alt={res.name} 
                    className="restaurant-img" 
                  />
                  <div className="restaurant-rating">★ {res.rating || "4.5"}</div>
                </div>
                <div className="restaurant-info">
                  <h3 className="restaurant-name">{res.name}</h3>
                  <p className="restaurant-address">📍 {res.address || "Jaipur, Rajasthan"}</p>
                  <div className="restaurant-phone">📞 {res.phone || "+91 98765 00000"}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
