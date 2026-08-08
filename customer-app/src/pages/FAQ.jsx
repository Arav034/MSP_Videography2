import { Link } from "react-router-dom";
import SEO from "@/components/common/SEO";
import Accordion from "@/components/common/Accordion";
import { FAQ_CATEGORIES } from "@/constants/faqContent";
import { ROUTES } from "@/constants/routes";

export default function FAQ() {
  return (
    <main className="relative min-h-screen overflow-hidden">

      {/* Blurred background */}
      <div
        className="absolute inset-0 z-0 scale-110 bg-cover bg-center blur-x"
        style={{
          backgroundImage: "url('/images/background.jpg')",
        }}
      />

      {/* Background overlay */}
      <div className="absolute inset-0 z-0 bg-white/60" />

      {/* Page content */}
      <div className="relative z-10">

        {/* Hero */}
        <section className="max-w-4xl mx-auto px-6 md:px-10 pt-24 pb-16 text-center">
          <span className="eyebrow mb-6 text-grey">
            Questions & Answers
          </span>

          <h1 className="font-display text-5xl md:text-6xl leading-tight">
            Frequently Asked Questions
          </h1>

          <p className="mt-6 text-grey max-w-lg mx-auto">
            Everything you need to know about booking, pricing, editing, and
            dubbing. Can't find your answer?{" "}
            <Link
              to={ROUTES.CONTACT}
              className="text-brand hover:underline"
            >
              Get in touch
            </Link>
            .
          </p>
        </section>

        {/* FAQ */}
        <section className="max-w-3xl mx-auto px-6 md:px-10 pb-24 text-black">
          {FAQ_CATEGORIES.map((cat) => (
            <div
              key={cat.category}
              className="mb-14 last:mb-0"
            >
              <p className="font-mono text-sm md:text-base tracking-widest2 uppercase text-black mb-4">
                {cat.category}
              </p>

              <Accordion items={cat.items} />
            </div>
          ))}
        </section>

      </div>
    </main>
  );
}