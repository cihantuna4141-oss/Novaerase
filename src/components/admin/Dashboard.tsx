"use client";

import React, { useState } from "react";
import { ShoppingCart, Package, LogOut, PenTool, Menu, X } from "lucide-react";
import ProductsManagement from "./ProductManagement";
import OrdersList from "./OrdersList";

type TabType = "products" | "orders";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("products");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* --- MOBILE HEADER --- */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-16 px-4 bg-white border-b lg:hidden">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-600 rounded-lg">
            <PenTool className="w-4 h-4 text-white" />
          </div>
          <span className="font-black tracking-tight text-gray-900">LUXE</span>
        </div>
        <button onClick={toggleSidebar} className="p-2 text-gray-600">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* --- SIDEBAR --- */}
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden" 
          onClick={toggleSidebar}
        />
      )}

      <aside className={`
        fixed lg:sticky top-0 left-0 h-screen bg-white border-r w-72 z-50 transition-transform duration-300
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        flex flex-col
      `}>
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
            onClick={() => { setActiveTab("products"); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold text-sm ${
              activeTab === "products" ? "bg-blue-600 text-white shadow-lg" : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <Package size={20} /> Pen Products
          </button>

          <button
            onClick={() => { setActiveTab("orders"); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold text-sm ${
              activeTab === "orders" ? "bg-blue-600 text-white shadow-lg" : "text-gray-500 hover:bg-gray-50"
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
      <main className="flex-grow p-4 mt-16 md:p-10 lg:mt-0">
        <header className="mb-6 md:mb-10">
          <h1 className="text-2xl font-black text-gray-900 capitalize md:text-3xl">
            {activeTab === "products" ? "Inventory Management" : "Incoming Orders"}
          </h1>
        </header>

        {activeTab === "products" ? <ProductsManagement /> : <OrdersList />}
      </main>
    </div>
  );
}