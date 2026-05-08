import React from 'react';
import ProductCard from './ProductCard';
import { PenData } from '@/contexts/Types';

// Function to fetch pens from our API
async function getPens() {
  // Use an absolute URL for server-side fetching
  // In production, you would use process.env.NEXT_PUBLIC_BASE_URL
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  
  const res = await fetch(`${baseUrl}/api/pens`, {
    cache: 'no-store', // Ensures we always get fresh data
  });

  if (!res.ok) {
    throw new Error('Failed to fetch pens');
  }

  const data = await res.json();

  // Map the Prisma data (basePrice) to our UI type (price)
  return data.map((pen: any) => ({
    id: pen.id,
    name: pen.name,
    description: pen.description,
    price: pen.basePrice, // mapping basePrice from DB to price for UI
    category: pen.category,
    images: pen.images,
  })) as PenData[];
}

const Product = async () => {
  let pens: PenData[] = [];
  
  try {
    pens = await getPens();
  } catch (error) {
    return (
      <div className="py-10 text-center text-red-500">
        Error loading products. Please try again later.
      </div>
    );
  }

  return (
    <section className="py-12">
      <div className="container px-4 mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Our Premium Collection
            </h2>
            <p className="mt-2 text-gray-600">
              Discover the perfect writing instrument for your style.
            </p>
          </div>
          <span className="text-sm font-medium text-gray-500">
            Showing {pens.length} products
          </span>
        </div>

        {pens.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-gray-500">No pens found in the collection.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {pens.map((pen) => (
              <ProductCard key={pen.id} pen={pen} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Product;