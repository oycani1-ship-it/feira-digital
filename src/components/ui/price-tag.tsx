"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PriceTagProps {
  price: number;
  origin?: string;
  materials?: string;
  artisan?: string;
  className?: string;
}

export function PriceTag({ price, origin, materials, artisan, className }: PriceTagProps) {
  const formattedPrice = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);

  return (
    <div className={cn("perspective-1000 w-fit h-12 group", className)}>
      <motion.div
        className="relative w-full h-full transition-all duration-500 preserve-3d group-hover:rotate-y-180"
        style={{ transformOrigin: "top center" }}
      >
        {/* Front Side */}
        <div className="absolute inset-0 bg-card border border-border px-4 flex items-center gap-2 backface-hidden shadow-sm rotate-z-[-2deg]">
          <div className="w-2 h-2 rounded-full border border-primary/20 shrink-0" />
          <span className="font-mono-tag text-xs font-medium tracking-tight whitespace-nowrap">
            {formattedPrice}
          </span>
        </div>

        {/* Back Side */}
        <div className="absolute inset-0 bg-card border border-border px-4 flex flex-col justify-center backface-hidden shadow-sm rotate-y-180 rotate-z-[-2deg]">
          <p className="font-mono-tag text-[8px] uppercase tracking-tighter text-muted-foreground leading-none">
            {artisan || "Mestre Artesão"}
          </p>
          <p className="font-mono-tag text-[8px] uppercase tracking-tighter text-muted-foreground leading-none mt-0.5">
            {origin || "Feito à mão"}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
