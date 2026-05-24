"use client";

import React from "react";
import { useSelector } from "react-redux";
import { Heart, Home } from "lucide-react";
import Link from "next/link";
import { RootState } from "@/store/Store";
import ProductCard from "@/components/product/ProductCard";

const FavoritesCard = () => {
  const favoriteItems = useSelector((state: RootState) => state.favorites.items);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl px-4 py-10 mx-auto">
        <div className="mb-10 text-center md:text-left">
          <h1 className="flex items-center justify-center gap-3 text-3xl font-bold text-gray-900 md:justify-start">
            My Wishlist <Heart className="text-red-500 fill-red-500" />
          </h1>
          <p className="mt-2 text-gray-500">Your handpicked collection of luxury pens.</p>
        </div>

        {favoriteItems.length === 0 ? (
          <div className="flex flex-col items-center px-4 py-20 bg-white border border-dashed rounded-3xl">
            <Heart className="w-16 h-16 mb-4 text-gray-200" />
            <p className="text-lg font-medium text-gray-500">You haven't saved anything yet.</p>
            <Link href="/" className="flex items-center gap-2 mt-6 font-bold text-blue-600 hover:underline">
              <Home size={18} /> Back to Shop
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {favoriteItems.map((pen) => (
              <ProductCard key={pen.id} {...pen} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FavoritesCard;