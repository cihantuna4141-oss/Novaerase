"use client";

import React, { useState } from "react";
import {
  ShoppingCart,
  Package,
  PlusCircle,
  LogOut,
  PenTool,
} from "lucide-react";
import ProductsManagement from "./ProductManagement";
import OrdersList from "./OrdersList";

type TabType = "products" | "orders";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("products");

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* --- SIDEBAR --- */}
      <aside className="sticky top-0 flex flex-col h-screen bg-white border-r w-72">
        <div className="flex items-center gap-3 p-8">
          <div className="p-2 bg-blue-600 rounded-lg">
            <PenTool className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black tracking-tight text-gray-900">
            LUXE<span className="text-blue-600">ADMIN</span>
          </span>
        </div>

        <nav className="flex-grow px-4 space-y-1">
          <button
            onClick={() => setActiveTab("products")}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold text-sm ${
              activeTab === "products"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                : "text-gray-500 hover:bg-gray-50 hover:text-blue-600"
            }`}
          >
            <Package size={20} /> Pen Products
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold text-sm ${
              activeTab === "orders"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                : "text-gray-500 hover:bg-gray-50 hover:text-blue-600"
            }`}
          >
            <ShoppingCart size={20} /> Customer Orders
          </button>
        </nav>

        <div className="p-6 text-gray-400 border-t">
          <button className="flex items-center gap-3 px-6 text-sm font-bold transition hover:text-red-500">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* --- DASH CONTENT --- */}
      <main className="flex-grow p-10">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-gray-900 capitalize">
            {activeTab === "products"
              ? "Inventory Management"
              : "Incoming Orders"}
          </h1>
        </header>

        {activeTab === "products" ? <ProductsManagement /> : <OrdersList />}
      </main>
    </div>
  );
}
