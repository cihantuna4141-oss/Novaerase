"use client";

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/Store";
import { CartActions } from "@/store/CartSlice";
import Navbar from "@/components/Navbar";
import {
  CreditCard,
  Smartphone,
  Truck,
  Lock,
  CheckCircle2,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const ShopProduct = () => {
  const { items } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();
  const router = useRouter();

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "momo">("card");

  const subtotal = items.reduce((acc, item) => acc + item.totalPrice, 0);
  const shipping = 0.0; // Free shipping
  const total = subtotal + shipping;

  const handlePlaceOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);

    const formData = new FormData(e.currentTarget);

    const orderData = {
      customerName: formData.get("customerName"),
      phone: formData.get("phone"),
      address: formData.get("address"),
      city: formData.get("city"),
      paymentMethod: paymentMethod,
      totalAmount: total,
      items: items, // From Redux state
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (res.ok) {
        toast.success("Order Placed!");
        dispatch(CartActions.clearCart());
        router.push("/checkout/success");
      }
    } catch (error) {
      toast.error("Failed to save order");
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
        <h1 className="mb-4 text-xl font-bold">No items to checkout</h1>
        <Link href="/" className="font-bold text-blue-600 hover:underline">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      <Navbar />
      <div className="max-w-6xl px-4 py-10 mx-auto">
        <Link
          href="/cart"
          className="flex items-center gap-2 mb-6 text-sm text-gray-500 transition hover:text-blue-600"
        >
          <ArrowLeft size={16} /> Back to Cart
        </Link>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* LEFT: FORM */}
          <form onSubmit={handlePlaceOrder} className="space-y-8">
            {/* Shipping Section */}
            <section className="p-6 bg-white border shadow-sm rounded-2xl">
              <h2 className="flex items-center gap-2 mb-6 text-lg font-bold">
                <Truck className="text-blue-600" size={20} /> Shipping
                Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Full Name
                  </label>
                  <input
                    required
                    className="w-full p-3 border outline-none rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50"
                    placeholder="John Doe"
                  />
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Street Address
                  </label>
                  <input
                    required
                    className="w-full p-3 border outline-none rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50"
                    placeholder="123 Independence Ave"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    City
                  </label>
                  <input
                    required
                    className="w-full p-3 border outline-none rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50"
                    placeholder="Accra"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Phone Number
                  </label>
                  <input
                    required
                    className="w-full p-3 border outline-none rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50"
                    placeholder="024 000 0000"
                  />
                </div>
              </div>
            </section>

            {/* Payment Section */}
            <section className="p-6 bg-white border shadow-sm rounded-2xl">
              <h2 className="flex items-center gap-2 mb-6 text-lg font-bold">
                <Lock className="text-blue-600" size={20} /> Payment Method
              </h2>

              <div className="flex gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition ${paymentMethod === "card" ? "border-blue-600 bg-blue-50" : "border-gray-100 hover:bg-gray-50"}`}
                >
                  <CreditCard
                    className={
                      paymentMethod === "card"
                        ? "text-blue-600"
                        : "text-gray-400"
                    }
                  />
                  <span className="text-xs font-bold uppercase">Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("momo")}
                  className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition ${paymentMethod === "momo" ? "border-blue-600 bg-blue-50" : "border-gray-100 hover:bg-gray-50"}`}
                >
                  <Smartphone
                    className={
                      paymentMethod === "momo"
                        ? "text-blue-600"
                        : "text-gray-400"
                    }
                  />
                  <span className="text-xs font-bold uppercase">MoMo</span>
                </button>
              </div>

              {paymentMethod === "card" ? (
                <div className="space-y-4">
                  <input
                    required
                    className="w-full p-3 border outline-none rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50"
                    placeholder="Card Number"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      required
                      className="p-3 border outline-none rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50"
                      placeholder="MM/YY"
                    />
                    <input
                      required
                      className="p-3 border outline-none rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50"
                      placeholder="CVC"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <select className="w-full p-3 font-medium border outline-none rounded-xl bg-gray-50">
                    <option>MTN Mobile Money</option>
                    <option>Telecel Cash</option>
                    <option>AT Money</option>
                  </select>
                  <input
                    required
                    className="w-full p-3 border outline-none rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50"
                    placeholder="Wallet Number"
                  />
                </div>
              )}
            </section>

            <button
              disabled={isProcessing}
              className="flex items-center justify-center w-full gap-3 py-4 text-lg font-extrabold text-white transition bg-blue-600 rounded-2xl hover:bg-blue-700 active:scale-95 disabled:bg-gray-400"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="animate-spin" /> Processing Payment...
                </>
              ) : (
                `Pay GH₵ ${total.toFixed(2)}`
              )}
            </button>
          </form>

          {/* RIGHT: SUMMARY */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="p-8 text-white bg-gray-900 shadow-xl rounded-3xl">
              <h2 className="mb-6 text-xl font-bold">Order Summary</h2>
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar mb-6">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4 pb-4 border-b border-gray-800"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 overflow-hidden rounded-lg bg-white/10">
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="object-contain p-1"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-bold line-clamp-1">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-bold whitespace-nowrap">
                      GH₵ {item.totalPrice.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white">GH₵ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-400 font-bold uppercase text-[10px]">
                    Free
                  </span>
                </div>
                <div className="flex justify-between pt-4 mt-4 text-xl font-extrabold text-white border-t border-gray-800">
                  <span>Total</span>
                  <span className="text-blue-400">GH₵ {total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopProduct;
