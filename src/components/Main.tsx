"use client";
import { useState } from "react";
import Footer from "./Footer";
import Hero from "./Hero";
import HowTo from "./HowTo";
import Modal from "./Modal";
import Navbar from "./Navbar";
import OrderCTA from "./OrderCTA";
import Specs from "./Specs";
import VideoSection from "./VideoSection";
import { Loader2, PackageCheck, Truck, Clock, XCircle } from "lucide-react";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  PROCESSING: { label: "Processing", color: "text-amber-600 bg-amber-50",     icon: <Clock size={16} /> },
  SHIPPED:    { label: "Shipped",    color: "text-blue-600 bg-blue-50",       icon: <Truck size={16} /> },
  DELIVERED:  { label: "Delivered",  color: "text-emerald-600 bg-emerald-50", icon: <PackageCheck size={16} /> },
  CANCELLED:  { label: "Cancelled",  color: "text-red-500 bg-red-50",         icon: <XCircle size={16} /> },
};

const CARRIER_TRACKING_URLS: Record<string, (n: string) => string> = {
  UPS:   (n) => `https://www.ups.com/track?tracknum=${n}`,
  FedEx: (n) => `https://www.fedex.com/fedextrack/?trknbr=${n}`,
  USPS:  (n) => `https://tools.usps.com/go/TrackConfirmAction?tLabels=${n}`,
  DHL:   (n) => `https://www.dhl.com/en/express/tracking.html?AWB=${n}`,
};

const Main = () => {
  const [modalType, setModalType] = useState<"track" | "contact" | null>(null);
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [trackLoading, setTrackLoading] = useState(false);
  const [trackError, setTrackError] = useState("");
  const [trackedOrder, setTrackedOrder] = useState<any>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setTrackError("");
    setTrackedOrder(null);
    setTrackLoading(true);

    const res = await fetch(`/api/orders/track?orderNumber=${encodeURIComponent(orderNumber)}&email=${encodeURIComponent(email)}`);
    const json = await res.json();
    setTrackLoading(false);

    if (!res.ok) {
      setTrackError(json.error || "Order not found.");
    } else {
      setTrackedOrder(json.data);
    }
  };

  const handleTrackClose = () => {
    setModalType(null);
    setTrackedOrder(null);
    setTrackError("");
    setOrderNumber("");
    setEmail("");
  };

  const status = trackedOrder ? (STATUS_CONFIG[trackedOrder.orderStatus] ?? STATUS_CONFIG.PROCESSING) : null;

  return (
    <main className="bg-cream text-ink antialiased selection:bg-gold/30">
      <Navbar onOpenModal={setModalType} />
      <Hero />
      <Specs />
      <HowTo />
      <VideoSection />
      <OrderCTA />
      <Footer onOpenModal={setModalType} />

      {/* Modals */}
      <Modal
        isOpen={modalType === "track"}
        onClose={handleTrackClose}
        title="Track Your Order"
      >
        {!trackedOrder ? (
          <form onSubmit={handleTrack} className="space-y-4">
            <input
              type="text"
              placeholder="Order Number (e.g. NVR-ABC123)"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              required
              className="modal-input"
            />
            <input
              type="email"
              placeholder="Email used at checkout"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="modal-input"
            />
            {trackError && (
              <p className="text-xs text-red-500 font-semibold">{trackError}</p>
            )}
            <button
              type="submit"
              disabled={trackLoading}
              className="w-full bg-ink text-cream py-4 rounded-xl font-bold mt-4 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {trackLoading ? <><Loader2 size={16} className="animate-spin" /> Searching...</> : "Track Order"}
            </button>
          </form>
        ) : (
          <div className="space-y-5">
            {/* Status Badge */}
            <div className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-sm ${status?.color}`}>
              {status?.icon}
              {status?.label}
            </div>

            {/* Order Info */}
            <div className="bg-ink/5 rounded-xl p-4 space-y-1">
              <p className="text-[10px] text-gold uppercase tracking-widest font-bold">Order Number</p>
              <p className="font-bold text-ink">{trackedOrder.orderNumber}</p>
            </div>

            {/* Items */}
            <div className="space-y-2">
              <p className="text-[10px] text-gold uppercase tracking-widest font-bold">Items</p>
              {trackedOrder.items.map((item: any) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-ink/70">{item.productName} × {item.quantity}</span>
                  <span className="font-semibold">${item.totalPrice.toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="flex justify-between text-sm border-t border-ink/10 pt-3">
              <span className="font-bold text-ink uppercase tracking-widest text-[10px]">Total</span>
              <span className="font-bold text-ink">${trackedOrder.totalAmount.toFixed(2)}</span>
            </div>

            {/* Tracking Number */}
            {trackedOrder.trackingNumber && (
              <div className="bg-blue-50 rounded-xl p-4 space-y-2">
                <p className="text-[10px] text-blue-600 uppercase tracking-widest font-bold">Tracking</p>
                <p className="text-sm font-bold text-ink">{trackedOrder.shippingCarrier}: {trackedOrder.trackingNumber}</p>
                <a
                  href={CARRIER_TRACKING_URLS[trackedOrder.shippingCarrier]?.(trackedOrder.trackingNumber) ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-xs font-bold text-blue-600 underline"
                >
                  Track on {trackedOrder.shippingCarrier} →
                </a>
              </div>
            )}

            {/* Shipping */}
            <div className="bg-ink/5 rounded-xl p-4 space-y-1">
              <p className="text-[10px] text-gold uppercase tracking-widest font-bold">Shipping To</p>
              <p className="text-sm text-ink/70 leading-relaxed">
                {trackedOrder.streetName}{trackedOrder.houseAddress ? `, ${trackedOrder.houseAddress}` : ""}<br />
                {trackedOrder.town}, {trackedOrder.state} {trackedOrder.zipCode}
              </p>
            </div>

            <button
              onClick={() => { setTrackedOrder(null); setOrderNumber(""); setEmail(""); }}
              className="w-full border border-ink/20 text-ink py-3 rounded-xl font-bold text-sm hover:bg-ink/5 transition"
            >
              Track Another Order
            </button>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={modalType === "contact"}
        onClose={() => setModalType(null)}
        title="Get in Touch"
      >
        <input type="text" placeholder="Name" className="modal-input" />
        <input type="email" placeholder="Email" className="modal-input" />
        <textarea placeholder="Message" className="modal-input min-h-[100px]" />
        <button className="w-full bg-ink text-cream py-4 rounded-xl font-bold mt-4">
          Send Message
        </button>
      </Modal>
    </main>
  );
};

export default Main;
