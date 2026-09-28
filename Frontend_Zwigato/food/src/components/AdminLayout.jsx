import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';

const API_BASE_URL = "http://localhost:5000/admin";

export default function AdminLayout() {
  const [adminToken, setAdminToken] = useState(localStorage.getItem('zwigato_admin_token'));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!/^[0-9]{10}$/.test(phone)) {
      alert('Admin mobile number must be exactly 10 digits.');
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password: password.trim(), phone: phone.trim() })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('zwigato_admin_token', data.token);
        setAdminToken(data.token);
        navigate('/admin');
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (err) {
      alert('Login error. Is backend running?');
    }
  };

  const logout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem('zwigato_admin_token');
      setAdminToken(null);
      navigate('/admin/login');
    }
  };

  useEffect(() => {
    if (adminToken && location.pathname === '/admin/login') {
      navigate('/admin');
    }
  }, [adminToken, location, navigate]);

  if (!adminToken) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f5f5f5' }}>
        <div style={{ background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '400px' }}>
          <h2 style={{ textAlign: 'center', color: 'var(--primary)', marginBottom: '20px' }}>Zwigato Admin</h2>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input 
              type="email" 
              placeholder="Admin Email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }}
              required
            />
            <input 
              type="tel" 
              placeholder="Admin Mobile (10 digits)" 
              value={phone}
              onChange={e => setPhone(e.target.value)}
              style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }}
              required
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }}
              required
            />
            <button type="submit" style={{ padding: '12px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
              Login
            </button>
            <p style={{fontSize: '12px', color: '#666', textAlign: 'center'}}>Use an existing admin account or create one via API.</p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      
      {/* Admin Topbar */}
      <div style={{ height: '60px', background: 'white', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 30px', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ fontSize: '24px' }}>🍔</span>
          <h2 style={{ margin: 0, color: 'var(--primary)', fontSize: '20px' }}>Zwigato Admin</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ fontSize: '20px', cursor: 'pointer' }}>🔔</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '35px', height: '35px', background: 'var(--primary)', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>A</div>
            <span style={{ fontWeight: '500' }}>Admin</span>
          </div>
          <button onClick={logout} style={{ padding: '6px 12px', background: '#ffebee', color: '#d32f2f', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            Logout
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, background: '#f5f6fa', overflow: 'hidden' }}>
        {/* Sidebar */}
        <div style={{ width: '250px', background: '#2c3e50', color: 'white', padding: '20px 0', overflowY: 'auto' }}>
          <nav style={{ display: 'flex', flexDirection: 'column' }}>
            {[
              { path: '/admin', name: 'Dashboard', icon: '📊' },
              { path: '/admin/orders', name: 'Orders', icon: '📦' },
              { path: '/admin/foods', name: 'Foods', icon: '🍔' },
              { path: '/admin/categories', name: 'Categories', icon: '📁' },
              { path: '/admin/restaurants', name: 'Restaurants', icon: '🏪' },
              { path: '/admin/banners', name: 'Banners', icon: '🖼️' },
              { path: '/admin/users', name: 'Users', icon: '👥' },
            ].map(item => (
              <Link 
                key={item.path} 
                to={item.path}
                style={{ 
                  padding: '15px 20px', 
                  color: 'white', 
                  textDecoration: 'none',
                  background: location.pathname === item.path ? '#34495e' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <span>{item.icon}</span> {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/orders" element={<AdminOrders />} />
          <Route path="/foods" element={<AdminFoods />} />
          <Route path="/categories" element={<AdminCategories />} />
          <Route path="/restaurants" element={<AdminRestaurants />} />
          <Route path="/banners" element={<AdminBanners />} />
          <Route path="/users" element={<AdminUsers />} />
        </Routes>
        </div>
      </div>
    </div>
  );
}

// ---------------- DASHBOARD ----------------
function Dashboard() {
  const [stats, setStats] = useState({ 
    users: 0, foods: 0, restaurants: 0, categories: 0, 
    orders: 0, pendingOrders: 0, deliveredOrders: 0, revenue: 0 
  });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, foodsRes, restsRes, catsRes, ordersRes] = await Promise.all([
          fetch(`${API_BASE_URL}/users/viewall`).then(r => r.json()),
          fetch(`${API_BASE_URL}/foods/viewall`).then(r => r.json()),
          fetch(`${API_BASE_URL}/restaurants/viewall`).then(r => r.json()),
          fetch(`${API_BASE_URL}/categories/viewall`).then(r => r.json()),
          fetch(`${API_BASE_URL}/orders/viewall`).then(r => r.json()),
        ]);

        const orders = ordersRes.data || [];
        const pending = orders.filter(o => ['Placed', 'Preparing', 'Out For Delivery'].includes(o.orderStatus)).length;
        const delivered = orders.filter(o => o.orderStatus === 'Delivered').length;
        const revenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
        
        setStats({
          users: usersRes.count || 0,
          foods: foodsRes.count || 0,
          restaurants: restsRes.count || 0,
          categories: catsRes.count || 0,
          orders: ordersRes.count || 0,
          pendingOrders: pending,
          deliveredOrders: delivered,
          revenue
        });

        // Get 5 most recent orders
        setRecentOrders(orders.slice(0, 5));
      } catch (e) {
        console.error("Dashboard fetch error", e);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    { title: 'Total Users', value: stats.users, color: '#3498db' },
    { title: 'Total Foods', value: stats.foods, color: '#e67e22' },
    { title: 'Total Restaurants', value: stats.restaurants, color: '#e74c3c' },
    { title: 'Total Categories', value: stats.categories, color: '#f1c40f' },
    { title: 'Total Orders', value: stats.orders, color: '#9b59b6' },
    { title: 'Pending Orders', value: stats.pendingOrders, color: '#e67e22' },
    { title: 'Delivered Orders', value: stats.deliveredOrders, color: '#2ecc71' },
    { title: 'Revenue', value: `₹${stats.revenue}`, color: '#2ecc71' }
  ];

  return (
    <div>
      <h2>Dashboard Overview</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '20px', marginBottom: '40px' }}>
        {statCards.map(stat => (
          <div key={stat.title} style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderTop: `4px solid ${stat.color}` }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#7f8c8d', fontSize: '16px' }}>{stat.title}</h3>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#2c3e50' }}>{stat.value}</div>
          </div>
        ))}
      </div>

      <h3>Recent Orders</h3>
      <div style={{ background: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>
              <th style={{ padding: '12px' }}>Order ID</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map(order => (
              <tr key={order._id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px' }}>{order._id.toString().slice(-6).toUpperCase()}</td>
                <td>{order.user?.name || 'Guest'}</td>
                <td>₹{order.totalAmount}</td>
                <td>
                  <span style={{ 
                    padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold',
                    background: order.orderStatus === 'Delivered' ? '#e8f5e9' : '#fff3e0',
                    color: order.orderStatus === 'Delivered' ? '#2e7d32' : '#ef6c00'
                  }}>
                    {order.orderStatus}
                  </span>
                </td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------------- ADMIN ORDERS ----------------
function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/viewall`);
      const data = await res.json();
      if (data.success) setOrders(data.data);
    } catch (e) { }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await fetch(`${API_BASE_URL}/orders/update${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus: newStatus })
      });
      fetchOrders();
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({...selectedOrder, orderStatus: newStatus});
      }
    } catch (e) { }
  };

  return (
    <div>
      <h2>Manage Orders</h2>
      <div style={{ background: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>
              <th style={{ padding: '12px' }}>Order ID</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date & Time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px' }}>{order._id.toString().slice(-6).toUpperCase()}</td>
                <td>
                  <div style={{ fontWeight: 'bold' }}>{order.user?.name || 'Guest'}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>{order.user?.email}</div>
                </td>
                <td style={{ fontWeight: 'bold' }}>₹{order.totalAmount}</td>
                <td>
                  <span style={{ 
                    padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold',
                    background: order.orderStatus === 'Delivered' ? '#e8f5e9' : 
                               order.orderStatus === 'Cancelled' ? '#ffebee' : '#fff3e0',
                    color: order.orderStatus === 'Delivered' ? '#2e7d32' : 
                           order.orderStatus === 'Cancelled' ? '#c62828' : '#ef6c00'
                  }}>
                    {order.orderStatus}
                  </span>
                </td>
                <td style={{ fontSize: '13px' }}>
                  {new Date(order.createdAt).toLocaleDateString()} <br/>
                  <span style={{ color: '#666' }}>{new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </td>
                <td>
                  <button onClick={() => setSelectedOrder(order)} style={{ padding: '6px 12px', background: '#e3f2fd', color: '#1976d2', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}>
                    View
                  </button>
                  <select 
                    value={order.orderStatus} 
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
                  >
                    <option value="Placed">Placed</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Preparing">Preparing</option>
                    <option value="Out For Delivery">Out For Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', width: '100%', maxWidth: '600px', borderRadius: '12px', padding: '24px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0 }}>Order Details #{selectedOrder._id.toString().slice(-6).toUpperCase()}</h3>
              <button onClick={() => setSelectedOrder(null)} style={{ border: 'none', background: 'none', fontSize: '24px', cursor: 'pointer' }}>&times;</button>
            </div>
            
            <div style={{ marginBottom: '20px', padding: '15px', background: '#f9f9f9', borderRadius: '8px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div><strong>User:</strong> {selectedOrder.user?.name}</div>
              <div><strong>Email:</strong> {selectedOrder.user?.email}</div>
              <div><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</div>
              <div><strong>Status:</strong> {selectedOrder.orderStatus}</div>
              <div><strong>Payment:</strong> {selectedOrder.paymentStatus}</div>
              <div><strong>Address:</strong> {selectedOrder.address?.city || 'Jaipur'}</div>
            </div>

            <h4 style={{ marginBottom: '15px' }}>Items</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' }}>
              {selectedOrder.items.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{item.food?.name || 'Food Item'}</div>
                    <div style={{ color: '#666', fontSize: '14px' }}>Qty: {item.quantity} x ₹{item.price}</div>
                  </div>
                  <div style={{ fontWeight: 'bold' }}>₹{item.price * item.quantity}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '18px', borderTop: '2px solid #eee', paddingTop: '15px' }}>
              <span>Total Amount</span>
              <span>₹{selectedOrder.totalAmount}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------- ADMIN FOODS ----------------
function AdminFoods() {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({ 
    name: '', description: '', price: '', discountPrice: '0', 
    type: 'Veg', available: true, category: '', restaurant: '', image: null 
  });
  const fileInputRef = React.useRef(null);
  
  useEffect(() => {
    fetchFoods();
    fetchCategories();
    fetchRestaurants();
  }, []);

  const fetchFoods = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/foods/viewall`);
      const data = await res.json();
      if (data.success) setFoods(data.data);
    } catch (e) { }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/categories/viewall`);
      const data = await res.json();
      if (data.success) setCategories(data.data);
    } catch (e) { }
  };

  const fetchRestaurants = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/restaurants/viewall`);
      const data = await res.json();
      if (data.success) setRestaurants(data.data);
    } catch (e) { }
  };

  const deleteFood = async (id) => {
    if (!window.confirm("Delete this food item?")) return;
    try {
      await fetch(`${API_BASE_URL}/foods/delete/${id}`, { method: 'DELETE' });
      fetchFoods();
    } catch (e) { }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({...formData, image: file});
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSaveFood = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('discountPrice', formData.discountPrice);
    data.append('type', formData.type);
    data.append('available', formData.available);
    if (formData.category) data.append('category', formData.category);
    if (formData.restaurant) data.append('restaurant', formData.restaurant);
    
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      const url = editingId ? `${API_BASE_URL}/foods/update/${editingId}` : `${API_BASE_URL}/foods/add`;
      const method = editingId ? 'PUT' : 'POST';
      
      const res = await fetch(url, { method, body: data });
      const json = await res.json();
      if (!json.success) {
        alert(json.message);
        return;
      }
      
      setShowAddForm(false);
      setEditingId(null);
      setImagePreview(null);
      setFormData({ name: '', description: '', price: '', discountPrice: '0', type: 'Veg', available: true, category: '', restaurant: '', image: null });
      if (fileInputRef.current) fileInputRef.current.value = '';
      fetchFoods();
    } catch (e) {
      alert("Failed to save food");
    }
  };

  const startEdit = (food) => {
    setEditingId(food._id);
    const existingImageUrl = food.image?.startsWith('http') ? food.image : (food.image ? `http://localhost:5000/uploads/${food.image}` : null);
    setImagePreview(existingImageUrl);
    
    const catId = typeof food.category === 'object' && food.category !== null ? food.category._id : food.category;
    const restId = typeof food.restaurant === 'object' && food.restaurant !== null ? food.restaurant._id : food.restaurant;

    setFormData({ 
      name: food.name, 
      description: food.description || '',
      price: food.price,
      discountPrice: food.discountPrice || 0,
      type: food.type || 'Veg',
      available: food.available !== false,
      category: catId || '', 
      restaurant: restId || '',
      image: null 
    });
    setShowAddForm(true);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Manage Foods</h2>
        <button 
          onClick={() => {
            setShowAddForm(!showAddForm);
            setEditingId(null);
            setImagePreview(null);
            setFormData({ name: '', description: '', price: '', discountPrice: '0', type: 'Veg', available: true, category: '', restaurant: '', image: null });
            if (fileInputRef.current) fileInputRef.current.value = '';
          }}
          style={{ padding: '10px 20px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
        >
          {showAddForm ? 'Cancel' : '+ Add New Food'}
        </button>
      </div>

      {showAddForm && (
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h3>{editingId ? 'Edit Food' : 'Add New Food'}</h3>
          <form onSubmit={handleSaveFood} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input type="text" placeholder="Food Name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
            <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} rows={2}></textarea>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <input type="number" placeholder="Price" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} style={{ flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
              <input type="number" placeholder="Discount Price" value={formData.discountPrice} onChange={e => setFormData({...formData, discountPrice: e.target.value})} style={{ flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} style={{ flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} required>
                <option value="">Select Category</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
              <select value={formData.restaurant} onChange={e => setFormData({...formData, restaurant: e.target.value})} style={{ flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} required>
                <option value="">Select Restaurant</option>
                {restaurants.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} style={{ flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}>
                <option value="Veg">Veg</option>
                <option value="Non-Veg">Non-Veg</option>
              </select>
              <label style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '5px' }}>
                <input type="checkbox" checked={formData.available} onChange={e => setFormData({...formData, available: e.target.checked})} /> Available
              </label>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '10px' }}>
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} style={{ flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
              {imagePreview && (
                <img src={imagePreview} alt="Preview" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #eee' }} />
              )}
            </div>

            <button type="submit" style={{ padding: '10px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }}>
              {editingId ? 'Update Food' : 'Save Food'}
            </button>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {foods.map(food => {
          const imageUrl = food.image?.startsWith('http') ? food.image : (food.image ? `http://localhost:5000/uploads/${food.image}` : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500');
            
          return (
            <div key={food._id} style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <img src={imageUrl} alt={food.name} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
              <div style={{ padding: '15px' }}>
                <h4 style={{ margin: '0 0 5px 0' }}>{food.name}</h4>
                <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '12px', height: '36px', overflow: 'hidden' }}>{food.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontWeight: 'bold' }}>₹{food.price}</span>
                  <span style={{ fontSize: '12px', color: food.available ? 'green' : 'red' }}>{food.available ? 'Available' : 'Out of stock'}</span>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => startEdit(food)} style={{ flex: 1, padding: '8px', background: '#e3f2fd', color: '#1976d2', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Edit
                  </button>
                  <button onClick={() => deleteFood(food._id)} style={{ flex: 1, padding: '8px', background: '#ffebee', color: '#d32f2f', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------------- ADMIN CATEGORIES ----------------
function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', image: null });
  const fileInputRef = React.useRef(null);
  
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/categories/viewall`);
      const data = await res.json();
      if (data.success) setCategories(data.data);
    } catch (e) { }
  };

  const deleteCat = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await fetch(`${API_BASE_URL}/categories/delete/${id}`, { method: 'DELETE' });
      fetchCategories();
    } catch (e) { }
  };

  const handleSaveCat = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      const url = editingId ? `${API_BASE_URL}/categories/update/${editingId}` : `${API_BASE_URL}/categories/add`;
      const method = editingId ? 'PUT' : 'POST';

      await fetch(url, {
        method,
        body: data
      });
      setShowAddForm(false);
      setEditingId(null);
      setFormData({ name: '', image: null });
      if (fileInputRef.current) fileInputRef.current.value = '';
      fetchCategories();
    } catch (e) {}
  };

  const startEdit = (cat) => {
    setEditingId(cat._id);
    setFormData({ name: cat.name, image: null });
    setShowAddForm(true);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Manage Categories</h2>
        <button 
          onClick={() => {
            setShowAddForm(!showAddForm);
            setEditingId(null);
            setFormData({ name: '', image: null });
            if (fileInputRef.current) fileInputRef.current.value = '';
          }}
          style={{ padding: '10px 20px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
        >
          {showAddForm ? 'Cancel' : '+ Add New Category'}
        </button>
      </div>

      {showAddForm && (
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h3>{editingId ? 'Edit Category' : 'Add New Category'}</h3>
          <form onSubmit={handleSaveCat} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input type="text" placeholder="Category Name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
            <input type="file" accept="image/*" ref={fileInputRef} onChange={e => setFormData({...formData, image: e.target.files[0]})} style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
            <button type="submit" style={{ padding: '10px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              {editingId ? 'Update Category' : 'Save Category'}
            </button>
          </form>
        </div>
      )}

      <div style={{ background: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>
              <th style={{ padding: '12px' }}>Image</th>
              <th>Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => {
              const imageUrl = cat.image?.startsWith('http') 
                ? cat.image 
                : (cat.image ? `http://localhost:5000/uploads/${cat.image}` : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150');
              
              return (
                <tr key={cat._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px' }}>
                    <img src={imageUrl} alt={cat.name} style={{ width: '50px', height: '50px', borderRadius: '4px', objectFit: 'cover' }} />
                  </td>
                  <td style={{ fontWeight: 'bold' }}>{cat.name}</td>
                  <td>
                    <button onClick={() => startEdit(cat)} style={{ padding: '6px 12px', background: '#e3f2fd', color: '#1976d2', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}>Edit</button>
                    <button onClick={() => deleteCat(cat._id)} style={{ padding: '6px 12px', background: '#ffebee', color: '#d32f2f', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------------- ADMIN RESTAURANTS ----------------
function AdminRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({ 
    name: '', email: '', phone: '', address: '', description: '', latitude: '', longitude: '', image: null 
  });
  const fileInputRef = React.useRef(null);
  
  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/restaurants/viewall`);
      const data = await res.json();
      if (data.success) setRestaurants(data.data);
    } catch (e) { }
  };

  const deleteRestaurant = async (id) => {
    if (!window.confirm("Delete this restaurant?")) return;
    try {
      await fetch(`${API_BASE_URL}/restaurants/delete/${id}`, { method: 'DELETE' });
      fetchRestaurants();
    } catch (e) { }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({...formData, image: file});
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSaveRestaurant = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('phone', formData.phone);
    data.append('address', formData.address);
    data.append('description', formData.description);
    if (formData.latitude) data.append('latitude', formData.latitude);
    if (formData.longitude) data.append('longitude', formData.longitude);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      const url = editingId ? `${API_BASE_URL}/restaurants/update/${editingId}` : `${API_BASE_URL}/restaurants/add`;
      const method = editingId ? 'PUT' : 'POST';
      
      const res = await fetch(url, { method, body: data });
      const json = await res.json();
      if (!json.success) {
        alert(json.message);
        return;
      }
      
      setShowAddForm(false);
      setEditingId(null);
      setImagePreview(null);
      setFormData({ name: '', email: '', phone: '', address: '', description: '', latitude: '', longitude: '', image: null });
      if (fileInputRef.current) fileInputRef.current.value = '';
      fetchRestaurants();
    } catch (e) {}
  };

  const startEdit = (r) => {
    setEditingId(r._id);
    const existingImageUrl = r.image?.startsWith('http') ? r.image : (r.image ? `http://localhost:5000/uploads/${r.image}` : null);
    setImagePreview(existingImageUrl);
    
    setFormData({ 
      name: r.name, 
      email: r.email,
      phone: r.phone,
      address: r.address,
      description: r.description || '',
      latitude: r.latitude || '',
      longitude: r.longitude || '',
      image: null 
    });
    setShowAddForm(true);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Manage Restaurants</h2>
        <button 
          onClick={() => {
            setShowAddForm(!showAddForm);
            setEditingId(null);
            setImagePreview(null);
            setFormData({ name: '', email: '', phone: '', address: '', description: '', latitude: '', longitude: '', image: null });
            if (fileInputRef.current) fileInputRef.current.value = '';
          }}
          style={{ padding: '10px 20px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
        >
          {showAddForm ? 'Cancel' : '+ Add New Restaurant'}
        </button>
      </div>

      {showAddForm && (
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h3>{editingId ? 'Edit Restaurant' : 'Add New Restaurant'}</h3>
          <form onSubmit={handleSaveRestaurant} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input type="text" placeholder="Restaurant Name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
              <input type="email" placeholder="Email (Unique)" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <input type="text" placeholder="Phone (Unique)" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
              <input type="text" placeholder="Address" required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} style={{ flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <input type="number" step="any" placeholder="Latitude (Optional)" value={formData.latitude} onChange={e => setFormData({...formData, latitude: e.target.value})} style={{ flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
              <input type="number" step="any" placeholder="Longitude (Optional)" value={formData.longitude} onChange={e => setFormData({...formData, longitude: e.target.value})} style={{ flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>

            <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} rows={2}></textarea>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '10px' }}>
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} style={{ flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
              {imagePreview && (
                <img src={imagePreview} alt="Preview" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #eee' }} />
              )}
            </div>

            <button type="submit" style={{ padding: '10px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }}>
              {editingId ? 'Update Restaurant' : 'Save Restaurant'}
            </button>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {restaurants.map(r => {
          const imageUrl = r.image?.startsWith('http') ? r.image : (r.image ? `http://localhost:5000/uploads/${r.image}` : 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500');
            
          return (
            <div key={r._id} style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <img src={imageUrl} alt={r.name} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
              <div style={{ padding: '15px' }}>
                <h4 style={{ margin: '0 0 5px 0' }}>{r.name}</h4>
                <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '12px' }}>{r.address}</p>
                <div style={{ display: 'flex', gap: '10px', fontSize: '12px', marginBottom: '15px' }}>
                  <span style={{ background: '#eee', padding: '2px 6px', borderRadius: '4px' }}>📞 {r.phone}</span>
                  <span style={{ background: '#eee', padding: '2px 6px', borderRadius: '4px' }}>⭐ {r.rating}</span>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => startEdit(r)} style={{ flex: 1, padding: '8px', background: '#e3f2fd', color: '#1976d2', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Edit
                  </button>
                  <button onClick={() => deleteRestaurant(r._id)} style={{ flex: 1, padding: '8px', background: '#ffebee', color: '#d32f2f', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------------- ADMIN USERS ----------------
function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [adminData, setAdminData] = useState({ name: '', email: '', phone: '', password: '' });
  
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/users/viewall`);
      const data = await res.json();
      if (data.success) setUsers(data.data);
    } catch (e) { }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/auth/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminData)
      });
      const data = await res.json();
      if (data.success) {
        alert("New Admin Created Successfully!");
        setShowAdminForm(false);
        setAdminData({ name: '', email: '', phone: '', password: '' });
      } else {
        alert(data.message || "Failed to create admin");
      }
    } catch (e) {
      alert("Error creating admin");
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Manage Users</h2>
        <button 
          onClick={() => setShowAdminForm(!showAdminForm)}
          style={{ padding: '10px 20px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
        >
          {showAdminForm ? 'Cancel' : '+ Create New Admin'}
        </button>
      </div>

      {showAdminForm && (
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h3>Create New Admin Account</h3>
          <form onSubmit={handleCreateAdmin} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input type="text" placeholder="Admin Name" required value={adminData.name} onChange={e => setAdminData({...adminData, name: e.target.value})} style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
            <input type="email" placeholder="Admin Email" required value={adminData.email} onChange={e => setAdminData({...adminData, email: e.target.value})} style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
            <input type="tel" placeholder="Mobile Number (10 digits)" required value={adminData.phone} onChange={e => setAdminData({...adminData, phone: e.target.value})} style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
            <input type="password" placeholder="Password (min 6 chars)" required value={adminData.password} onChange={e => setAdminData({...adminData, password: e.target.value})} style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
            <button type="submit" style={{ padding: '10px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }}>
              Create Admin
            </button>
          </form>
        </div>
      )}

      <div style={{ background: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>
              <th style={{ padding: '12px' }}>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <span style={{ padding: '4px 8px', background: u.role === 'admin' ? '#e3f2fd' : '#eee', color: u.role === 'admin' ? '#1976d2' : '#333', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                    {u.role}
                  </span>
                </td>
                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------------- ADMIN BANNERS ----------------
function AdminBanners() {
  const [banners, setBanners] = React.useState([]);
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [editingId, setEditingId] = React.useState(null);
  const [formData, setFormData] = React.useState({ name: '', description: '', image: null });
  const fileInputRef = React.useRef(null);
  
  React.useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const res = await fetch('http://localhost:5000/admin/banners/viewall');
      const data = await res.json();
      if (data.success) setBanners(data.data);
    } catch (e) { }
  };

  const deleteBanner = async (id) => {
    if (!window.confirm("Delete this banner?")) return;
    try {
      await fetch('http://localhost:5000/admin/banners/delete/' + id, { method: 'DELETE' });
      fetchBanners();
    } catch (e) { }
  };

  const handleSaveBanner = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      const url = editingId ? 'http://localhost:5000/admin/banners/update/' + editingId : 'http://localhost:5000/admin/banners/add';
      const method = editingId ? 'PUT' : 'POST';

      await fetch(url, { method, body: data });
      setShowAddForm(false);
      setEditingId(null);
      setFormData({ name: '', description: '', image: null });
      if (fileInputRef.current) fileInputRef.current.value = '';
      fetchBanners();
    } catch (e) {}
  };

  const startEdit = (b) => {
    setEditingId(b._id);
    setFormData({ name: b.name, description: b.description || '', image: null });
    setShowAddForm(true);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Manage Banners</h2>
        <button 
          onClick={() => {
            setShowAddForm(!showAddForm);
            setEditingId(null);
            setFormData({ name: '', description: '', image: null });
            if (fileInputRef.current) fileInputRef.current.value = '';
          }}
          style={{ padding: '10px 20px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
        >
          {showAddForm ? 'Cancel' : '+ Add New Banner'}
        </button>
      </div>

      {showAddForm && (
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h3>{editingId ? 'Edit Banner' : 'Add New Banner'}</h3>
          <form onSubmit={handleSaveBanner} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input type="text" placeholder="Banner Name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
            <input type="text" placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
            <input type="file" accept="image/*" ref={fileInputRef} onChange={e => setFormData({...formData, image: e.target.files[0]})} style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
            <button type="submit" style={{ padding: '10px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              {editingId ? 'Update Banner' : 'Save Banner'}
            </button>
          </form>
        </div>
      )}

      <div style={{ background: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>
              <th style={{ padding: '12px' }}>Image</th>
              <th>Name</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {banners.map(b => {
              const imageUrl = b.image?.startsWith('http') 
                ? b.image 
                : (b.image ? 'http://localhost:5000/uploads/' + b.image : 'https://via.placeholder.com/150');
              
              return (
                <tr key={b._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px' }}>
                    <img src={imageUrl} alt={b.name} style={{ width: '80px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
                  </td>
                  <td style={{ fontWeight: 'bold' }}>{b.name}</td>
                  <td>{b.description}</td>
                  <td>
                    <button onClick={() => startEdit(b)} style={{ padding: '6px 12px', background: '#e3f2fd', color: '#1976d2', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}>Edit</button>
                    <button onClick={() => deleteBanner(b._id)} style={{ padding: '6px 12px', background: '#ffebee', color: '#d32f2f', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
