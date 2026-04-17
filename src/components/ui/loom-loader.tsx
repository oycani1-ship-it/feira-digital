"use client";

import { motion } from "framer-motion";

export function LoomLoader() {
  const bars = [0, 1, 2, 3, 4];
  
  return (
    <div className="flex gap-1.5 h-8 items-center justify-center">
      {bars.map((i) => (
        <motion.div
          key={i}
          className="w-[2px] h-6 bg-primary"
          animate={{
            translateY: i % 2 === 0 ? [-8, 8] : [8, -8],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
            delay: i * 0.08,
          }}
        />
      ))}
    </div>
  );
}
