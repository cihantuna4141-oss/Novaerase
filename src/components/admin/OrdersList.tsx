"use client";
import React, { useEffect, useState } from "react";
import { Smartphone, MapPin, Hash, Package, ArrowUpRight } from "lucide-react";

const OrdersList = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((j) => setOrders(j.data));
  }, []);

  return (
    <div className="grid grid-cols-1 gap-6 pb-20">
      {orders.map((order: any) => (
        <div
          key={order.id}
          className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-8 border border-slate-200/60 shadow-sm flex flex-col xl:flex-row gap-6 md:gap-10"
        >
          {/* Customer Info */}
          <div className="w-full xl:w-80">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] font-black bg-emerald-500 text-white px-2 py-0.5 rounded shadow-sm">
                PAID
              </span>
              <span className="text-[11px] text-slate-400 font-mono italic">
                #{order.id.slice(-8)}
              </span>
            </div>
            <h3 className="mb-4 text-xl font-black md:text-2xl text-slate-900">
              {order.customerName}
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3 text-sm text-slate-500 bg-slate-50 rounded-xl">
                <Smartphone size={16} className="text-indigo-500" />
                <span className="truncate">{order.phone}</span>
              </div>
              <div className="flex items-center gap-3 p-3 text-sm text-slate-500 bg-slate-50 rounded-xl">
                <MapPin size={16} className="text-indigo-500" />
                <span className="truncate">
                  {order.city}, {order.address}
                </span>
              </div>
            </div>
          </div>

          {/* Contents - Horizontal scroll on very small screens if needed */}
          <div className="flex-grow p-4 border md:p-6 bg-slate-50/50 rounded-2xl border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
              Contents
            </p>
            <div className="space-y-3">
              {order.items.map((item: any, i: number) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-4 pb-2 text-sm border-b border-slate-200/50"
                >
                  <span className="font-bold truncate text-slate-700">
                    <span className="text-indigo-600">{item.quantity}x</span>{" "}
                    {item.penName}
                  </span>
                  <span className="font-mono text-slate-400 shrink-0">
                    GH₵ {item.price.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue & Actions */}
          <div className="flex flex-col justify-between gap-4 sm:flex-row xl:flex-col xl:w-64">
            <div className="flex-grow p-5 text-white shadow-lg bg-slate-900 rounded-2xl">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                Total
              </p>
              <p className="text-xl font-black text-indigo-400 md:text-2xl">
                GH₵ {order.totalAmount.toFixed(2)}
              </p>
            </div>
            <button className="flex items-center justify-center w-full gap-2 py-4 text-sm font-black transition-all bg-white border-2 border-slate-900 text-slate-900 rounded-2xl hover:bg-slate-900 hover:text-white shrink-0">
              Details <ArrowUpRight size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrdersList;
