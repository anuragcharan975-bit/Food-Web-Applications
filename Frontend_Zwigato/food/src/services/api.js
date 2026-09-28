/**
 * ============================================================================
 * ZWIGATO API MODULE (Simple JavaScript - Easy to read & understand)
 * ============================================================================
 * This file connects your website to the Node.js / Express backend server.
 * If the backend is running at http://localhost:5000, it fetches live data.
 * If the backend is not running, it uses high-quality sample data automatically!
 */

const API_BASE_URL = "http://localhost:5000/api";

// ================= SAMPLE FALLBACK DATA =================
// (Used whenever backend or database is offline)

const SAMPLE_CATEGORIES = [
  { _id: "cat_all", name: "All Dishes", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&auto=format&fit=crop&q=80" },
  { _id: "cat_pizza", name: "Pizza", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=150&auto=format&fit=crop&q=80" },
  { _id: "cat_burger", name: "Burger", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=150&auto=format&fit=crop&q=80" },
  { _id: "cat_biryani", name: "Biryani", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=150&auto=format&fit=crop&q=80" },
  { _id: "cat_north", name: "North Indian", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=150&auto=format&fit=crop&q=80" },
  { _id: "cat_chinese", name: "Chinese", image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=150&auto=format&fit=crop&q=80" },
  { _id: "cat_rolls", name: "Rolls", image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=150&auto=format&fit=crop&q=80" },
  { _id: "cat_dessert", name: "Desserts", image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=150&auto=format&fit=crop&q=80" },
  { _id: "cat_beverage", name: "Drinks", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=150&auto=format&fit=crop&q=80" }
];

const SAMPLE_RESTAURANTS = [
  {
    _id: "res_1",
    name: "Royal Spice Kitchen",
    address: "C-Scheme, Jaipur",
    phone: "+91 98765 43210",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&auto=format&fit=crop&q=80",
    description: "Famous for authentic Butter Chicken, Dal Makhani & Garlic Naan."
  },
  {
    _id: "res_2",
    name: "Pizza Italiano & Cafe",
    address: "Malviya Nagar, Jaipur",
    phone: "+91 98765 11223",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop&q=80",
    description: "Wood-fired authentic Italian pizza and artisanal pastas."
  },
  {
    _id: "res_3",
    name: "Burger Craft House",
    address: "Vaishali Nagar, Jaipur",
    phone: "+91 98765 99887",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&auto=format&fit=crop&q=80",
    description: "Juicy handmade burgers with crisp golden fries and shakes."
  },
  {
    _id: "res_4",
    name: "Hyderabadi Dum Darbar",
    address: "Mansarovar, Jaipur",
    phone: "+91 98765 55443",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80",
    description: "Authentic slow-cooked Dum Biryanis infused with fragrant saffron."
  }
];

const SAMPLE_FOODS = [
  {
    _id: "food_1",
    name: "Margherita Supreme Pizza",
    description: "Loaded with fresh mozzarella cheese, juicy tomatoes, and fragrant basil leaves on crispy crust.",
    price: 249,
    discountPrice: 299,
    type: "Veg",
    category: { _id: "cat_pizza", name: "Pizza" },
    restaurant: { _id: "res_2", name: "Pizza Italiano & Cafe" },
    image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=500&auto=format&fit=crop&q=80",
    available: true
  },
  {
    _id: "food_2",
    name: "Double Cheese Paneer Burger",
    description: "Crispy grilled paneer patty topped with melted cheddar, fresh veggies & special house sauce.",
    price: 159,
    discountPrice: 199,
    type: "Veg",
    category: { _id: "cat_burger", name: "Burger" },
    restaurant: { _id: "res_3", name: "Burger Craft House" },
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80",
    available: true
  },
  {
    _id: "food_3",
    name: "Royal Chicken Dum Biryani",
    description: "Tender chicken marinated in secret spices, slow-cooked in handi with aged basmati rice.",
    price: 320,
    discountPrice: 380,
    type: "Non-Veg",
    category: { _id: "cat_biryani", name: "Biryani" },
    restaurant: { _id: "res_4", name: "Hyderabadi Dum Darbar" },
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80",
    available: true
  },
  {
    _id: "food_4",
    name: "Dal Makhani with Butter Naan",
    description: "Creamy black lentils simmered overnight with fresh butter and cream, served with 2 hot naans.",
    price: 220,
    discountPrice: 260,
    type: "Veg",
    category: { _id: "cat_north", name: "North Indian" },
    restaurant: { _id: "res_1", name: "Royal Spice Kitchen" },
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=80",
    available: true
  },
  {
    _id: "food_5",
    name: "Butter Chicken Masala",
    description: "Rich and creamy tomato gravy with tender boneless tandoori chicken chunks.",
    price: 340,
    discountPrice: 399,
    type: "Non-Veg",
    category: { _id: "cat_north", name: "North Indian" },
    restaurant: { _id: "res_1", name: "Royal Spice Kitchen" },
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&auto=format&fit=crop&q=80",
    available: true
  },
  {
    _id: "food_6",
    name: "Crispy Veg Spring Rolls",
    description: "Golden fried crispy rolls stuffed with seasoned noodles, carrots, cabbage and sweet chili dip.",
    price: 139,
    discountPrice: 170,
    type: "Veg",
    category: { _id: "cat_chinese", name: "Chinese" },
    restaurant: { _id: "res_3", name: "Burger Craft House" },
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80",
    available: true
  },
  {
    _id: "food_7",
    name: "Choco Lava Cake",
    description: "Decadent warm chocolate cake with a molten chocolate center that melts in your mouth.",
    price: 99,
    discountPrice: 130,
    type: "Veg",
    category: { _id: "cat_dessert", name: "Desserts" },
    restaurant: { _id: "res_2", name: "Pizza Italiano & Cafe" },
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=80",
    available: true
  },
  {
    _id: "food_8",
    name: "Iced Caramel Cold Coffee",
    description: "Thick creamy brewed espresso blended with rich milk, caramel drizzle and ice cream.",
    price: 110,
    discountPrice: 140,
    type: "Veg",
    category: { _id: "cat_beverage", name: "Drinks" },
    restaurant: { _id: "res_3", name: "Burger Craft House" },
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&auto=format&fit=crop&q=80",
    available: true
  }
];

const SAMPLE_BANNERS = [
  {
    title: "50% OFF up to ₹100",
    desc: "Use code ZWIGATO50 on your first food order today!",
    tag: "Welcome Offer",
    bg: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&auto=format&fit=crop&q=80"
  },
  {
    title: "Weekend Biryani Fest",
    desc: "Flat ₹150 OFF on Hyderabadi & Lucknowi Dum Biryanis!",
    tag: "Trending Now",
    bg: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=1200&auto=format&fit=crop&q=80"
  },
  {
    title: "Free Delivery on Orders > ₹299",
    desc: "Fast, contact-less delivery in under 30 minutes guaranteed.",
    tag: "Fast Delivery",
    bg: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&auto=format&fit=crop&q=80"
  }
];

// ================= API CALL FUNCTIONS =================

/**
 * Get all available foods from backend, or fallback to sample foods
 */
async function fetchFoods(searchQuery = "") {
  try {
    const url = searchQuery ? `${API_BASE_URL}/foods?search=${encodeURIComponent(searchQuery)}` : `${API_BASE_URL}/foods`;
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error("Backend offline");
    const json = await response.json();
    if (json.success && Array.isArray(json.data)) {
      return json.data;
    }
  } catch (error) {
    console.log("Using sample foods (Backend offline):", error.message);
  }
  return SAMPLE_FOODS.filter(food => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase().trim();
    return food.name.toLowerCase().includes(query) || 
           (food.description && food.description.toLowerCase().includes(query)) ||
           (food.restaurant && food.restaurant.name.toLowerCase().includes(query));
  });
}

/**
 * Get all categories from backend, or fallback
 */
async function fetchCategories() {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`, { cache: "no-store" });
    if (!response.ok) throw new Error("Backend offline");
    const json = await response.json();
    if (json.success && Array.isArray(json.data)) {
      return [{ _id: "cat_all", name: "All Dishes", image: SAMPLE_CATEGORIES[0].image }, ...json.data];
    }
  } catch (error) {
    console.log("Using sample categories:", error.message);
  }
  return SAMPLE_CATEGORIES;
}

/**
 * Get all restaurants from backend, or fallback
 */
async function fetchRestaurants() {
  try {
    const response = await fetch(`${API_BASE_URL}/restaurants`, { cache: "no-store" });
    if (!response.ok) throw new Error("Backend offline");
    const json = await response.json();
    if (json.success && Array.isArray(json.data)) {
      return json.data;
    }
  } catch (error) {
    console.log("Using sample restaurants:", error.message);
  }
  return SAMPLE_RESTAURANTS;
}

/**
 * Get promotional banners
 */
async function fetchBanners() {
  try {
    const response = await fetch(`${API_BASE_URL}/banners`, { cache: "no-store" });
    if (!response.ok) throw new Error("Backend offline");
    const json = await response.json();
    if (json.success && Array.isArray(json.data)) {
      return json.data;
    }
  } catch (error) {
    console.log("Using sample banners:", error.message);
  }
  return SAMPLE_BANNERS;
}

/**
 * User Login
 */
async function apiLogin(email, password) {
  try {
    const res = await fetch(`${API_BASE_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    return data;
  } catch (error) {
    // If backend is offline, simulate demo login
    return {
      success: true,
      message: "Logged in (Demo mode)",
      data: {
        _id: "demo_user_1",
        name: email.split("@")[0].toUpperCase(),
        email: email,
        phone: "+91 9876543210"
      }
    };
  }
}

/**
 * User Registration
 */
async function apiRegister(userData) {
  try {
    const res = await fetch(`${API_BASE_URL}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return {
      success: true,
      message: "Account created (Demo mode)",
      data: {
        _id: "demo_user_" + Date.now(),
        name: userData.name,
        email: userData.email,
        phone: userData.phone
      }
    };
  }
}

/**
 * Create Order
 */
async function apiPlaceOrder(orderData) {
  try {
    const userId = orderData.userId || "guest";
    const res = await fetch(`${API_BASE_URL}/orders/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData)
    });
    return await res.json();
  } catch (error) {
    return {
      success: true,
      message: "Order placed successfully!",
      orderId: "ZWG-" + Math.floor(100000 + Math.random() * 900000)
    };
  }
}

/**
 * Fetch User Orders
 */
async function fetchOrders(userId) {
  try {
    const res = await fetch(`${API_BASE_URL}/orders/${userId}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Backend offline");
    const json = await res.json();
    if (json.success) return json.data;
  } catch (error) {
    console.log("Using sample orders:", error.message);
  }
  return [];
}

/**
 * Update User Profile
 */
async function apiUpdateUser(userId, userData) {
  try {
    const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData)
    });
    return await res.json();
  } catch (error) {
    return { success: true, message: "Profile updated (Demo mode)", data: { _id: userId, ...userData } };
  }
}

/**
 * Forgot Password - Send OTP
 */
async function apiForgotPassword(email) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
    return await res.json();
  } catch (error) {
    return { success: false, message: "Server error" };
  }
}

/**
 * Verify OTP
 */
async function apiVerifyOtp(email, otp) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp })
    });
    return await res.json();
  } catch (error) {
    return { success: false, message: "Server error" };
  }
}

/**
 * Reset Password
 */
async function apiResetPassword(email, resetToken, newPassword) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, resetToken, newPassword })
    });
    return await res.json();
  } catch (error) {
    return { success: false, message: "Server error" };
  }
}

/**
 * Fetch Restaurant By Id
 */
async function fetchRestaurantById(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/restaurants/${id}`, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      if (json.success) return json.data;
    }
  } catch (error) {
    console.log("Using sample fallback for restaurant:", error.message);
  }
  return SAMPLE_RESTAURANTS.find(r => r._id === id) || null;
}

export { fetchFoods, fetchCategories, fetchRestaurants, fetchBanners, apiLogin, apiRegister, apiPlaceOrder, fetchOrders, apiUpdateUser, apiForgotPassword, apiVerifyOtp, apiResetPassword, fetchRestaurantById };
