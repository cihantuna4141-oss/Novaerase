"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, CheckCircle2, Info } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { CartActions } from "@/store/CartSlice";
import { FavoriteActions } from "@/store/FavoritesSlice";
import { PenData } from "@/contexts/Types";
import { RootState } from "@/store/Store";

export default function ProductCard(props: PenData) {
  const { name, images, category, id, basePrice } = props;
  
  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.favorites.items);
  const isFavorite = favorites.some((item) => item.id === id);

  // --- Handlers ---

  const handleFavoriteClick = () => {
    if (isFavorite) {
      dispatch(FavoriteActions.deleteFavorite(id));
      toast.info("Removed from Favorites", {
        description: `${name} has been removed.`,
      });
    } else {
      dispatch(FavoriteActions.addToFavorite(props));
      toast.success("Added to Favorites", {
        description: `${name} added to your wishlist.`,
        icon: <Heart className="w-4 h-4 text-red-500 fill-red-500" />,
      });
    }
  };

  const handleAddToCart = () => {
    dispatch(CartActions.addToCart(props));
    
    // Professional Toast with a "View Cart" Action
    toast.success("Added to Cart", {
      description: `${name} - GH₵ ${basePrice}.00`,
      icon: <CheckCircle2 className="w-4 h-4 text-green-500" />,
      action: {
        label: "View Cart",
        onClick: () => window.location.href = "/cart",
      },
    });
  };

  return (
    <div className="relative p-3 transition-all bg-white border group rounded-xl hover:shadow-xl hover:border-blue-100">
      {/* Favorite Button */}
      <button 
        onClick={handleFavoriteClick}
        className="absolute z-10 p-2 transition rounded-full shadow-sm right-5 top-5 bg-white/90 backdrop-blur-sm hover:scale-110 active:scale-90"
      >
        <Heart 
          className={`h-5 w-5 transition-colors ${
            isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"
          }`} 
        />
      </button>

      {/* Product Image */}
      <Link href={`/product/${id}`}>
        <div className="relative overflow-hidden rounded-lg aspect-square bg-gray-50">
          <Image
            src={images[0] || "/placeholder-pen.png"}
            alt={name}
            fill
            className="object-contain transition-transform duration-500 md:p-2 group-hover:scale-110"
          />
        </div>
      </Link>

      {/* Product Info */}
      <div className="mt-4 space-y-1">
        <p className="text-[10px] font-bold tracking-widest text-blue-600 uppercase">
          {category}
        </p>
        <Link href={`/product/${id}`}>
          <h3 className="font-semibold text-gray-800 transition line-clamp-1 group-hover:text-blue-600">
            {name}
          </h3>
        </Link>
        <p className="font-bold text-gray-900 md:text-lg">
          GH₵ {basePrice ? basePrice.toFixed(2) : "0.00"}
        </p>
      </div>

      {/* Add to Cart Button */}
      <button 
        onClick={handleAddToCart}
        className="flex items-center justify-center w-full gap-2 py-3 mt-4 text-xs font-bold text-white transition bg-gray-900 rounded-lg md:text-sm hover:bg-blue-600 active:scale-95"
      >
        <ShoppingCart className="w-4 h-4" />
        Add to Cart
      </button>
    </div>
  );
}