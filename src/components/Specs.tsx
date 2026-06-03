"use client";

import React, { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import { ShoppingCart, Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { CartActions } from "@/store/CartSlice";
import { toast } from "sonner";
import Image from "next/image";

const specification = [
  {
    icon: "✦",
    title: "Does Not Damage Paper",
    desc: "Specially formulated solution that lifts ink without tearing fibres.",
  },
  {
    icon: "⚡",
    title: "Dries Quickly",
    desc: "Evaporates in seconds, leaving pages dry and ready to use again.",
  },
  {
    icon: "◈",
    title: "Non-Abrasive Tip",
    desc: "Soft precision applicator — gentle on delicate or coated paper.",
  },
  {
    icon: "✓",
    title: "Safe for Most Paper Types",
    desc: "Tested on notebooks, textbooks, planners and more.",
  },
  {
    icon: "◇",
    title: "2.5 ml — Premium Box",
    desc: "Includes user guide and before/after reference card.",
  },
];

const Specs = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await fetch("/api/pens");
        const json = await res.json();
        if (json.success) {
          setProducts(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, []);

  // Handler to add item and then navigate
  const handleAddToCartAndNavigate = (product: any) => {
    dispatch(CartActions.addToCart(product));
    toast.success("Added to Cart", {
      description: `${product.name} has been added to your collection.`,
    });
    router.push("/cart");
  };

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

  if (loading) {
    return (
      <div className="py-24 flex justify-center bg-cream">
        <Loader2 className="animate-spin text-gold" size={32} />
      </div>
    );
  }

  const item1 = products[0];
  const item2 = products[1];

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
      className="bg-cream py-24 border-y border-ink/10 px-6 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="flex gap-6 items-center justify-center">
          {item1 && (
            <motion.div variants={fadeInUp} className="flex flex-col gap-4 w-80">
              <div
                // href={`/product/${item1.id}`}
                className="group relative cursor-pointer w-80 h-96 bg-cream-dark rounded-xl overflow-hidden border-2 border-gold/20 shadow-sm"
              >
                <Image
                  src={item1.images[0] || "/images/nov-pen.png"}
                  alt={item1.name}
                  fill
                  loading="lazy"
                  className=" object-contain transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col group">
                <div className="flex items-center justify-between gap-4 pb-2">
                  <p className="text-sm font-bold text-ink group-hover:text-gold transition-colors">
                    {item1.name}
                  </p>
                  <button
                    onClick={() => handleAddToCartAndNavigate(item1)}
                    className="w-8 h-8 rounded-lg bg-gold text-white flex items-center justify-center hover:bg-ink transition-colors duration-300 active:scale-90"
                  >
                    <ShoppingCart size={16} />
                  </button>
                </div>
                <span className="text-sm  font-medium text-gray-500 tracking-widest">
                  {item1.description || "Archival Kit"}
                </span>
              </div>
            </motion.div>
          )}

          {/* Dynamic Item 2 (Slot for second product - Asymmetrical Offset) */}
          {/* {item2 && (
            <motion.div
              variants={fadeInUp}
              className="flex-1 flex flex-col gap-4 mb-12"
            >
              <div
                // href={`/product/${item2.id}`}
                className="group cursor-pointer aspect-[3/4] bg-cream-dark rounded-2xl overflow-hidden border-2 border-gold/20 shadow-sm relative"
              >
                <img
                  src={item2.images[0] || "/images/nov-pen.png"}
                  alt={item2.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col group">
                <div className="flex items-center justify-between gap-4 pb-2">
                  <p className="text-sm font-semibold text-ink group-hover:text-gold transition-colors">
                    {item2.name}
                  </p>
                  <button
                    onClick={() => handleAddToCartAndNavigate(item2)}
                    className="w-8 h-8 rounded-lg bg-gold text-white flex items-center justify-center hover:bg-ink transition-colors duration-300 active:scale-90"
                  >
                    <ShoppingCart size={14} />
                  </button>
                </div>
                <span className="text-[11px] w-full font-semibold text-gray-500 tracking-widest">
                  {item2.description || "Archival Kit"}
                </span>
              </div>
            </motion.div>
          )} */}
        </div>

        {/* Specs Content */}
        <div className="space-y-8">
          <div>
            <p className="text-[10px] tracking-[0.3em] text-gold uppercase mb-3 font-bold">
              Specifications
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-ink leading-tight font-serif italic">
              Built to erase <br />{" "}
              <span className="font-sans not-italic">without a trace.</span>
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
