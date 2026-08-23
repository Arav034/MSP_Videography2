import { Link } from "react-router-dom";
import { Star, ShieldCheck } from "lucide-react";
import FocusFrame from "@/components/ui/FocusFrame";
import { ROUTES } from "@/constants/routes";

export default function ClosingCta() {
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10 py-24 text-center">
      <div className="flex items-center justify-center gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
        ))}
        <span className="ml-2 font-mono text-xs tracking-wideish text-steel">
          4.9/5 from 150+ clients
        </span>
      </div>

      <span className="eyebrow mb-4 block">Ready When You Are</span>
      <h2 className="font-display text-4xl md:text-5xl max-w-2xl mx-auto">
        Let's compose your next frame.
      </h2>

      <div className="mt-10 flex flex-col items-center gap-5">
        <FocusFrame padding="p-1">
          <Link to={ROUTES.BOOK} className="btn-primary rounded-lg">
            Book a Session
          </Link>
        </FocusFrame>

        <p className="flex items-center gap-2 text-xs font-mono tracking-wideish uppercase text-steel">
          <ShieldCheck size={15} className="text-brand" />
          100% Satisfaction Guaranteed
        </p>
      </div>
    </section>
  );
}