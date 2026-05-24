"use client";

import { motion, Variants } from "framer-motion";
import { ShieldCheck, Truck, RotateCcw } from "lucide-react";
import React from "react";

const OrderCTA = () => {
  // Logic to scroll up by 2 pages
  const handleScrollUp = () => {
    window.scrollBy({
      top: -(window.innerHeight * 3.5),
      behavior: "smooth",
    });
  };

  // 1. Explicitly typing as Variants fixes the "ease" error
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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1] // TypeScript now accepts this
      },
    },
  };

  const badgeVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.section
      id="order"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
      className="bg-[#EDE9DF] py-24 px-6 text-center border-t border-ink/10 overflow-hidden"
    >
      <div className="max-w-2xl mx-auto">
        <motion.p
          variants={itemVariants}
          className="text-[10px] tracking-[0.4em] text-gold uppercase mb-6 font-black"
        >
          Ready to Try It?
        </motion.p>

        <motion.h2
          variants={itemVariants}
          className="font-serif text-5xl md:text-6xl text-ink leading-tight"
        >
          Extend the life <br /> of your <span className="italic">books.</span>
        </motion.h2>

        <motion.div variants={itemVariants} className="mt-10 relative inline-block">
          <p className="text-6xl md:text-8xl font-serif text-ink tracking-tighter">
            $14.99
          </p>
          <div className="absolute -inset-4 bg-gold/5 blur-3xl -z-10 rounded-full" />
        </motion.div>

        <motion.p
          variants={itemVariants}
          className="mt-6 text-[11px] font-semibold text-ink/40 uppercase tracking-[0.2em]"
        >
          Free shipping on orders over $30 • 30-day satisfaction guarantee
        </motion.p>

        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-12"
        >
          {/* Added handleScrollUp logic here */}
          <button 
            onClick={handleScrollUp}
            className="px-14 py-4 rounded-full bg-ink text-cream font-black text-[11px] tracking-[0.3em] uppercase shadow-2xl shadow-gold/20 hover:bg-gold transition-colors duration-500 group flex items-center gap-4 mx-auto cursor-pointer"
          >
            Buy Now
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              →
            </motion.span>
          </button>
        </motion.div>

        <motion.div
          variants={containerVariants}
          className="mt-20 flex justify-center gap-x-10 gap-y-4 flex-wrap opacity-50"
        >
          <Badge icon={<ShieldCheck size={18} strokeWidth={1.5} />} text="Secure Checkout" variants={badgeVariants} />
          <Badge icon={<Truck size={18} strokeWidth={1.5} />} text="Fast Shipping" variants={badgeVariants} />
          <Badge icon={<RotateCcw size={18} strokeWidth={1.5} />} text="30-Day Returns" variants={badgeVariants} />
        </motion.div>
      </div>
    </motion.section>
  );
};

// Properly type the Badge component props
const Badge = ({ 
  icon, 
  text, 
  variants 
}: { 
  icon: React.ReactNode; 
  text: string; 
  variants: Variants; 
}) => {
  return (
    <motion.div
      variants={variants}
      className="flex items-center gap-3 text-[10px] font-bold text-ink uppercase tracking-widest"
    >
      <span className="text-gold">{icon}</span>
      {text}
    </motion.div>
  );
};

export default OrderCTA;