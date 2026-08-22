import { NavLink } from "react-router-dom";
import { cn } from "@/utils/cn";
import FocusFrame from "@/components/ui/FocusFrame";
import { NAV_ITEMS } from "@/constants/navContent";

export default function Navbar() {
  return (
    <nav className="hidden md:flex items-center gap-1">
      {NAV_ITEMS.map((item) => (
        <FocusFrame key={item.to} padding="p-1">
          <NavLink
            to={item.to}
            end
            className={({ isActive }) =>
                cn("nav-link font-nav block px-3 py-1", isActive  ? "text-blue font-bold"
                  : "hover:text-black/90")
              }
          >
            {item.label}
          </NavLink>
        </FocusFrame>
      ))}
    </nav>
  );
}