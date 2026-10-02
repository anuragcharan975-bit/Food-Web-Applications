import React from 'react';

export default function TermsConditions() {
  return (
    <main style={{ padding: '40px 0', minHeight: '80vh', backgroundColor: 'var(--bg-light)' }}>
      <div className="container">
        <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <h1 style={{ color: 'var(--secondary)', marginBottom: '20px', borderBottom: '2px solid var(--primary)', paddingBottom: '10px', display: 'inline-block' }}>Terms & Conditions</h1>
          <div style={{ color: 'var(--text-color)', lineHeight: '1.8', fontSize: '16px' }}>
            
    <p>Last updated: October 2026</p>
    <h3>1. Acceptance of Terms</h3>
    <p>By accessing and using Zwigato, you accept and agree to be bound by the terms and provision of this agreement.</p>
    <h3>2. Food Orders</h3>
    <p>Zwigato acts as an intermediary between you and the restaurants. The restaurants are solely responsible for preparing and packing the food.</p>
    <h3>3. Payments</h3>
    <p>All payments must be made at the time of ordering unless "Cash on Delivery" is selected and available.</p>
    <h3>4. Cancellations</h3>
    <p>Orders cannot be cancelled once the restaurant has started preparing your food.</p>
  
          </div>
        </div>
      </div>
    </main>
  );
}
