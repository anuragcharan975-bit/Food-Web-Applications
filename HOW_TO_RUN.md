# 🍔 Zwigato Food Web Application - Quick Guide

## How to Run Your Project

### Option 1: Run Frontend Directly (Fastest & Simplest)
You can directly open the frontend in any browser without needing to install anything:
1. Go to folder: `Frontend_Zwigato/food/`
2. **Double-click on `index.html`** (or right-click -> Open with Google Chrome).
3. That's it! Your full website will open with:
   - Food browsing (Pizza, Burger, Biryani, North Indian, Rolls, Drinks, etc.)
   - Category filtering & Veg-only toggle
   - Live search
   - Cart with quantity increment/decrement (`+` / `-`)
   - Coupon codes (`ZWIGATO50` for ₹100 off, `WELCOME` for ₹50 off)
   - Checkout & Order confirmation
   - Sign In & Sign Up modals

---

### Option 2: Run with Backend Server
If you want to run your Node.js / Express backend server:
1. Open PowerShell or Command Prompt.
2. Go to the backend folder:
   ```bash
   cd "Backend_Zwigato"
   ```
3. Start the server:
   ```bash
   node server.js
   ```
4. Open your browser and go to:
   ```
   http://localhost:5000
   ```
   The backend will automatically serve your frontend website and handle all `/api` requests!

---

## What Technologies are Used?
- **Frontend:** Pure HTML5, Modern CSS3, and clean, beginner-friendly JavaScript (`fetch`, `async/await`, DOM).
- **Backend:** Node.js, Express.js, MongoDB (Mongoose).
- **No complicated frameworks or tools needed!**
