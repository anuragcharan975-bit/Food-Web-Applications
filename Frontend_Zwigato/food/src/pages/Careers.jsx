import React from 'react';

export default function Careers() {
  return (
    <main style={{ padding: '40px 0', minHeight: '80vh', backgroundColor: 'var(--bg-light)' }}>
      <div className="container">
        <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <h1 style={{ color: 'var(--secondary)', marginBottom: '20px', borderBottom: '2px solid var(--primary)', paddingBottom: '10px', display: 'inline-block' }}>Careers</h1>
          <div style={{ color: 'var(--text-color)', lineHeight: '1.8', fontSize: '16px' }}>
            
    <p>Join the Zwigato family! We are always looking for passionate individuals who want to redefine the food delivery industry.</p>
    <h3>Current Openings</h3>
    <ul>
      <li>Frontend Developer (React)</li>
      <li>Backend Engineer (Node.js)</li>
      <li>City Operations Manager</li>
      <li>Customer Support Executive</li>
    </ul>
    <p>If you don't see a role that fits but still want to join, email us your resume at careers@zwigato.com.</p>
  
          </div>
        </div>
      </div>
    </main>
  );
}
