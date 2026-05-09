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
    <div className="space-y-8 duration-700 animate-in fade-in slide-in-from-bottom-4">
      {/* PROFESSIONAL TOP BAR */}
      <div className="flex flex-col justify-between gap-6 p-4 bg-white border shadow-sm md:flex-row md:items-center rounded-xl border-slate-200/60">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center bg-indigo-600 shadow-lg w-14 h-14 rounded-2xl shadow-indigo-200">
            <Box className="text-white" size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900">
              Inventory
            </h2>
            <p className="text-sm font-medium text-slate-400">
              Manage and track your pen collection
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden xl:block">
            <Search
              className="absolute -translate-y-1/2 left-3 top-1/2 text-slate-400"
              size={16}
            />
            <input
              placeholder="Search inventory..."
              className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm w-64 outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
            />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 font-bold text-white transition-all shadow-xl bg-slate-900 hover:bg-indigo-600 rounded-xl shadow-slate-200 active:scale-95"
          >
            <Plus size={18} /> Add Product
          </button>
        </div>
      </div>

      {/* TABLE SECTION */}
      <section className="pb-10">
        {loading ? (
          <div className="flex flex-col items-center gap-4 py-40">
            <Loader2 className="text-indigo-600 animate-spin" size={32} />
            <p className="text-sm font-bold text-slate-400 animate-pulse">
              SYNCING DATABASE...
            </p>
          </div>
        ) : (
          <ProductsList
            pens={pens}
            onRefresh={fetchPens}
            onEdit={(p) => console.log("Edit:", p)}
          />
        )}
      </section>

      {/* LUXURY MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div
            className="absolute inset-0 duration-300 bg-slate-900/40 backdrop-blur-md animate-in fade-in"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl border border-white/20 animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 overflow-hidden">
            <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 bg-slate-50/50">
              <div>
                <h3 className="text-xl font-black text-slate-900">
                  New Pen Entry
                </h3>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">
                  Inventory Management System
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex items-center justify-center w-10 h-10 transition rounded-full hover:bg-slate-200 text-slate-400"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-10 max-h-[75vh] overflow-y-auto custom-scrollbar">
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
