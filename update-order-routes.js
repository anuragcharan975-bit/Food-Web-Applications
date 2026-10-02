const fs = require('fs');
let content = fs.readFileSync('Backend_Zwigato/router/frontend/orderRoutes.js', 'utf8');

const verifyRoute = `
// VERIFY PAYMENT
router.post("/verify-payment", controller.verifyPayment);
`;

content = content.replace('router.post("/:userId", controller.createOrder);', 'router.post("/:userId", controller.createOrder);\n' + verifyRoute);

fs.writeFileSync('Backend_Zwigato/router/frontend/orderRoutes.js', content);
