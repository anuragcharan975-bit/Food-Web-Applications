import React, { useMemo } from 'react';
import FoodCard from './FoodCard';

export default function FoodMenu({ foods, categories, selectedCategoryId, isVegOnly, setIsVegOnly, currentSearch, isSearching, currentSort, setCurrentSort }) {
  
  const filteredFoods = useMemo(() => {
    let filtered = foods.filter((item) => {
      if (selectedCategoryId === "cat_all") return true;
      const catId = typeof item.category === "object" ? item.category?._id : item.category;
      const catName = typeof item.category === "object" ? item.category?.name : "";
      const activeCat = categories.find((c) => c._id === selectedCategoryId);
      return catId === selectedCategoryId || (activeCat && catName === activeCat.name);
    });

    if (isVegOnly) {
      filtered = filtered.filter((item) => item.type === "Veg");
    }

    if (currentSearch && currentSearch.trim() !== '') {
      const searchLower = currentSearch.trim().toLowerCase();
      filtered = filtered.filter((item) => {
        const restaurantName = typeof item.restaurant === 'object' && item.restaurant?.name 
          ? item.restaurant.name.toLowerCase() 
          : '';
        
        return item.name.toLowerCase().includes(searchLower) ||
               (item.description && item.description.toLowerCase().includes(searchLower)) ||
               restaurantName.includes(searchLower);
      });
    }

    if (currentSort === "price-low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (currentSort === "price-high") {
      filtered.sort((a, b) => b.price - a.price);
    }

    return filtered;
  }, [foods, categories, selectedCategoryId, isVegOnly, currentSearch, currentSort]);

  return (
    <section className="section" id="menu-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Order Delicious Food</h2>
          <span className="status-tag"><strong>{filteredFoods.length}</strong> Dishes Found</span>
        </div>

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
              <span>Pure Veg Only</span>
            </label>
          </div>

          <div className="filter-group">
            <label htmlFor="sort-select" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Sort by:</label>
            <select 
              id="sort-select" 
              className="sort-select" 
              value={currentSort}
              onChange={(e) => setCurrentSort(e.target.value)}
            >
              <option value="default">Relevance (Default)</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {isSearching ? (
          <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--primary)' }}>
            <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '4px solid rgba(255, 71, 87, 0.2)', borderTop: '4px solid var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            <h3>Searching...</h3>
          </div>
        ) : (
          <div className="food-grid">
            {filteredFoods.length > 0 ? (
              filteredFoods.map(food => (
                <FoodCard key={food._id} food={food} />
              ))
            ) : (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '50px 20px', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: '40px', marginBottom: '10px' }}>🍽️</p>
                <h3>No delicious food found!</h3>
                <p>Try searching for something else or reset your filters.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
