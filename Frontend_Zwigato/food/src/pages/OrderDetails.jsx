import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { getFoodImageUrl } from '../utils/imageUtils';
import { fetchOrderById } from '../services/api';

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, showToast } = useContext(AppContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        // Assuming API returns 404 if order belongs to another user
        const data = await fetchOrderById(currentUser._id, id);

        
        if (data.success) {
          setOrder(data.data);
        } else {
          setError(data.message || 'Order not found');
          showToast(data.message || 'Order not found', 'error');
        }
      } catch (err) {
        setError('Failed to fetch order details');
        showToast('Failed to fetch order details', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id, currentUser, navigate, showToast]);

  if (loading) {
    return <div style={{ padding: '60px', textAlign: 'center' }}>Loading order details...</div>;
  }

  if (error || !order) {
    return (
      <div style={{ padding: '60px', textAlign: 'center' }}>
        <h2>Order Not Found</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/profile')} style={{ padding: '10px 20px', marginTop: '20px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>Back to Profile</button>
      </div>
    );
  }

  // Order Tracking Progress
  const statuses = ['Placed', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'];
  let currentStatusIndex = statuses.indexOf(order.orderStatus);
  if (currentStatusIndex === -1 && order.orderStatus === 'Cancelled') {
      currentStatusIndex = -1; // Cancelled
  } else if (currentStatusIndex === -1) {
      currentStatusIndex = 0; // Default or fallback
  }

  return (
    <div className="order-details-container" style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto', minHeight: '80vh' }}>
      <Link to="/profile" style={{ display: 'inline-block', marginBottom: '20px', color: 'var(--primary)', textDecoration: 'none', fontWeight: 'bold' }}>
        ← Back to My Orders
      </Link>
      
      <div style={{ background: 'white', borderRadius: 'var(--radius-md)', padding: '30px', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '20px', marginBottom: '20px' }}>
          <div>
            <h2 style={{ margin: '0 0 10px 0', color: 'var(--secondary)' }}>Order #{order._id.toString().slice(-6).toUpperCase()}</h2>
            <p style={{ margin: 0, color: 'var(--text-muted)' }}>Placed on: {new Date(order.createdAt).toLocaleString()}</p>
          </div>
          <div style={{ 
            padding: '8px 16px', 
            borderRadius: '20px', 
            fontWeight: 'bold',
            background: order.orderStatus === 'Delivered' ? '#e8f5e9' : 
                       order.orderStatus === 'Cancelled' ? '#ffebee' : '#fff3e0',
            color: order.orderStatus === 'Delivered' ? '#2e7d32' : 
                   order.orderStatus === 'Cancelled' ? '#c62828' : '#ef6c00'
          }}>
            {order.orderStatus}
          </div>
        </div>

        {/* Order Tracking */}
        {order.orderStatus !== 'Cancelled' && (
          <div style={{ marginBottom: '40px', padding: '20px', background: '#f8fafc', borderRadius: 'var(--radius-sm)' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', color: 'var(--secondary)' }}>Order Tracking</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '15px', left: '10%', right: '10%', height: '4px', background: '#e2e8f0', zIndex: 1 }}></div>
              <div style={{ position: 'absolute', top: '15px', left: '10%', right: `${100 - (Math.max(0, currentStatusIndex) / (statuses.length - 1)) * 80}%`, height: '4px', background: 'var(--primary)', zIndex: 2, transition: 'right 0.3s ease' }}></div>
              
              {statuses.map((status, index) => {
                const isActive = index <= currentStatusIndex;
                return (
                  <div key={status} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 3, width: '20%' }}>
                    <div style={{ 
                      width: '34px', 
                      height: '34px', 
                      borderRadius: '50%', 
                      background: isActive ? 'var(--primary)' : '#e2e8f0',
                      color: isActive ? 'white' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      marginBottom: '8px',
                      border: '4px solid #f8fafc'
                    }}>
                      {isActive ? '✓' : index + 1}
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: isActive ? 'bold' : 'normal', color: isActive ? 'var(--secondary)' : 'var(--text-muted)', textAlign: 'center' }}>
                      {status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
          <div>
            <h4 style={{ margin: '0 0 10px 0', color: 'var(--secondary)' }}>Delivery Address</h4>
            <div style={{ color: 'var(--text-muted)', lineHeight: '1.5' }}>
              <p style={{ margin: 0 }}><strong>{order.address?.name || currentUser.name}</strong></p>
              <p style={{ margin: 0 }}>{order.address?.street}</p>
              <p style={{ margin: 0 }}>{order.address?.city}, {order.address?.state} {order.address?.pincode}</p>
            </div>
          </div>
          <div>
            <h4 style={{ margin: '0 0 10px 0', color: 'var(--secondary)' }}>Payment Information</h4>
            <div style={{ color: 'var(--text-muted)', lineHeight: '1.5' }}>
              <p style={{ margin: 0 }}><strong>Method:</strong> {order.paymentMethod}</p>
              <p style={{ margin: 0 }}><strong>Status:</strong> {order.paymentStatus}</p>
              {order.transactionId && <p style={{ margin: 0 }}><strong>Txn ID:</strong> {order.transactionId}</p>}
            </div>
          </div>
        </div>

        <h3 style={{ margin: '0 0 15px 0', fontSize: '20px', color: 'var(--secondary)' }}>Order Items</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {order.items.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', border: '1px solid #eee', borderRadius: 'var(--radius-sm)' }}>
              <img 
                src={item.food?.image ? getFoodImageUrl(item.food.image) : '/placeholder-food.jpg'} 
                alt={item.food?.name || 'Food Item'} 
                style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} 
              />
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 5px 0', color: 'var(--secondary)', fontSize: '16px' }}>{item.food?.name || 'Food Item'}</h4>
                <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Price: ₹{item.price}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '5px' }}>Qty: {item.quantity}</div>
                <div style={{ fontWeight: 'bold', color: 'var(--secondary)', fontSize: '16px' }}>₹{item.price * item.quantity}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '30px', padding: '20px', background: '#f8fafc', borderRadius: 'var(--radius-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: 'var(--text-muted)' }}>
            <span>Subtotal</span>
            <span>₹{order.subtotal || order.totalAmount}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: 'var(--text-muted)' }}>
            <span>Delivery Charge</span>
            <span>₹{order.deliveryCharge || 0}</span>
          </div>
          {order.discount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: 'var(--primary)' }}>
              <span>Discount</span>
              <span>-₹{order.discount}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #e2e8f0', fontWeight: 'bold', fontSize: '20px', color: 'var(--secondary)' }}>
            <span>Total</span>
            <span>₹{order.totalAmount}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
