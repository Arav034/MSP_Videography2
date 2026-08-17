import { Link } from "react-router-dom";
import FocusFrame from "@/components/ui/FocusFrame";
import SectionHeading from "@/components/common/SectionHeading";
import StatBlock from "@/components/common/StatBlock";
import ValueCard from "@/components/cards/ValueCard";
import TeamCard from "@/components/cards/TeamCard";
import {
  STUDIO_VALUES,
  STUDIO_STATS,
  STUDIO_TEAM,
} from "@/constants/aboutContent";
import { ROUTES } from "@/constants/routes";
import SEO from "@/components/common/SEO";

export default function About() {
  return (
    <main className="relative min-h-screen overflow-hidden">

      {/* Blurred Background */}
      <div
        className="absolute inset-0 z-0 scale-110 bg-cover bg-center blur-l"
        style={{
          // backgroundImage: "url('/images/background2.png')",
                    backgroundImage: "url('/images/image1.png')",

        }}
      />

      {/* Background Overlay */}
      <div className="absolute inset-0 z-0 bg-white/40" />

      {/* Page Content */}
      <div className="relative z-10">

        {/* Hero */}
        <section className="max-w-4xl mx-auto px-6 md:px-10 pt-24 pb-16 text-center">
          <span className="eyebrow mb-6">Our Story</span>

          <h1 className="font-display text-5xl md:text-6xl leading-tight">
            Built on patience, precision, and light.
          </h1>
        </section>

        {/* Story */}
        <section className="max-w-7xl mx-auto px-6 md:px-10 pb-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <FocusFrame padding="p-0" className="block w-full">
            <img
              src="https://picsum.photos/seed/studiofounder/900/1100"
              alt="Lumen Studio at work"
              className="w-full aspect-[4/5] object-cover border border-mist"
            />
          </FocusFrame>

          <div>
            <span className="eyebrow mb-4 block">Since 2017</span>

            <h2 className="font-display text-3xl md:text-4xl mb-6">
              A studio founded on one idea.
            </h2>

            <p className="text-steel leading-relaxed mb-4">
              MSP Videography began with a simple frustration: too much
              photography felt rushed, staged, or generic. We started this
              studio to slow the process down — to actually understand the
              people and brands in front of the lens before a single frame is
              shot.
            </p>

            <p className="text-steel leading-relaxed">
              Today, that same principle guides every session, from an
              intimate portrait to a full broadcast production. We're small
              enough to stay hands-on, and precise enough to be trusted with
              the moments that matter most.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="bg-white/50 border-y border-mist">
          <div className="max-w-7xl mx-auto px-6 md:px-10 py-20">
            <SectionHeading
              eyebrow="What Guides Us"
              title="Our Values"
              align="center"
            />

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {STUDIO_VALUES.map((value) => (
                <ValueCard key={value.title} {...value} />
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-ink text-frost">
          <div className="max-w-7xl mx-auto px-6 md:px-10 py-20">
            <span className="font-mono text-xs tracking-widest2 uppercase text-frost/50 block text-center mb-12">
              The Studio In Numbers
            </span>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
              {STUDIO_STATS.map((stat) => (
                <StatBlock key={stat.label} {...stat} />
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="max-w-7xl mx-auto px-6 md:px-10 py-20">
          <SectionHeading
            eyebrow="Behind The Lens"
            title="Meet the Team"
            align="center"
          />

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {STUDIO_TEAM.map((member) => (
              <TeamCard key={member.name} {...member} />
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-7xl mx-auto px-6 md:px-10 pb-24 text-center">
          <span className="eyebrow mb-4 block">Ready When You Are</span>

          <h2 className="font-display text-4xl md:text-5xl max-w-2xl mx-auto mb-10">
            Let's compose your next frame.
          </h2>

          <FocusFrame padding="p-1">
            <Link to={ROUTES.BOOK} className="btn-primary">
              Book a Session
            </Link>
          </FocusFrame>
        </section>

      </div>
    </main>
  );
}