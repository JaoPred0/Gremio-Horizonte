import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import navData from "@/data/navLinks.json";
import {
  HomeIcon,
  Cog6ToothIcon,
  Squares2X2Icon
} from "@heroicons/react/24/solid";
import {
  HomeIcon as HomeOutline,
  Cog6ToothIcon as CogOutline
} from "@heroicons/react/24/solid";
import { BookOpenIcon } from "lucide-react";

const iconsMap = {
  HomeIcon: { solid: HomeIcon, outline: HomeOutline },
  AppIcon: { solid: Squares2X2Icon, outline: Squares2X2Icon },
  ConfigIcon: { solid: Cog6ToothIcon, outline: CogOutline },
  Vest: {solid: BookOpenIcon, outline: BookOpenIcon}
};

export default function Dock() {
  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-6 px-4 pointer-events-none lg:hidden z-50">
      <motion.nav
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="
          pointer-events-auto
          flex items-center gap-8
          bg-base-100/80 backdrop-blur-xl
          px-8 py-4
          rounded-full
          shadow-2xl
          border border-base-300/50
          relative
          overflow-hidden
        "
      >
        {/* Brilho sutil de fundo */}
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-secondary/5" />

        {navData.links.map((item, index) => {
          const IconSet = iconsMap[item.icon];

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={false} 
              className="relative"
            >
              {({ isActive }) => (
                <motion.div
                  whileHover={{ scale: 1.1, y: -4 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 400,
                    damping: 17
                  }}
                  className="relative flex flex-col items-center gap-2 py-1"
                >
                  {/* Ícone */}
                  <div className={`
                    transition-colors duration-300
                    ${isActive
                      ? 'text-primary'
                      : 'text-base-content/60'
                    }
                  `}>
                    {IconSet && (
                      isActive
                        ? <IconSet.solid className="w-7 h-7" />
                        : <IconSet.outline className="w-7 h-7" />
                    )}
                  </div>

                  {/* Linha animada embaixo - sempre visível, apenas muda de posição */}
                  {isActive && (
                    <motion.div
                      layoutId="activeLine"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30
                      }}
                      className="absolute -bottom-1 w-6 h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50 rounded-full"
                    />
                  )}
                </motion.div>
              )}
            </NavLink>
          );
        })}

        {/* Efeito de brilho animado */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
            repeatDelay: 5
          }}
        />
      </motion.nav>
    </div>
  );
}