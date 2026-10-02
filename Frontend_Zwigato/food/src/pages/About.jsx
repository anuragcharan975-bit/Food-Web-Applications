import React from 'react';

export default function AboutUs() {
  return (
    <main style={{ padding: '40px 0', minHeight: '80vh', backgroundColor: 'var(--bg-light)' }}>
      <div className="container">
        <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <h1 style={{ color: 'var(--secondary)', marginBottom: '20px', borderBottom: '2px solid var(--primary)', paddingBottom: '10px', display: 'inline-block' }}>About Us</h1>
          <div style={{ color: 'var(--text-color)', lineHeight: '1.8', fontSize: '16px' }}>
            
    <p>Welcome to <strong>Zwigato</strong>, your ultimate destination for superfast food delivery. We partner with the best local restaurants to bring you hot, fresh, and delicious meals right to your doorstep.</p>
    <p>Founded in 2026, Zwigato has grown to become the most trusted food delivery platform, ensuring quality service, fast delivery, and a seamless ordering experience.</p>
  
          </div>
        </div>
      </div>
    </main>
  );
}
