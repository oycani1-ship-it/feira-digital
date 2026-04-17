"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import React from "react";

interface KraftCardProps {
  children: React.ReactNode;
  className?: string;
  dataCursor?: string;
}

export function KraftCard({ children, className, dataCursor = "inspect" }: KraftCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 100, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 100, damping: 30 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        perspective: 1000,
        transformStyle: "preserve-3d",
      }}
      initial={{ rotateX: 2, translateY: 4 }}
      whileHover={{ rotateX: 0, translateY: 0 }}
      transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
      data-cursor={dataCursor}
      className={cn(
        "bg-card dog-ear p-6 shadow-sm border border-border/50 relative overflow-hidden group",
        className
      )}
    >
      {/* Glaze Highlight */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background: useTransform(
            [x, y],
            ([vx, vy]: number[]) => `radial-gradient(circle at ${(vx + 0.5) * 100}% ${(vy + 0.5) * 100}%, rgba(255,255,255,0.12) 0%, rgba(255, 255, 255, 0) 180px)`
          )
        }}
      />
      
      <div style={{ transform: "translateZ(20px)" }}>
        {children}
      </div>
    </motion.div>
  );
}
