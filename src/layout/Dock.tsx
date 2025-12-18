import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import navData from "@/data/navLinks.json";
import { HomeIcon, UserIcon, SettingsIcon } from "lucide-react";

const iconsMap: Record<string, JSX.Element> = {
  HomeIcon: <HomeIcon />,
  UserIcon: <UserIcon />,
  SettingsIcon: <SettingsIcon />
};

export default function Dock() {
  return (
    <motion.nav
      initial={{ y: 50 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 120 }}
      className="fixed bottom-0 left-0 right-0 flex justify-around bg-base-200 p-3 shadow-lg lg:hidden"
    >
      {navData.links.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex flex-col items-center text-xs text-base-content hover:text-primary ${
              isActive ? "text-primary" : ""
            }`
          }
        >
          {iconsMap[item.icon]}
        </NavLink>
      ))}
    </motion.nav>
  );
}
