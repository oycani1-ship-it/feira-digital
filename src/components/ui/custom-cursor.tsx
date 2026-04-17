"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useSpring, useMotionValue, AnimatePresence } from "framer-motion";

export function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [cursorType, setCursorType] = useState<"default" | "pointer" | "text" | "drag" | "cut">("default");
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const ringX = useSpring(mouseX, { damping: 30, stiffness: 250, restDelta: 0.001 });
  const ringY = useSpring(mouseY, { damping: 30, stiffness: 250, restDelta: 0.001 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement;
      if (target.closest('a, button, [data-cursor="pointer"]')) {
        setCursorType("pointer");
      } else if (target.closest('[data-cursor="text"]')) {
        setCursorType("text");
      } else if (target.closest('[data-cursor="drag"]')) {
        setCursorType("drag");
      } else if (target.closest('[data-cursor="cut"]')) {
        setCursorType("cut");
      } else {
        setCursorType("default");
      }
    };

    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isVisible, mouseX, mouseY]);

  if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[99999]">
      <AnimatePresence>
        {isVisible && (
          <>
            {/* Inner Dot */}
            <motion.div
              className="fixed top-0 left-0 w-1.5 h-1.5 bg-primary rounded-full"
              style={{ x: mouseX, y: mouseY, translateX: "-50%", translateY: "-50%" }}
              animate={{
                scale: cursorType === "pointer" ? 0 : 1,
              }}
            />

            {/* Outer Ring */}
            <motion.div
              className="fixed top-0 left-0 border border-primary rounded-full flex items-center justify-center"
              style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
              animate={{
                width: cursorType === "pointer" ? 56 : cursorType === "text" ? 2 : 32,
                height: cursorType === "pointer" ? 56 : cursorType === "text" ? 28 : 32,
                backgroundColor: cursorType === "pointer" ? "rgba(200, 134, 26, 0.15)" : "rgba(200, 134, 26, 0)",
                borderRadius: cursorType === "text" ? "0px" : "100%",
                rotate: cursorType === "cut" ? 15 : 0,
              }}
            >
              {cursorType === "drag" && (
                <span className="text-primary text-xs">↔</span>
              )}
              {cursorType === "cut" && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <circle cx="6" cy="6" r="3" />
                  <path d="M8.12 8.12 12 12" />
                  <path d="M20 4 8.12 15.88" />
                  <circle cx="6" cy="18" r="3" />
                  <path d="M14.8 14.8 20 20" />
                </svg>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
