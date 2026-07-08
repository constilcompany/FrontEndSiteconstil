import Navbar from "@/components/Navbar";
import ConstilChatBot from "@/components/ConstilChatBot";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import clientHeroImg from "@/assets/team-professionals.jpg";
import smarterSystemsImg from "@/assets/professionals-office.jpg";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Users,
  ClipboardList,
  BarChart3,
  Handshake,
  ArrowRight,
  Sparkles,
  Target,
  Building2,
  Zap,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const cardHover = "transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/20";
const btnPrimary =
  "inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary-hover transition-all duration-300 focus-visible:outline focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-[0.98]";
const btnSecondary =
  "inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border-2 border-primary-foreground/30 text-primary-foreground font-semibold hover:bg-primary-foreground/10 backdrop-blur-sm transition-all duration-300 focus-visible:outline focus-visible:ring-2 focus-visible:ring-primary-foreground/50 focus-visible:ring-offset-2 active:scale-[0.98]";
const btnOutline =
  "inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-muted transition-all duration-300 focus-visible:outline focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-[0.98]";

const ClientManagementPage = () => (
  <main className="bg-background min-h-screen scroll-smooth">
    <Navbar />
    <ConstilChatBot />

    {/* Hero / Overview – image as background */}
    <section className="relative min-h-[85vh] flex items-center overflow-hidden pt-24">
      {/* Background image */}
      <img
        src={clientHeroImg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        aria-hidden
      />
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/70 to-foreground/50" />
      {/* Subtle grid (optional) */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(hsl(217 100% 63% / 0.4) 1px, transparent 1px), linear-gradient(90deg, hsl(217 100% 63% / 0.4) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 border border-primary/40 text-primary text-xs font-semibold tracking-wider uppercase mb-6 backdrop-blur-sm">
            Client Management for Contractors
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-primary-foreground mb-6">
            The Future of Client Management
            <br className="hidden md:block" />
            <span className="text-primary"> for Contractors</span> Starts Here
          </h1>
          <p className="text-lg text-primary-foreground/90 leading-relaxed mb-4">
            CONSTIL offers a powerful Construction Client Management Software that targets builders, contractors,
            and real estate professionals. Manage all relationships, documentation, and interaction, simplify
            communication and ensure your entire client pipeline is organised with one intelligent system, which
            is easy to use since it starts with the first inquiry to final project completion.
          </p>
          <p className="text-primary-foreground/80 leading-relaxed mb-8">
            Constructing businesses requires more than spreadsheets. Client Management for Contractors enables
            your business to handle clients more effectively, reduce confusion in operations, and create a solid
            base for scalable construction operations.
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

    {/* Challenges of client management */}
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
              Why construction client management is more difficult than ever
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Construction businesses are not only the managers of the projects. They control individuals,
              expectations, schedules, permits, adjustments and payments. Every single client interaction has an
              impact on reputation and long-term growth.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Without the right client management system, contractors struggle with lost conversations, fragmented
              records, and missed follow ups. Teams fail to update each other and significant opportunities slip
              away.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              CONSTIL is a single, strong client management solution designed specifically to help contractors keep
              their teams organised and in full control of every client relationship.
            </p>
          </motion.div>

          {/* Image / visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="rounded-3xl border border-border/60 bg-background/80 p-6 h-full min-h-[260px] flex flex-col justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-2">
                  From chaos to clarity
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Map every stakeholder, approval, and conversation in one place instead of chasing fragmented
                  threads.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="rounded-2xl bg-muted/50 p-4">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Without CONSTIL</p>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    <li>• Scattered email trails</li>
                    <li>• Missed approvals</li>
                    <li>• Lost context</li>
                    <li>• Reactive firefighting</li>
                  </ul>
                </div>
                <div className="rounded-2xl bg-primary/10 border border-primary/40 p-4">
                  <p className="text-xs font-semibold text-primary mb-2">With CONSTIL</p>
                  <ul className="space-y-1 text-xs text-foreground">
                    <li>• Unified records</li>
                    <li>• Structured workflows</li>
                    <li>• Clear ownership</li>
                    <li>• Proactive engagement</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>

    {/* Trusted by construction teams */}
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Relied on by construction teams who treasure client clarity
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              <Link to="/"> CONSTIL </Link> has been trusted by construction businesses because it was built around their reality. From
              independent contractors to growing construction companies, teams use our client tracking software to:
            </p>
          </motion.div>
        </div>
        <motion.div
          className="grid md:grid-cols-4 gap-6 mt-8 max-w-5xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: { opacity: 0, y: 24 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.6, staggerChildren: 0.05 },
            },
          }}
        >
          {[
            { title: "Record all contacts", desc: "Capture every touchpoint with clients in a single, reliable system.", Icon: Users },
            { title: "Improve response time", desc: "React faster with organised information and clear ownership.", Icon: Zap },
            { title: "Increase repeat business", desc: "Deliver a predictable, transparent experience clients want to return to.", Icon: Handshake },
            { title: "Ensure transparency", desc: "Give clients full visibility into progress, updates, and decisions.", Icon: CheckCircle2 },
          ].map(({ title, desc, Icon }) => (
            <motion.div
              key={title}
              className={`rounded-2xl border border-border/60 bg-background p-5 text-left ${cardHover}`}
              variants={fadeInUp}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-primary/10 p-2.5 shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{title}</h3>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        <div className="max-w-3xl mx-auto text-center mt-8">
          <p className="text-muted-foreground">
            CONSTIL helps transform reactive communication into proactive engagement with your clients.
          </p>
        </div>
      </div>
    </section>

    {/* Need to simplify operations */}
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
              Need to simplify your client operations with a strong platform?
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Get complete control of your pipeline with organised client management solutions built to grow with
              your construction business. Keep all your leads in order, stay in touch, and control the entire client
              journey.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              From the first enquiry to final delivery, CONSTIL keeps every step structured so nothing falls through
              the cracks.
            </p>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="rounded-3xl border border-border/60 bg-gradient-to-br from-primary/10 via-background to-primary/5 p-6 h-full min-h-[260px]">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    Client pipeline
                  </p>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[11px] px-3 py-1">
                    Live
                  </span>
                </div>
                <div className="space-y-3 text-xs text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>New enquiries</span>
                    <span className="text-foreground font-semibold">18</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>In negotiation</span>
                    <span className="text-foreground font-semibold">9</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Active projects</span>
                    <span className="text-foreground font-semibold">12</span>
                  </div>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-primary/15">
                  <div className="h-1.5 rounded-full bg-primary w-4/5" />
                </div>
                <p className="text-[11px] text-muted-foreground mt-2">
                  All client, project, and communication data flows through a single organised system.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>

    {/* Marketplace functionality / feature pillars */}
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Marketplace-strength functionality inside your client management tool
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Organise and amplify your entire customer base with features designed for construction workflows.
            </p>
          </motion.div>
        </div>
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: { opacity: 0, y: 24 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.6, staggerChildren: 0.05 },
            },
          }}
        >
          {[
            { title: "Organise and amplify your customer base", text: "Efficiently organise all client information using robust database management built for construction processes. Create unlimited profiles, store key documents, and keep a structured, accessible system.", Icon: ClipboardList },
            { title: "Track every interaction with precision", text: "Track approvals, project updates, and communications in real time. Automated follow-ups reduce missed tasks and keep teams accountable.", Icon: BarChart3 },
            { title: "Use resources with confidence", text: "Allocate project managers, track duties, and coordinate internal processes with client resource management, improving accuracy, communication, and service.", Icon: Target },
            { title: "Serve real estate and construction customers comfortably", text: "Organise customers, vendors, and investors with workflows tailored to both residential and commercial construction, scaling as your projects and client base grow.", Icon: Building2 },
          ].map(({ title, text, Icon }) => (
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

    {/* Smarter strategy overview (Section 6) */}
    <section id="strategy" className="section-dark py-20">
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
              A smarter client management strategy
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              CONSTIL connects project activities with a powerhouse client management tool tailored to contractors.
              With a built-in client data management system, your team operates on a single platform.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              See every project, maintain structured document control, leverage smart notifications, activity logs,
              and performance analytics, and keep everything you need to manage clients clearly and confidently.
            </p>
          </motion.div>

          {/* Overview visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="rounded-3xl border border-border/60 bg-background/80 p-6 h-full min-h-[260px] space-y-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="rounded-2xl bg-muted/50 p-4">
                  <p className="text-[11px] font-semibold text-muted-foreground mb-1">Activity log</p>
                  <ul className="space-y-1 text-[11px] text-muted-foreground">
                    <li>• Client approval recorded</li>
                    <li>• Change order sent</li>
                    <li>• Site meeting confirmed</li>
                  </ul>
                </div>
                <div className="rounded-2xl bg-primary/10 border border-primary/40 p-4">
                  <p className="text-[11px] font-semibold text-primary mb-1">Smart alerts</p>
                  <ul className="space-y-1 text-[11px] text-foreground">
                    <li>• Follow-up overdue</li>
                    <li>• New enquiry unassigned</li>
                    <li>• Contract awaiting signature</li>
                  </ul>
                </div>
              </div>
              <div className="rounded-2xl bg-background border border-border p-4 text-xs">
                <p className="text-[11px] font-semibold text-muted-foreground mb-1">Performance analytics</p>
                <p className="text-[11px] text-muted-foreground mb-2">
                  Understand conversion rates, response times, and client satisfaction to improve every project
                  cycle.
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 rounded-full bg-primary/15">
                    <div className="h-1.5 rounded-full bg-primary w-3/4" />
                  </div>
                  <span className="text-[11px] text-primary font-semibold">+23% faster cycles</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>

    {/* How it works (Section 7) */}
    <section id="how-it-works" className="section-light py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">How it works</h2>
            <p className="text-muted-foreground leading-relaxed">
              A clear, four-step workflow that centralises information, structures processes, and keeps every
              interaction traceable.
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
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.6, staggerChildren: 0.06 },
            },
          }}
        >
          {[
            {
              title: "Capture and centralise",
              text:
                "Store all enquiries, leads, and client information directly in the client management software. Calls, emails, and forms are captured in one secure place from day one.",
            },
            {
              title: "Organise and structure",
              text:
                "Automatically organise client profiles with predefined fields based on construction workflows. Contracts, documents, estimates, and communication history stay structured and accessible.",
            },
            {
              title: "Track and monitor",
              text:
                "Use intelligent records to track conversations, project updates, approvals, and follow-ups in real time. Nothing gets lost between departments.",
            },
            {
              title: "Manage and deliver",
              text:
                "Coordinate teams with built-in resource management. Assign responsibilities, organise schedules, and guide work from onboarding to final delivery in a controlled way.",
            },
          ].map((item) => (
            <motion.div
              key={item.title}
              className={`rounded-2xl border border-border/60 bg-background/80 p-6 text-left flex flex-col gap-2 ${cardHover}`}
              variants={fadeInUp}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <div className="rounded-xl bg-primary/10 w-10 h-10 flex items-center justify-center mb-1">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* Benefits (Section 8) */}
    <section className="section-dark py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Key benefits</h2>
            <p className="text-muted-foreground leading-relaxed">
              Move from ad-hoc client communication to a structured, predictable experience for every project.
            </p>
          </motion.div>
        </div>
        <motion.div
          className="grid md:grid-cols-3 gap-6 mt-10 max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: { opacity: 0, y: 24 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.6, staggerChildren: 0.05 },
            },
          }}
        >
          {[
            { title: "Better networking and better communication", text: "Build sustainable business relationships with solutions that group all conversations and updates in one place, reducing misunderstandings across the client lifecycle." },
            { title: "Less mismanagement and more control", text: "Move away from manual tracking and data silos. Accurate records and clear documentation improve control across every project." },
            { title: "Smart retention and long-term growth", text: "Transparency and efficiency drive stronger client loyalty. Intelligent management improves retention, streamlines operations, and supports long-term profitability." },
          ].map(({ title, text }) => (
            <motion.div
              key={title}
              className={`rounded-2xl border border-border/60 bg-background/80 p-6 ${cardHover}`}
              variants={fadeInUp}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="font-semibold text-foreground mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground">{text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* CTA (Section 9) */}
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Ready to upgrade to powerful client management for contractors?
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Modern construction companies need more than spreadsheets and disconnected communication. Elevate how
              you manage clients by organising, tracking, and managing every relationship in a structure built for
              growth, visibility, and long-term success.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="https://app.constil.com/signup" className={`${btnPrimary} glow-primary`}>
                Start Now
                <ArrowRight className="w-4 h-4" />
              </a>
              <a href="#faqs" className={btnOutline}>
                View FAQs
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>

    {/* Sub services placeholder (Section 10) */}
    <section className="section-dark py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            className="text-2xl md:text-3xl font-bold mb-4 text-foreground"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            variants={fadeInUp}
          >
            Sub-services inside CONSTIL Client Management
          </motion.h2>
          <p className="text-muted-foreground leading-relaxed">
            Configure specific services such as pre-construction communication, variation management, and
            post-handover follow-up – all using the same structured client backbone.
          </p>
        </div>
      </div>
    </section>

    {/* Workflow (Section 11) */}
    <section id="workflow" className="section-light py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Client management workflow
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Guide every client through a predictable, trackable sequence from first contact to final follow-up.
            </p>
          </motion.div>
        </div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mt-10 max-w-6xl mx-auto text-sm"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: { opacity: 0, y: 24 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.6, staggerChildren: 0.05 },
            },
          }}
        >
          {[
            {
              title: "Lead capture & qualification",
              text: "Identify prospects and qualify them quickly using structured fields.",
            },
            {
              title: "Proposal approval & estimation",
              text: "Prepare estimates and secure approvals in time with clear records.",
            },
            {
              title: "Project start & contracts",
              text: "Formalise decisions, sign contracts, and launch systematic processes.",
            },
            {
              title: "Execution & change management",
              text: "Track progress and changes in an orderly, auditable way.",
            },
            {
              title: "Handover & follow-up",
              text: "Deliver smoothly and maintain relationships with structured follow-up.",
            },
          ].map((item) => (
            <motion.div
              key={item.title}
              className={`rounded-2xl border border-border/60 bg-background/80 p-4 text-left ${cardHover}`}
              variants={fadeInUp}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
              <p className="text-xs text-muted-foreground">{item.text}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="max-w-3xl mx-auto text-center mt-6">
          <p className="text-muted-foreground text-sm">
            Our structured client management platform powers each stage, ensuring nothing is missed along the way.
          </p>
        </div>
      </div>
    </section>

    {/* Integrations (Section 12) */}
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
              Strong integrations for a smarter construction ecosystem
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Connect your accounting tools, email platforms, project management software, cloud storage, and payment
              gateways. With seamless integrations, you can expand and automate your workflows with a single click.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Your construction client management software becomes the core of operations, synchronising data across
              systems so your team can work inside one connected, intelligent ecosystem.
            </p>
          </motion.div>

          {/* Integrations visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="rounded-3xl border border-border/60 bg-background/80 p-6 h-full min-h-[260px]">
              <div className="grid grid-cols-3 gap-4 text-xs text-muted-foreground">
                {["Accounting", "Email", "PM tools", "Cloud", "Payments", "CRMs"].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-dashed border-border/80 bg-muted/60 px-3 py-4 flex items-center justify-center text-center"
                  >
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-2xl bg-primary/10 border border-primary/40 px-4 py-3 text-xs text-primary">
                CONSTIL sits at the centre, syncing client and project data between all your operational tools.
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>

    {/* Why choose Constil (Section 13) */}
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Why construction businesses choose CONSTIL
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We combine construction-specific automation and structured systems to streamline client operations,
              increase visibility, and build long-term relationships throughout every project stage.
            </p>
          </motion.div>
        </div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: { opacity: 0, y: 24 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.6, staggerChildren: 0.05 },
            },
          }}
        >
          {[
            { title: "Built for the construction industry", text: "Our client manager software is built around real contractor processes, project cycles, and documentation requirements – not generic sales pipelines." },
            { title: "Zero-confusion centralisation", text: "Keep conversations, contracts, and updates in one platform, giving your team clarity without jumping between disconnected tools." },
            { title: "Automation that reduces manual work", text: "Intelligent client management automates follow-ups, reminders, and workflow transitions to reduce repetitive admin and increase responsiveness." },
            { title: "Better coordination and visibility", text: "Organised client data gives every department confidence that nothing is missed from lead to final handover." },
            { title: "Scales with growing contractors", text: "Serve more clients, larger teams, and more complex processes while keeping client management steady and effective." },
          ].map(({ title, text }) => (
            <motion.div
              key={title}
              className={`rounded-2xl border border-border/60 bg-background/80 p-6 ${cardHover}`}
              variants={fadeInUp}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="font-semibold text-foreground mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground">{text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* Image + CTA (Section 14) */}
    <section className="section-dark py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Image – left side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl"
            whileHover={{ scale: 1.02 }}
          >
            <img
              src={smarterSystemsImg}
              alt="Construction professionals using client management systems"
              className="rounded-3xl w-full object-cover aspect-[4/3] transition-transform duration-500"
            />
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6 }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              How to have smarter systems with your clients
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Give your team a scalable client management system designed specifically for construction. Speed up
              communication, systematise interactions, and build a workflow that increases transparency, efficiency,
              and long-term retention.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              As your organisation grows, CONSTIL grows with you – keeping every client relationship structured and
              traceable.
            </p>
            <a href="https://app.constil.com/signup" className={`${btnPrimary} glow-primary`}>
              Talk to our team
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>

    {/* Final CTA (Section 15) */}
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Take full control of your client operations
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Move away from disconnected tools and manual tracking. Adopt a client management platform that gives
              your construction business complete visibility, better coordination, and a consistent client experience
              from first touch to final handover.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              With CONSTIL, you do more than manage contacts – you build systematic structures that help you grow,
              retain, and secure long-term revenue.
            </p>
            <a href="https://app.constil.com/signup" className={`${btnPrimary} glow-primary`}>
              Get Started with CONSTIL
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>

    {/* Reviews (Section 16) */}
    <section className="section-dark py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Read why contractors like this client management system
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
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.6, staggerChildren: 0.05 },
            },
          }}
        >
          {[
            {
              quote:
                "Using CONSTIL’s Client Management for Contractors has completely changed how we track and manage client information. Everything is organised and clear, and our team has never moved faster.",
              author: "Residential Contractor",
            },
            {
              quote:
                "Our projects are more streamlined since all client communication is centralised. CONSTIL’s platform has reduced mistakes and aligned our teams.",
              author: "Commercial Construction Firm",
            },
            {
              quote:
                "Managing clients is easier with CONSTIL. The construction client management software keeps us on top of documentation and follow-ups so we can focus on growing the business.",
              author: "General Contractor",
            },
          ].map((item) => (
            <motion.div
              key={item.author}
              className={`rounded-2xl border border-border/60 bg-background/80 p-6 flex flex-col justify-between ${cardHover}`}
              variants={fadeInUp}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-sm text-muted-foreground mb-4">“{item.quote}”</p>
              <p className="text-xs font-semibold text-foreground">{item.author}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* FAQs (Section 17) – same expand/collapse format as main FAQ */}
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
            FAQs about construction client management software
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
            <AccordionItem
              value="q1"
              className="bg-background rounded-xl px-6 border border-border/60"
            >
              <AccordionTrigger className="text-left font-medium text-foreground hover:text-primary hover:no-underline py-5">
                How does construction client management software make life easier for contractors?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5">
                It centralises client information, project updates, and communication in a single platform. This
                reduces manual work and keeps teams aligned from lead to project completion.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem
              value="q2"
              className="bg-background rounded-xl px-6 border border-border/60"
            >
              <AccordionTrigger className="text-left font-medium text-foreground hover:text-primary hover:no-underline py-5">
                What types of projects benefit the most from client tracking software?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5">
                Residential, commercial, and mixed-use projects all gain value. Any project with multiple clients,
                approvals, or phases can be effectively managed and tracked.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem
              value="q3"
              className="bg-background rounded-xl px-6 border border-border/60"
            >
              <AccordionTrigger className="text-left font-medium text-foreground hover:text-primary hover:no-underline py-5">
                How long does it take to implement a client data management system in a construction firm?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5">
                Implementation typically takes 2–6 weeks, depending on company size and data complexity. With a
                structured migration and training plan, teams can see value quickly.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem
              value="q4"
              className="bg-background rounded-xl px-6 border border-border/60"
            >
              <AccordionTrigger className="text-left font-medium text-foreground hover:text-primary hover:no-underline py-5">
                Is client management software customisable to construction workflows?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5">
                Yes. Tasks, approvals, and notifications can be tailored to your own processes and project types,
                so the platform fits how your teams already work.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem
              value="q5"
              className="bg-background rounded-xl px-6 border border-border/60"
            >
              <AccordionTrigger className="text-left font-medium text-foreground hover:text-primary hover:no-underline py-5">
                What is the ROI of investing in a contractor client management solution?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5">
                ROI shows up in faster project cycles, fewer errors, and higher client retention. Automation and
                better data reduce admin time and improve profitability.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>
      </div>
    </section>

    <Footer />
  </main>
);

export default ClientManagementPage;

