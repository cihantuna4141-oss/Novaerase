"use client";
import { motion, Variants } from "framer-motion";
import { ChevronDown } from "lucide-react";

const Hero = () => {
  // Function to handle the custom scroll
  const handleScroll = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default anchor jump
    window.scrollBy({
      top: window.innerHeight, // Scrolls down one full screen height
      behavior: "smooth",
    });
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="relative min-h-[75vh] md:min-h-screen flex flex-col items-center justify-center text-center px-4 md:px-6 overflow-hidden bg-cream-dark">
      <div className="absolute inset-0 z-0 opacity-30 md:opacity-40 bg-[url('/hero-bg.jpg')] bg-cover bg-center" />
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-cream/60 via-cream/40 to-cream/80" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-20 max-w-[95vw] md:max-w-6xl mx-auto"
      >
        <motion.p
          variants={itemVariants}
          className="text-[9px] md:text-[11px] tracking-[0.3em] md:tracking-[0.4em] text-gold uppercase mb-4 md:mb-6 font-bold"
        >
          by Armas — Precision Highlight Removal
        </motion.p>

        <motion.h1
          variants={itemVariants}
          className="font-serif text-ink uppercase leading-[0.9] md:leading-[1] tracking-[0.1em] md:tracking-[0.22em] text-[clamp(2.5rem,12vw,8.5rem)]"
        >
          Novarease
          <span className="block font-sans leading-4 capitalize text-[11px] sm:text-xs md:text-base tracking-[0.2em] md:tracking-[0.5em] text-gold/80 mt-4 md:mt-6  md:uppercase md:not-italic">
            Erase the unwanted, preserve the essential
          </span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mt-8 md:mt-10 text-xs sm:text-sm md:text-base text-ink/60 tracking-wide font-light max-w-[280px] sm:max-w-md mx-auto leading-relaxed"
        >
          Remove Highlights Cleanly & Instantly.{" "}
          <br className="hidden sm:block" />
          No damage • Dries quickly • Safe for all paper types.
        </motion.p>

        <motion.div variants={itemVariants} className="mt-10 md:mt-14">
          <button
            onClick={handleScroll}
            className="inline-block px-10 md:px-14 py-4 md:py-5 rounded-full bg-ink text-cream text-[10px] md:text-xs tracking-[0.2em] uppercase font-bold hover:bg-gold hover:text-white transition-all duration-500 shadow-xl shadow-ink/10 active:scale-95"
          >
            Order Now
          </button>
        </motion.div>
      </motion.div>

      {/* Centered Scroll Hint */}
      <motion.button
        onClick={handleScroll}
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-6 md:bottom-10  -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-ink/40 cursor-pointer"
      >
        <span className="text-[9px] uppercase tracking-[0.3em] font-medium">
          Scroll
        </span>
        <ChevronDown size={18} strokeWidth={1.5} />
      </motion.button>
    </section>
  );
};

export default Hero;
