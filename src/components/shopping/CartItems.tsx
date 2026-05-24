"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Eraser,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/Store";
import { CartActions } from "@/store/CartSlice";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const CartItems = () => {
  const { items, totalQuantity } = useSelector(
    (state: RootState) => state.cart,
  );
  const dispatch = useDispatch();
  const router = useRouter();

  const totalPrice = items.reduce((acc, item) => acc + item.totalPrice, 0);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-[#F5F2EB]">
        <div className="relative p-12 mb-8 bg-white border rounded-full shadow-sm border-gold/10">
          <ShoppingBag className="w-16 h-16 text-gold/20" strokeWidth={1} />
          <div className="absolute top-0 right-0 w-6 h-6 rounded-full bg-gold animate-pulse" />
        </div>
        <h1 className="mb-3 font-serif text-3xl text-ink uppercase tracking-wider">
          Your selection is empty
        </h1>
        <p className="mb-10 text-sm font-medium text-center text-ink/40 tracking-wide max-w-[280px]">
          The orders are waiting for your curation. Discover our precision
          products.
        </p>
        <Link
          href="/"
          className="px-10 py-4 text-[11px] font-bold tracking-[0.2em] text-cream uppercase transition-all bg-ink rounded-full hover:bg-gold shadow-xl shadow-gold/5 active:scale-95"
        >
          Return to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-[#F5F2EB]">
      <div className="max-w-6xl px-6 py-16 mx-auto">
        <header className="mb-7 border-b-2 pb-4 border-gold/20 flex flex-col items-start md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold text-gold uppercase tracking-[0.3em] mb-2">
              Shopping Cart
            </p>
            <h1 className="font-serif text-4xl text-ink md:text-5xl">
              Your Selection
            </h1>
          </div>
          <span className="px-5 py-1.5 text-[10px] font-bold tracking-widest text-gold uppercase bg-white border border-gold/20 rounded-full shadow-sm">
            {totalQuantity} Products
          </span>
        </header>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Left: Cart Items */}
          <div className="space-y-4 lg:col-span-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="group flex flex-wrap items-center gap-6 px-3 py-2.5 transition-all bg-white border-2 border-gold/30 rounded-xl hover:shadow-xl hover:shadow-gold/5"
              >
                {/* Image Container */}
                <div className="relative flex-shrink-0 w-24 h-24 overflow-hidden border bg-cream rounded-lg border-gold/10">
                  <Image
                    src={item.images[0]}
                    alt={item.name}
                    fill
                    className="object-contain p-3 transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                {/* Info */}
                <div className="flex-grow text-left">
                  <h3 className="font-serif text-xl text-ink uppercase tracking-wide">
                    {item.name}
                  </h3>
                  <p className="font-serif italic text-gold text-lg">
                    Unit Price $ {item.price ? item.price.toFixed(2) : "0.00"}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-row sm:flex-col items-center gap-4">
                  <div className="flex items-center p-1 bg-cream border border-gold/10 rounded-lg">
                    <button
                      onClick={() =>
                        dispatch(CartActions.removeFromCart(item.id))
                      }
                      className="p-2 transition-colors text-ink/40 hover:text-gold active:scale-75"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-4 text-xs font-bold text-ink">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => dispatch(CartActions.addToCart(item))}
                      className="p-2 transition-colors text-ink/40 hover:text-gold active:scale-75"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      dispatch(CartActions.deleteFromCart(item.id));
                      toast.error("Entry Removed", {
                        description: `${item.name} has been removed from your selection.`,
                      });
                    }}
                    className="p-3 text-red-400/50 transition-all rounded-xl hover:bg-red-50 hover:text-red-500 active:scale-90"
                  >
                    <Trash2 size={18} strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Summary */}
          <div className="lg:col-span-1">
            <div className="sticky p-8 bg-ink text-cream rounded-lg top-24 shadow-2xl shadow-gold/10 overflow-hidden">
              {/* Decorative Background Icon */}
              <Eraser className="absolute -bottom-10 -right-10 w-40 h-40 text-white/[0.03] rotate-12" />

              <h2 className="mb-8 font-serif text-2xl tracking-wide uppercase border-b border-white/10 pb-4">
                Order Summary
              </h2>

              <div className="mb-8 space-y-5">
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-cream/70">
                  <span>Subtotal</span>
                  <span className="text-cream italic font-serif text-sm">
                    $ {totalPrice ? totalPrice.toFixed(2) : "0.00"}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-cream/70">
                  <span>Shipping</span>
                  <span className="text-gold">Complimentary</span>
                </div>
                <div className="pt-6 border-t border-white/10 flex justify-between items-baseline">
                  <span className="text-[11px] font-bold uppercase tracking-[0.3em]">
                    Total
                  </span>
                  <span className="text-2xl font-serif italic text-gold">
                    $ {totalPrice ? totalPrice.toFixed(2) : "0.00"}
                  </span>
                </div>
              </div>

              <button
                onClick={() => router.push("/checkout")}
                className="relative z-10 flex items-center justify-center w-full gap-3 py-3.5 text-[11px] font-black tracking-[0.25em] text-ink uppercase transition-all bg-gold rounded-2xl hover:bg-white hover:text-ink active:scale-95 shadow-lg shadow-gold/20"
              >
                Proceed to Checkout <ArrowRight size={16} />
              </button>

              <p className="mt-6 text-[9px] text-center text-white/70 uppercase tracking-widest leading-relaxed">
                Secure product transactions <br /> encrypted by Novarease.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItems;
