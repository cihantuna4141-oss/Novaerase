"use client";
import { motion } from "framer-motion";
import { MousePointer2, Timer, RotateCcw } from "lucide-react";

const steps = [
  {
    num: "01",
    title: "Apply Gently",
    desc: "Position the precision tip and glide across the highlight with minimal pressure.",
    icon: <MousePointer2 className="w-5 h-5" />,
  },
  {
    num: "02",
    title: "Wait a Moment",
    desc: "Allow 5–10 seconds for the proprietary formula to lift the pigment from the fibers.",
    icon: <Timer className="w-5 h-5" />,
  },
  {
    num: "03",
    title: "Repeat if Needed",
    desc: "For deep pigments, a second pass may be applied once the surface is fully dry.",
    icon: <RotateCcw className="w-5 h-5" />,
  },
];

const HowTo = () => {
  return (
    <section className="bg-white py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[10px] tracking-[0.4em] text-gold uppercase font-bold"
          >
            How to Use
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif text-ink mt-4"
          >
            Three Simple Steps.
          </motion.h2>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="relative group p-6 cursor-pointer rounded-lg bg-cream/40 border-2 border-gold/10 hover:border-gold/30 hover:bg-white transition-all duration-500 hover:shadow-2xl hover:shadow-gold/5"
            >
              {/* Top Accent Line */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gold/20 rounded-b-full group-hover:w-24 group-hover:bg-gold transition-all duration-500" />

              {/* Number and Icon Header */}
              <div className="flex justify-between items-start mb-6">
                <span className="text-sm font-black text-gold tracking-widest">
                  {step.num}
                </span>
                <div className="text-ink/30 group-hover:text-gold transition-colors duration-500">
                  {step.icon}
                </div>
              </div>

              {/* Content */}
              <div className="relative z-10">
                <h4 className="text-xl font-bold text-ink mb-4 tracking-tight">
                  {step.title}
                </h4>
                <p className="text-sm text-ink/80 leading-relaxed font-light">
                  {step.desc}
                </p>
              </div>

              {/* Background Large Number (Faded) */}
              <div className="absolute bottom-4 right-8 text-8xl font-black text-ink/[0.06] select-none pointer-events-none group-hover:text-gold/[0.05] transition-colors duration-500">
                {step.num}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Progress Tracker (Visual connection) */}
        <div className="mt-20 flex justify-center items-center gap-4">
          <div className="h-[2px] w-12 bg-gold/20" />
          <span className="text-[13px] text-ink/30 uppercase tracking-[0.2em]">
            Sequence of use
          </span>
          <div className="h-[2px] w-12 bg-gold/20" />
        </div>
      </div>
    </section>
  );
};

export default HowTo;
