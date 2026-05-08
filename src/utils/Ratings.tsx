export const getProductRating = (productId: string | undefined | null) => {
  // 1. Safety check: Return default if ID is missing
  if (!productId) {
    return { rating: 4.8, reviews: 120 };
  }

  // 2. Generate a consistent hash from the string ID
  let hash = 0;
  for (let i = 0; i < productId.length; i++) {
    hash = productId.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const normalized = Math.abs(hash);
  
  // 3. Generate Rating: 4.0 to 5.0 
  const ratingShift = (normalized % 11) / 10; 
  const rawRating = 4.0 + ratingShift;

  
  const finalRating = Math.round(rawRating * 10) / 10;

  // 5. Generate Reviews: 50 to 500
  const reviewCount = 50 + (normalized % 450);

  return {
    rating: finalRating, 
    reviews: reviewCount
  };
};