import React, { useEffect } from "react";
import { motion } from "framer-motion";
import {
    Construction,
    Hammer,
    Wrench,
    HardHat,
    Drill,
    Paintbrush,
    Ruler,
} from "lucide-react";
import AnimatedPage from "@/components/AnimatedPage";

type FallingIconProps = {
    Icon: React.ElementType;
    delay: number;
    duration: number;
    startX: number;
};

const FallingIcon: React.FC<FallingIconProps> = ({
    Icon,
    delay,
    duration,
    startX,
}) => {
    return (
        <motion.div
            className="absolute text-base-content/20 blur-[0.5px]"
            style={{ left: `${startX}%`, top: "-10%" }}
            initial={{ y: -120, rotate: 0, opacity: 0, scale: 0.8 }}
            animate={{
                y: "120vh",
                rotate: 360,
                opacity: [0, 1, 1, 0],
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
            <Icon className="w-7 h-7 md:w-8 md:h-8" />
        </motion.div>
    );
};

export default function Build() {
    // trava o scroll da página
    useEffect(() => {
        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "";
            document.documentElement.style.overflow = "";
        };
    }, []);

    const icons = [
        Construction,
        Hammer,
        Wrench,
        HardHat,
        Drill,
        Paintbrush,
        Ruler,
    ];

    const fallingIcons = Array.from({ length: 18 }, (_, i) => ({
        Icon: icons[i % icons.length],
        delay: i * 0.6,
        duration: 9 + Math.random() * 4,
        startX: Math.random() * 95,
    }));

    return (
        <AnimatedPage>
            <div className="fixed inset-0 overflow-hidden">
                {/* Ícones de fundo */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {fallingIcons.map((props, index) => (
                        <FallingIcon key={index} {...props} />
                    ))}
                </div>

                {/* Card central */}
                <div className="relative z-10 flex h-full items-center justify-center px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 40, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="
            w-full max-w-xl
            rounded-3xl
            bg-base-100/70 backdrop-blur-xl
            border border-base-300
            shadow-2xl
            p-8 md:p-12
            text-center
          "
                    >
                        {/* Ícone principal */}
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 18 }}
                            className="mb-8 flex justify-center"
                        >
                            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-primary flex items-center justify-center shadow-xl">
                                <Construction className="w-12 h-12 md:w-14 md:h-14 text-base" />
                            </div>
                        </motion.div>

                        {/* Título */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="text-3xl md:text-5xl font-black tracking-tight text-base-content mb-4"
                        >
                            Em Construção
                        </motion.h1>

                        {/* Subtítulo */}
                        <motion.p
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35, duration: 0.5 }}
                            className="text-base md:text-lg text-base-content/70 leading-relaxed"
                        >
                            Estou preparando algo especial, pensado nos mínimos detalhes para você.
                            <br />
                            <span className="font-semibold">
                                Volte em breve. <span className="font-bold text-primary">Alemão</span> está cuidando de tudo. :)
                            </span>
                        </motion.p>
                    </motion.div>
                </div>
            </div>
        </AnimatedPage>
    );
}
