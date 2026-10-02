import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">
              <img src="/logo_icon.jpg" alt="Zwigato Logo" style={{ width: '28px', height: '28px', objectFit: 'contain', marginRight: '10px', verticalAlign: 'middle' }} />
              Zwigato
            </div>
            <p>Superfast food delivery from top restaurants right to your doorstep. Order fresh pizzas, juicy burgers, authentic biryanis, and more.</p>
          </div>
          <div>
            <h4 className="footer-col-title">Company</h4>
            <ul className="footer-links">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/team">Team</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/blog">Zwigato Blog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="footer-col-title">Contact</h4>
            <ul className="footer-links">
              <li><Link to="/support">Help & Support</Link></li>
              <li><Link to="/partner">Partner with us</Link></li>
              <li><Link to="/ride">Ride with us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="footer-col-title">Legal</h4>
            <ul className="footer-links">
              <li><Link to="/terms">Terms & Conditions</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/cookie-policy">Cookie Policy</Link></li>
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
