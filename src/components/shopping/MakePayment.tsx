"use client";

import React from "react";
import { CheckCircle2, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const MakePayment = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
        <div className="p-6 mb-6 bg-green-100 rounded-full">
          <CheckCircle2 className="w-20 h-20 text-green-600" />
        </div>
        <h1 className="mb-2 text-4xl font-extrabold text-gray-900">Order Confirmed!</h1>
        <p className="max-w-md mb-10 text-gray-500">
          Thank you for your purchase. We’ve received your order and are currently preparing your luxury pen for shipment.
        </p>

        <div className="grid w-full max-w-md grid-cols-1 gap-4 sm:grid-cols-2">
          <Link href="/" className="flex items-center justify-center gap-2 py-2.5 font-bold text-white transition bg-gray-900 rounded-2xl hover:bg-blue-600">
            <ShoppingBag size={20} /> Back to Shop
          </Link>
          <button className="flex items-center justify-center gap-2 py-2.5 font-bold text-gray-700 transition bg-white border border-gray-200 rounded-2xl hover:bg-gray-50">
            View Receipt <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default MakePayment;