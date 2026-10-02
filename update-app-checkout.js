const fs = require('fs');

let content = fs.readFileSync('Frontend_Zwigato/food/src/App.jsx', 'utf8');

const imports = `import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';`;

const routes = `<Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />`;

content = content.replace("import Profile from './pages/Profile';", imports + "\nimport Profile from './pages/Profile';");
content = content.replace('<Route path="/profile" element={<Profile />} />', '<Route path="/profile" element={<Profile />} />\n        ' + routes);

fs.writeFileSync('Frontend_Zwigato/food/src/App.jsx', content);
console.log('App.jsx updated with checkout routes');
