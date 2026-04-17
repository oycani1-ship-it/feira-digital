"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export function TornDivider() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <div ref={ref} className="w-full relative h-12 -my-6 z-10 overflow-hidden" data-cursor="tear">
      <svg
        viewBox="0 0 1200 40"
        preserveAspectRatio="none"
        className="w-full h-full fill-background stroke-none"
      >
        <motion.path
          d="M0,40 L1200,40 L1200,10 C1100,15 1050,5 950,12 C850,20 780,3 650,10 C520,18 450,5 350,12 C250,20 150,5 0,15 Z"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 1.2, ease: "linear" }}
        />
      </svg>
    </div>
  );
}
