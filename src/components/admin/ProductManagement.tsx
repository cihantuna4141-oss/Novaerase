"use client";

import React, { useState, useEffect } from "react";
import CreatePenForm from "./CreatePenForm";

import { Loader2, Plus, Box, X, Search, Filter } from "lucide-react";
import ProductsList from "./ProductsList";

const ProductsManagement = () => {
  const [pens, setPens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPens = async () => {
    try {
      const res = await fetch("/api/pens");
      const json = await res.json();
      if (json.success) setPens(json.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPens();
  }, []);

  return (
    <div className="space-y-6 duration-700 md:space-y-8 animate-in fade-in slide-in-from-bottom-4">
      {/* RESPONSIVE TOP BAR */}
      <div className="flex flex-col justify-between gap-4 p-4 bg-white border shadow-sm lg:flex-row md:p-6 rounded-2xl border-slate-200/60">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 bg-indigo-600 shadow-lg md:w-14 md:h-14 rounded-2xl shrink-0">
            <Box className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight md:text-2xl text-slate-900">
              Inventory
            </h2>
            <p className="text-xs font-medium md:text-sm text-slate-400">
              Manage your pen collection
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 sm:items-center">
          <div className="relative w-auto">
            <Search
              className="absolute -translate-y-1/2 left-3 top-1/2 text-slate-400"
              size={16}
            />
            <input
              placeholder="Search..."
              className="w-full sm:w-64 pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-6 py-2.5 font-bold text-white transition-all bg-slate-900 hover:bg-indigo-600 rounded-xl active:scale-95"
          >
            <Plus size={18} /> Add{" "}
            <span className="hidden sm:inline">Product</span>
          </button>
        </div>
      </div>

      {/* TABLE SECTION (Must have overflow-x-auto) */}
      <section className="pb-10 overflow-x-hidden">
        {/* Wrap your ProductsList in a div with min-width to prevent squishing on mobile */}
        <div className="l">
          {loading ? (
            <div className="flex flex-col items-center py-20">
              <Loader2 className="text-indigo-600 animate-spin" />
            </div>
          ) : (
            <ProductsList
              pens={pens}
              onRefresh={fetchPens}
              onEdit={(pen) => {
                console.log("Edit requested for:", pen);
              }}
            />
          )}
        </div>
      </section>

      {/* RESPONSIVE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white border rounded-3xl shadow-2xl animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b bg-white/80 backdrop-blur-md">
              <h3 className="text-lg font-black text-slate-900">
                New Pen Entry
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 md:p-8">
              <CreatePenForm
                onSuccess={fetchPens}
                onClose={() => setIsModalOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsManagement;
