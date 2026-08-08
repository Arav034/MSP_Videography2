import { Link } from "react-router-dom";
import FocusFrame from "@/components/ui/FocusFrame";
import ServicesExplorer from "@/components/sections/ServicesExplorer";
import { ROUTES } from "@/constants/routes";
import SEO from "@/components/common/SEO";

export default function ServicesPage() {
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

      {/* Page content */}
      <div className="relative z-10">

        <section className="max-w-4xl mx-auto px-6 md:px-10 pt-24 pb-16 text-center">
          <span className="eyebrow mb-6">Full Service Range</span>

          <h1 className="font-display text-5xl md:text-6xl leading-tight">
            Everything we shoot, edit, and produce.
          </h1>

          <p className="mt-6 text-steel max-w-lg mx-auto">
            From candid family sessions to full broadcast production — browse
            by category to find the right fit for your project.
          </p>
        </section>

        <section className="max-w-7xl mx-auto px-6 md:px-10 pb-20">
          <ServicesExplorer />
        </section>

        <section className="bg-ink text-frost">
          {/* <div className="max-w-7xl mx-auto px-6 md:px-10 py-20 text-center">
            

            <h2 className="font-display text-3xl md:text-4xl max-w-xl mx-auto mb-8">
              Tell us your project — we'll recommend the right service.
            </h2>

            <FocusFrame padding="p-1">
              <Link to={ROUTES.BOOK} className="btn-primary">
                Book a Session
              </Link>
            </FocusFrame>
          </div> */}
        </section>

      </div>
    </main>
  );
}