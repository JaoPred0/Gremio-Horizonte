import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { ArrowPathIcon } from "@heroicons/react/24/solid";

const text = "GRÊMIO HORIZONTES";
const DURATION = 2600;

export default function SplashScreen() {
  const navigate = useNavigate();

  const [progress, setProgress] = useState(0);
  const [authUser, setAuthUser] = useState<User | null | undefined>(undefined);
  const [timeReady, setTimeReady] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  const hasNavigated = useRef(false);

  useEffect(() => {
    const start = performance.now();
    let rafId: number;

    // Progresso visual
    const tick = (now: number) => {
      const elapsed = now - start;
      const value = Math.min((elapsed / DURATION) * 100, 100);
      setProgress(value);

      if (elapsed < DURATION) {
        rafId = requestAnimationFrame(tick);
      } else {
        setTimeReady(true);
      }
    };

    rafId = requestAnimationFrame(tick);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
    });

    return () => {
      cancelAnimationFrame(rafId);
      unsubscribe();
    };
  }, []);

  // Navegação com fade out
  useEffect(() => {
    if (hasNavigated.current) return;
    if (!timeReady) return;
    if (authUser === undefined) return;

    // Inicia o fade out
    setFadeOut(true);

    // Navega após o fade (duração de 0.8s)
    setTimeout(() => {
      hasNavigated.current = true;
      navigate(authUser ? "/home" : "/login", { replace: true });
    }, 800);
  }, [timeReady, authUser, navigate]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        animate={fadeOut ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="
          fixed inset-0 z-50
          flex flex-col items-center justify-center
          px-4 sm:px-6
          bg-gradient-to-br from-blue-400 via-blue-600 to-blue-800
          overflow-hidden
        "
      >
        {/* Glow */}
        <div
          className="
            absolute rounded-full bg-blue-300/20 blur-3xl animate-pulse
            w-[220px] h-[220px]
            sm:w-[320px] sm:h-[320px]
            md:w-[420px] md:h-[420px]
          "
        />

        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
          className="relative z-10 mb-4"
        >
          <ArrowPathIcon className="w-12 h-12 sm:w-16 sm:h-16 text-white animate-spin" />
        </motion.div>

        {/* Título */}
        <motion.h1
          className="
            relative z-10
            text-center font-black tracking-widest text-white
            text-[1.6rem] sm:text-3xl md:text-5xl lg:text-6xl
            flex flex-wrap justify-center leading-tight
          "
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
        >
          {text.split("").map((char, i) => (
            <motion.span
              key={i}
              variants={{
                hidden: { y: 20, opacity: 0, filter: "blur(4px)" },
                visible: { y: 0, opacity: 1, filter: "blur(0px)" },
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="inline-block"
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.h1>

        {/* Subtítulo */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4, ease: "easeInOut" }}
          className="
            relative z-10 mt-3 sm:mt-4
            text-[10px] sm:text-xs md:text-sm
            uppercase tracking-[0.25em]
            text-white/70 text-center
          "
        >
          carregando experiência
        </motion.p>

        {/* Progresso */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9, duration: 0.5, ease: "easeInOut" }}
          className="
            relative z-10 mt-8 sm:mt-10
            w-full max-w-[180px] sm:max-w-xs md:max-w-sm
          "
        >
          <div className="relative h-1 sm:h-[5px] w-full overflow-hidden rounded-full bg-white/30">
            <motion.div
              className="absolute left-0 top-0 h-full rounded-full bg-white"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1, ease: "linear" }}
            />
          </div>

          <span className="mt-2 block text-center text-[10px] sm:text-xs text-white/70">
            {Math.round(progress)}%
          </span>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}