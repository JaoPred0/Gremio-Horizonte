import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import MobileDock from "./Dock";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();

  // Páginas públicas onde não mostra a navegação
  const hideNav = ["/login", "/register", "/verificar-email", "/forgot-password", "/"].includes(location.pathname);

  if (hideNav) return <>{children}</>;

  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      <Navbar />
      <div className="flex flex-1 pt-16">
        <Sidebar />

        {/* Conteúdo principal */}
        <main className="flex-1 lg:ml-20 p-4">
          {children}
        </main>

        <MobileDock />
      </div>
    </div>
  );
}
