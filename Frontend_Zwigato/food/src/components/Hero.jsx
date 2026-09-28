import React, { useState, useEffect } from 'react';

export default function Hero({ banners }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!banners || banners.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [banners]);

  if (!banners || banners.length === 0) return null;

  const prevBanner = () => setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  const nextBanner = () => setCurrentIndex((prev) => (prev + 1) % banners.length);

  const scrollToMenu = () => {
    const menu = document.getElementById('menu-section');
    if (menu) menu.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero-section">
      <div className="container">
        <div className="banner-carousel">
          <div 
            className="banner-track" 
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {banners.map((b, idx) => (
              <div 
                key={idx} 
                className="banner-slide" 
                style={{ backgroundImage: `url('${b.bg || b.image}')` }}
              >
                <div className="banner-content">
                  <span className="banner-tag">{b.tag || "Special Offer"}</span>
                  <h2 className="banner-title">{b.title || b.name}</h2>
                  <p className="banner-desc">{b.desc || b.description || ""}</p>
                  <button className="banner-btn" onClick={scrollToMenu}>Order Now</button>
                </div>
              </div>
            ))}
          </div>

          <button className="banner-nav-btn banner-prev" onClick={prevBanner} aria-label="Previous Banner">❮</button>
          <button className="banner-nav-btn banner-next" onClick={nextBanner} aria-label="Next Banner">❯</button>
        </div>
      </div>
    </section>
  );
}
