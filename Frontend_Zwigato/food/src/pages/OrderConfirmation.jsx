import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

export default function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { orderId, amount, method } = location.state || { orderId: "Unknown", amount: 0, method: "Unknown" };

  if (!location.state) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center', minHeight: '60vh' }}>
        <h2>No Recent Orders Found</h2>
        <button onClick={() => navigate('/')} style={{ marginTop: '20px', padding: '10px 20px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '60px 0', display: 'flex', justifyContent: 'center', minHeight: '80vh' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', textAlign: 'center', maxWidth: '500px', width: '100%' }}>
        <div style={{ width: '80px', height: '80px', background: '#e8f5e9', color: '#4caf50', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', margin: '0 auto 20px' }}>
          ✓
        </div>
        <h1 style={{ color: '#2e7d32', marginBottom: '10px' }}>Order Placed Successfully!</h1>
        <p style={{ color: '#666', marginBottom: '30px', fontSize: '16px' }}>
          Thank you for ordering with Zwigato. Your delicious food is being prepared.
        </p>
        
        <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', textAlign: 'left', marginBottom: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ color: '#666' }}>Order ID:</span>
            <span style={{ fontWeight: '600' }}>{orderId}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ color: '#666' }}>Amount Paid:</span>
            <span style={{ fontWeight: '600' }}>₹{amount}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#666' }}>Payment Method:</span>
            <span style={{ fontWeight: '600' }}>{method}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '15px' }}>
          <button onClick={() => navigate('/profile')} style={{ flex: 1, padding: '12px', background: 'white', color: 'var(--primary)', border: '1px solid var(--primary)', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
            Track Order
          </button>
          <button onClick={() => navigate('/')} style={{ flex: 1, padding: '12px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
            Browse More
          </button>
        </div>
      </div>
    </div>
  );
}
