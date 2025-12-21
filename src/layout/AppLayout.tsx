import React, { useEffect, useState, ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useMediaQuery } from "react-responsive";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import MobileDock from "./Dock";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isDesktop = useMediaQuery({ minWidth: 1024 });

  const hideNav = [
    "/login",
    "/register",
    "/verificar-email",
    "/forgot-password",
    "/",
  ].includes(location.pathname);

  // Carregar tema apenas quando houver Navbar/Sidebar
  useEffect(() => {
    if (!hideNav) {
      setMounted(true);
      const savedTheme = localStorage.getItem("selectedTheme");
      if (savedTheme) {
        document.documentElement.setAttribute("data-theme", savedTheme);
      }
    }
  }, [hideNav]);

  if (hideNav) return <>{children}</>;

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-base-100 text-base-content transition-colors duration-300">
      {/* NAVBAR */}
      <Navbar />

      <div className="pt-16 flex">
        <div className="hidden lg:block">
          <Sidebar
            expanded={sidebarExpanded}
            onToggle={() => setSidebarExpanded((v) => !v)}
          />
        </div>

        {/* CONTEÚDO */}
        <motion.main
          style={{
            marginLeft: isDesktop ? (sidebarExpanded ? 280 : 80) : 0,
          }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
          className="flex-1 min-h-[calc(100vh-4rem)] pb-30 sm:p-6"
        >
          {children}
        </motion.main>
      </div>

      {/* DOCK — SOMENTE MOBILE */}
      <div className="lg:hidden">
        <MobileDock />
      </div>
    </div>
  );
}
