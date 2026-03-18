"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Ignore touch devices using media query feature
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      const target = e.target as HTMLElement;
      // Define a "interactable" surface as an anchor, button, input, or any div with role=button/cursor-pointer
      const isInteractive = 
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'input' ||
        target.closest('a') !== null ||
        target.closest('button') !== null ||
        target.closest('[role="button"]') !== null ||
        window.getComputedStyle(target).cursor === 'pointer';
        
      setIsHovering(isInteractive);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    
    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  if (!mounted) return null;
  // Always fallback to standard CSS defaults on mobile
  if (typeof window !== 'undefined' && window.matchMedia("(pointer: coarse)").matches) return null;

  return (
    <>
      {/* Ponto Rápido (Lider) */}
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 bg-primary rounded-full pointer-events-none z-[99999]"
        animate={{
          x: mousePosition.x - 6,
          y: mousePosition.y - 6,
          scale: isClicking ? 0.7 : isHovering ? 2.5 : 1, // Infla ao tocar em link
          opacity: isHovering ? 0.4 : 1
        }}
        transition={{ type: "spring", stiffness: 1000, damping: 28, mass: 0.1 }}
      />
      {/* Rastro Fluído (Trailing Follower) */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border border-primary/50 shadow-[0_0_10px_rgba(var(--primary),0.3)] bg-primary/5 rounded-full pointer-events-none z-[99998] backdrop-blur-[1px]"
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
          scale: isClicking ? 0.5 : isHovering ? 1.5 : 1,
          opacity: isHovering ? 0 : 1,
        }}
        transition={{ type: "spring", stiffness: 250, damping: 20, mass: 0.6 }}
      />
    </>
  );
}
