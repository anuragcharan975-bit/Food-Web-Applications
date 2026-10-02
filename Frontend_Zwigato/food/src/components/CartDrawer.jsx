import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { apiPlaceOrder } from '../services/api';
import { getFoodImageUrl } from '../utils/imageUtils';

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, changeQuantity, currentUser, clearCart, showToast } = useContext(AppContext);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCouponDiscount, setAppliedCouponDiscount] = useState(0);

  const closeCart = () => setIsCartOpen(false);

  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) {
      showToast("Please enter a coupon code", "error");
      return;
    }

    if (code === "ZWIGATO50") {
      setAppliedCouponDiscount(100);
      showToast("Coupon ZWIGATO50 applied! ₹100 Saved 🎉", "success");
    } else if (code === "WELCOME") {
      setAppliedCouponDiscount(50);
      showToast("Coupon WELCOME applied! ₹50 Saved 🎉", "success");
    } else {
      showToast("Invalid coupon code. Try ZWIGATO50", "error");
    }
  };

  
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (cart.length === 0) {
      showToast("Your cart is empty!", "error");
      return;
    }
    
    // Just navigate to checkout page
    closeCart();
    navigate('/checkout', { state: { appliedCouponDiscount, couponCode } });
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = subtotal > 300 ? 0 : 35;
  const discount = Math.min(appliedCouponDiscount, subtotal);
  const total = Math.max(0, subtotal + delivery - discount);

  return (
    <>
      <div className={`drawer-backdrop ${isCartOpen ? 'open' : ''}`} onClick={closeCart}></div>
      
      <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <div className="cart-title">Your Food Cart</div>
          <button className="close-btn" onClick={closeCart}>✕</button>
        </div>

        <div className="cart-body">
          {cart.length === 0 ? (
            <div className="empty-cart-state">
              <div className="empty-cart-icon">🛒</div>
              <h3>Your Cart is Empty</h3>
              <p>Explore delicious dishes from your favourite restaurants.</p>
              <button className="banner-btn" style={{ marginTop: '16px', background: 'var(--primary)', color: 'white' }} onClick={closeCart}>
                Browse Food
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.foodId} className="cart-item">
                <img src={getFoodImageUrl(item.image)} 
                     alt={item.name} className="cart-item-img" />
                <div className="cart-item-details">
                  <div className="cart-item-title">{item.name}</div>
                  <div className="cart-item-price">₹{item.price} each</div>
                </div>
                <div className="qty-control">
                  <button className="qty-btn" onClick={() => changeQuantity(item.foodId, -1)}>−</button>
                  <span className="qty-number">{item.quantity}</span>
                  <button className="qty-btn" onClick={() => changeQuantity(item.foodId, 1)}>+</button>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div style={{ padding: '0 20px' }}>
            <div className="coupon-box">
              <input 
                type="text" 
                className="coupon-input" 
                placeholder="Coupon Code (e.g. ZWIGATO50)" 
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <button className="coupon-btn" onClick={applyCoupon}>Apply</button>
            </div>
          </div>
        )}

        <div className="cart-footer">
          <div className="bill-summary">
            <div className="bill-row">
              <span>Item Total</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="bill-row">
              <span>Delivery Fee</span>
              <span>{delivery === 0 ? "FREE" : `₹${delivery}`}</span>
            </div>
            <div className="bill-row" style={{ color: 'var(--success)' }}>
              <span>Coupon Discount</span>
              <span>-₹{discount}</span>
            </div>
            <div className="bill-row total">
              <span>TO PAY</span>
              <span>₹{total}</span>
            </div>
          </div>

          <button className="checkout-btn" style={{ marginTop: '16px' }} onClick={handleCheckout}>
            Proceed to Pay
          </button>
        </div>
      </div>
    </>
  );
}
