const fs = require('fs');

let apiCode = fs.readFileSync('Frontend_Zwigato/food/src/services/api.js', 'utf8');

const verifyPaymentFn = `
/**
 * Verify Razorpay Payment
 */
async function apiVerifyPayment(paymentData) {
  try {
    const res = await fetch(\`\${API_BASE_URL}/orders/verify-payment\`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paymentData)
    });
    return await res.json();
  } catch (error) {
    return { success: false, message: "Server error" };
  }
}
`;

apiCode = apiCode.replace('export { fetchFoods,', verifyPaymentFn + '\nexport { fetchFoods,');
apiCode = apiCode.replace('apiPlaceOrder,', 'apiPlaceOrder, apiVerifyPayment,');

fs.writeFileSync('Frontend_Zwigato/food/src/services/api.js', apiCode);
console.log('Added apiVerifyPayment to api.js');
