import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UploadCloud } from "lucide-react";
import FocusFrame from "@/components/ui/FocusFrame";
import { ROUTES } from "@/constants/routes";

export default function Hero() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => setOffset(window.scrollY * 0.3);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/images/timeline2.png"
          alt=""
          style={{ transform: `translateY(${offset}px)`, filter: "blur(2px)" }}
          // className="w-full h-[100%] object-cover will-change-transform scale-105"
          
          className="absolute inset-0 w-full h-full object-cover will-change-transform scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/40" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-10 py-60 md:py-40 flex flex-col items-center text-center">
        <span className="eyebrow mb-6 text-frost/70">
          <p className="font-display text-1xl md:text-2xl text-frost">
            Portraits · Weddings · Commercial · Film
          </p>
        </span>

        <FocusFrame padding="p-4">
          <p className="font-display text-5xl md:text-8xl leading-tight max-w-3xl text-frost">
            Cut. Shape. Inspire.
          </p>
        </FocusFrame>

        <p className="mt-8 text-frost/70 max-w-md">
          Let's compose your Next Story.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <FocusFrame padding="p-1">
            <Link to={ROUTES.BOOK} className="btn-primary rounded-lg">
              Book a Session
            </Link>
          </FocusFrame>
          <FocusFrame padding="p-1">
            <Link
              to={ROUTES.PORTFOLIO}
              className="inline-flex items-center gap-2 border border-frost/40 text-frost px-6 py-3
                         text-sm tracking-wideish uppercase font-body
                         transition-colors duration-300 ease-frame
                         hover:border-frost hover:bg-frost/10 rounded-lg"
            >
              View Portfolio
            </Link>
          </FocusFrame>
        </div>
      </div>

      <button
        type="button"
        onClick={() =>
          document.getElementById("upload-section")?.scrollIntoView({ behavior: "smooth" })
        }
        className="absolute top-6 md:top-10 right-6 z-10 flex items-center gap-2 bg-white/10 backdrop-blur-sm
                   border border-white/20 text-frost pl-3 pr-4 py-2.5 text-xs font-mono tracking-wideish uppercase
                   hover:bg-white/20 hover:border-white/30 transition-colors duration-300 animate-bounce-slow rounded-lg"
      >
        <UploadCloud size={15} />
        Upload Files to Edit
      </button>
    </section>
  );
}