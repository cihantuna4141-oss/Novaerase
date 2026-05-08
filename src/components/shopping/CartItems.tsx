"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/Store";
import { CartActions } from "@/store/CartSlice";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";

const CartItems = () => {
  const { items, totalQuantity } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();

  const totalPrice = items.reduce((acc, item) => acc + item.totalPrice, 0);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center px-4 py-20">
          <div className="p-8 mb-6 bg-white rounded-full shadow-sm">
            <ShoppingBag className="w-16 h-16 text-gray-300" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">Your cart is empty</h1>
          <p className="mb-8 text-center text-gray-500">Looks like you haven't added any premium pens yet.</p>
          <Link href="/" className="px-8 py-3 font-bold text-white transition bg-blue-600 rounded-xl hover:bg-blue-700">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      <Navbar />
      <div className="max-w-6xl px-4 py-10 mx-auto">
        <h1 className="flex items-center gap-3 mb-8 text-3xl font-bold text-gray-900">
          Shopping Cart <span className="px-3 py-1 text-sm font-medium bg-gray-200 rounded-full">{totalQuantity} Items</span>
        </h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left: Cart Items */}
          <div className="space-y-4 lg:col-span-2">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4 bg-white border rounded-2xl">
                <div className="relative flex-shrink-0 w-24 h-24 overflow-hidden rounded-lg bg-gray-50">
                  <Image src={item.images[0]} alt={item.name} fill className="object-contain p-2" />
                </div>
                
                <div className="flex-grow">
                  <h3 className="font-bold text-gray-900">{item.name}</h3>
                  <p className="text-xs font-semibold text-blue-600 uppercase">{item.category}</p>
                  <p className="mt-1 text-sm font-bold text-gray-500"> GH₵ {item.basePrice ? item.basePrice.toFixed(2) : "0.00"}</p>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <div className="flex items-center overflow-hidden border rounded-lg">
                    <button 
                      onClick={() => dispatch(CartActions.removeFromCart(item.id))}
                      className="p-1 transition hover:bg-gray-100"><Minus size={16} /></button>
                    <span className="px-3 text-sm font-bold">{item.quantity}</span>
                    <button 
                      onClick={() => dispatch(CartActions.addToCart(item))}
                      className="p-1 transition hover:bg-gray-100"><Plus size={16} /></button>
                  </div>
                  <button 
                    onClick={() => {
                        dispatch(CartActions.deleteFromCart(item.id));
                        toast.error(`Removed ${item.name}`);
                    }}
                    className="p-2 text-red-500 transition rounded-full hover:bg-red-50"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Summary */}
          <div className="lg:col-span-1">
            <div className="sticky p-6 bg-white border rounded-2xl top-24">
              <h2 className="mb-6 text-xl font-bold">Order Summary</h2>
              <div className="mb-6 space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                    <span>GH₵ {totalPrice ? totalPrice.toFixed(2): "0.00"}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="flex justify-between pt-4 text-xl font-bold text-gray-900 border-t">
                  <span>Total</span>
                  <span>GH₵ {totalPrice ? totalPrice.toFixed(2): "0.00"}</span>
                  
                </div>
              </div>
              <button className="flex items-center justify-center w-full gap-2 py-4 font-bold text-white transition bg-gray-900 rounded-xl hover:bg-blue-600">
                Checkout Now <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartItems;