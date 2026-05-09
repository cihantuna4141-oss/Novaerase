"use client";
import React, { useEffect, useState } from "react";
import { Smartphone, MapPin, Hash, Package, ArrowUpRight } from "lucide-react";

const OrdersList = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("/api/orders").then(r => r.json()).then(j => setOrders(j.data));
  }, []);

  return (
    <div className="grid grid-cols-1 gap-6 pb-20">
      {orders.map((order: any) => (
        <div key={order.id} className="bg-white rounded-[2rem] p-8 border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow flex flex-col xl:flex-row gap-10">
          
          <div className="xl:w-80">
            <div className="flex items-center gap-2 mb-4">
               <span className="text-[10px] font-black bg-emerald-500 text-white px-2.5 py-1 rounded-lg shadow-sm">PAID</span>
               <div className="flex items-center gap-1 text-slate-400 font-mono text-[11px]">
                  <Hash size={12} /> {order.id.toUpperCase().slice(-8)}
               </div>
            </div>
            <h3 className="mb-6 text-2xl font-black text-slate-900">{order.customerName}</h3>
            <div className="space-y-3">
               <div className="flex items-center gap-3 p-3 text-sm text-slate-500 bg-slate-50 rounded-xl">
                  <Smartphone size={16} className="text-indigo-500" />
                  <span className="font-medium">{order.phone}</span>
               </div>
               <div className="flex items-center gap-3 p-3 text-sm text-slate-500 bg-slate-50 rounded-xl">
                  <MapPin size={16} className="text-indigo-500" />
                  <span className="font-medium">{order.city}, {order.address}</span>
               </div>
            </div>
          </div>

          <div className="flex-grow p-6 border bg-slate-50/50 rounded-3xl border-slate-100">
             <div className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6">
                <Package size={14} /> Shipment Contents
             </div>
             <div className="space-y-3">
                {order.items.map((item: any, i: number) => (
                  <div key={i} className="flex items-center justify-between pb-2 text-sm border-b border-slate-200/50">
                    <span className="font-bold text-slate-700">
                      <span className="mr-2 text-indigo-600">{item.quantity}x</span> {item.penName}
                    </span>
                    <span className="font-mono text-slate-400">GH₵ {item.price.toFixed(2)}</span>
                  </div>
                ))}
             </div>
          </div>

          <div className="flex flex-col justify-between xl:w-64">
             <div className="p-6 text-white shadow-xl bg-slate-900 rounded-3xl shadow-slate-200">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Total Revenue</p>
                <p className="text-2xl font-black text-indigo-400">GH₵ {order.totalAmount.toFixed(2)}</p>
             </div>
             <button className="flex items-center justify-center w-full gap-2 py-4 mt-4 text-sm font-black transition-all bg-white border-2 border-slate-900 text-slate-900 rounded-2xl hover:bg-slate-900 hover:text-white group">
                Full Details <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
             </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default OrdersList;