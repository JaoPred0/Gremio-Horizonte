import { NavLink } from "react-router-dom";
import navData from "@/data/navLinks.json";
import { HomeIcon, UserIcon, SettingsIcon } from "lucide-react";

const iconsMap: Record<string, JSX.Element> = {
  HomeIcon: <HomeIcon />,
  UserIcon: <UserIcon />,
  SettingsIcon: <SettingsIcon />
};

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-20 bg-base-200 p-4 gap-4 fixed h-full">
      {navData.links.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex items-center justify-center w-12 h-12 rounded-lg hover:bg-primary/20 transition-colors ${
              isActive ? "bg-primary text-white" : "text-base-content"
            }`
          }
        >
          {iconsMap[item.icon]}
        </NavLink>
      ))}
    </aside>
  );
}
