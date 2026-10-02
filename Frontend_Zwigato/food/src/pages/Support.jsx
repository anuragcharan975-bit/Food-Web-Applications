import React from 'react';

export default function HelpSupport() {
  return (
    <main style={{ padding: '40px 0', minHeight: '80vh', backgroundColor: 'var(--bg-light)' }}>
      <div className="container">
        <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <h1 style={{ color: 'var(--secondary)', marginBottom: '20px', borderBottom: '2px solid var(--primary)', paddingBottom: '10px', display: 'inline-block' }}>Help & Support</h1>
          <div style={{ color: 'var(--text-color)', lineHeight: '1.8', fontSize: '16px' }}>
            
    <p>Need help with your order? Our support team is available 24/7 to assist you.</p>
    <h3>Contact Us</h3>
    <p><strong>Email:</strong> support@zwigato.com</p>
    <p><strong>Phone:</strong> 1-800-ZWIGATO</p>
    <h3>FAQs</h3>
    <ul>
      <li><strong>Where is my order?</strong> You can track your order in real-time from the "My Orders" section.</li>
      <li><strong>How do I cancel my order?</strong> Orders can be cancelled within 1 minute of placing them.</li>
      <li><strong>What is your refund policy?</strong> Refunds are processed within 3-5 business days for failed or cancelled orders.</li>
    </ul>
  
          </div>
        </div>
      </div>
    </main>
  );
}
