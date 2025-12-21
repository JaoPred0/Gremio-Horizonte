import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Frown, Home, AlertTriangle, X, AlertCircle, XCircle, Ban, Slash } from "lucide-react";
import { Link } from "react-router-dom";
import AnimatedPage from "@/components/AnimatedPage";

const FallingErrorIcon = ({ Icon, delay, duration, startX }) => {
  return (
    <motion.div
      className="absolute text-error/15 blur-[0.5px]"
      style={{ left: `${startX}%`, top: "-10%" }}
      initial={{ y: -120, rotate: 0, opacity: 0, scale: 0.8 }}
      animate={{
        y: "120vh",
        rotate: 360,
        opacity: [0, 0.8, 0.8, 0],
        scale: [0.8, 1, 1, 0.8],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "linear",
        opacity: { times: [0, 0.1, 0.9, 1] },
      }}
    >
      <Icon className="w-6 h-6 md:w-7 md:h-7" />
    </motion.div>
  );
};

export default function NotPage() {
  const errorIcons = [AlertTriangle, X, AlertCircle, XCircle, Ban, Slash];

  const fallingIcons = Array.from({ length: 15 }, (_, i) => ({
    Icon: errorIcons[i % errorIcons.length],
    delay: i * 0.7,
    duration: 10 + Math.random() * 5,
    startX: Math.random() * 95,
  }));

  // trava o scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  return (
    <AnimatedPage>
      <div className="fixed inset-0 overflow-hidden flex items-center justify-center px-4">
        {/* Background animation */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {fallingIcons.map((props, index) => (
            <FallingErrorIcon key={index} {...props} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="
          relative z-10
          w-full max-w-lg
          rounded-3xl
          bg-base-100/80 backdrop-blur-xl
          border border-base-300
          shadow-2xl
          p-8 md:p-10
          text-center
        "
        >
          {/* Ícone - Carinha Triste */}
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{
              scale: 1,
              rotate: 0,
            }}
            transition={{
              type: "spring",
              stiffness: 150,
              damping: 15,
            }}
            className="mb-6 flex justify-center"
          >
            <motion.div
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-error/15 flex items-center justify-center shadow-lg"
            >
              <Frown className="w-14 h-14 md:w-16 md:h-16 text-error" strokeWidth={2} />
            </motion.div>
          </motion.div>

          {/* Código */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-6xl md:text-7xl font-black text-error mb-3"
          >
            404
          </motion.h1>

          {/* Título */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-xl md:text-2xl font-bold text-base-content mb-3"
          >
            Oops! Página não encontrada
          </motion.p>

          {/* Descrição */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-base-content/70 mb-8 leading-relaxed"
          >
            Parece que você se perdeu... O endereço que você tentou acessar não existe ou foi removido.
          </motion.p>

          {/* Ação */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Link to="/home">
              <motion.button
                whileHover={{ scale: 1.06, y: -2 }}
                whileTap={{ scale: 0.96 }}
                className="btn btn-primary gap-2 shadow-lg"
              >
                <Home className="w-4 h-4" />
                Voltar para Home
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </AnimatedPage>
  );
}