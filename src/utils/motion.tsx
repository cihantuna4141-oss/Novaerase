import { Variants } from "framer-motion";

export const fadeIn = (direction: string, delay: number): Variants => {
  return {
    hidden: {
      x: direction === "right" ? 50 : direction === "left" ? -50 : 0,
      y: direction === "up" ? 50 : direction === "down" ? -50 : 0,
      opacity: 0,
    },
    show: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: {
        type: "tween", // TypeScript now knows this is a literal "tween"
        delay: delay,
        duration: 1.2,
        ease: [0.25, 0.25, 0.25, 0.25],
      },
    },
  };
};