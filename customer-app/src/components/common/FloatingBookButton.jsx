import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Camera } from "lucide-react";
import { cn } from "@/utils/cn";
import { ROUTES } from "@/constants/routes";

export default function FloatingBookButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Link
      to={ROUTES.BOOK}
      className={cn(
        "fixed bottom-6 left-6 z-30 flex items-center gap-2 bg-brand text-white pl-4 pr-5 py-3",
        "text-sm tracking-wideish uppercase font-body shadow-lg",
        "transition-all duration-300 ease-frame hover:bg-brand-dark rounded-lg",
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none"
      )}
    >
      <Camera size={16} />
      Book a Session
    </Link>
  );
}