import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { BellIcon, EnvelopeIcon } from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function Navbar() {
  const [notificationCount, setNotificationCount] = useState(0);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  // Listener de autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user.uid);
      } else {
        setCurrentUser(null);
        setNotificationCount(0);
      }
    });

    return () => unsubscribe();
  }, []);

  // Listener em tempo real para notificações
  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, 'notifications'),
      where('uid', '==', currentUser),
      where('read', '==', false) // Apenas notificações não lidas
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setNotificationCount(snapshot.size);
    }, (error) => {
      console.error('Erro ao escutar notificações:', error);
    });

    return () => unsubscribe();
  }, [currentUser]);

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
            className="relative"
          >
            <BellIcon className="w-5 h-5" />
            {notificationCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="badge badge-xs badge-primary absolute -top-1 -right-1"
              >
                {notificationCount > 99 ? '99+' : notificationCount}
              </motion.span>
            )}
          </motion.div>
        </NavLink>
      </div>

      {/* Mobile: Email and Notifications */}
      <div className="lg:hidden flex items-center gap-2">
        {/* Email Link - Mobile */}
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

        {/* Notifications Link - Mobile */}
        <NavLink
          to="/notifications"
          className={({ isActive }) =>
            `btn btn-ghost btn-circle relative ${isActive ? "bg-primary text-primary-content" : ""}`
          }
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <BellIcon className="w-5 h-5" />
            {notificationCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="badge badge-xs badge-primary absolute -top-1 -right-1"
              >
                {notificationCount > 99 ? '99+' : notificationCount}
              </motion.span>
            )}
          </motion.div>
        </NavLink>
      </div>
    </motion.header>
  );
}