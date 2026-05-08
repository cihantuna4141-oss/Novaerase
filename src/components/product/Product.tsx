"use client";

import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { PenData } from '@/contexts/Types';
import { Loader2 } from 'lucide-react';

const Product = () => {
  const [pens, setPens] = useState<PenData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPens = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/pens');
        
        if (!res.ok) throw new Error('Failed to fetch pens');

        const result = await res.json();

        if (result.success && Array.isArray(result.data)) {
          const mappedData: PenData[] = result.data.map((pen: any) => ({
            id: pen.id,
            name: pen.name,
            description: pen.description,
            basePrice: pen.basePrice,
            category: pen.category,
            images: pen.images,
            variants: pen.variants || [], // FIX: Ensure variants is included
          }));
          
          setPens(mappedData);
        }
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchPens();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 space-y-4">
      <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      <p className="font-medium text-gray-500">Loading our collection...</p>
    </div>
  );

  return (
    <section className="w-full py-12 bg-gray-50">
      <div className="max-w-6xl px-4 mx-auto">
        <h2 className="mb-10 text-xl font-bold text-gray-900 md:text-3xl">Our Premium Collection</h2>
        
        {pens.length === 0 ? (
          <div className="py-20 text-center bg-white border border-dashed rounded-3xl">
            <p className="text-gray-500">No pens found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {pens.map((pen) => (
              // FIX: Pass the whole pen object using spread to satisfy PenData requirements
              <ProductCard key={pen.id} {...pen} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Product;