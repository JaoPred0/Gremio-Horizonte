import { ReactNode, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import MobileDock from "./Dock";
import { useMediaQuery } from "react-responsive";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const isDesktop = useMediaQuery({ minWidth: 1024 });

  const hideNav = [
    "/login",
    "/register",
    "/verificar-email",
    "/forgot-password",
    "/",
  ].includes(location.pathname);

  if (hideNav) return <>{children}</>;

  return (
    <div className="min-h-screen bg-base-100">
      {/* NAVBAR */}
      <Navbar />

      <div className="pt-16 flex">
        {/* SIDEBAR — SOMENTE DESKTOP */}
        <div className="hidden lg:block">
          <Sidebar
            expanded={sidebarExpanded}
            onToggle={() => setSidebarExpanded((v) => !v)}
          />
        </div>

        {/* CONTEÚDO */}
        <motion.main
          animate={{
            marginLeft: isDesktop
              ? sidebarExpanded
                ? 280
                : 80
              : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 28,
          }}
          className="
    flex-1
    min-h-[calc(100vh-4rem)]
    p-4 sm:p-6
  "
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
