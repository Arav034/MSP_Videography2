import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import MobileMenu from "@/components/layout/MobileMenu";
import FocusFrame from "@/components/ui/FocusFrame";
import { ROUTES } from "@/constants/routes";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* <header className="fixed top-0 left-0 right-0 z-50 bg-frost/90 backdrop-blur-md border-b border-mist shadow-sm transition-all duration-300"> */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-20 flex items-center justify-between">
          {/* Logo */}
          <FocusFrame padding="p-1">
            <Link
              to={ROUTES.HOME}
              className="font-display font-semibold text-2xl tracking-wideish text-white"
            >
              MSP <span className="text-brand font-bold">VIDEOGRAPHY</span>
            </Link>
          </FocusFrame>

          {/* Desktop Navigation */}
          <Navbar />

          {/* Right Side */}
          <div className="flex items-center gap-3">
            <FocusFrame padding="p-1" className="hidden md:block">
              <Link to={ROUTES.BOOK} className="btn-primary">
                Book a Session
              </Link>
            </FocusFrame>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen((prev) => !prev)}
              className="md:hidden flex flex-col items-center justify-center gap-[5px] w-10 h-10"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              <span
                className={`block h-[2px] w-6 bg-ink transition-all duration-300 ${
                  mobileOpen ? "translate-y-[7px] rotate-45" : ""
                }`}
              />
              <span
                className={`block h-[2px] w-6 bg-ink transition-all duration-300 ${
                  mobileOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`block h-[2px] w-6 bg-ink transition-all duration-300 ${
                  mobileOpen ? "-translate-y-[7px] -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </div>

        <MobileMenu
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
        />
      </header>

      {/* Spacer so page content starts below the fixed header */}
      <div className="h-20" />
    </>
  );
}