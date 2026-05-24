"use client";
import React from "react";

interface FooterProps {
  onOpenModal: (type: "track" | "contact") => void;
}

const Footer = ({ onOpenModal }: FooterProps) => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-cream-dark border-t border-ink/10 px-8 py-9 md:px-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <span className="text-lg font-bold tracking-[0.2em] uppercase text-ink">
          Novarease
        </span>

        <div className="flex flex-wrap gap-4 md:gap-8 justify-center items-center">
          <button
            onClick={() => onOpenModal("contact")}
            className="text-[10px] font-semibold text-ink/60 hover:text-gold transition-colors tracking-widest uppercase"
          >
            Privacy Policy
          </button>
          <button
            onClick={() => onOpenModal("contact")}
            className="text-[10px] font-semibold text-ink/60 hover:text-gold transition-colors tracking-widest uppercase"
          >
            Terms
          </button>
          <button
            onClick={() => onOpenModal("contact")}
            className="text-[10px] font-semibold text-ink/60 hover:text-gold transition-colors tracking-widest uppercase"
          >
            Contact
          </button>
          <button
            onClick={() => onOpenModal("track")}
            className="text-[10px] font-semibold text-ink/60 hover:text-gold transition-colors tracking-widest uppercase"
          >
            Track Order
          </button>
         
        </div>

        <p className="text-[11px] text-ink/70 tracking-wider">
          © {year} Novarease by Armas. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
