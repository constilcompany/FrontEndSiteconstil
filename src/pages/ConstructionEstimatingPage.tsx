import Navbar from "@/components/Navbar";
import ConstilChatBot from "@/components/ConstilChatBot";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import heroImg from "@/assets/diverse-engineers.jpg";
import overviewImg from "@/assets/professionals-office.jpg";
import bannerBgImg from "@/assets/feature-showcase.jpg";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowRight,
  BarChart3,
  Brain,
  Building2,
  Calculator,
  CheckCircle2,
  ClipboardList,
  Layers,
  Plug,
  Timer,
  TrendingUp,
  Workflow,
  Zap,
} from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const cardHover =
  "transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/20";
const btnPrimary =
  "inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary-hover transition-all duration-300 focus-visible:outline focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-[0.98]";
const btnSecondary =
  "inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border-2 border-primary-foreground/30 text-primary-foreground font-semibold hover:bg-primary-foreground/10 backdrop-blur-sm transition-all duration-300 focus-visible:outline focus-visible:ring-2 focus-visible:ring-primary-foreground/50 focus-visible:ring-offset-2 active:scale-[0.98]";
const btnOutline =
  "inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-muted transition-all duration-300 focus-visible:outline focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-[0.98]";

const ConstructionEstimatingPage = () => (
  <main className="bg-background min-h-screen scroll-smooth">
    <Navbar />
    <ConstilChatBot />

    {/* Hero */}
    <section className="relative min-h-[85vh] flex items-center overflow-hidden pt-24">
      <img
        src={heroImg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/70 to-foreground/50" />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(hsl(217 100% 63% / 0.4) 1px, transparent 1px), linear-gradient(90deg, hsl(217 100% 63% / 0.4) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 border border-primary/40 text-primary text-xs font-semibold tracking-wider uppercase mb-6 backdrop-blur-sm">
            Construction Estimating
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-primary-foreground mb-6">
            Design More Budgets and Build Stronger with{" "}
            <span className="text-primary">Construction Estimating Software</span>
          </h1>
          <p className="text-lg text-primary-foreground/90 leading-relaxed mb-4">
            Advanced construction estimating software designed to meet contractor and construction team needs
            assists in creating project estimates, costing materials and labour, with a single system aimed at
            making estimating processes easier.
          </p>
          <p className="text-primary-foreground/80 leading-relaxed mb-8">
            The smart construction cost estimating software enables contractors to prepare sound estimates in the
            shortest time possible, improve bid quality, and maintain transparent financial visibility before the
            commencement of all projects.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="https://app.constil.com/signup" className={`${btnPrimary} glow-primary`}>
              Get Started
              <ArrowRight className="w-4 h-4" />
            </a>
            <a href="#how-it-works" className={btnSecondary}>
              See How It Works
            </a>
          </div>
        </motion.div>
      </div>
    </section>

    {/* Solution */}
    <section className="section-dark py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6 }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              A Smarter Solution for Modern Construction Estimating
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Construction projects today are much more than a simple calculation of materials. Contractors must
              consider labour costs, material price changes, subcontractor expenses, permits, and changes to
              project scope.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Without systematic estimation software, teams end up in disconnected spreadsheets and manual
              calculations—leading to inaccurate bids, over-budgeting, and missed margins.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              CONSITL brings cost information, materials, labour rates, and subcontractor prices together on one
              platform so you can estimate accurately, revise quickly, and keep workflows clear and transparent.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="rounded-3xl border border-border/60 bg-background/80 p-6 h-full min-h-[260px]">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Estimating clarity
                </p>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[11px] px-3 py-1">
                  Real-time
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {[
                  { label: "Materials", value: "$84,250" },
                  { label: "Labour", value: "$63,900" },
                  { label: "Subcontractors", value: "$41,800" },
                  { label: "Equipment", value: "$12,600" },
                ].map((x) => (
                  <div key={x.label} className="rounded-2xl bg-muted/50 p-4 border border-border/60">
                    <p className="text-xs text-muted-foreground mb-1">{x.label}</p>
                    <p className="font-semibold text-foreground">{x.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-2xl bg-primary/10 border border-primary/30 p-4">
                <p className="text-xs font-semibold text-primary mb-1">AI checks</p>
                <p className="text-xs text-muted-foreground">
                  Flags cost spikes, scope shifts, and risk ranges before you submit your bid.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>

    {/* Key features */}
    <section className="section-light py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            variants={fadeInUp}
          >
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">Key features</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-3 text-foreground">
              Powerful Functionality In Our Estimating Platform, Contractor-built
            </h2>
            <p className="text-muted-foreground leading-relaxed mt-4">
              CONSITL offers smart systems within its estimating software to assist contractors in preparing
              accurate estimates, tabulating project costs, and maintaining monetary simplicity during planning.
            </p>
          </motion.div>
        </div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10 max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: { opacity: 0, y: 24 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.06 } },
          }}
        >
          {[
            {
              title: "Prepare and arrangement of full cost estimates",
              text: "Organise materials, labour, subcontractor fees, and equipment costs in one structured estimate with clear breakdowns and archived pricing.",
              Icon: Layers,
            },
            {
              title: "Make precise estimates using intelligent cost tracking",
              text: "Track quantities, labour rates, and budget adjustments in real time. Automated calculations reduce manual errors and speed up delivery.",
              Icon: Calculator,
            },
            {
              title: "Better estimation with AI-powered cost analysis",
              text: "Analyse past project records and cost patterns to identify risk ranges, improve predictability, and bid competitively without sacrificing margin.",
              Icon: Brain,
            },
            {
              title: "Designed for residential and commercial projects",
              text: "Confidently manage small renovation estimates or large commercial budgets with one unified platform built for real jobsite complexity.",
              Icon: Building2,
            },
          ].map(({ title, text, Icon }) => (
            <motion.div
              key={title}
              className={`rounded-2xl border border-border/60 bg-background/80 p-6 text-left ${cardHover}`}
              variants={fadeInUp}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <div className="rounded-xl bg-primary/10 w-10 h-10 flex items-center justify-center mb-3">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground">{text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* CTA */}
    <section className="section-dark py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto rounded-3xl border border-border/60 bg-gradient-to-br from-primary/10 via-background to-primary/5 p-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="grid lg:grid-cols-3 gap-8 items-center"
          >
            <div className="lg:col-span-2">
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                Turn Complex Estimates into Simple Workflows with Estimating Software
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Start managing your project costs, increasing estimate precision, and understanding your
                project&apos;s financials before construction starts.
              </p>
            </div>
            <div className="flex lg:justify-end gap-3 flex-wrap">
              <a href="#integrations" className={btnOutline}>
                Explore Integrations
              </a>
              <a href="https://app.constil.com/signup" className={`${btnPrimary} glow-primary`}>
                Start Estimating
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>

    {/* Image + overview */}
    <section className="section-light py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <img
              src={overviewImg}
              alt="Construction team planning budgets"
              className="w-full h-[420px] object-cover rounded-3xl border border-border/60 shadow-sm"
              loading="lazy"
            />
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6 }}
            variants={fadeInUp}
          >
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">Overview</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-3 text-foreground">
              The Right System Makes Smarter Construction Estimating
            </h2>
            <p className="text-muted-foreground leading-relaxed mt-4">
              CONSITL links financial preparation with project planning through a robust construction estimator
              system built for modern contractors. Maintain cost libraries, monitor estimate revisions, and analyse
              budgets in a single connected platform.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Instead of disconnected tools, your team can prepare, review, and approve estimates inside one
              environment—improving collaboration and helping every project start with clear, confident cost
              planning.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mt-8">
              {[
                { Icon: ClipboardList, title: "Structured cost libraries", text: "Keep consistent pricing and breakdown templates." },
                { Icon: BarChart3, title: "Transparent revisions", text: "Track changes and assumptions with confidence." },
                { Icon: Workflow, title: "Connected workflows", text: "Align estimating, planning, and approvals." },
                { Icon: CheckCircle2, title: "Bid-ready outputs", text: "Create professional estimates and proposals." },
              ].map(({ Icon, title, text }) => (
                <div key={title} className="rounded-2xl border border-border/60 bg-background/80 p-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-primary/10 p-2.5 shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{title}</p>
                      <p className="text-sm text-muted-foreground">{text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>

    {/* How it works */}
    <section id="how-it-works" className="section-dark py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            variants={fadeInUp}
          >
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">How it works</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-3 text-foreground">
              The Simplified Workflow with Construction Estimating Software
            </h2>
          </motion.div>
        </div>

        <motion.div
          className="grid md:grid-cols-2 gap-6 mt-10 max-w-5xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: { opacity: 0, y: 24 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.06 } },
          }}
        >
          {[
            {
              Icon: ClipboardList,
              title: "Requirement capture of the project",
              text: "Input project information, scope, materials, and labour expectations in one integrated system—no manual records or separate files.",
            },
            {
              Icon: Layers,
              title: "Organise components of cost",
              text: "Automatically structure materials, labour, equipment, and subcontractors into a transparent cost breakdown that is easy to adjust.",
            },
            {
              Icon: BarChart3,
              title: "Refine and analyse estimates",
              text: "Audit budgets, modify assumptions, and revise prices immediately with real-time calculations—even when scope changes.",
            },
            {
              Icon: CheckCircle2,
              title: "Complete and share estimates",
              text: "Create professional estimates and proposals through consistent templates so you can bid confidently with full financial visibility.",
            },
          ].map(({ Icon, title, text }) => (
            <motion.div
              key={title}
              className={`rounded-2xl border border-border/60 bg-background p-6 ${cardHover}`}
              variants={fadeInUp}
            >
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-primary/10 p-3">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground">{text}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* Benefits */}
    <section className="section-light py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            variants={fadeInUp}
          >
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">Benefits</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-3 text-foreground">
              Benefits of This Construction Estimating Software
            </h2>
          </motion.div>
        </div>

        <motion.div
          className="grid md:grid-cols-3 gap-6 mt-10 max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: { opacity: 0, y: 24 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.06 } },
          }}
        >
          {[
            {
              Icon: CheckCircle2,
              title: "More precise project budgets",
              text: "Replace hand calculators and spreadsheet drift with structured breakdowns that reduce errors and cost overruns.",
            },
            {
              Icon: Timer,
              title: "More rapid estimating and bidding",
              text: "Automated calculations and organised workflows help teams respond faster to opportunities without losing accuracy.",
            },
            {
              Icon: TrendingUp,
              title: "Stronger financial planning and profitability",
              text: "Accurate estimates protect profit margins, reduce financial risk, and help you plan projects with more confidence.",
            },
          ].map(({ Icon, title, text }) => (
            <motion.div
              key={title}
              className={`rounded-2xl border border-border/60 bg-background/80 p-6 ${cardHover}`}
              variants={fadeInUp}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <div className="rounded-xl bg-primary/10 w-10 h-10 flex items-center justify-center mb-3">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground">{text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* CTA button (benefits) */}
    <section className="section-dark py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Automate Your Budgets and Improve Project Precision
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Raise the standard of how you estimate your building projects and lay a more solid financial base
              for every project your team delivers.
            </p>
            <a href="https://app.constil.com/signup" className={`${btnPrimary} glow-primary`}>
              Start Estimating Smarter
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>

    {/* Competitive comparison */}
    <section className="section-light py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            variants={fadeInUp}
          >
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">
              Competitive comparison
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-3 text-foreground">
              A Clear Upgrade from Spreadsheets and Generic Tools
            </h2>
          </motion.div>
        </div>

        <div className="max-w-6xl mx-auto mt-10 grid lg:grid-cols-3 gap-6">
          {[
            {
              title: "Spreadsheets",
              badge: "Manual",
              points: [
                "High risk of formula and version errors",
                "Hard to track revisions and assumptions",
                "No single source of truth across teams",
              ],
            },
            {
              title: "Generic estimating tools",
              badge: "Limited",
              points: [
                "Not built for contractor workflows",
                "Fragmented cost libraries and exports",
                "Weak collaboration and approvals",
              ],
            },
            {
              title: "CONSITL estimating platform",
              badge: "Contractor-built",
              points: [
                "Structured estimates with real-time tracking",
                "AI insights for smarter, safer bids",
                "Connected workflows + integrations",
              ],
              featured: true,
            },
          ].map((c) => (
            <div
              key={c.title}
              className={`rounded-3xl border p-7 bg-background/80 ${c.featured ? "border-primary/40 shadow-sm" : "border-border/60"
                }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">{c.title}</h3>
                <span
                  className={`text-[11px] px-3 py-1 rounded-full border ${c.featured
                    ? "bg-primary/10 text-primary border-primary/30"
                    : "bg-muted text-muted-foreground border-border"
                    }`}
                >
                  {c.badge}
                </span>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {c.points.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span className={c.featured ? "text-primary" : "text-muted-foreground"}>•</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              {c.featured && (
                <div className="mt-6">
                  <a href="https://app.constil.com/signup" className={`${btnPrimary} w-full glow-primary`}>
                    Try CONSITL
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Integrations */}
    <section id="integrations" className="section-dark py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6 }}
            variants={fadeInUp}
          >
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">Integrations</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-3 text-foreground">
              Strong Integrations to a Networked Construction Ecosystem
            </h2>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Connect accounting software, document storage, project management solutions, and communication tools
              to create one operational environment.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              With construction estimator accounting software integration, financial data flows between estimating
              and accounting systems—removing manual data entry and keeping budgets and costs in check.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="rounded-3xl border border-border/60 bg-background/80 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-xl bg-primary/10 p-2.5">
                  <Plug className="w-5 h-5 text-primary" />
                </div>
                <p className="font-semibold text-foreground">Connected data flow</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                {[
                  { Icon: BarChart3, label: "Accounting" },
                  { Icon: Layers, label: "Document storage" },
                  { Icon: Workflow, label: "Project management" },
                  { Icon: Zap, label: "Communication" },
                ].map(({ Icon, label }) => (
                  <div key={label} className="rounded-2xl bg-muted/50 p-4 border border-border/60">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">{label}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-2xl bg-primary/10 border border-primary/30 p-4">
                <p className="text-xs font-semibold text-primary mb-1">Outcome</p>
                <p className="text-xs text-muted-foreground">
                  Estimating, project management, and financial tracking stay aligned in one connected ecosystem.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>

    {/* Why choose */}
    <section className="section-light py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            variants={fadeInUp}
          >
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">Why choose</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-3 text-foreground">
              Why AI Construction Estimating Software Increases Predictive Planning
            </h2>
          </motion.div>
        </div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: { opacity: 0, y: 24 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.06 } },
          }}
        >
          {[
            {
              Icon: Workflow,
              title: "Simplified workflow",
              text: "Smart technology makes estimating easier and increases budgeting accuracy.",
            },
            {
              Icon: Building2,
              title: "Built for construction industry needs",
              text: "Designed around contractor processes—not generic financial instruments.",
            },
            {
              Icon: Layers,
              title: "Accurate cost planning",
              text: "Structured organisation keeps project costs clear and audit-ready.",
            },
            {
              Icon: Zap,
              title: "Automation reduces errors",
              text: "Faster estimating with fewer manual calculation mistakes.",
            },
            {
              Icon: CheckCircle2,
              title: "Better team collaboration",
              text: "Estimators, managers, and finance teams work on the same platform.",
            },
            {
              Icon: Brain,
              title: "Growth-ready",
              text: "Flexible for small contractors and scalable for larger teams and complex projects.",
            },
          ].map(({ Icon, title, text }) => (
            <motion.div
              key={title}
              className={`rounded-2xl border border-border/60 bg-background/80 p-6 ${cardHover}`}
              variants={fadeInUp}
            >
              <div className="rounded-xl bg-primary/10 w-10 h-10 flex items-center justify-center mb-3">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground">{text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* Image + CTA */}
    <section className="section-dark py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto rounded-3xl border border-border/60 overflow-hidden bg-background/70">
          <div className="grid lg:grid-cols-2">
            <div className="relative min-h-[320px]">
              <img
                src={heroImg}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                aria-hidden
              />
              <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 to-foreground/30" />
            </div>
            <div className="p-10">
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Intelligent Estimating Builds Smarter Project Budgets
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                We help contractors plan project expenses, create detailed estimates, and keep maximum financial
                transparency before construction starts—replacing manual spreadsheets with a structured estimating
                system built for clarity and efficiency.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="#faqs" className={btnOutline}>
                  Read FAQs
                </a>
                <a href="https://app.constil.com/signup" className={`${btnPrimary} glow-primary`}>
                  Build Better Budgets
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* CTA Banner */}
    <section className="relative py-16 text-primary-foreground overflow-hidden">
      <img
        src={bannerBgImg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        aria-hidden
      />
      <div className="absolute inset-0 bg-primary/50" />
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-6xl mx-auto rounded-3xl border border-primary-foreground/20 bg-primary/60 backdrop-blur-sm p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <p className="text-primary-foreground/80 text-sm font-semibold uppercase tracking-wider mb-2">
              Create more reliable estimates with certainty
            </p>
            <h3 className="text-2xl md:text-3xl font-extrabold">
              Stop basing budgets on fragmented spreadsheets and manual calculations
            </h3>
            <p className="text-primary-foreground/90 mt-3 max-w-2xl">
              Provide your team with a smarter estimating platform that maximises accuracy, speed, and financial
              management across projects.
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* Testimonials */}
    <section className="section-light py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            variants={fadeInUp}
          >
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">Testimonials</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-3 text-foreground">
              Read Why Contractors Trust This Construction Estimating Platform
            </h2>
          </motion.div>
        </div>

        <motion.div
          className="grid md:grid-cols-3 gap-6 mt-10 max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: { opacity: 0, y: 24 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.06 } },
          }}
        >
          {[
            {
              quote:
                "The preparation of project budgets has been enhanced by all means through the use of estimating software. We have now organised our estimates, made them accurate and the bidding process has also become a lot faster.",
              author: "Residential Contractor",
            },
            {
              quote:
                "In the past, big projects could be estimated in a rather complicated and time-intensive way. The construction cost estimating software has assisted us in organising budgets in a clear manner and minimising errors in computation in our commercial projects.",
              author: "Development Co. Construction Company",
            },
            {
              quote:
                "They ensured that estimating was easy for our group. The construction estimator software manages the cost of all materials, labour rates in addition to the project calculations under one roof, which has enabled us to provide better estimates to customers.",
              author: "General Contractor",
            },
          ].map((t) => (
            <motion.div
              key={t.author}
              className={`rounded-2xl border border-border/60 bg-background/80 p-6 flex flex-col justify-between ${cardHover}`}
              variants={fadeInUp}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-sm text-muted-foreground mb-4">“{t.quote}”</p>
              <p className="text-xs font-semibold text-foreground">{t.author}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* FAQs */}
    <section id="faqs" className="section-light py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-primary text-sm font-semibold uppercase tracking-wider">FAQ</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-3 text-foreground">
            FAQs about construction estimating software
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-2xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-3">
            <AccordionItem value="q1" className="bg-background rounded-xl px-6 border border-border/60">
              <AccordionTrigger className="text-left font-medium text-foreground hover:text-primary hover:no-underline py-5">
                What is construction estimating software and what is its operation?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5">
                It groups materials, labour, equipment, and subcontractor costs within one system and generates
                structured estimates and cost breakdowns to support accurate project budgeting.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2" className="bg-background rounded-xl px-6 border border-border/60">
              <AccordionTrigger className="text-left font-medium text-foreground hover:text-primary hover:no-underline py-5">
                How precise are estimates made by current estimation software on construction?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5">
                Modern tools improve precision using systematised cost data, automated calculations, and real-time
                pricing—reducing human errors and helping contractors prepare sound project budgets.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3" className="bg-background rounded-xl px-6 border border-border/60">
              <AccordionTrigger className="text-left font-medium text-foreground hover:text-primary hover:no-underline py-5">
                How does AI construction estimating software make the estimation process better?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5">
                AI analyses historical project data and cost trends to surface risk ranges, improve predictability,
                and support more competitive bids without compromising profitability.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4" className="bg-background rounded-xl px-6 border border-border/60">
              <AccordionTrigger className="text-left font-medium text-foreground hover:text-primary hover:no-underline py-5">
                Does this software come easily to learn and use?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5">
                Most platforms use easy dashboards and templates, allowing teams to learn quickly and begin
                preparing estimates efficiently.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q5" className="bg-background rounded-xl px-6 border border-border/60">
              <AccordionTrigger className="text-left font-medium text-foreground hover:text-primary hover:no-underline py-5">
                What determines the cost of the construction cost estimating software?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5">
                Pricing varies by features, number of users, integrations, and project volume. Automation,
                reporting, and AI capabilities can also influence the cost.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>
      </div>
    </section>

    <Footer />
  </main>
);

export default ConstructionEstimatingPage;

