"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SafeArtisanImageProps {
  src?: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

/**
 * @fileOverview Um componente de imagem seguro que lida com erros de carregamento,
 * URLs externas e strings Base64, exibindo um placeholder elegante em caso de falha.
 */
export function SafeArtisanImage({ 
  src, 
  alt, 
  fill, 
  width, 
  height, 
  className, 
  sizes,
  priority = false
}: SafeArtisanImageProps) {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Reset error state if src changes
  useEffect(() => {
    setError(false);
    setIsLoading(true);
  }, [src]);

  if (!src || error) {
    return (
      <div className={cn(
        "flex items-center justify-center bg-muted/30 border border-border/10",
        fill ? "absolute inset-0" : "relative",
        className
      )}
      style={!fill ? { width, height } : undefined}
      >
        <div className="flex flex-col items-center gap-2 opacity-20">
          <ImageIcon className="h-8 w-8" />
          <span className="text-[8px] font-mono-tag uppercase tracking-widest">Imagem Indisponível</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", fill ? "h-full w-full" : "")}>
      <Image 
        src={src} 
        alt={alt} 
        fill={fill} 
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        className={cn(
          "transition-all duration-700",
          isLoading ? "scale-105 blur-sm grayscale" : "scale-100 blur-0",
          className
        )} 
        sizes={sizes}
        priority={priority}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setError(true);
          setIsLoading(false);
        }}
        unoptimized={src.startsWith('data:')}
      />
    </div>
  );
}
