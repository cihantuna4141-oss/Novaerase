"use client";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-6 pt-32 pb-20 overflow-hidden bg-cream-dark">
      {/* Background Overlay */}
      <div className="absolute inset-0 z-0 opacity-40 bg-[url('/hero-bg.jpg')] bg-cover bg-center" />
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-cream/55 via-cream/40 to-cream/70" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-20 max-w-4xl"
      >
        <p className="text-[10px] tracking-[0.34em] text-gold uppercase mb-5 font-semibold">
          by Armas — Precision Highlight Removal
        </p>
        <h1 className="font-serif text-6xl md:text-9xl font-light tracking-[0.22em] uppercase text-ink leading-none">
          Novarease
          <span className="block font-sans text-xs md:text-base tracking-[0.4em] text-gold/75 mt-3">
            Erase the unwanted, preserve the essential
          </span>
        </h1>
        <p className="mt-8 text-sm md:text-base text-ink/50 tracking-wide font-light max-w-lg mx-auto">
          Remove Highlights Cleanly & Instantly. No damage • Dries quickly •
          Safe for all paper types.
        </p>
        <a
          href="#order"
          className="mt-12 inline-block px-12 py-4 rounded-full bg-ink text-cream text-[10px] tracking-[0.18em] uppercase font-medium hover:bg-gold transition-colors duration-300"
        >
          Order Now
        </a>
      </motion.div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-ink/30 animate-bounce">
        <span className="text-[10px] tracking-widest uppercase">Scroll</span>
        <ChevronDown size={20} />
      </div>
    </section>
  );
};

export default Hero;
