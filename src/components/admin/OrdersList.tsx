"use client";
import React, { useEffect, useState } from "react";
import { Smartphone, MapPin, Hash, Package, ArrowUpRight, X, User, CreditCard } from "lucide-react";

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null); // State for the Modal

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((j) => setOrders(j.data));
  }, []);

  return (
    <div className="grid grid-cols-1 pb-20 gap-0p-4 md:grid-cols-2 lg:grid-cols-3">
      {orders.map((order: any) => (
        <div
          key={order.id}
          className="flex flex-col items-center justify-between gap-4 p-4 transition-colors bg-white border shadow-sm rounded-xl border-slate-200/60 hover:border-indigo-200"
        >
          {/* Compact Info */}
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-start gap-2">
              <span className="text-[10px] font-black bg-emerald-500 text-white px-2 py-0.5 rounded shadow-sm">
                PAID
              </span>
              <span className="text-[11px] text-slate-400 font-mono italic">
                #{order.id.slice(-8)}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-black leading-tight text-slate-900">
                {order.customerName}
              </h3>
              <p className="text-xs font-medium text-slate-400">
                {order.items?.length || 0} items • GH₵ {order.totalAmount.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Action Button */}
          <button 
            onClick={() => setSelectedOrder(order)}
            className="flex items-center justify-center gap-2 py-2.5 text-sm font-black transition-all bg-white border-2 px-3 border-slate-900 text-slate-900 rounded-2xl hover:bg-slate-900 hover:text-white shrink-0 active:scale-95"
          >
            Details <ArrowUpRight size={18} />
          </button>
        </div>
      ))}

      {/* --- ORDER DETAILS MODAL --- */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 duration-300 bg-slate-900/40 backdrop-blur-md animate-in fade-in"
            onClick={() => setSelectedOrder(null)} 
          />
          
          {/* Modal Box */}
          <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 text-white bg-indigo-600 rounded-xl">
                  <User size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">{selectedOrder.customerName}</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Order #{selectedOrder.id.toUpperCase().slice(-8)}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="flex items-center justify-center w-10 h-10 transition rounded-full hover:bg-slate-200 text-slate-400"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-8 max-h-[70vh] overflow-y-auto space-y-8">
              
              {/* 1. Customer Contact & Address */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex items-center gap-4 p-4 text-sm border text-slate-600 bg-slate-50 rounded-2xl border-slate-100">
                  <Smartphone size={20} className="text-indigo-500 shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Contact</p>
                    <span className="font-bold">{selectedOrder.phone}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 text-sm border text-slate-600 bg-slate-50 rounded-2xl border-slate-100">
                  <MapPin size={20} className="text-indigo-500 shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Delivery Address</p>
                    <span className="font-bold">{selectedOrder.city}, {selectedOrder.address}</span>
                  </div>
                </div>
              </div>

              {/* 2. Order Items (Contents) */}
              <div className="p-6 border bg-slate-50/30 rounded-3xl border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Package size={14} /> Shipment Contents
                </p>
                <div className="space-y-3">
                  {selectedOrder.items.map((item: any, i: number) => (
                    <div key={i} className="flex items-center justify-between pb-3 text-sm border-b border-slate-200/50 last:border-0 last:pb-0">
                      <span className="font-bold text-slate-700">
                        <span className="mr-2 text-indigo-600 px-2 py-0.5 bg-indigo-50 rounded-lg">{item.quantity}x</span> 
                        {item.penName}
                      </span>
                      <span className="font-mono font-bold text-slate-400">GH₵ {item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Payment Summary (Dark Block) */}
              <div className="flex flex-col md:flex-row items-center justify-between p-6 bg-slate-900 rounded-[2rem] text-white shadow-xl shadow-indigo-100">
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                  <div className="flex items-center justify-center w-12 h-12 bg-white/10 rounded-2xl">
                    <CreditCard size={24} className="text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Payment via</p>
                    <p className="text-sm font-black tracking-wider uppercase">{selectedOrder.paymentMethod}</p>
                  </div>
                </div>
                <div className="text-center md:text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Total Revenue</p>
                  <p className="text-3xl font-black text-indigo-400">GH₵ {selectedOrder.totalAmount.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-6 border-t bg-slate-50">
               <button className="flex-1 py-4 text-sm font-black text-white transition bg-indigo-600 shadow-lg rounded-2xl hover:bg-indigo-700 active:scale-95 shadow-indigo-100">
                 Mark as Delivered
               </button>
               <button 
                 onClick={() => setSelectedOrder(null)}
                 className="flex-1 py-4 text-sm font-black transition bg-white border-2 border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 active:scale-95"
               >
                 Close
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersList;