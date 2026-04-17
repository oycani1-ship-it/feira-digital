"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

interface WovenTextProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p";
  delay?: number;
}

export function WovenText({ text, className, as: Component = "h2", delay = 0 }: WovenTextProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const letters = Array.from(text);

  return (
    <Component ref={ref} className={className}>
      {letters.map((char, i) => (
        <motion.span
          key={i}
          className="inline-block whitespace-pre"
          initial={{ opacity: 0, translateY: i % 2 === 0 ? 12 : -12 }}
          animate={isInView ? { opacity: 1, translateY: 0 } : {}}
          transition={{
            duration: 0.5,
            delay: delay + i * 0.03,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {char}
        </motion.span>
      ))}
    </Component>
  );
}
