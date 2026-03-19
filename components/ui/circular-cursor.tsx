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
        html, body, * { 
          cursor: none !important; 
        }
        /* Garantir que o cursor padrão não apareça em hover de links/botões */
        a, button, [role="button"] {
          cursor: none !important;
        }
      `}} />
      <div className="fixed inset-0 pointer-events-none z-[2147483647]">
        {/* Ponto Rápido Central */}
        <motion.div
          className="fixed top-0 left-0 w-2 h-2 bg-primary rounded-full shadow-[0_0_10px_hsl(var(--primary))] z-[2147483647]"
          animate={{ x: mousePosition.x - 4, y: mousePosition.y - 4 }}
          transition={{ type: "tween", ease: "linear", duration: 0 }}
        />
        {/* Aro Extensível Smooth */}
        <motion.div
          className="fixed top-0 left-0 rounded-full border-2 border-primary/40 bg-primary/10 backdrop-blur-[2px] z-[2147483647]"
          animate={{
            x: mousePosition.x - (isHovering ? 28 : 18),
            y: mousePosition.y - (isHovering ? 28 : 18),
            width: isHovering ? 56 : 36,
            height: isHovering ? 56 : 36,
            scale: isHovering ? 1.1 : 1,
          }}
          transition={{ type: "spring", stiffness: 200, damping: 20, mass: 0.5 }}
        />
      </div>
    </>
  );
}
