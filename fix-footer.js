const fs = require('fs');
let content = fs.readFileSync('Frontend_Zwigato/food/src/components/Footer.jsx', 'utf8');

if (!content.includes('import { Link }')) {
  content = content.replace("import React from 'react';", "import React from 'react';\nimport { Link } from 'react-router-dom';");
}

// Company
content = content.replace('<li><a href="#">About Us</a></li>', '<li><Link to="/about">About Us</Link></li>');
content = content.replace('<li><a href="#">Team</a></li>', '<li><Link to="/team">Team</Link></li>');
content = content.replace('<li><a href="#">Careers</a></li>', '<li><Link to="/careers">Careers</Link></li>');
content = content.replace('<li><a href="#">Zwigato Blog</a></li>', '<li><Link to="/blog">Zwigato Blog</Link></li>');

// Contact
content = content.replace('<li><a href="#">Help & Support</a></li>', '<li><Link to="/support">Help & Support</Link></li>');
content = content.replace('<li><a href="#">Partner with us</a></li>', '<li><Link to="/partner">Partner with us</Link></li>');
content = content.replace('<li><a href="#">Ride with us</a></li>', '<li><Link to="/ride">Ride with us</Link></li>');

// Legal
content = content.replace('<li><a href="#">Terms & Conditions</a></li>', '<li><Link to="/terms">Terms & Conditions</Link></li>');
content = content.replace('<li><a href="#">Privacy Policy</a></li>', '<li><Link to="/privacy">Privacy Policy</Link></li>');
content = content.replace('<li><a href="#">Cookie Policy</a></li>', '<li><Link to="/cookie-policy">Cookie Policy</Link></li>');

fs.writeFileSync('Frontend_Zwigato/food/src/components/Footer.jsx', content);
console.log('Done');
