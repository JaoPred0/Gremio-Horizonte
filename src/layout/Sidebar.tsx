import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { getUserRole, roles } from "@/data/roles";
import { roleIcons } from "@/utils/roleIcons";
import { useNavigate } from "react-router-dom";
import navData from "@/data/navLinks.json";
import {
  HomeIcon,
  ChevronRightIcon,
  Cog6ToothIcon,
  Squares2X2Icon,
  BookOpenIcon,
} from "@heroicons/react/24/solid";
import { LogOut, User } from "lucide-react";

interface SidebarProps {
  expanded: boolean;
  onToggle: () => void;
}

const iconsMap = {
  HomeIcon: HomeIcon,
  ConfigIcon: Cog6ToothIcon,
  AppIcon: Squares2X2Icon,
  Estudos: BookOpenIcon
}
const listVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -8 },
  show: { opacity: 1, x: 0 },
};


function NavItem({ item, expanded }) {
  const Icon = iconsMap[item.icon] || HomeIcon;
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => !expanded && setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <NavLink to={item.path}>
        {({ isActive }) => (
          <motion.div
            variants={itemVariants}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            className={`relative flex items-center rounded-xl px-3 py-3 transition-all duration-200 cursor-pointer group ${expanded ? 'gap-3' : 'justify-center'
              } ${isActive
                ? "bg-primary text-primary-content shadow-lg"
                : "text-base-content/70 hover:text-base-content hover:bg-base-300"
              }`}
          >
            <motion.div
              className="flex items-center justify-center w-6 h-6"
              whileHover={{ scale: 1.1 }}
            >
              <Icon className="w-6 h-6" />
            </motion.div>

            <AnimatePresence mode="wait">
              {expanded && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="font-medium text-sm whitespace-nowrap overflow-hidden"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>

            {isActive && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-content rounded-r-full"
              />
            )}
          </motion.div>
        )}
      </NavLink>

      {showTooltip && !expanded && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="
      absolute left-full ml-3 top-1/2 -translate-y-1/2
      px-3 py-2
      bg-base-300
      text-base-content
      text-sm
      rounded-lg
      shadow-xl
      border border-base-content/10
      whitespace-nowrap
      z-50
      pointer-events-none
    "
        >
          {item.label}
        </motion.div>
      )}
    </div>
  );
}

export default function Sidebar({ expanded, onToggle }: SidebarProps) {
  const [user] = useAuthState(auth);
  const userRole = getUserRole(user?.email);
  const RoleIcon = roleIcons[userRole.key] || User;
  const navigate = useNavigate();
  function getFirstName(user: any) {
    if (user?.displayName) {
      return user.displayName.split(" ")[0];
    }

    if (user?.email) {
      return user.email.split("@")[0].split(".")[0];
    }

    return "Usuário";
  }

  function getPhotoURL(user: any) {
    return user?.photoURL || null;
  }

  return (
    <motion.aside
      animate={{ width: expanded ? 280 : 80 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="
        hidden lg:flex
        flex-col
        fixed
        top-16
        left-0
        h-[calc(100vh-4rem)]
        z-40
        bg-base-200
        border-r
        border-base-300
        shadow-2xl
      "
    >
      {/* HEADER */}
      <div className="relative px-4 py-5 border-b border-base-300">
        {/* Header */}
        <div
          className={`flex items-center transition-all ${expanded ? "gap-3 justify-start" : "justify-center"
            }`}
        >
          {/* Logo */}
          <motion.div
            layout
            whileHover={{ scale: 1.08, rotate: 1 }}
            className={`
    w-11 h-11 rounded-2xl
    flex items-center justify-center
    shadow-lg
    ring-1 ring-white/10
    transition-all
    ${userRole.color}
  `}
          >
            <RoleIcon className="w-5 h-5 drop-shadow-sm" />
          </motion.div>

          {/* Brand */}
          <AnimatePresence mode="wait">
            {expanded && (
              <motion.div
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.2 }}
                className="leading-tight"
              >
                <span
                  className={`
    mt-1 inline-flex items-center gap-1
    px-3 py-1
    rounded-full
    text-[11px] font-semibold tracking-wide
    shadow-sm
    transition-all duration-300
    hover:scale-105 hover:shadow-lg
    ${userRole.color}
  `}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse" />
                  {userRole.label}
                </span>


                <h1 className="font-semibold text-base-content capitalize">
                  {user?.displayName
                    ? user.displayName.split(" ")[0]
                    : user?.email
                      ? user.email.split("@")[0].split(".")[0]
                      : "Usuário"}
                </h1>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Toggle */}
        <motion.button
          onClick={onToggle}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.95 }}
          className="
      absolute -right-3 top-1/2 -translate-y-1/2
      w-8 h-8 rounded-full
      bg-base-100/80 backdrop-blur
      border border-base-300
      flex items-center justify-center
      shadow-xl
      hover:bg-primary hover:text-primary-content
      transition-colors
    "
        >
          <motion.span
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
          >
            <ChevronRightIcon className="w-4 h-4" />
          </motion.span>
        </motion.button>

        {/* Glow */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      </div>


      <nav className="relative flex-1 px-3 py-6 overflow-y-auto">
        <AnimatePresence mode="wait">
          {expanded && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-3 mb-3 text-xs font-semibold text-base-content/50 uppercase tracking-wider"
            >
              Menu
            </motion.p>
          )}
        </AnimatePresence>

        <motion.div
          variants={listVariants}
          initial="hidden"
          animate="show"
          className="space-y-2"
        >
          {navData.links.map((item) => (
            <NavItem key={item.path} item={item} expanded={expanded} />
          ))}
        </motion.div>
      </nav>

      <div className="relative border-t border-base-300 p-4">
        <motion.div
          onClick={() => navigate("/config/perfil")}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`
      flex items-center rounded-xl p-3
      transition-all cursor-pointer
      ${expanded ? "gap-3" : "justify-center"}
      bg-base-200 hover:bg-base-300
    `}
        >
          {/* ÍCONE DE USUÁRIO */}
          <div
            className={`
    w-10 h-10 rounded-full
    flex items-center justify-center
    shrink-0
    shadow-md
    ring-1 ring-white/20
    ${userRole.color}
  `}
          >
            {RoleIcon ? (
              <RoleIcon className="w-5 h-5 text-white drop-shadow-sm" />
            ) : (
              <User className="w-5 h-5 text-white" />
            )}
          </div>


          {/* INFO DO USUÁRIO */}
          <AnimatePresence mode="wait">
            {expanded && user && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="flex-1 min-w-0"
              >
                <p className="text-sm font-semibold text-base-content truncate">
                  {getFirstName(user).charAt(0).toUpperCase() +
                    getFirstName(user).slice(1)}
                </p>
                <p className="text-xs text-base-content/60 truncate">
                  {user.email}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* BOTÃO SAIR (NÃO NAVEGA) */}
          {expanded && (
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                signOut(auth);
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="
          p-2 rounded-lg
          text-error
          hover:bg-error/10
          transition
        "
              title="Sair"
            >
              <LogOut className="w-4 h-4" />
            </motion.button>
          )}
        </motion.div>
      </div>


    </motion.aside>
  );
}