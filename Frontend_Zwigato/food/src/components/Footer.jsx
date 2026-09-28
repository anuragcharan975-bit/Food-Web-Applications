import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">🍔 Zwigato</div>
            <p>Superfast food delivery from top restaurants right to your doorstep. Order fresh pizzas, juicy burgers, authentic biryanis, and more.</p>
          </div>
          <div>
            <h4 className="footer-col-title">Company</h4>
            <ul className="footer-links">
              <li><a href="#">About Us</a></li>
              <li><a href="#">Team</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Zwigato Blog</a></li>
            </ul>
          </div>
          <div>
            <h4 className="footer-col-title">Contact</h4>
            <ul className="footer-links">
              <li><a href="#">Help & Support</a></li>
              <li><a href="#">Partner with us</a></li>
              <li><a href="#">Ride with us</a></li>
            </ul>
          </div>
          <div>
            <h4 className="footer-col-title">Legal</h4>
            <ul className="footer-links">
              <li><a href="#">Terms & Conditions</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 Zwigato Food Web Application. Modern React Refactor.</p>
        </div>
      </div>
    </footer>
  );
}
