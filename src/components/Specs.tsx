"use client";
import { motion } from "framer-motion";

const specs = [
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
];

const Specs = () => {
  return (
    <section className="bg-cream py-24 border-y border-ink/10 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="flex gap-4 items-end">
          <div className="flex-1 aspect-[3/4] bg-cream-dark rounded-2xl overflow-hidden border border-gold/20">
            <img
              src="/product-pen.jpg"
              alt="Pen"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="flex-1 aspect-[3/4] bg-cream-dark rounded-2xl overflow-hidden border border-gold/20 mb-8">
            <img
              src="/product-box.jpg"
              alt="Box"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
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
            {specs.map((spec, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex gap-4 pb-6 border-b border-ink/5 last:border-0"
              >
                <div className="w-10 shadow-md h-10 bg-gold/10 border border-gold/30 rounded-lg flex items-center justify-center text-gold shrink-0">
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
    </section>
  );
};

export default Specs;
