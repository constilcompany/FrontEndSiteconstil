import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesCards from "@/components/FeaturesCards";
import AboutSection from "@/components/AboutSection";
import BlueprintIntelligence from "@/components/BlueprintIntelligence";
import FeatureShowcase from "@/components/FeatureShowcase";
import WhatWeOffer from "@/components/WhatWeOffer";
import WhyChooseUs from "@/components/WhyChooseUs";
import OurProcess from "@/components/OurProcess";
import PricingSection from "@/components/PricingSection";
import ContactForm from "@/components/ContactForm";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import ConstilChatBot from "@/components/ConstilChatBot";
import Chat from "@/components/Chat";
import TryIt from "@/components/TryIt";
import IncreasePrecision from "@/components/IncreasePrecision";
import Testimonials from "@/components/Testimonials";
import banner1 from "@/assets/images/banner1.jpg";
import banner3 from "@/assets/images/banner3.jpg";
import { faqs, testimonialsData, tryItContent } from "@/lib/dummydata/homeContent";
const Index = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const id = hash.slice(1);
    const el = document.getElementById(id);
    if (el) {
      const timer = setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
      return () => clearTimeout(timer);
    }
  }, [hash]);

  return (
    <main className="bg-background min-h-screen scroll-smooth">
      <Helmet>
        <title>AI Construction Estimating Software with Smart Planning</title>
        <meta name="description" content="Simplify construction planning with AI construction estimating software. Create accurate estimates from blueprints and manage projects with ease." />
      </Helmet>
      <Navbar />
      {/* <ConstilChatBot /> */}
      <HeroSection />
      <FeaturesCards />
      <AboutSection />
      <BlueprintIntelligence />
      <FeatureShowcase />
      <TryIt tryItContent={tryItContent} />
      <WhatWeOffer />
      <WhyChooseUs />
      <OurProcess />
      <IncreasePrecision />
      <PricingSection />
      <Testimonials {...testimonialsData} />
      <TryIt tryItContent={tryItContent} />
      <ContactForm />
      <FAQSection faqs={faqs} />
      <Chat />
      <Footer />
    </main>
  );
};

export default Index;
