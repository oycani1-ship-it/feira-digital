"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useSpring, useMotionValue, AnimatePresence } from "framer-motion";

export function ArtisanCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [cursorType, setCursorType] = useState<"default" | "stitch" | "inspect" | "tear">("default");
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const lastMouseX = useRef(0);
  const lastMouseY = useRef(0);
  const [rotation, setRotation] = useState(0);

  const trailX = useSpring(mouseX, { damping: 30, stiffness: 250 });
  const trailY = useSpring(mouseY, { damping: 30, stiffness: 250 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - lastMouseX.current;
      const dy = e.clientY - lastMouseY.current;
      
      if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
        const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
        setRotation(angle);
      }

      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      lastMouseX.current = e.clientX;
      lastMouseY.current = e.clientY;

      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement;
      if (target.closest('a, button, [data-cursor="stitch"]')) {
        setCursorType("stitch");
      } else if (target.closest('[data-cursor="inspect"]')) {
        setCursorType("inspect");
      } else if (target.closest('[data-cursor="tear"]')) {
        setCursorType("tear");
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
            {/* Thread Path */}
            <svg className="fixed inset-0 w-full h-full pointer-events-none">
              <motion.path
                d={`M ${trailX.get()} ${trailY.get()} L ${mouseX.get()} ${mouseY.get()}`}
                fill="none"
                stroke="var(--primary)"
                strokeWidth="0.5"
                strokeDasharray="4 2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
              />
            </svg>

            {/* Main Cursor: Needle */}
            <motion.div
              className="fixed top-0 left-0 flex items-center justify-center"
              style={{ x: mouseX, y: mouseY, translateX: "-50%", translateY: "-50%", rotate: rotation }}
              animate={{
                scale: cursorType === "stitch" ? 0 : 1,
              }}
            >
              {cursorType === "default" && (
                <svg width="6" height="28" viewBox="0 0 6 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 0V28M3 0C4.5 0 5.5 1 5.5 2.5C5.5 4 4.5 5 3 5C1.5 5 0.5 4 0.5 2.5C0.5 1 1.5 0 3 0Z" stroke="currentColor" className="text-primary" strokeWidth="0.5"/>
                </svg>
              )}
              {cursorType === "inspect" && (
                <div className="relative">
                  <motion.div 
                    className="absolute inset-0 border border-primary rounded-full"
                    animate={{ width: 44, height: 44, x: -22, y: -22 }}
                  />
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>
              )}
              {cursorType === "tear" && (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary">
                  <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
                  <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
                  <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
                  <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
                </svg>
              )}
            </motion.div>

            {/* Yarn Ball for Hover */}
            {cursorType === "stitch" && (
              <motion.div
                className="fixed top-0 left-0"
                style={{ x: mouseX, y: mouseY, translateX: "-50%", translateY: "-50%" }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" className="text-primary" strokeWidth="1"/>
                  <path d="M12 2C12 2 8 6 8 12C8 18 12 22 12 22" stroke="currentColor" className="text-primary" strokeWidth="0.5"/>
                  <path d="M2 12C2 12 6 16 12 16C18 16 22 12 22 12" stroke="currentColor" className="text-primary" strokeWidth="0.5"/>
                  <path d="M12 2C12 2 16 6 16 12C16 18 12 22 12 22" stroke="currentColor" className="text-primary" strokeWidth="0.5"/>
                </svg>
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
