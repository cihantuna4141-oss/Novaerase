"use client";

import React, { useState } from "react";
import {
  ShoppingBag,
  Layers,
  LogOut,
  Eraser,
  Menu,
  X,
  ChevronRight,
  User,
} from "lucide-react";
import ProductsManagement from "./ProductManagement";
import OrdersList from "./OrdersList";

type TabType = "products" | "orders";

export default function NovareaseDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("products");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex min-h-screen bg-[#F5F2EB]">
      {" "}
      {/* Var --cream */}
      {/* --- MOBILE HEADER --- */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-20 px-6 bg-[#F5F2EB]/80 backdrop-blur-md border-b border-gold/10 lg:hidden">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#1A1A18] rounded-lg">
            <Eraser className="w-4 h-4 text-[#B8973A]" />
          </div>
          <span className="font-serif text-xl tracking-widest uppercase text-[#1A1A18]">
            Novarease
          </span>
        </div>
        <button onClick={toggleSidebar} className="p-2 text-[#1A1A18]">
          {isSidebarOpen ? (
            <X size={26} strokeWidth={1.5} />
          ) : (
            <Menu size={26} strokeWidth={1.5} />
          )}
        </button>
      </div>
      {/* --- SIDEBAR --- */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      <aside
        className={`
        fixed lg:sticky top-0 left-0 h-screen pb-28 md:pb-4 bg-[#EDE9DF] border-r-2 border-black/5 w-72 z-50 transition-transform duration-500 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        flex flex-col
      `}
      >
        {/* Brand Identity */}
        <div className="flex flex-col items-center gap-2 py-12 border-b border-black/5">
          <div className="p-3 bg-[#1A1A18] rounded-2xl shadow-xl shadow-gold/5">
            <Eraser className="w-6 h-6 text-[#B8973A]" />
          </div>
          <div className="mt-4 text-center">
            <span className="font-serif text-2xl tracking-[0.2em] uppercase text-[#1A1A18]">
              Novarease
            </span>
            <p className="text-[10px] tracking-[0.3em] font-bold text-[#B8973A] uppercase mt-1">
              Admin Portal
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-grow px-6 mt-10 space-y-3">
          <SidebarLink
            icon={<Layers size={18} />}
            label="Inventory"
            active={activeTab === "products"}
            onClick={() => {
              setActiveTab("products");
              setIsSidebarOpen(false);
            }}
          />
          <SidebarLink
            icon={<ShoppingBag size={18} />}
            label="Customer Orders"
            active={activeTab === "orders"}
            onClick={() => {
              setActiveTab("orders");
              setIsSidebarOpen(false);
            }}
          />
        </nav>

        {/* Admin Footer */}
        <div className="p-8 border-t flex flex-col items-start gap-3 border-black/5 bg-[#F5F2EB]/30">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#1A1A18] flex items-center justify-center text-[#B8973A] font-bold text-xs border border-gold/20">
              A
            </div>
            <div>
              <p className="text-xs font-bold text-ink tracking-wide">
                Armas Admin
              </p>
              <p className="text-[10px] text-ink/40">Superuser</p>
            </div>
          </div>
          <button className="flex items-center  gap-3 text-[11px] font-bold tracking-widest text-red-500 uppercase transition hover:text-blue-500">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>
      {/* --- MAIN DASHBOARD CONTENT --- */}
      <main className="flex-grow p-4 mt-20 md:p-12 lg:mt-0 overflow-x-hidden">
        <header className="flex flex-col justify-between gap-4 mb-10 md:flex-row md:items-end">
          <div>
            <p className="text-[10px] tracking-[0.3em] font-bold text-gold uppercase mb-2">
              Management Overview
            </p>
            <h1 className="font-serif text-4xl text-ink md:text-5xl lg:text-6xl">
              {activeTab === "products" ? "The Collection" : "Client Requests"}
            </h1>
          </div>

          {/* Quick Stats Summary */}
          <div className="flex gap-6">
            <div className="text-right">
              <p className="text-[10px] text-ink/40 uppercase tracking-widest font-bold">
                System Status
              </p>
              <p className="text-xs font-bold text-emerald-600 uppercase flex items-center gap-2 justify-end">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />{" "}
                Live
              </p>
            </div>
          </div>
        </header>

        {/* Dynamic Content View */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
          {activeTab === "products" ? <ProductsManagement /> : <OrdersList />}
        </section>
      </main>
    </div>
  );
}

/* Sidebar Helper Component for Luxury Feel */
function SidebarLink({
  icon,
  label,
  active,
  onClick,
}: {
  icon: any;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-300 font-bold text-[11px] uppercase tracking-widest ${
        active
          ? "bg-[#1A1A18] text-[#F5F2EB] shadow-2xl shadow-black/10"
          : "text-ink/40 hover:bg-black/5 hover:text-ink"
      }`}
    >
      <div className="flex items-center gap-4">
        <span className={active ? "text-[#B8973A]" : "text-inherit"}>
          {icon}
        </span>
        {label}
      </div>
      {active && <ChevronRight size={14} className="text-[#B8973A]" />}
    </button>
  );
}
