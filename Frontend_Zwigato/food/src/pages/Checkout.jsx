import React, { useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { apiPlaceOrder, apiVerifyPayment } from '../services/api';

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, currentUser, clearCart, showToast } = useContext(AppContext);
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Online');
  const [isProcessing, setIsProcessing] = useState(false);

  const appliedCouponDiscount = location.state?.appliedCouponDiscount || 0;

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/');
    }
  }, [cart, navigate]);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async () => {
    if (!address.trim()) {
      showToast("Please enter delivery address", "error");
      return;
    }

    setIsProcessing(true);

    const orderData = {
      userId: currentUser ? currentUser._id : "guest_user",
      items: cart,
      deliveryAddress: address,
      paymentMethod
    };

    const res = await apiPlaceOrder(orderData);
    
    if (!res.success) {
      showToast(res.message || "Failed to place order. Some items might be unavailable.", "error");
      setIsProcessing(false);
      return;
    }

    if (paymentMethod === "COD") {
      clearCart();
      showToast("Order placed successfully!", "success");
      navigate('/order-confirmation', { state: { orderId: res.orderId, amount: res.data.totalAmount, method: "COD" } });
    } else {
      // ONLINE PAYMENT FLOW
      if (res.demoOnlinePayment) {
        clearCart();
        showToast("Order placed (Demo Online Payment)", "success");
        navigate('/order-confirmation', { state: { orderId: res.orderId, amount: res.data?.totalAmount || 'Demo', method: "Online" } });
        return;
      }

      const resRazorpay = await loadRazorpay();
      if (!resRazorpay) {
        showToast("Razorpay SDK failed to load. Are you online?", "error");
        setIsProcessing(false);
        return;
      }

      const options = {
        key: 'rzp_test_YOUR_KEY_HERE', // Usually passed from backend, hardcoding for demo, but backend has key_secret
        amount: res.amount,
        currency: res.currency,
        name: 'Zwigato Food Delivery',
        description: 'Order Payment',
        order_id: res.razorpayOrderId,
        handler: async function (response) {
          const verifyData = {
            orderId: res.orderId,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature
          };
          const verifyRes = await apiVerifyPayment(verifyData);
          if (verifyRes.success) {
            clearCart();
            showToast("Payment Successful!", "success");
            navigate('/order-confirmation', { state: { orderId: res.orderId, amount: res.amount/100, method: "Online" } });
          } else {
            showToast("Payment Verification Failed", "error");
            setIsProcessing(false);
          }
        },
        prefill: {
          name: currentUser ? currentUser.name : "Guest",
          email: currentUser ? currentUser.email : "guest@zwigato.com"
        },
        theme: {
          color: '#ff4757'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        showToast("Payment Failed", "error");
        setIsProcessing(false);
      });
      rzp.open();
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = subtotal > 300 ? 0 : 50; // flat 50 from backend
  const discount = Math.min(appliedCouponDiscount, subtotal);
  const total = Math.max(0, subtotal + delivery - discount);

  return (
    <div className="container" style={{ padding: '40px 0', minHeight: '80vh' }}>
      <h1 style={{ marginBottom: '30px' }}>Checkout</h1>
      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
        
        {/* Left Col - Forms */}
        <div style={{ flex: '1 1 600px' }}>
          
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', marginBottom: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <h3>Delivery Address</h3>
            <textarea 
              rows="3" 
              style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', marginTop: '10px' }}
              placeholder="Enter your complete delivery address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <h3>Payment Method</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', background: paymentMethod === 'Online' ? '#fff0f2' : 'white' }}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="Online" 
                  checked={paymentMethod === 'Online'} 
                  onChange={() => setPaymentMethod('Online')} 
                />
                <strong>Online Payment (Cards, UPI, NetBanking)</strong>
              </label>
              
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', background: paymentMethod === 'COD' ? '#fff0f2' : 'white' }}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="COD" 
                  checked={paymentMethod === 'COD'} 
                  onChange={() => setPaymentMethod('COD')} 
                />
                <strong>Cash on Delivery (COD)</strong>
              </label>
            </div>
          </div>

        </div>

        {/* Right Col - Summary */}
        <div style={{ flex: '1 1 400px' }}>
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <h3>Order Summary</h3>
            
            <div style={{ margin: '20px 0', maxHeight: '300px', overflowY: 'auto' }}>
              {cart.map(item => (
                <div key={item.foodId} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid #eee' }}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ fontWeight: '500' }}>{item.name}</div>
                    <div style={{ color: '#666' }}>x {item.quantity}</div>
                  </div>
                  <div style={{ fontWeight: '600' }}>₹{item.price * item.quantity}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '2px dashed #eee', paddingTop: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Delivery Charge</span>
                <span>₹{delivery}</span>
              </div>
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)' }}>
                  <span>Discount</span>
                  <span>-₹{discount}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: 'bold', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #eee' }}>
                <span>Total Amount</span>
                <span>₹{total}</span>
              </div>
            </div>

            <button 
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              style={{ width: '100%', padding: '15px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', marginTop: '20px', cursor: isProcessing ? 'not-allowed' : 'pointer', opacity: isProcessing ? 0.7 : 1 }}
            >
              {isProcessing ? 'Processing...' : "Place Order • ₹" + total}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
