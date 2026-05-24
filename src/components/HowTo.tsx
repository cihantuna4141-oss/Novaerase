"use client"
import { motion } from 'framer-motion';

const steps = [
  { num: '01', title: 'Apply Gently', desc: 'Press the tip lightly onto the highlighted area and glide slowly.' },
  { num: '02', title: 'Wait a Moment', desc: 'Allow 5–10 seconds for the formula to lift the ink pigment.' },
  { num: '03', title: 'Repeat if Needed', desc: 'For stubborn highlights, apply a second pass. Dries without residue.' },
];

const HowTo = () => {
  return (
    <section className="bg-white py-24 px-6 text-center">
      <div className="">
        <p className="text-[10px] tracking-[0.3em] text-gold uppercase mb-3 font-bold">How to Use</p>
        <h2 className="text-4xl font-bold text-ink mb-12">Three simple steps.</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {steps.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-cream border border-ink/5 relative overflow-hidden"
            >
              <div className="text-5xl font-black text-gold/20 leading-none mb-4">
                {step.num}
              </div>
              <h4 className="text-sm font-bold text-ink mb-2 tracking-tight">{step.title}</h4>
              <p className="text-xs text-ink/60 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowTo;