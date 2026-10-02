import React from 'react';

export default function ZwigatoBlog() {
  return (
    <main style={{ padding: '40px 0', minHeight: '80vh', backgroundColor: 'var(--bg-light)' }}>
      <div className="container">
        <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <h1 style={{ color: 'var(--secondary)', marginBottom: '20px', borderBottom: '2px solid var(--primary)', paddingBottom: '10px', display: 'inline-block' }}>Zwigato Blog</h1>
          <div style={{ color: 'var(--text-color)', lineHeight: '1.8', fontSize: '16px' }}>
            
    <p>Discover the latest food trends, restaurant spotlights, and behind-the-scenes stories from Zwigato.</p>
    <div style={{ marginTop: '20px', padding: '20px', borderLeft: '4px solid var(--primary)', backgroundColor: '#f9f9f9' }}>
      <h3 style={{ margin: '0 0 10px 0' }}>Top 10 Biryani Spots in the City</h3>
      <p style={{ margin: 0 }}>Craving biryani? We've compiled a list of the most highly-rated biryani restaurants on our platform...</p>
    </div>
    <div style={{ marginTop: '20px', padding: '20px', borderLeft: '4px solid var(--primary)', backgroundColor: '#f9f9f9' }}>
      <h3 style={{ margin: '0 0 10px 0' }}>How We Guarantee 30-Minute Deliveries</h3>
      <p style={{ margin: 0 }}>Ever wonder how your pizza arrives so fast? Read about our optimized routing technology...</p>
    </div>
  
          </div>
        </div>
      </div>
    </main>
  );
}
