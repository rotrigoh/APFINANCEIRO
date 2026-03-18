"use client"
import { motion } from "framer-motion"

export function ThreeGlobe() {
  return (
    <div className="absolute -right-20 -top-20 h-[300px] w-[300px] md:h-[500px] md:w-[500px] z-0 opacity-40 mix-blend-screen pointer-events-none md:block hidden">
      <motion.div
        className="w-full h-full rounded-full border border-primary/30 shadow-[inset_0_0_120px_hsla(var(--primary))] flex items-center justify-center relative bg-gradient-to-tr from-primary/5 to-transparent backdrop-blur-lg"
        animate={{ rotateZ: 360, rotateY: 360 }}
        transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
        style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
      >
        <motion.div 
           className="w-[80%] h-[80%] rounded-full border-[2px] border-primary/60 border-dashed"
           animate={{ rotateX: 360, rotateY: -360 }}
           transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
         />
        <div className="absolute w-[150%] h-[150%] bg-primary/20 rounded-full blur-[100px] -z-10" />
      </motion.div>
    </div>
  )
}
