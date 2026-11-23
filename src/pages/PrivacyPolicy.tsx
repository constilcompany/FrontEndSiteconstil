import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  FileText,
  Database,
  Eye,
  Cookie,
  Server,
  Scale,
  Mail,
  MapPin,
  Clock,
  ArrowLeft,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Building2,
  FileCode,
  HardHat,
  Sliders,
  ExternalLink,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import bannerImage from "@/assets/hero-construction.jpg";

interface SectionLink {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
}

const sections: SectionLink[] = [
  { id: "overview", title: "1. Overview & Scope", icon: FileText },
  { id: "information-collected", title: "2. Information We Collect", icon: Database },
  { id: "how-we-use-information", title: "3. How We Use Information", icon: Sliders },
  { id: "blueprint-confidentiality", title: "4. Blueprint & AI Confidentiality", icon: Lock },
  { id: "cookies-and-tracking", title: "5. Cookies & Tracking Technologies", icon: Cookie },
  { id: "third-party-subprocessors", title: "6. Infrastructure & Sub-Processors", icon: Server },
  { id: "data-retention-security", title: "7. Data Retention & Security", icon: ShieldCheck },
  { id: "privacy-rights", title: "8. Your Privacy Rights", icon: Scale },
  { id: "contact-us", title: "9. Contact Information", icon: Mail },
];

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const openCookiePreferences = () => {
    window.dispatchEvent(new CustomEvent("openCookiePreferences"));
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const navOffset = 90;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - navOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Helmet>
        <title>Privacy Policy | CONSTIL - AI Construction Estimation & Invoicing</title>
        <meta
          name="description"
          content="Review CONSTIL's Privacy Policy. Learn how we safeguard your architectural blueprints, estimates, takeoffs, and personal data under strict confidentiality."
        />
        <link rel="canonical" href="https://constil.com/privacy-policy" />
      </Helmet>

      <Navbar />

      {/* Hero Header */}
      <section className="relative overflow-hidden pt-32 pb-20 bg-navy text-primary-foreground">
        <img
          src={bannerImage}
          alt="Constil Construction Platform"
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-navy/95 via-navy/90 to-navy/80" />
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(hsl(217 100% 63% / 0.4) 1px, transparent 1px), linear-gradient(90deg, hsl(217 100% 63% / 0.4) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative container mx-auto px-4 max-w-6xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs md:text-sm text-primary-foreground/60 mb-6">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-40" />
            <span className="text-primary-foreground/90 font-medium">Privacy Policy</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-semibold uppercase tracking-wider mb-5">
              <ShieldCheck className="w-4 h-4" />
              Legal & Data Privacy Protection
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-primary-foreground mb-4">
              Privacy Policy
            </h1>
            <p className="text-base md:text-lg text-primary-foreground/80 leading-relaxed max-w-2xl">
              How CONSTIL collects, utilizes, and safeguards your construction project data,
              architectural blueprints, cost estimates, and personal information.
            </p>

            {/* Metadata Pills */}
            <div className="mt-8 pt-6 border-t border-primary-foreground/10 flex flex-wrap items-center gap-4 text-xs md:text-sm text-primary-foreground/70">
              <div className="flex items-center gap-1.5 bg-primary-foreground/5 px-3 py-1.5 rounded-md border border-primary-foreground/10">
                <Clock className="w-4 h-4 text-primary" />
                <span>
                  Last Updated: <strong className="text-primary-foreground">November 2026</strong>
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-primary-foreground/5 px-3 py-1.5 rounded-md border border-primary-foreground/10">
                <Building2 className="w-4 h-4 text-primary" />
                <span>
                  Entity: <strong className="text-primary-foreground">CONSTIL</strong>
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-primary-foreground/5 px-3 py-1.5 rounded-md border border-primary-foreground/10">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Portland, Maine 04073, USA</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="py-16 md:py-24 bg-surface-light border-b border-border">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Sticky Table of Contents (Desktop) */}
            <aside className="hidden lg:block lg:col-span-4">
              <div className="sticky top-24 bg-card border border-border rounded-2xl p-6 shadow-card space-y-5">
                <div className="flex items-center gap-2 pb-3 border-b border-border">
                  <FileCode className="w-4 h-4 text-primary" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Table of Contents
                  </h2>
                </div>
                <nav className="flex flex-col space-y-1">
                  {sections.map((sec) => (
                    <button
                      key={sec.id}
                      onClick={() => scrollToSection(sec.id)}
                      className="text-left text-xs font-medium px-3 py-2 rounded-lg text-foreground/70 hover:text-primary hover:bg-primary/5 transition-colors flex items-center justify-between group"
                    >
                      <span className="truncate">{sec.title}</span>
                      <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-primary shrink-0 ml-1" />
                    </button>
                  ))}
                </nav>

                <div className="pt-4 border-t border-border space-y-3">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Have specific questions about data security or blueprint isolation?
                  </p>
                  <a
                    href="mailto:support@constil.com"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-primary hover:underline"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    support@constil.com
                  </a>
                  <button
                    type="button"
                    onClick={openCookiePreferences}
                    className="w-full text-center text-xs font-medium py-2 px-3 rounded-lg border border-border bg-muted/40 hover:bg-muted text-foreground/80 hover:text-foreground transition-colors flex items-center justify-center gap-2"
                  >
                    <Cookie className="w-3.5 h-3.5 text-primary" />
                    Manage Cookie Preferences
                  </button>
                </div>
              </div>
            </aside>

            {/* Policy Body */}
            <main className="lg:col-span-8 space-y-12">
              {/* Section 1: Overview & Scope */}
              <article
                id="overview"
                className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-card space-y-4 scroll-mt-28"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                      Section 1
                    </span>
                    <h2 className="text-xl md:text-2xl font-bold text-navy">
                      Overview & Scope
                    </h2>
                  </div>
                </div>
                <div className="text-sm md:text-base leading-relaxed text-foreground/80 space-y-3 pt-2">
                  <p>
                    This Privacy Policy details how <strong>CONSTIL</strong> (&ldquo;CONSTIL,&rdquo;
                    &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) collects, uses, protects,
                    and discloses information gathered through:
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                    <li className="flex items-start gap-2 bg-muted/30 p-2.5 rounded-lg border border-border/60 text-xs md:text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>
                        Our public marketing site (<strong>constil.com</strong>).
                      </span>
                    </li>
                    <li className="flex items-start gap-2 bg-muted/30 p-2.5 rounded-lg border border-border/60 text-xs md:text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>
                        The cloud-based AI construction blueprint estimating platform.
                      </span>
                    </li>
                    <li className="flex items-start gap-2 bg-muted/30 p-2.5 rounded-lg border border-border/60 text-xs md:text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>
                        Invoicing, billing, and payment tracking modules.
                      </span>
                    </li>
                    <li className="flex items-start gap-2 bg-muted/30 p-2.5 rounded-lg border border-border/60 text-xs md:text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>
                        Our interactive AI Sales Assistant &amp; lead capture forms.
                      </span>
                    </li>
                  </ul>
                  <p className="pt-2">
                    By accessing or using CONSTIL, you agree to the collection and handling of your
                    information in accordance with this Privacy Policy. If you do not agree with any
                    term outlined herein, please discontinue use of our platform immediately.
                  </p>
                </div>
              </article>

              {/* Section 2: Information We Collect */}
              <article
                id="information-collected"
                className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-card space-y-6 scroll-mt-28"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                      Section 2
                    </span>
                    <h2 className="text-xl md:text-2xl font-bold text-navy">
                      Information We Collect
                    </h2>
                  </div>
                </div>

                <p className="text-sm md:text-base text-foreground/80 leading-relaxed">
                  To power intelligent construction takeoffs, generate localized estimates, and
                  support enterprise billing, we collect specific categories of business and
                  technical data:
                </p>

                <div className="space-y-4">
                  {/* Category A */}
                  <div className="p-4 rounded-xl border border-border bg-background">
                    <h3 className="text-sm md:text-base font-semibold text-navy flex items-center gap-2 mb-2">
                      <Building2 className="w-4 h-4 text-primary" />
                      A. Account &amp; Business Information
                    </h3>
                    <p className="text-xs md:text-sm text-foreground/70 leading-relaxed">
                      When you create an account, request a proposal, or manage subscriptions, we
                      collect your full name, business or contractor name, professional email address,
                      phone number, primary trade classification (e.g., General Contracting, Electrical,
                      Plumbing, Drywall), billing address, and transaction records. Payment cards are
                      handled directly by our PCI-DSS compliant payment processor (Stripe).
                    </p>
                  </div>

                  {/* Category B */}
                  <div className="p-4 rounded-xl border border-border bg-background">
                    <h3 className="text-sm md:text-base font-semibold text-navy flex items-center gap-2 mb-2">
                      <HardHat className="w-4 h-4 text-primary" />
                      B. Construction Blueprints &amp; Project Files
                    </h3>
                    <p className="text-xs md:text-sm text-foreground/70 leading-relaxed">
                      To generate takeoffs, cost calculations, and proposals, you upload architectural
                      drawings, PDF floor plans, engineering specifications, room schedules, material
                      cost sheets, and customized labor markups. These files contain proprietary project
                      intelligence that is treated under strict confidentiality protections (detailed in
                      Section 4).
                    </p>
                  </div>

                  {/* Category C */}
                  <div className="p-4 rounded-xl border border-border bg-background">
                    <h3 className="text-sm md:text-base font-semibold text-navy flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-primary" />
                      C. Lead &amp; Interactive Chat Data
                    </h3>
                    <p className="text-xs md:text-sm text-foreground/70 leading-relaxed">
                      When engaging with our interactive AI Sales Assistant, booking a demonstration,
                      or submitting a quote request, we collect contact credentials, trade specializations,
                      project timelines, and the chat conversation transcripts so our team can deliver
                      accurate test credits, onboarding guidance, and technical support.
                    </p>
                  </div>

                  {/* Category D */}
                  <div className="p-4 rounded-xl border border-border bg-background">
                    <h3 className="text-sm md:text-base font-semibold text-navy flex items-center gap-2 mb-2">
                      <Eye className="w-4 h-4 text-primary" />
                      D. Usage, Analytics &amp; Device Forensics
                    </h3>
                    <p className="text-xs md:text-sm text-foreground/70 leading-relaxed">
                      As you browse our website, we automatically gather technical telemetry:
                      IP-derived approximate geographic location (city, state/region, country),
                      operating system, browser type and version, screen resolution, referral URLs,
                      campaign parameters (UTM source, medium, campaign), page navigation paths, and
                      page dwell time. This telemetry does not identify individual users on an unauthorized
                      basis and is utilized strictly for system optimization and security.
                    </p>
                  </div>
                </div>
              </article>

              {/* Section 3: How We Use Your Information */}
              <article
                id="how-we-use-information"
                className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-card space-y-5 scroll-mt-28"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                    <Sliders className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                      Section 3
                    </span>
                    <h2 className="text-xl md:text-2xl font-bold text-navy">
                      How We Use Your Information
                    </h2>
                  </div>
                </div>

                <div className="text-sm md:text-base text-foreground/80 leading-relaxed space-y-3">
                  <p>CONSTIL applies collected information exclusively for the following operational purposes:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-3.5 rounded-xl border border-border bg-background space-y-1">
                      <h4 className="text-xs md:text-sm font-semibold text-navy flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                        AI Blueprint Takeoffs
                      </h4>
                      <p className="text-xs text-foreground/70">
                        Extracting square footage, linear footage, counts, and bill of materials from
                        your plans.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-border bg-background space-y-1">
                      <h4 className="text-xs md:text-sm font-semibold text-navy flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                        PDF Proposals &amp; Invoices
                      </h4>
                      <p className="text-xs text-foreground/70">
                        Compiling branded client estimates, payment milestones, change orders, and
                        invoices.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-border bg-background space-y-1">
                      <h4 className="text-xs md:text-sm font-semibold text-navy flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                        Account &amp; Credit Management
                      </h4>
                      <p className="text-xs text-foreground/70">
                        Administering test credits, subscription renewals, user permissions, and
                        support tickets.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-border bg-background space-y-1">
                      <h4 className="text-xs md:text-sm font-semibold text-navy flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                        Security &amp; Fraud Prevention
                      </h4>
                      <p className="text-xs text-foreground/70">
                        Safeguarding against unauthorized logins, API abuse, scraping, and payment
                        irregularities.
                      </p>
                    </div>
                  </div>
                </div>
              </article>

              {/* Section 4: Blueprint & AI Data Confidentiality (HIGHLIGHTED) */}
              <article
                id="blueprint-confidentiality"
                className="bg-gradient-to-br from-navy/5 via-primary/5 to-transparent border-2 border-primary/30 rounded-2xl p-6 md:p-8 shadow-card space-y-5 scroll-mt-28 relative overflow-hidden"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold shadow-md">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                      Section 4 &bull; Core Commitment
                    </span>
                    <h2 className="text-xl md:text-2xl font-bold text-navy">
                      Blueprint &amp; AI Data Confidentiality
                    </h2>
                  </div>
                </div>

                <div className="bg-background/90 border border-primary/20 rounded-xl p-4 md:p-5 space-y-3">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <p className="text-xs md:text-sm text-foreground/90 leading-relaxed font-medium">
                      At CONSTIL, we treat your architectural plans, trade estimates, and profit markups
                      as mission-critical trade secrets. We uphold four foundational confidentiality pillars:
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                  <div className="p-4 rounded-xl bg-background border border-border space-y-1.5">
                    <h4 className="text-xs md:text-sm font-bold text-navy flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      100% Contractor Ownership
                    </h4>
                    <p className="text-xs text-foreground/70 leading-relaxed">
                      All uploaded blueprints, CAD/PDF drawings, takeoff measurements, client records,
                      and custom pricing databases remain your sole and exclusive property.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-background border border-border space-y-1.5">
                    <h4 className="text-xs md:text-sm font-bold text-navy flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      Isolated Tenant Storage
                    </h4>
                    <p className="text-xs text-foreground/70 leading-relaxed">
                      Files are stored in segregated, encrypted object storage with strict Row-Level
                      Security (RLS). No competing contractor can view or query your project data.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-background border border-border space-y-1.5">
                    <h4 className="text-xs md:text-sm font-bold text-navy flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      Never Sold or Monopolized
                    </h4>
                    <p className="text-xs text-foreground/70 leading-relaxed">
                      We never sell, broker, license, or distribute your plans, bids, or client lists to
                      subcontractors, general contractors, material suppliers, or ad networks.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-background border border-border space-y-1.5">
                    <h4 className="text-xs md:text-sm font-bold text-navy flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      Zero Public AI Leakage
                    </h4>
                    <p className="text-xs text-foreground/70 leading-relaxed">
                      Your proprietary drawings and price sheets are never fed into open, public AI
                      training datasets. Estimating models process your files strictly in private sessions.
                    </p>
                  </div>
                </div>
              </article>

              {/* Section 5: Cookies, Analytics & Advertising Technologies */}
              <article
                id="cookies-and-tracking"
                className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-card space-y-5 scroll-mt-28"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                    <Cookie className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                      Section 5
                    </span>
                    <h2 className="text-xl md:text-2xl font-bold text-navy">
                      Cookies, Analytics &amp; Advertising Technologies
                    </h2>
                  </div>
                </div>

                <div className="text-sm md:text-base text-foreground/80 leading-relaxed space-y-3">
                  <p>
                    We deploy cookies, local storage tokens, and web beacons to maintain session state,
                    measure aggregate engagement, and optimize campaign delivery:
                  </p>

                  <div className="space-y-3 pt-2">
                    <div className="p-3.5 rounded-xl border border-border bg-background">
                      <h4 className="text-xs md:text-sm font-semibold text-navy mb-1">
                        1. Strictly Necessary &amp; Session Cookies
                      </h4>
                      <p className="text-xs text-foreground/70 leading-relaxed">
                        Required for secure login authentication, CSRF validation, tenant isolation,
                        and shopping cart/credit checkout. These cannot be disabled without breaking
                        platform features.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-border bg-background">
                      <h4 className="text-xs md:text-sm font-semibold text-navy mb-1">
                        2. Google Analytics 4 (GA4)
                      </h4>
                      <p className="text-xs text-foreground/70 leading-relaxed">
                        Measures aggregated site traffic, navigation sequences, route dwell times, and
                        button interactions. In compliance with Google Terms of Service and privacy
                        standards, raw IP addresses and sensitive identifiers are masked and never
                        passed into GA4.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-border bg-background">
                      <h4 className="text-xs md:text-sm font-semibold text-navy mb-1">
                        3. Meta Pixel &amp; Conversions API (CAPI)
                      </h4>
                      <p className="text-xs text-foreground/70 leading-relaxed">
                        Enables ad attribution, conversion verification, and remarketing for contractor
                        audiences. Data transmitted via Meta CAPI is securely hashed (SHA-256) prior to
                        transmission.
                      </p>
                    </div>
                  </div>

                  {/* Cookie Management Box */}
                  <div className="mt-4 p-4 rounded-xl bg-muted/40 border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-xs md:text-sm font-semibold text-navy">
                        Manage Your Consent Preferences
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        You can adjust your cookie consent anytime via our interactive consent manager.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={openCookiePreferences}
                      className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary-hover text-xs font-semibold transition-colors shrink-0 cursor-pointer shadow-sm"
                    >
                      Cookie Preferences
                    </button>
                  </div>
                </div>
              </article>

              {/* Section 6: Third-Party Infrastructure & Sub-Processors */}
              <article
                id="third-party-subprocessors"
                className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-card space-y-5 scroll-mt-28"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                    <Server className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                      Section 6
                    </span>
                    <h2 className="text-xl md:text-2xl font-bold text-navy">
                      Third-Party Infrastructure &amp; Sub-Processors
                    </h2>
                  </div>
                </div>

                <div className="text-sm md:text-base text-foreground/80 leading-relaxed space-y-3">
                  <p>
                    CONSTIL contracts with enterprise infrastructure providers bound by rigorous Data
                    Protection Agreements (DPAs):
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-3.5 rounded-xl border border-border bg-background space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs md:text-sm font-bold text-navy">Supabase Inc.</h4>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-muted font-medium text-muted-foreground">
                          Database &amp; Auth
                        </span>
                      </div>
                      <p className="text-xs text-foreground/70">
                        Enterprise PostgreSQL database hosting, authenticated identity management, and
                        encrypted storage for project files.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-border bg-background space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs md:text-sm font-bold text-navy">Stripe, Inc.</h4>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-muted font-medium text-muted-foreground">
                          Billing
                        </span>
                      </div>
                      <p className="text-xs text-foreground/70">
                        PCI-DSS Level 1 certified payment processor handling subscriptions, card
                        tokens, and checkout flows.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-border bg-background space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs md:text-sm font-bold text-navy">Cloudflare &amp; AWS</h4>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-muted font-medium text-muted-foreground">
                          CDN &amp; Security
                        </span>
                      </div>
                      <p className="text-xs text-foreground/70">
                        DDoS mitigation, web application firewall (WAF), edge routing, and automated
                        SSL/TLS termination.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-border bg-background space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs md:text-sm font-bold text-navy">Transactional Mailers</h4>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-muted font-medium text-muted-foreground">
                          Email Delivery
                        </span>
                      </div>
                      <p className="text-xs text-foreground/70">
                        High-deliverability SMTP services dispatching password reset links, generated
                        estimate PDFs, and invoice notices.
                      </p>
                    </div>
                  </div>
                </div>
              </article>

              {/* Section 7: Data Retention & Security */}
              <article
                id="data-retention-security"
                className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-card space-y-5 scroll-mt-28"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                      Section 7
                    </span>
                    <h2 className="text-xl md:text-2xl font-bold text-navy">
                      Data Retention &amp; Security Protocols
                    </h2>
                  </div>
                </div>

                <div className="text-sm md:text-base text-foreground/80 leading-relaxed space-y-3">
                  <p>
                    CONSTIL applies multi-tiered administrative, physical, and technical safeguards:
                  </p>
                  <ul className="space-y-2.5 pt-1 text-xs md:text-sm">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>
                        <strong>Encryption Everywhere:</strong> All communications operate over TLS
                        1.3 / HTTPS. Stored files, database snapshots, and backups are encrypted at
                        rest using AES-256.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>
                        <strong>Access Controls:</strong> Multi-factor authentication (MFA) and
                        role-based access controls (RBAC) restrict internal engineering access strictly
                        to verified operational needs.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>
                        <strong>Retention Timelines:</strong> Active account data and project takeoffs
                        are maintained during the lifetime of your active subscription. You may delete
                        individual project files or request full account purges at any time.
                      </span>
                    </li>
                  </ul>
                </div>
              </article>

              {/* Section 8: Your Privacy Rights */}
              <article
                id="privacy-rights"
                className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-card space-y-5 scroll-mt-28"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                      Section 8
                    </span>
                    <h2 className="text-xl md:text-2xl font-bold text-navy">
                      Your Privacy Rights (GDPR, CCPA/CPRA)
                    </h2>
                  </div>
                </div>

                <div className="text-sm md:text-base text-foreground/80 leading-relaxed space-y-3">
                  <p>
                    Depending on your location (including the European Economic Area, the UK, California,
                    and other US jurisdictions), you have specific statutory privacy rights:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-3.5 rounded-xl border border-border bg-background">
                      <h4 className="text-xs md:text-sm font-semibold text-navy mb-1">
                        Right to Access &amp; Portability
                      </h4>
                      <p className="text-xs text-foreground/70">
                        Request a structured, machine-readable export of all your personal records,
                        invoices, and estimates.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-border bg-background">
                      <h4 className="text-xs md:text-sm font-semibold text-navy mb-1">
                        Right to Rectification
                      </h4>
                      <p className="text-xs text-foreground/70">
                        Correct or update incomplete or inaccurate business information through your
                        dashboard or support.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-border bg-background">
                      <h4 className="text-xs md:text-sm font-semibold text-navy mb-1">
                        Right to Erasure (&ldquo;To Be Forgotten&rdquo;)
                      </h4>
                      <p className="text-xs text-foreground/70">
                        Request complete deletion of your account, blueprints, historical bids, and
                        associated metadata.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-border bg-background">
                      <h4 className="text-xs md:text-sm font-semibold text-navy mb-1">
                        Right to Opt-Out &amp; Non-Discrimination
                      </h4>
                      <p className="text-xs text-foreground/70">
                        Opt-out of marketing communications and analytics tracking. We will never
                        discriminate against you for exercising your privacy rights.
                      </p>
                    </div>
                  </div>

                  <p className="text-xs md:text-sm text-foreground/70 pt-2">
                    To exercise any of these rights, email us at{" "}
                    <a
                      href="mailto:support@constil.com"
                      className="text-primary font-semibold hover:underline"
                    >
                      support@constil.com
                    </a>
                    . Requests are fulfilled free of charge within 30 days.
                  </p>
                </div>
              </article>

              {/* Section 9: Contact Information */}
              <article
                id="contact-us"
                className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-card space-y-6 scroll-mt-28"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                      Section 9
                    </span>
                    <h2 className="text-xl md:text-2xl font-bold text-navy">
                      Contact Information
                    </h2>
                  </div>
                </div>

                <p className="text-sm md:text-base text-foreground/80 leading-relaxed">
                  For questions regarding this Privacy Policy, our data handling practices, or to submit
                  a formal data subject request, please contact our Data Governance &amp; Compliance team:
                </p>

                {/* Direct Contact Card */}
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 space-y-4">
                  <div className="flex flex-wrap items-center gap-3.5">
                    <div className="px-3.5 py-2 rounded-xl bg-navy text-primary-foreground flex items-center justify-center shrink-0 shadow-sm border border-slate-800 select-none">
                      <span className="text-base md:text-lg font-bold tracking-tight text-primary-foreground">
                        CONST<span className="text-primary">IL</span>
                      </span>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-navy">CONSTIL Compliance Office</h3>
                      <p className="text-xs text-muted-foreground">
                        AI-Powered Construction Estimation &amp; Invoicing
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs md:text-sm">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-navy block">Physical Headquarters:</strong>
                        <span className="text-foreground/70">
                          Portland, Maine 04073
                          <br />
                          United States
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <Mail className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-navy block">Electronic Inquiries:</strong>
                        <a
                          href="mailto:support@constil.com"
                          className="text-primary hover:underline font-semibold block"
                        >
                          support@constil.com
                        </a>
                        <span className="text-xs text-muted-foreground">
                          Response SLA: Within 2 business days
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Action Navigation */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
                  <span>&copy; {new Date().getFullYear()} CONSTIL. All rights reserved.</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                      className="text-primary hover:underline font-medium cursor-pointer"
                    >
                      Back to top &uarr;
                    </button>
                    <span>&bull;</span>
                    <Link to="/contact" className="text-primary hover:underline font-medium">
                      Contact Sales
                    </Link>
                  </div>
                </div>
              </article>
            </main>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
