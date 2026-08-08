import Hero from "@/pages/home/Hero";
import UploadSection from "@/components/sections/UploadSection";
import Intro from "@/pages/home/Intro";
import FeaturedWork from "@/pages/home/FeaturedWork";
import Services from "@/pages/home/Services";
import Process from "@/pages/home/Process";
import Testimonials from "@/pages/home/Testimonials";
// import FAQTeaser from "@/pages/home/FAQTeaser";
import ClosingCta from "@/pages/home/ClosingCta";
import UrgencyBanner from "@/components/sections/UrgencyBanner";
import TrustBar from "@/components/sections/TrustBar";
import InstagramStrip from "@/components/sections/InstagramStrip";
import Reveal from "@/components/common/Reveal";
import SEO from "@/components/common/SEO";

export default function Home() {
return (
<>
  <Reveal>
    <UrgencyBanner />
  </Reveal>

  <Reveal>
    <Hero />
  </Reveal>

  <Reveal>
    <TrustBar />
  </Reveal>

  <Reveal>
    <UploadSection />
  </Reveal>

  <Reveal>
    <Intro />
  </Reveal>
  
  <Reveal>
    <FeaturedWork />
  </Reveal>

  {/* <Reveal>
    <InstagramStrip />
  </Reveal> */}

  <Reveal>
    <Services />
  </Reveal>

  <Reveal>
    <Process />
  </Reveal>

  {/* <Reveal>
    <Testimonials />
  </Reveal> */}

  {/* <Reveal>
    <FAQTeaser />
  </Reveal> */}

  {/* <Reveal>
    <ClosingCta />
  </Reveal> */}
</>
);
}