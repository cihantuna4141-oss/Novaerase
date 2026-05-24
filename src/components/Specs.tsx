"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ShoppingCart } from "lucide-react";

const specification = [
  {
    icon: "✦",
    title: "Does Not Damage Paper",
    desc: "Formulated solution that lifts ink without tearing fibres.",
  },
  {
    icon: "⚡",
    title: "Dries Quickly",
    desc: "Evaporates in seconds, leaving pages dry and ready.",
  },
  {
    icon: "◈",
    title: "Non-Abrasive Tip",
    desc: "Soft precision applicator gentle on delicate paper.",
  },
  {
    icon: "✓",
    title: "Safe for Most Paper",
    desc: "Tested on notebooks, textbooks, and planners.",
  },
  {
    icon: "◇",
    title: "2.5 ml — Premium Box",
    desc: "Includes user guide and before/after reference card.",
  },
];

const Specs = () => {
  // Animation Variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
      className="bg-cream py-24 border-y border-ink/10 px-6 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="flex gap-6 items-end">
          {/* Item 1 */}
          <motion.div
            variants={fadeInUp}
            className="flex-1 flex flex-col gap-4"
          >
            <div className="group cursor-pointer aspect-[3/4] bg-cream-dark rounded-2xl overflow-hidden border-2 border-gold/20 shadow-sm relative">
              <img
                src="/images/nov-pen.png"
                alt="Novarease Pen"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <Link
              href="#order"
              className="flex items-center justify-between group px-2"
            >
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gold uppercase tracking-widest">
                  Premium Pen
                </span>
                <span className="text-sm font-semibold text-ink">
                  Novarease Eraser
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-gold text-white flex items-center justify-center group-hover:bg-ink transition-colors duration-300">
                <ShoppingCart size={14} />
              </div>
            </Link>
          </motion.div>

          {/* Item 2 (Asymmetrical Offset) */}
          <motion.div
            variants={fadeInUp}
            className="flex-1 flex flex-col gap-4 mb-12"
          >
            <div className="group cursor-pointer aspect-[3/4] bg-cream-dark rounded-2xl overflow-hidden border-2 border-gold/20 shadow-sm relative">
              <img
                src="/images/nov-pen.png"
                alt="Novarease Set"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <Link
              href="#order"
              className="flex items-center justify-between group px-2"
            >
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gold uppercase tracking-widest">
                  Archival Kit
                </span>
                <span className="text-sm font-semibold text-ink">
                  Full Set Box
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-gold text-white flex items-center justify-center group-hover:bg-ink transition-colors duration-300">
                <ShoppingCart size={14} />
              </div>
            </Link>
          </motion.div>
        </div>

        <div className="space-y-8">
          <div>
            <p className="text-[10px] tracking-[0.3em] text-gold uppercase mb-3 font-bold">
              Specifications
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-ink leading-tight">
              Built to erase <br /> without a trace.
            </h2>
          </div>

          <div className="space-y-6">
            {specification.map((spec, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex gap-4 pb-4 border-b border-ink/10 last:border-0"
              >
                <div className="w-10 shadow-lg h-10 bg-gold/10 border border-gold/30 rounded-lg flex items-center justify-center text-gold shrink-0">
                  {spec.icon}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-ink mb-1 tracking-wide">
                    {spec.title}
                  </h4>
                  <p className="text-xs text-ink/60 leading-relaxed">
                    {spec.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Specs;
