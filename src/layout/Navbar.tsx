import { NavLink } from "react-router-dom";
import { SettingsIcon } from "lucide-react";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-base-200 flex items-center justify-between px-4 shadow-md z-50">
      <div className="text-xl font-bold text-primary">Horizonte</div>
      <nav className="hidden md:flex items-center gap-4">
        <NavLink to="/home" className="hover:text-primary">Home</NavLink>
        <NavLink to="/perfil" className="hover:text-primary">Perfil</NavLink>
        <NavLink to="/config" className="hover:text-primary">Config</NavLink>
      </nav>
      <button className="md:hidden p-2 rounded hover:bg-base-300">
        <SettingsIcon className="w-5 h-5" />
      </button>
    </header>
  );
}
