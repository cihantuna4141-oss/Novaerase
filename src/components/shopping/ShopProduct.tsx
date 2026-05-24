"use client";

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/Store";
import { CartActions } from "@/store/CartSlice";
import {
  CreditCard,
  Smartphone,
  Truck,
  Lock,
  Loader2,
  ArrowLeft,
  MapPin,
  User,
  Mail,
  Phone,
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
  const shippingCost = 0.0; // Complimentary shipping
  const totalAmount = subtotal + shippingCost;

  const handlePlaceOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);

    const formData = new FormData(e.currentTarget);

    // Matching your Prisma Order Model precisely
    const orderData = {
      orderNumber: `NVR-${Math.random().toString(36).toUpperCase().substring(2, 10)}`,
      customerName: formData.get("customerName"),
      customerEmail: formData.get("customerEmail"),
      customerPhone: formData.get("customerPhone"),
      houseAddress: formData.get("houseAddress"),
      streetName: formData.get("streetName"),
      town: formData.get("town"),
      state: formData.get("state") || "N/A",
      zipCode: formData.get("zipCode"),
      country: "Ghana",
      subtotal: subtotal,
      shippingCost: shippingCost,
      totalAmount: totalAmount,
      paymentStatus: "PENDING",
      orderStatus: "PROCESSING",
      items: items.map((item) => ({
        productId: item.id,
        productName: item.name,
        productImage: item.images[0],
        priceAtSale: item.price,
        quantity: item.quantity,
        totalPrice: item.totalPrice,
      })),
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (res.ok) {
        toast.success("Order Placed Successfully", {
          description: "Your Order instrument is being prepared.",
        });
        dispatch(CartActions.clearCart());
        router.push("/checkout/success");
      } else {
        const err = await res.json();
        toast.error(err.message || "Failed to process order");
      }
    } catch (error) {
      toast.error("Network synchronization error");
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[#F5F2EB]">
        <h1 className="mb-4 font-serif text-2xl text-ink uppercase">
          Your Selection is empty
        </h1>
        <Link
          href="/"
          className="px-8 py-3 text-[11px] font-bold tracking-widest text-cream uppercase bg-ink rounded-full hover:bg-gold transition-all"
        >
          Return to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-[#F5F2EB]">
      <div className="max-w-6xl px-6 py-12 mx-auto">
        <Link
          href="/cart"
          className="flex items-center gap-2 mb-10 text-[10px] font-bold tracking-widest text-gold uppercase transition hover:text-ink"
        >
          <ArrowLeft size={14} /> Back to Selection
        </Link>

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          {/* LEFT: FORM */}
          <form onSubmit={handlePlaceOrder} className="space-y-4">
            {/* 1. Identity Section */}
            <section className="p-8 bg-white border border-gold/10 shadow-sm rounded-lg">
              <h2 className="flex items-center gap-3 mb-8 font-serif text-xl text-ink uppercase tracking-wide">
                <User className="text-gold" size={20} /> Client Identity
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <input
                    name="customerName"
                    required
                    placeholder="Full Name"
                    className="w-full p-3 bg-cream/30 border-2 border-gold/30 rounded-lg outline-none focus:ring-1 focus:ring-gold/30 text-base"
                  />
                  <input
                    name="customerPhone"
                    required
                    placeholder="Phone Number"
                    className="w-full p-3 bg-cream/30 border-2 border-gold/30 rounded-lg outline-none focus:ring-1 focus:ring-gold/30 text-base"
                  />
                </div>
                <div>
                  <input
                    name="customerEmail"
                    type="email"
                    required
                    placeholder="Email Address"
                    className="w-full p-3 bg-cream/30 border-2 border-gold/30 rounded-lg outline-none focus:ring-1 focus:ring-gold/30 text-base"
                  />
                </div>
              </div>
            </section>

            {/* 2. Logistics (Shipping) Section */}
            <section className="p-8 bg-white border border-gold/10 shadow-sm rounded-lg">
              <h2 className="flex items-center gap-3 mb-8 font-serif text-xl text-ink uppercase tracking-wide">
                <MapPin className="text-gold" size={20} /> Logistics Details
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-x-2 gap-y-3 md:grid-cols-2">
                  <input
                    name="houseAddress"
                    required
                    placeholder="House/Apt/Plot No."
                    className="w-full p-3 bg-cream/30 border-2 border-gold/30 rounded-lg outline-none focus:ring-1 focus:ring-gold/30 text-base"
                  />
                  <input
                    name="streetName"
                    required
                    placeholder="Street Name"
                    className="w-full p-3 bg-cream/30 border-2 border-gold/30 rounded-lg outline-none focus:ring-1 focus:ring-gold/30 text-base"
                  />
                </div>
                <div className="grid grid-cols-1 gap-x-2 gap-y-3 md:grid-cols-3">
                  <input
                    name="town"
                    required
                    placeholder="Town/City"
                    className="w-full p-3 bg-cream/30 border-2 border-gold/30 rounded-lg outline-none focus:ring-1 focus:ring-gold/30 text-base md:col-span-1"
                  />
                  <input
                    name="state"
                    placeholder="State/Region"
                    className="w-full p-3 bg-cream/30 border-2 border-gold/30 rounded-lg outline-none focus:ring-1 focus:ring-gold/30 text-base md:col-span-1"
                  />
                  <input
                    name="zipCode"
                    required
                    placeholder="Zip Code"
                    className="w-full p-3 bg-cream/30 border-2 border-gold/30 rounded-lg outline-none focus:ring-1 focus:ring-gold/30 text-base md:col-span-1"
                  />
                </div>
              </div>
            </section>

            {/* 3. Payment Method Section */}
            <section className="p-8 bg-white border border-gold/10 shadow-sm rounded-lg">
              <h2 className="flex items-center gap-3 mb-8 font-serif text-xl text-ink uppercase tracking-wide">
                <Lock className="text-gold" size={20} /> Secure Vault
              </h2>

              <div className="flex gap-4 mb-8">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`flex-1 flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all duration-300 ${paymentMethod === "card" ? "border-gold bg-gold/5" : "border-cream-dark opacity-40"}`}
                >
                  <CreditCard
                    className={
                      paymentMethod === "card" ? "text-gold" : "text-ink"
                    }
                  />
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    Debit Card
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("momo")}
                  className={`flex-1 flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all duration-300 ${paymentMethod === "momo" ? "border-gold bg-gold/5" : "border-cream-dark opacity-40"}`}
                >
                  <Smartphone
                    className={
                      paymentMethod === "momo" ? "text-gold" : "text-ink"
                    }
                  />
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    Mobile Money
                  </span>
                </button>
              </div>

              <div className="p-4 bg-cream/20 border border-gold/5 rounded-2xl">
                <p className="text-[10px] text-ink/40 text-center font-medium uppercase tracking-widest">
                  External payment gateway will trigger <br /> upon creation of
                  order.
                </p>
              </div>
            </section>

            <button
              disabled={isProcessing}
              className="flex items-center justify-center w-full gap-3 py-4 text-xs font-bold tracking-[0.3em] text-cream transition-all bg-ink rounded-lg hover:bg-gold active:scale-95 disabled:bg-ink/40 uppercase shadow-2xl shadow-gold/10"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4" /> Synchronizing...
                </>
              ) : (
                `Complete Transaction `
              )}
            </button>
          </form>

          {/* RIGHT: SUMMARY */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="p-5 md:p-10 text-cream bg-ink shadow-2xl rounded-lg border border-white/5">
              <h2 className="mb-10 font-serif text-2xl uppercase tracking-widest border-b border-white/10 pb-4 text-gold">
                Product Summary
              </h2>
              <div className="space-y-6 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar mb-10">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-6 pb-6 border-b border-white/5"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative flex-shrink-0 w-14 h-14 overflow-hidden rounded-xl bg-white/5 border border-white/10">
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="object-contain p-2"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-bold tracking-wide text-white uppercase">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-cream/40 uppercase tracking-widest mt-1">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="font-serif italic text-gold">
                      ${item.totalPrice.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-4 text-[11px] font-bold uppercase tracking-[0.2em] text-cream/40">
                <div className="flex justify-between">
                  <span>Subtotal-2</span>
                  <span className="text-white italic font-serif text-base">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Logistics</span>
                  <span className="text-gold">Complimentary</span>
                </div>
                <div className="flex justify-between pt-8 mt-6 text-xl font-serif italic text-gold border-t border-white/10">
                  <span className="text-[11px] font-bold not-italic tracking-[0.4em] text-white">
                    Total
                  </span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-10 p-4 border border-white/20 rounded-xl text-center">
                <p className="text-[9px] text-white/70 uppercase tracking-[0.3em]">
                  Novarease Order Creation System
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopProduct;
