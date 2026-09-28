import React from 'react';
import RestaurantGrid from '../components/RestaurantGrid';

export default function AllRestaurants({ restaurants }) {
  return (
    <main style={{ padding: '40px 0', minHeight: '80vh' }}>
      <RestaurantGrid restaurants={restaurants} />
    </main>
  );
}
