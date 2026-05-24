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

const Main = () => {
  const [modalType, setModalType] = useState<"track" | "contact" | null>(null);

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
        onClose={() => setModalType(null)}
        title="Track Your Order"
      >
        <input type="text" placeholder="Order Number" className="modal-input" />
        <input type="email" placeholder="Email" className="modal-input" />
        <button className="w-full bg-ink text-cream py-4 rounded-xl font-bold mt-4">
          Track
        </button>
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
