import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { BellIcon, EnvelopeIcon } from "@heroicons/react/24/solid";

export default function Navbar() {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 h-16 bg-base-100 flex items-center justify-between px-4 shadow-lg border-b border-base-300 z-50"
    >
      {/* Logo - PC and Mobile */}
      <motion.div
        className="flex items-center gap-2"
        whileHover={{ scale: 1.05 }}
      >
        <span className="text-xl font-bold text-primary">Horizonte</span>
      </motion.div>

      {/* Right Side - PC: Email and Notifications */}
      <div className="hidden lg:flex items-center gap-4">
        {/* Email Link */}
        <NavLink
          to="/mailbox"
          className={({ isActive }) =>
            `btn btn-ghost btn-circle ${isActive ? "bg-primary text-primary-content" : ""}`
          }
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <EnvelopeIcon className="w-5 h-5" />
          </motion.div>
        </NavLink>

        {/* Notifications Link */}
        <NavLink
          to="/notifications"
          className={({ isActive }) =>
            `btn btn-ghost btn-circle relative ${isActive ? "bg-primary text-primary-content" : ""}`
          }
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <BellIcon className="w-5 h-5" />
            <span className="badge badge-xs badge-primary indicator-item absolute -top-1 -right-1">3</span>
          </motion.div>
        </NavLink>
      </div>

      {/* Mobile: Just Notifications Link */}
      <div className="lg:hidden flex items-center">
        <NavLink
          to="/notifications"
          className={({ isActive }) =>
            `btn btn-ghost btn-circle relative ${isActive ? "bg-primary text-primary-content" : ""}`
          }
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <BellIcon className="w-5 h-5" />
            <span className="badge badge-xs badge-primary indicator-item absolute -top-1 -right-1">3</span>
          </motion.div>
        </NavLink>
      </div>
    </motion.header>
  );
}