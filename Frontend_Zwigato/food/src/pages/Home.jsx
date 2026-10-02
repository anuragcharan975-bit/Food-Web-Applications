import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import CategoryList from '../components/CategoryList';
import FoodMenu from '../components/FoodMenu';
import RestaurantGrid from '../components/RestaurantGrid';

export default function Home({ banners, categories, restaurants, foods, currentSearch, isSearching, selectedCategoryId, setSelectedCategoryId, isVegOnly, setIsVegOnly, currentSort, setCurrentSort }) {
  const homeRestaurants = restaurants.slice(0, 8);
  const homeFoods = (selectedCategoryId === "cat_all" && !currentSearch && !isVegOnly && currentSort === "default") ? foods.slice(0, 8) : foods;

  return (
    <main style={{ backgroundColor: 'var(--bg-light)', minHeight: '100vh', paddingBottom: '60px' }}>
      <Hero banners={banners} />
      
      <div className="container" style={{ marginTop: '20px' }}>
        <CategoryList 
          categories={categories} 
          selectedCategoryId={selectedCategoryId} 
          setSelectedCategoryId={setSelectedCategoryId} 
        />
      </div>

      <div className="container" style={{ marginTop: '40px' }}>
        <FoodMenu 
          foods={homeFoods} 
          categories={categories} 
          selectedCategoryId={selectedCategoryId}
          isVegOnly={isVegOnly}
          setIsVegOnly={setIsVegOnly}
          currentSearch={currentSearch}
          isSearching={isSearching}
          currentSort={currentSort}
          setCurrentSort={setCurrentSort}
        />
        <div style={{ textAlign: 'center', marginTop: '30px', marginBottom: '50px' }}>
          <Link to="/foods" style={{ 
            padding: '14px 32px', 
            background: 'var(--white)', 
            color: 'var(--primary)', 
            border: '2px solid var(--primary)',
            textDecoration: 'none', 
            borderRadius: 'var(--radius-sm)', 
            fontWeight: 'bold',
            transition: 'all 0.3s ease',
            display: 'inline-block'
          }}>
            Explore All Dishes ➔
          </Link>
        </div>
      </div>
      
      <div className="container" style={{ paddingBottom: '40px' }}>
        <RestaurantGrid restaurants={homeRestaurants} />
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <Link to="/restaurants" style={{ 
            padding: '14px 32px', 
            background: 'var(--primary)', 
            color: 'var(--white)', 
            textDecoration: 'none', 
            borderRadius: 'var(--radius-sm)', 
            fontWeight: 'bold',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 10px rgba(255, 71, 87, 0.2)',
            display: 'inline-block'
          }}>
            Explore All Restaurants ➔
          </Link>
        </div>
      </div>
    </main>
  );
}
