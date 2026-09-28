import React, { useState, useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import AuthModal from './components/AuthModal';
import ToastContainer from './components/ToastContainer';
import Home from './pages/Home';
import { fetchBanners, fetchCategories, fetchRestaurants, fetchFoods } from './services/api';

import { Routes, Route, useLocation } from 'react-router-dom';
import Profile from './pages/Profile';
import AdminLayout from './components/AdminLayout';
import AllFoods from './pages/AllFoods';
import AllRestaurants from './pages/AllRestaurants';
import RestaurantDetails from './pages/RestaurantDetails';

function AppContent() {
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [foods, setFoods] = useState([]);

  const [currentSearch, setCurrentSearch] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('cat_all');
  const [isVegOnly, setIsVegOnly] = useState(false);
  const [currentSort, setCurrentSort] = useState('default');

  const [isSearching, setIsSearching] = useState(false);

  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    const loadInitialData = async () => {
      const [bannersData, categoriesData, restaurantsData] = await Promise.all([
        fetchBanners(),
        fetchCategories(),
        fetchRestaurants()
      ]);
      setBanners(bannersData);
      setCategories(categoriesData);
      setRestaurants(restaurantsData);
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    const loadFoods = async () => {
      setIsSearching(true);
      const foodsData = await fetchFoods(currentSearch);
      setFoods(foodsData);
      setIsSearching(false);
    };

    const timer = setTimeout(() => {
      loadFoods();
    }, 400);

    return () => clearTimeout(timer);
  }, [currentSearch]);

  return (
    <>
      {!isAdminRoute && <Header currentSearch={currentSearch} setCurrentSearch={setCurrentSearch} />}
      <Routes>
        <Route path="/" element={
          <Home 
            banners={banners} 
            categories={categories} 
            restaurants={restaurants} 
            foods={foods} 
            currentSearch={currentSearch}
            isSearching={isSearching}
            selectedCategoryId={selectedCategoryId}
            setSelectedCategoryId={setSelectedCategoryId}
            isVegOnly={isVegOnly}
            setIsVegOnly={setIsVegOnly}
            currentSort={currentSort}
            setCurrentSort={setCurrentSort}
          />
        } />
        <Route path="/foods" element={
          <AllFoods 
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
        } />
        <Route path="/restaurants" element={
          <AllRestaurants restaurants={restaurants} />
        } />
        <Route path="/restaurant/:id" element={<RestaurantDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin/*" element={<AdminLayout />} />
      </Routes>
      {!isAdminRoute && (
        <>
          <CartDrawer />
          <AuthModal />
          <ToastContainer />
          <Footer />
        </>
      )}
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
