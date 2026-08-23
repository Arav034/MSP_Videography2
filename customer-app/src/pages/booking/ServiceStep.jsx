import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/utils/cn";
import FocusFrame from "@/components/ui/FocusFrame";
import { SERVICE_CATEGORIES } from "@/constants/homeContent";
import { BOOKING_SERVICE_OPTIONS } from "@/constants/bookingContent";

export default function ServiceStep({ value, onChange, onNext }) {
  const [activeCategory, setActiveCategory] = useState(null);

  const filteredOptions = activeCategory
    ? BOOKING_SERVICE_OPTIONS.filter((opt) => opt.category === activeCategory.label)
    : [];

  const handleSelectCategory = (cat) => {
    setActiveCategory(cat);
    if (value && value.category !== cat.label) {
      onChange(null);
    }
  };

  return (
    <div>
      <p className="eyebrow mb-2 text-center">Step 1 of 4</p>
      {!activeCategory ? (
        <>
          <h2 className="font-display text-3xl text-center mb-10">
            What kind of service do you need?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SERVICE_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <FocusFrame key={cat.id} padding="p-0" className="block w-full">
                  <button
                    type="button"
                    onClick={() => handleSelectCategory(cat)}
                    className="w-full h-full text-left border border-mist bg-white p-6
                               transition-colors duration-300 hover:border-brand"
                  >
                    <div className="w-11 h-11 flex items-center justify-center bg-brand/10 text-brand mb-4">
                      <Icon size={20} strokeWidth={1.5} />
                    </div>
                    <p className="font-display text-lg text-ink mb-1">{cat.label}</p>
                    <p className="font-mono text-xs tracking-wideish uppercase text-steel">
                      {cat.count} {cat.count === 1 ? "Service" : "Services"}
                    </p>
                  </button>
                </FocusFrame>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <button
            type="button"
            onClick={() => setActiveCategory(null)}
            className="flex items-center gap-2 text-xs text-steel hover:text-brand transition-colors mb-6 mx-auto"
          >
            <ArrowLeft size={14} />
            Change Category
          </button>

          <h2 className="font-display text-3xl text-center mb-10">
            Choose a {activeCategory.label.toLowerCase()} service
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOptions.map((option) => {
              const isSelected = value?.title === option.title;
              return (
                <FocusFrame key={option.title} padding="p-0" className="block w-full">
                  <button
                    type="button"
                    onClick={() => onChange(option)}
                    className={cn(
                      "w-full h-full text-left border p-6 transition-colors duration-300",
                      isSelected ? "border-brand bg-brand/5" : "border-mist bg-white hover:border-brand"
                    )}
                  >
                    <p className="font-mono text-xs tracking-wideish uppercase text-steel mb-2">
                      {option.category}
                    </p>
                    <p className="font-display text-lg text-ink">{option.title}</p>
                  </button>
                </FocusFrame>
              );
            })}
          </div>

          <div className="mt-12 flex justify-center">
            <button
              type="button"
              disabled={!value}
              onClick={onNext}
              className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed rounded-lg"
            >
              Continue
            </button>
          </div>
        </>
      )}
    </div>
  );
}