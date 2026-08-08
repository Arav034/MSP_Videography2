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
        className="absolute inset-0 z-0 scale-110 bg-cover bg-center blur-l"
        style={{
          backgroundImage: "url('/images/background.png')",
        }}
      />

      {/* Background overlay */}
      <div className="absolute inset-0 z-0 bg-white/50" />

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
        <section className="max-w-3xl mx-auto px-6 md:px-10 pb-24">

          {/* FAQ Card */}
         <div className="bg-white/55 backdrop-blur-m border border-white/70 rounded-2xl p-6 md:p-10">

            {FAQ_CATEGORIES.map((cat) => (
              <div
                key={cat.category}
                className="mb-16 last:mb-0"
              >
                <p className="font-mono text-sm md:text-base font-bold tracking-widest2 uppercase text-black mb-5">
                  {cat.category}
                </p>

                <Accordion items={cat.items} />
              </div>
            ))}

          </div>

        </section>

      </div>
    </main>
  );
}