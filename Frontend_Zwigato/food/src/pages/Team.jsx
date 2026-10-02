import React from 'react';

export default function OurTeam() {
  return (
    <main style={{ padding: '40px 0', minHeight: '80vh', backgroundColor: 'var(--bg-light)' }}>
      <div className="container">
        <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <h1 style={{ color: 'var(--secondary)', marginBottom: '20px', borderBottom: '2px solid var(--primary)', paddingBottom: '10px', display: 'inline-block' }}>Our Team</h1>
          <div style={{ color: 'var(--text-color)', lineHeight: '1.8', fontSize: '16px' }}>
            
    <p>At Zwigato, our team is our biggest asset. From our dedicated delivery partners to our expert engineers and customer support heroes, everyone works together to ensure you get the best food delivery experience.</p>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '30px' }}>
      <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
        <h3 style={{ margin: '0 0 10px 0', color: 'var(--secondary)' }}>Leadership</h3>
        <p style={{ margin: 0, fontSize: '14px' }}>Guiding Zwigato's vision and strategy.</p>
      </div>
      <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
        <h3 style={{ margin: '0 0 10px 0', color: 'var(--secondary)' }}>Engineering</h3>
        <p style={{ margin: 0, fontSize: '14px' }}>Building the platform that connects you to your food.</p>
      </div>
      <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
        <h3 style={{ margin: '0 0 10px 0', color: 'var(--secondary)' }}>Operations</h3>
        <p style={{ margin: 0, fontSize: '14px' }}>Ensuring fast and safe deliveries every time.</p>
      </div>
    </div>
  
          </div>
        </div>
      </div>
    </main>
  );
}
