import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { fetchOrders, apiUpdateUser } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { currentUser, setCurrentUser, logout, showToast } = useContext(AppContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editPassword, setEditPassword] = useState('');

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
      return;
    }
    
    setEditName(currentUser.name || '');
    setEditPhone(currentUser.phone || '');
    
    const loadOrders = async () => {
      setLoading(true);
      const data = await fetchOrders(currentUser._id);
      setOrders(data || []);
      setLoading(false);
    };
    loadOrders();
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!editName) {
      showToast("Name is required", "error");
      return;
    }
    
    const updateData = { name: editName, phone: editPhone };
    if (editPassword) {
      updateData.password = editPassword;
    }

    const res = await apiUpdateUser(currentUser._id, updateData);
    if (res.success) {
      showToast("Profile updated successfully", "success");
      setCurrentUser(res.data);
      setIsEditing(false);
      setEditPassword('');
    } else {
      showToast(res.message || "Failed to update profile", "error");
    }
  };

  return (
    <div className="profile-container" style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto', minHeight: '80vh' }}>
      
      {!isEditing ? (
        <div className="profile-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', padding: '30px', background: 'white', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 'bold' }}>
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 style={{ margin: '0 0 8px 0', fontSize: '26px', color: 'var(--secondary)' }}>{currentUser.name}</h2>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '15px' }}>{currentUser.email}</p>
              <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '15px' }}>{currentUser.phone || 'No phone added'}</p>
              <button onClick={() => setIsEditing(true)} style={{ marginTop: '12px', padding: '6px 16px', background: 'var(--primary-light)', color: 'var(--primary)', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>
                Edit Profile
              </button>
            </div>
          </div>
          <button onClick={logout} style={{ padding: '10px 20px', background: '#ffebee', color: '#d32f2f', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 'bold' }}>
            Logout
          </button>
        </div>
      ) : (
        <div style={{ marginBottom: '40px', padding: '30px', background: 'white', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)' }}>
          <h3 style={{ marginBottom: '20px', fontSize: '22px' }}>Edit Profile</h3>
          <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '500px' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address (Cannot be changed)</label>
              <input type="email" value={currentUser.email} disabled className="form-input" style={{ background: '#f5f5f5' }} />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input type="text" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">New Password (leave blank to keep current)</label>
              <input type="password" value={editPassword} onChange={(e) => setEditPassword(e.target.value)} className="form-input" placeholder="Enter new password" />
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
              <button type="submit" className="submit-btn" style={{ flex: 1 }}>Save Changes</button>
              <button type="button" onClick={() => setIsEditing(false)} className="submit-btn" style={{ flex: 1, background: '#f1f5f9', color: 'var(--secondary)' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <h3 style={{ fontSize: '22px', marginBottom: '20px', color: 'var(--secondary)' }}>Order History</h3>
      
      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <div style={{ padding: '60px', textAlign: 'center', background: 'white', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🍽️</div>
          <h3 style={{ color: 'var(--secondary)' }}>No Orders Yet</h3>
          <p style={{ color: 'var(--text-muted)' }}>You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orders.map(order => (
            <div key={order._id} style={{ background: 'white', borderRadius: 'var(--radius-md)', padding: '24px', boxShadow: 'var(--shadow-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: '800', fontSize: '18px', marginBottom: '8px', color: 'var(--secondary)' }}>Order #{order._id.toString().slice(-6).toUpperCase()}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '12px' }}>
                  {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
                <div style={{ fontWeight: '700', fontSize: '16px', color: 'var(--secondary)' }}>
                  Total: ₹{order.totalAmount}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ 
                  display: 'inline-block', 
                  padding: '6px 14px', 
                  borderRadius: '20px', 
                  fontSize: '13px', 
                  fontWeight: '700',
                  marginBottom: '12px',
                  background: order.orderStatus === 'Delivered' ? '#e8f5e9' : 
                             order.orderStatus === 'Cancelled' ? '#ffebee' : '#fff3e0',
                  color: order.orderStatus === 'Delivered' ? '#2e7d32' : 
                         order.orderStatus === 'Cancelled' ? '#c62828' : '#ef6c00'
                }}>
                  {order.orderStatus}
                </div>
                <br/>
                <button 
                  onClick={() => setSelectedOrder(order)}
                  style={{ padding: '10px 18px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedOrder && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', width: '100%', maxWidth: '600px', borderRadius: 'var(--radius-md)', padding: '30px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ margin: 0, fontSize: '24px', color: 'var(--secondary)' }}>Order Details</h3>
              <button onClick={() => setSelectedOrder(null)} style={{ border: 'none', background: '#f1f5f9', width: '36px', height: '36px', borderRadius: '50%', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>
            
            <div style={{ marginBottom: '24px', padding: '20px', background: '#f8fafc', borderRadius: 'var(--radius-sm)' }}>
              <p style={{ margin: '0 0 8px 0' }}><strong>Order ID:</strong> {selectedOrder._id}</p>
              <p style={{ margin: '0 0 8px 0' }}><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
              <p style={{ margin: '0 0 8px 0' }}><strong>Status:</strong> <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{selectedOrder.orderStatus}</span></p>
              <p style={{ margin: '0 0 8px 0' }}><strong>Payment Status:</strong> {selectedOrder.paymentStatus}</p>
              <p style={{ margin: 0 }}><strong>Address:</strong> {selectedOrder.address?.city || 'Jaipur'}</p>
            </div>

            <h4 style={{ marginBottom: '16px', fontSize: '18px', color: 'var(--secondary)' }}>Items</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              {selectedOrder.items.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                  <div>
                    <div style={{ fontWeight: '600', color: 'var(--secondary)' }}>{item.food?.name || 'Food Item'}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Qty: {item.quantity} x ₹{item.price}</div>
                  </div>
                  <div style={{ fontWeight: '700', color: 'var(--secondary)' }}>₹{item.price * item.quantity}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '20px', color: 'var(--secondary)', borderTop: '2px solid #f1f5f9', paddingTop: '20px' }}>
              <span>Total Amount</span>
              <span>₹{selectedOrder.totalAmount}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
