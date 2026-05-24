"use client";
import React, { useEffect, useState } from "react";
import {
  Smartphone,
  MapPin,
  Hash,
  Package,
  ArrowUpRight,
  X,
  User,
  CreditCard,
  Eraser,
  ShoppingBag,
  Loader2,
} from "lucide-react";

const OrdersList = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); // Track loading state
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/orders");
        const json = await response.json();

        if (json && json.success && Array.isArray(json.data)) {
          setOrders(json.data);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // 1. SHOW LOADING STATE
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Loader2 className="text-gold animate-spin" size={32} />
        <p className="text-[10px] font-bold text-gold uppercase tracking-[0.4em] animate-pulse">
          Synchronizing Orders
        </p>
      </div>
    );
  }

  // 2. SHOW EMPTY STATE
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center animate-in fade-in duration-700">
        <div className="w-20 h-20 bg-white border border-gold/10 rounded-[2rem] flex items-center justify-center mb-6 shadow-sm">
          <ShoppingBag className="text-gold/20" size={32} strokeWidth={1} />
        </div>
        <h3 className="font-serif text-2xl text-ink mb-2">
          No Client Requests
        </h3>
        <p className="text-[10px] font-bold text-gold uppercase tracking-[0.2em] max-w-[200px] leading-relaxed">
          The order log is currently empty.
        </p>
      </div>
    );
  }

  // 3. SHOW LIST (If not loading and not empty)
  return (
    <div className="grid grid-cols-1 gap-6 pb-20 md:grid-cols-2 xl:grid-cols-3">
      {orders.map((order: any) => (
        <div
          key={order.id}
          className="flex flex-col items-start justify-between gap-6 p-6 transition-all bg-white border border-gold/10 shadow-sm rounded-[2rem] hover:shadow-xl hover:shadow-gold/5 group"
        >
          <div className="flex items-center w-full gap-4">
            <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-cream">
              <span className="text-[10px] font-bold text-gold uppercase tracking-tighter italic">
                #{order.id.slice(-6)}
              </span>
            </div>
            <div className="flex-grow">
              <h3 className="font-serif text-xl text-ink leading-tight uppercase tracking-wide">
                {order.customerName}
              </h3>
              <p className="text-[10px] font-bold text-gold uppercase tracking-[0.2em] mt-1">
                {order.items?.length || 0} Products • GH₵{" "}
                {order.totalAmount.toFixed(2)}
              </p>
            </div>
          </div>

          <button
            onClick={() => setSelectedOrder(order)}
            className="flex items-center justify-center w-full gap-2 py-3 text-[11px] font-bold tracking-widest text-cream uppercase transition-all bg-ink rounded-xl hover:bg-gold active:scale-95"
          >
            Review Request <ArrowUpRight size={16} />
          </button>
        </div>
      ))}

      {/* --- LUXURY ORDER MODAL --- */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 duration-500 bg-ink/60 backdrop-blur-md animate-in fade-in"
            onClick={() => setSelectedOrder(null)}
          />

          <div className="relative w-full max-w-2xl overflow-hidden duration-500 bg-cream rounded-[2.5rem] shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between px-10 py-6 border-b border-gold/10 bg-white/50">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-ink text-gold shadow-lg shadow-gold/10">
                  <User size={22} />
                </div>
                <div>
                  <h3 className="font-serif text-2xl text-ink uppercase tracking-wider">
                    {selectedOrder.customerName}
                  </h3>
                  <p className="text-[9px] font-bold text-gold uppercase tracking-[0.3em]">
                    Reference: {selectedOrder.id.toUpperCase()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="flex items-center justify-center w-10 h-10 transition rounded-full hover:bg-ink hover:text-cream text-ink/30"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-10 max-h-[70vh] overflow-y-auto space-y-10">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="p-5 border bg-white rounded-[2rem] border-gold/10 flex items-center gap-4">
                  <Smartphone size={20} className="text-gold" />
                  <div>
                    <p className="text-[9px] font-bold text-gold uppercase tracking-widest mb-1">
                      Contact
                    </p>
                    <span className="text-sm font-bold text-ink">
                      {selectedOrder.phone}
                    </span>
                  </div>
                </div>
                <div className="p-5 border bg-white rounded-[2rem] border-gold/10 flex items-center gap-4">
                  <MapPin size={20} className="text-gold" />
                  <div>
                    <p className="text-[9px] font-bold text-gold uppercase tracking-widest mb-1">
                      Destination
                    </p>
                    <span className="text-sm font-bold text-ink">
                      {selectedOrder.city}, {selectedOrder.address}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-8 border bg-white/40 rounded-[2.5rem] border-gold/10">
                <p className="text-[10px] font-black text-ink/30 uppercase tracking-[0.4em] mb-6 flex items-center gap-2">
                  <Eraser size={14} className="text-gold" /> Shipment Manifest
                </p>
                <div className="space-y-4">
                  {selectedOrder.items.map((item: any, i: number) => (
                    <div
                      key={i}
                      className="flex items-center justify-between pb-4 border-b border-gold/5 last:border-0 last:pb-0"
                    >
                      <span className="text-sm font-bold text-ink">
                        <span className="mr-3 text-gold italic font-serif text-base">
                          {item.quantity}x
                        </span>
                        {item.penName}
                      </span>
                      <span className="font-mono text-xs font-bold text-ink/40">
                        GH₵ {item.price.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between p-8 bg-ink rounded-[2.5rem] text-cream shadow-2xl shadow-gold/10">
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                  <div className="flex items-center justify-center w-14 h-14 bg-white/5 rounded-2xl border border-white/5">
                    <CreditCard size={26} className="text-gold" />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-gold uppercase tracking-widest mb-1">
                      Payment method
                    </p>
                    <p className="text-xs font-bold tracking-widest uppercase">
                      {selectedOrder.paymentMethod}
                    </p>
                  </div>
                </div>
                <div className="text-center md:text-right">
                  <p className="text-[10px] font-bold text-gold uppercase tracking-widest mb-1">
                    Revenue
                  </p>
                  <p className="text-4xl font-serif italic text-gold">
                    GH₵ {selectedOrder.totalAmount.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 p-8 border-t border-gold/10 bg-white/30">
              <button className="flex-1 py-4 text-[11px] font-bold tracking-[0.2em] text-cream uppercase bg-ink rounded-2xl hover:bg-gold transition-all duration-300">
                Finalize Shipment
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="flex-1 py-4 text-[11px] font-bold tracking-[0.2em] text-ink uppercase bg-white border border-gold/20 rounded-2xl hover:bg-cream transition-all"
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
