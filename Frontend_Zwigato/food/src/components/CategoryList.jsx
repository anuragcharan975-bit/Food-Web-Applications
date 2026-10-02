import React from 'react';
import { getCategoryImageUrl } from '../utils/imageUtils';

export default function CategoryList({ categories, selectedCategoryId, setSelectedCategoryId }) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">What's on your mind?</h2>
        </div>

        <div className="category-scroll">
          {categories.map((cat) => (
            <div 
              key={cat._id}
              className={`category-card ${selectedCategoryId === cat._id ? "active" : ""}`} 
              onClick={() => setSelectedCategoryId(cat._id)}
            >
              <div className="category-img-wrap">
                <img 
                  src={getCategoryImageUrl(cat.image)} 
                  alt={cat.name} 
                  className="category-img" 
                />
              </div>
              <span className="category-name">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
