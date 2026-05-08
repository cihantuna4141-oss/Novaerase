"use client";

import Link from "next/link";
import { ShoppingCart, Heart, PenTool, Search } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/Store";

export default function Navbar() {
  const { totalQuantity } = useSelector((state: RootState) => state.cart);
  const favorites = useSelector((state: RootState) => state.favorites.items);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <PenTool className="w-6 h-6 text-blue-600" />
          <span>LUXE<span className="text-blue-600">PENS</span></span>
        </Link>

        {/* Desktop Links */}
        <div className="items-center hidden gap-8 text-sm font-medium md:flex">
          <Link href="/shop" className="transition hover:text-blue-600">Shop All</Link>
          <Link href="/categories/fountain" className="transition hover:text-blue-600">Fountain</Link>
          <Link href="/categories/rollerball" className="transition hover:text-blue-600">Rollerball</Link>
          <Link href="/about" className="transition hover:text-blue-600">Our Story</Link>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-4">
          <button className="p-2 transition rounded-full hover:bg-gray-100">
            <Search className="w-5 h-5 text-gray-600" />
          </button>
          
          <Link href="/favorites" className="relative p-2 transition rounded-full hover:bg-gray-100">
            <Heart className="w-5 h-5 text-gray-600" />
            {favorites.length > 0 && (
              <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                {favorites.length}
              </span>
            )}
          </Link>

          <Link href="/cart" className="relative p-2 transition rounded-full hover:bg-gray-100">
            <ShoppingCart className="w-5 h-5 text-gray-600" />
            {totalQuantity > 0 && (
              <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white">
                {totalQuantity}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}