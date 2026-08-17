import { Mail, Phone, MapPin, Clock } from "lucide-react";
import ContactForm from "@/components/forms/ContactForm";
import SEO from "@/components/common/SEO";

const CONTACT_INFO = [
  {
    icon: Mail,
    label: "Email",
    value: "mspvideograph@gmail.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+91 8838346319",
  },
  {
    icon: MapPin,
    label: "Studio",
    value: "10/10E, Vengatesh nagar, Melur, Madurai District, Tamil Nadu - 625106, India.",
  },
  {
    icon: Clock,
    label: "Hours",
    value: "Mon–Sat, 9:00 AM – 6:00 PM",
  },
];

export default function Contact() {
  return (
    <main className="relative min-h-screen overflow-hidden">

      {/* Blurred Background */}
      <div
        className="absolute inset-0 z-0 scale-110 bg-cover bg-center blur-l"
        style={{
          backgroundImage: "url('/images/image1.png')",
        }}
      />

      {/* Background Overlay */}
      <div className="absolute inset-0 z-0 bg-white/30" />

      {/* Page Content */}
      <div className="relative z-10">

        {/* Hero */}
        <section className="max-w-4xl mx-auto px-6 md:px-10 pt-24 pb-16 text-center">
          <span className="eyebrow mb-6">
            Get In Touch
          </span>

          <h1 className="font-display text-5xl md:text-6xl leading-tight">
            Let's talk about your project.
          </h1>

          <p className="mt-6 text-steel max-w-lg mx-auto">
            Questions about a session, pricing, or availability? Send us a
            message and we'll respond within one business day.
          </p>
        </section>

        {/* Contact Section */}
        <section className="max-w-6xl mx-auto px-6 md:px-10 pb-24 grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <ContactForm />
          </div>

          {/* Contact Information */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {CONTACT_INFO.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="border border-mist bg-white/60 p-6 flex items-start gap-4"
              >
                <Icon
                  size={20}
                  className="text-brand shrink-0 mt-1"
                  strokeWidth={1.5}
                />

                <div>
                  <p className="font-mono text-xs tracking-wideish uppercase text-steel mb-1">
                    {label}
                  </p>

                  <p className="text-ink">
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </section>

        {/* Studio CTA */}
        <section className="bg-ink text-frost">
          <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 text-center">

            <span className="eyebrow text-frost/50 mb-3 block">
              Visit The Studio
            </span>

            <p className="font-display text-2xl md:text-3xl max-w-xl mx-auto">
              10/10E, Vengatesh nagar, Melur, Madurai District, Tamil Nadu - 625106, India.
            </p>

          </div>
        </section>

      </div>
    </main>
  );
}