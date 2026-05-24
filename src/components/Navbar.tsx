"use client";
import React from "react";

interface NavProps {
  onOpenModal: (type: "track" | "contact") => void;
}

const Navbar = ({ onOpenModal }: NavProps) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-cream/88 backdrop-blur-lg border-b-2 border-gold/20 md:px-12">
      <div className=" max-w-7xl m-auto flex items-center justify-between">
        <span className="text-lg font-bold tracking-[0.22em] uppercase text-ink">
          Novarease
        </span>
        <div className="flex gap-4">
          <button
            onClick={() => onOpenModal("track")}
            className="px-5 py-2 rounded-full text-xs font-semibold tracking-wider border border-ink/25 hover:bg-ink/5 transition-all"
          >
            Track Order
          </button>
          <button
            onClick={() => onOpenModal("contact")}
            className="px-5 py-2 rounded-full text-xs font-semibold tracking-wider bg-ink text-cream hover:bg-zinc-800 transition-all"
          >
            Contact
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
