"use client";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { CartActions } from "@/store/CartSlice";
import { FavoriteActions } from "@/store/FavoritesSlice";
import { PenData } from "@/contexts/Types";
import { RootState } from "@/store/Store";

export default function ProductCard({ pen }: { pen: PenData }) {
  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.favorites.items);
  const isFavorite = favorites.some((item) => item.id === pen.id);

  return (
    <div className="relative p-3 transition-all bg-white border group rounded-xl hover:shadow-xl">
      {/* Favorite Button */}
      <button 
        onClick={() => isFavorite ? dispatch(FavoriteActions.deleteFavorite(pen.id)) : dispatch(FavoriteActions.addToFavorite(pen))}
        className="absolute z-10 p-2 transition rounded-full shadow-sm right-5 top-5 bg-white/80 backdrop-blur-sm hover:scale-110"
      >
        <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
      </button>

      {/* Image */}
      <Link href={`/product/${pen.id}`}>
        <div className="relative overflow-hidden bg-gray-100 rounded-lg aspect-square">
          <Image
            src={pen.images[0]}
            alt={pen.name}
            fill
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-110"
          />
        </div>
      </Link>

      {/* Info */}
      <div className="mt-4 space-y-1">
        <p className="text-xs font-medium tracking-wider text-blue-600 uppercase">{pen.category}</p>
        <Link href={`/product/${pen.id}`}>
          <h3 className="font-semibold text-gray-800 transition line-clamp-1 group-hover:text-blue-600">
            {pen.name}
          </h3>
        </Link>
        <p className="text-lg font-bold text-gray-900">${pen.basePrice.toFixed(2)}</p>
      </div>

      {/* Add to Cart Button */}
      <button 
        onClick={() => dispatch(CartActions.addToCart(pen))}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600 active:scale-95"
      >
        <ShoppingCart className="w-4 h-4" />
        Add to Cart
      </button>
    </div>
  );
}