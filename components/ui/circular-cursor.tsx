"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function CircularCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      const target = e.target as HTMLElement;
      setIsHovering(
        window.getComputedStyle(target).cursor === "pointer" ||
        target.tagName.toLowerCase() === "a" ||
        target.tagName.toLowerCase() === "button"
      );
    };

    window.addEventListener("mousemove", updateMousePosition);
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @media (min-width: 768px) {
          body * { cursor: none !important; }
        }
      `}} />
      <div className="hidden md:block pointer-events-none z-[9999]">
        {/* Ponto Rápido Central */}
        <motion.div
          className="fixed top-0 left-0 w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_hsl(var(--primary))]"
          animate={{ x: mousePosition.x - 4, y: mousePosition.y - 4 }}
          transition={{ type: "tween", ease: "linear", duration: 0 }}
        />
        {/* Aro Extensível Smooth */}
        <motion.div
          className="fixed top-0 left-0 rounded-full border border-primary/50 bg-primary/5 backdrop-blur-[1px]"
          animate={{
            x: mousePosition.x - (isHovering ? 24 : 16),
            y: mousePosition.y - (isHovering ? 24 : 16),
            width: isHovering ? 48 : 32,
            height: isHovering ? 48 : 32,
          }}
          transition={{ type: "spring", stiffness: 180, damping: 18, mass: 0.5 }}
        />
      </div>
    </>
  );
}
