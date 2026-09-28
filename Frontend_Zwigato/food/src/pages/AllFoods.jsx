import React from 'react';
import FoodMenu from '../components/FoodMenu';

export default function AllFoods({ foods, categories, selectedCategoryId, setSelectedCategoryId, isVegOnly, setIsVegOnly, currentSearch, isSearching, currentSort, setCurrentSort }) {
  return (
    <main style={{ padding: '40px 0', minHeight: '80vh' }}>
      <FoodMenu 
        foods={foods} 
        categories={categories} 
        selectedCategoryId={selectedCategoryId}
        setSelectedCategoryId={setSelectedCategoryId}
        isVegOnly={isVegOnly}
        setIsVegOnly={setIsVegOnly}
        currentSearch={currentSearch}
        isSearching={isSearching}
        currentSort={currentSort}
        setCurrentSort={setCurrentSort}
      />
    </main>
  );
}
