"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface WovenTextProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p";
  delay?: number;
}

export function WovenText({ text, className, as: Component = "h2", delay = 0 }: WovenTextProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  
  // Split by words to prevent mid-word breaks while maintaining the character-by-character animation
  const words = text.split(" ");

  return (
    <Component ref={ref} className={cn("break-keep hyphens-none", className)}>
      {words.map((word, wordIndex) => {
        // Calculate the starting index for this word to maintain sequential delay
        const previousLettersCount = words.slice(0, wordIndex).join("").length + wordIndex;
        
        return (
          <span key={wordIndex} className="inline-block whitespace-nowrap">
            {Array.from(word).map((char, charIndex) => (
              <motion.span
                key={charIndex}
                className="inline-block whitespace-pre"
                initial={{ opacity: 0, translateY: (previousLettersCount + charIndex) % 2 === 0 ? 12 : -12 }}
                animate={isInView ? { opacity: 1, translateY: 0 } : {}}
                transition={{
                  duration: 0.5,
                  delay: delay + (previousLettersCount + charIndex) * 0.03,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {char}
              </motion.span>
            ))}
            {/* Add space between words */}
            {wordIndex < words.length - 1 && (
              <span className="inline-block whitespace-pre">&nbsp;</span>
            )}
          </span>
        );
      })}
    </Component>
  );
}
