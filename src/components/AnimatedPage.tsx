import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedPageProps {
  children: ReactNode;
}

export default function AnimatedPage({ children }: AnimatedPageProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 16,
        scale: 0.97,
        filter: "blur(4px)",
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
      }}
      exit={{
        opacity: 0,
        y: -12,
        scale: 0.98,
        filter: "blur(2px)",
      }}
      transition={{
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="h-full will-change-transform"
    >
      {children}
    </motion.div>
  );
}
