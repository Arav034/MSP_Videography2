import { useScrollProgress } from "@/hooks/useScrollProgress";
import { cn } from "@/utils/cn";
import { PROCESS_STEPS } from "@/constants/homeContent";

export default function Process() {
  const [ref, progress] = useScrollProgress();

  return (
    <section ref={ref} className="max-w-7xl mx-auto px-10md:px-10 py-24">
      <div className="text-center mb-16">
        <span className="eyebrow mb-3 block">How It Works</span>
        <h2 className="font-display text-3xl md:text-5xl">Our Process</h2>
      </div>

      {/* Desktop — horizontal fill line */}
      <div className="hidden md:block relative">
        <div className="absolute top-5 left-0 right-0 h-px bg-mist" />
        <div
          className="absolute top-5 left-0 h-px bg-brand"
          style={{ width: `${progress * 100}%` }}
        />

        <div className="relative grid grid-cols-4 gap-10">
          {PROCESS_STEPS.map((step, idx) => {
            const threshold = idx / (PROCESS_STEPS.length - 1);
            const active = progress >= threshold - 0.05;
            return (
              <div key={step.index} className="flex flex-col items-center text-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-mono text-sm border transition-colors duration-500",
                    active
                      ? "bg-brand border-brand text-white"
                      : "bg-frost border-mist text-steel"
                  )}
                >
                  {step.index}
                </div>
                <h3 className="font-display text-xl mt-5 mb-2">{step.title}</h3>
                <p className="text-sm text-steel leading-relaxed max-w-[220px]">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile — vertical fill line */}
      <div className="md:hidden relative">
        <div className="absolute top-1 bottom-1 left-4 w-px bg-mist" />
        <div
          className="absolute top-1 left-4 w-px bg-brand"
          style={{ height: `${progress * 100}%` }}
        />

        <div className="flex flex-col gap-10">
          {PROCESS_STEPS.map((step, idx) => {
            const threshold = idx / (PROCESS_STEPS.length - 1);
            const active = progress >= threshold - 0.05;
            return (
              <div key={step.index} className="relative pl-12">
                <div
                  className={cn(
                    "absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs border transition-colors duration-500",
                    active
                      ? "bg-brand border-brand text-white"
                      : "bg-frost border-mist text-steel"
                  )}
                >
                  {step.index}
                </div>
                <h3 className="font-display text-lg mb-1">{step.title}</h3>
                <p className="text-sm text-steel leading-relaxed">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}