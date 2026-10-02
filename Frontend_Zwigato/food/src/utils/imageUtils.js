export const getFoodImageUrl = (img) => {
  if (!img) return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500';
  if (img.startsWith('http')) return img;
  return `http://localhost:5000/uploads/${img}`;
};

export const getRestaurantImageUrl = (img) => {
  if (!img) return 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200';
  if (img.startsWith('http')) return img;
  return `http://localhost:5000/uploads/${img}`;
};

export const getCategoryImageUrl = (img) => {
  if (!img) return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150';
  if (img.startsWith('http')) return img;
  return `http://localhost:5000/uploads/${img}`;
};

export const getBannerImageUrl = (img) => {
  if (!img) return 'https://via.placeholder.com/150';
  if (img.startsWith('http')) return img;
  return `http://localhost:5000/uploads/${img}`;
};
