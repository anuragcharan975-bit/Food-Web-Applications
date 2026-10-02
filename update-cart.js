const fs = require('fs');

let content = fs.readFileSync('Frontend_Zwigato/food/src/components/CartDrawer.jsx', 'utf8');

// Replace handleCheckout body
content = content.replace(/const handleCheckout = async \(\) => \{[\s\S]*?alert\([\s\S]*?\);\n  \};/, 
`const { useNavigate } = require('react-router-dom');
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (cart.length === 0) {
      showToast("Your cart is empty!", "error");
      return;
    }
    
    // Just navigate to checkout page
    closeCart();
    navigate('/checkout', { state: { appliedCouponDiscount, couponCode } });
  };`);

// Add import
content = content.replace("import React, { useContext, useState } from 'react';", "import React, { useContext, useState } from 'react';\nimport { useNavigate } from 'react-router-dom';");
content = content.replace("const { useNavigate } = require('react-router-dom');", ""); // remove the injected one above

fs.writeFileSync('Frontend_Zwigato/food/src/components/CartDrawer.jsx', content);
console.log('CartDrawer updated to navigate to /checkout');
