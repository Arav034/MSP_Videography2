import { useState, useMemo } from "react";
import CategoryTabs from "@/components/common/CategoryTabs";
import WorkCard from "@/components/cards/WorkCard";
import Lightbox from "@/components/common/Lightbox";
import { PORTFOLIO_CATEGORIES, PORTFOLIO_ITEMS } from "@/constants/portfolioContent";
import SEO from "@/components/common/SEO";

export default function Portfolio() {
  const [activeId, setActiveId] = useState("all");
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const filtered = useMemo(() => {
    if (activeId === "all") return PORTFOLIO_ITEMS;
    return PORTFOLIO_ITEMS.filter((item) => item.category === activeId);
  }, [activeId]);

 return (
  <main className="relative min-h-screen overflow-hidden">

    {/* Blurred background */}
    <div
      className="absolute inset-0 z-0 scale-110 bg-cover bg-center blur-l"
      style={{
        backgroundImage: "url('/images/background.jpg')",
      }}
    />

    {/* Background overlay */}
    <div className="absolute inset-0 z-0 bg-white/60" />

    {/* Content */}
    <div className="relative z-10">

      <section className="max-w-4xl mx-auto px-6 md:px-10 pt-24 pb-12 text-center">
        <span className="eyebrow mb-6">Selected Work</span>

        <h1 className="font-display text-5xl md:text-6xl leading-tight">
          The Portfolio
        </h1>

        <p className="mt-6 text-steel max-w-lg mx-auto">
          A collection of portraits, weddings, commercial work, and film —
          browse by category or view it all.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-6 md:px-10 pb-24">
        <div className="flex justify-center mb-12">
          <CategoryTabs
            categories={PORTFOLIO_CATEGORIES}
            activeId={activeId}
            onChange={setActiveId}
          />
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {filtered.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setLightboxIndex(idx)}
                className="text-left focus:outline-none"
              >
                <WorkCard {...item} />
              </button>
            ))}
          </div>
        ) : (
          <p className="text-center text-steel">
            No work in this category yet.
          </p>
        )}
      </section>

      {lightboxIndex !== null && (
        <Lightbox
          items={filtered}
          activeIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}

    </div>
  </main>
);
}