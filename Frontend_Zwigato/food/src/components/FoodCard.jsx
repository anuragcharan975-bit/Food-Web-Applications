import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { getFoodImageUrl } from '../utils/imageUtils';

export default function FoodCard({ food }) {
  const { cart, addToCart, changeQuantity, wishlist, toggleWishlist } = useContext(AppContext);
  
  const cartItem = cart.find((c) => c.foodId === food._id);
  const isWishlisted = wishlist.includes(food._id);
  const isVeg = food.type === "Veg";
  const restaurantName = typeof food.restaurant === "object" ? food.restaurant?.name : "Zwigato Special";

  return (
    <div className="food-card">
      <div className="food-img-container">
        <img 
          src={getFoodImageUrl(food.image)} 
          alt={food.name} 
          className="food-img" 
        />
        
        <div className="veg-indicator" title={food.type}>
          {isVeg ? (
            <div className="veg-icon"><div className="veg-dot"></div></div>
          ) : (
            <div className="non-veg-icon"><div className="non-veg-dot"></div></div>
          )}
        </div>

        <button 
          className={`wishlist-btn ${isWishlisted ? "active" : ""}`} 
          onClick={() => toggleWishlist(food._id)} 
          title="Save to Wishlist"
        >
          {isWishlisted ? "❤️" : "🤍"}
        </button>
      </div>

      <div className="food-details">
        <div className="food-restaurant">
          {restaurantName}
        </div>
        <h3 className="food-title">{food.name}</h3>
        <p className="food-desc">{food.description || "Fresh and prepared with finest ingredients."}</p>

        <div className="food-footer">
          <div className="price-box">
            <span className="current-price">₹{food.price}</span>
            {food.discountPrice && <span className="original-price">₹{food.discountPrice}</span>}
          </div>

          {cartItem ? (
            <div className="qty-control">
              <button className="qty-btn" onClick={() => changeQuantity(food._id, -1)}>−</button>
              <span className="qty-number">{cartItem.quantity}</span>
              <button className="qty-btn" onClick={() => changeQuantity(food._id, 1)}>+</button>
            </div>
          ) : (
            <button className="add-cart-btn" onClick={() => addToCart(food)}>
              ADD +
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
