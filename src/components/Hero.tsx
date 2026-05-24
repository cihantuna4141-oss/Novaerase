"use client";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-[70vh] flex flex-col items-center justify-center text-center px-6 pt-32 pb-20 overflow-hidden bg-cream-dark">
      {/* Background Overlay */}
      <div className="absolute inset-0 z-0 opacity-40 bg-[url('/hero-bg.jpg')] bg-cover bg-center" />
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-cream/55 via-cream/40 to-cream/70" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-20"
      >
        <p className="text-[10px] tracking-[0.34em] text-gold uppercase mb-5 font-semibold">
          by Armas — Precision Highlight Removal
        </p>
        <h4 className="hero-title font-extralight text-ink leading-loose">
          Novarease
          <span className="block font-sans text-xs md:text-base tracking-[0.4em] text-gold/75 mt-3">
            Erase the unwanted, preserve the essential
          </span>
        </h4>
        <p className="mt-8 text-sm md:text-base text-ink/50 tracking-wide font-light max-w-lg mx-auto">
          Remove Highlights Cleanly & Instantly. <br /> No damage • Dries
          quickly • Safe for all paper types.
        </p>
        <a href="#order" className="hero-cta">
          Order Now
        </a>
      </motion.div>

      <div className="scroll-hint">
        <span className="">Scroll</span>
        <ChevronDown size={20} />
      </div>
    </section>
  );
};

export default Hero;
