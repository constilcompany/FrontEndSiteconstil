import Navbar from "@/components/Navbar";
import ConstilChatBot from "@/components/ConstilChatBot";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import heroImg from "@/assets/diverse-engineers.jpg";
import overviewImg from "@/assets/professionals-office.jpg";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowRight,
  Brain,
  Building2,
  Calculator,
  CheckCircle2,
  FileText,
  Layers,
  Ruler,
  Upload,
  Users,
  Wallet,
  Workflow,
} from "lucide-react";
import { Link } from "react-router-dom";

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

const SmartConstructionPage = () => (
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
            AI Construction Estimating
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-primary-foreground mb-6">
            Make Your Construction Process Smarter with{" "}
            <span className="text-primary">AI Construction Estimating Software</span>
          </h1>
          <p className="text-lg text-primary-foreground/90 leading-relaxed mb-4">
            Build your projects with AI construction estimating software constructed to give you the power to take
            charge of your projects. CONSITL changes the way you estimate, plan, and manage with blueprint uploads
            through to precise cost estimates.
          </p>
          <p className="text-primary-foreground/80 leading-relaxed mb-8">
            See how construction estimating will be revamped in the future with high-level automation that is
            seamlessly coupled with intuitive project control, all on a single smart intelligent platform that
            optimizes your workflow and increases your productivity.
          </p>
          <a href="https://app.constil.com/signup" className={`${btnPrimary} glow-primary`}>
            Get Started Now
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>

    {/* 2nd – Smart Construction Company Software */}
    <section className="section-dark py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-bold text-foreground"
          >
            Smart Construction Company Software Engineered to Thrive
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="text-muted-foreground leading-relaxed mt-4"
          >
            CONSITL is a combination of robust construction estimating software and smooth workflow applications that
            eliminate human mistakes and hours of lost time.
          </motion.p>
        </div>
        <motion.div
          className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto"
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
              Icon: Brain,
              title: "AI-Powered Smart Estimating",
              text: "Create proper budgets in real time.",
            },
            {
              Icon: Workflow,
              title: "Smart Cost and Workflow Control",
              text: "Monitor costs and streamline business.",
            },
            {
              Icon: Ruler,
              title: "Computerized Blueprint Quantity Takeoffs",
              text: "Select measurements from the plans.",
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

    {/* 3rd – Who We Are & Why We Built This */}
    <section className="section-light py-20">
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
              Who We Are & Why We Built This
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Smart construction tools should be granted to construction professionals.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              CONSITL was developed to bridge the gap between traditional and modern technologies. Our AI blueprint
              analysis software is technologically advanced, and it reads and analyzes plans immediately, enabling
              contractors to transition to the budget within minutes.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              It does not matter whether you are a residential construction builder or commercial contractor; we want
              to accomplish:
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-3xl border border-primary/30 bg-primary/10 p-6"
          >
            <p className="text-foreground font-medium">
              Provide construction estimating and project management software that is the most reliable, saves
              time, costs, and increases profits.
            </p>
          </motion.div>
        </div>
      </div>
    </section>

    {/* 4th – Turn All Blueprints into Stepped-out Project Insights */}
    <section className="section-dark py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-bold text-foreground"
          >
            Turn All Blueprints into Stepped-out Project Insights
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="text-muted-foreground mt-4"
          >
            Post any blueprint for construction and leave the heavy work to our smart engine.
          </motion.p>
        </div>
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: { opacity: 0, y: 24 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.05 } },
          }}
        >
          {[
            { Icon: Ruler, title: "Intelligent Detection of Measuring", text: "Automatically derives the correct dimensions of blueprints." },
            { Icon: Layers, title: "Proper Material Quantification", text: "Determines resources and estimates precise amounts." },
            { Icon: Calculator, title: "Instant Cost Breakdown", text: "Creates cost estimates for construction with a couple of clicks." },
            { Icon: Brain, title: "AI-Based Interpretation of a Plan", text: "Smarts up smartly analysis of complex drawings." },
            { Icon: Workflow, title: "Continuous Takeoff Integration", text: "Relates takeoffs with workflow estimation." },
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

    {/* 5th – Built for Builders, Powered by Intelligence */}
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
              alt="Construction professionals at work"
              className="w-full h-[380px] object-cover rounded-3xl border border-border/60 shadow-sm"
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Built for Builders, Powered by Intelligence
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We are the best professionals in construction.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              CONSITL is a company that assists a contractor at all levels of development and provides strong
              building construction project software that facilitates planning, budgeting and implementation. Our
              intelligent system streamlines complicated processes and enhances project visibility all the way to
              completion.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Using the CONSITL software in <Link to="/estimates_software">estimating costs</Link>, materials, and labor to build the structure, advanced
              residential construction estimating software allows one to make correct cost and material estimates
              and labor estimates. Our system scales to any business needs and your project, whether it is a small
              housing project or a large commercial project.
            </p>
          </motion.div>
        </div>
      </div>
    </section>

    {/* 6th – The Future of Automated Construction Estimating */}
    <section className="section-dark py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto text-center rounded-3xl border border-primary/30 bg-primary/10 p-10">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
          >
            The Future of Automated Construction Estimating Begins Here
          </motion.h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Find out why contractors are moving to smart construction company software that saves time and is more
            likely to boost margins.
          </p>
          <p className="text-foreground font-semibold mb-8">
            Experience precision. Experience automation. Experience the CONSITL.
          </p>
          <a href="https://app.constil.com/signup" className={`${btnPrimary} glow-primary`}>
            Get Started
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>

    {/* 7th – What We Can Provide to Drive Your Business */}
    <section className="section-light py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-bold text-foreground"
          >
            What We Can Provide to Drive Your Business
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="text-muted-foreground mt-4"
          >
            The platform is smart, and it consists of a combination of powerful estimating, invoicing, and project
            management tools. Developed to meet the needs of the modern contractors, it enhances precision,
            conserves precious time, as well as assisting in maximizing profitability at each phase of your
            building endeavors.
          </motion.p>
        </div>
        <motion.div
          className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto"
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
              Icon: FileText,
              title: "Invoice Management",
              text: "Automated construction estimating and invoicing capabilities in growing billing using sophisticated construction company software.",
            },
            {
              Icon: Calculator,
              title: "Estimates & Quotes",
              text: "Create precise suggestions through the use of effective construction estimating software and intelligent blueprint estimating software tools.",
            },
            {
              Icon: Users,
              title: "Client Management",
              text: "Small business projects should be managed using efficient construction management software to manage client data.",
            },
            {
              Icon: Wallet,
              title: "Payment Tracking",
              text: "Make certain accountability of cash flow with incorporated construction cost estimating software and financial reporting software.",
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

    {/* 8th – Why choose AI construction estimating software */}
    <section className="section-dark py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-bold text-foreground mb-6 text-center"
          >
            Why choose AI construction estimating software
          </motion.h2>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="space-y-4 text-muted-foreground leading-relaxed"
          >
            <p>
              CONSITL is designed as the best software for residential construction estimating, and it is able to
              provide the most accurate results to home builders and remodelers.
            </p>
            <p>
              Our smart system minimizes human mistakes and enhances bid competition, and at the same time,
              profitability.
            </p>
            <p>
              In the case of large companies, we also offer sophisticated commercial construction estimating
              software in order to take complicated projects with certainty.
            </p>
          </motion.div>
        </div>
      </div>
    </section>

    {/* 9th – Our Artificial Intelligence Construction Estimating Process */}
    <section id="how-it-works" className="section-light py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-bold text-foreground"
          >
            Our Artificial Intelligence Construction Estimating Process
          </motion.h2>
        </div>
        <motion.div
          className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: { opacity: 0, y: 24 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.08 } },
          }}
        >
          {[
            {
              step: "1",
              Icon: Upload,
              title: "Upload Plans",
              text: "Create your publications through our smart construction blueprint software interface.",
            },
            {
              step: "2",
              Icon: Brain,
              title: "AI Analysis",
              text: "Our AI construction estimating software scans and interprets your files in real time.",
            },
            {
              step: "3",
              Icon: Calculator,
              title: "Generate Estimate",
              text: "Get cost breakdown in detail with powerful construction estimating software.",
            },
            {
              step: "4",
              Icon: Workflow,
              title: "Manage & Execute",
              text: "Monitor timelines, budgets and progress using built in construction estimating and project management software.",
            },
          ].map(({ step, Icon, title, text }) => (
            <motion.div
              key={step}
              className={`rounded-2xl border border-border/60 bg-background p-6 flex gap-4 ${cardHover}`}
              variants={fadeInUp}
            >
              <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary text-primary-foreground font-bold flex items-center justify-center">
                {step}
              </span>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-foreground">{title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{text}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* 10th – Increase Precision */}
    <section className="section-dark py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-bold text-foreground mb-6 text-center"
          >
            Increase Precision using Construction cost estimating software
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="text-muted-foreground leading-relaxed text-center max-w-3xl mx-auto"
          >
            Modernize your construction company software, which will revolutionize the manner in which you
            structure, control and execute projects. Constil simplifies the working process, elevates the level of
            cost accuracy, and strengthens team cooperation. Start using it today and start to enjoy the benefits
            of genuine automated construction estimating designed with the modern building professional in mind and
            the need to achieve efficiency, precision and long-term development.
          </motion.p>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mt-8"
          >
            <a href="https://app.constil.com/signup" className={`${btnPrimary} glow-primary`}>
              Start Today
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>

    {/* Testimonials – Modern Construction Professionals' Success Stories */}
    <section className="section-light py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-bold text-foreground"
          >
            Modern Construction Professionals&apos; Success Stories
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="text-muted-foreground mt-4"
          >
            CONSITL is relied upon by contractors to ease the processes of estimating and project management and
            enhance financial clarity and operational efficiency.
          </motion.p>
        </div>
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto"
        >
          CONSITL has revamped the way project estimation and project management are done. It is all quicker, more
          distinct and much more precise.
        </motion.p>
        <motion.div
          className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto"
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
                "It only takes minutes to upload a blueprint for construction, after which the system does the rest. The automation saves us hours on any individual estimate.",
              author: "Contractor",
            },
            {
              quote:
                "Their software for construction management makes our team stay on track. We have made things more efficient and minimized expensive mistakes in all projects.",
              author: "Project Manager",
            },
            {
              quote:
                "CONSITL has revamped the way we estimate and manage projects. Quicker, clearer, and much more precise.",
              author: "Construction Company",
            },
          ].map((item) => (
            <motion.div
              key={item.author}
              className={`rounded-2xl border border-border/60 bg-background/80 p-6 flex flex-col justify-between ${cardHover}`}
              variants={fadeInUp}
            >
              <p className="text-sm text-muted-foreground mb-4">&ldquo;{item.quote}&rdquo;</p>
              <p className="text-xs font-semibold text-foreground">{item.author}</p>
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
          <h2 className="text-3xl md:text-4xl font-bold mt-3 text-foreground">FAQs</h2>
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
                What is the level of compatibility between construction estimating software and mobile and cloud-based
                workflow?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5">
                The majority of construction estimating software is entirely mobile compatible and supports
                cloud-based technologies to be accessed in real-time. Working teams have the ability to work
                together, revise estimations, and monitor the progress of projects anywhere, thus project workflow
                management remains smooth.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2" className="bg-background rounded-xl px-6 border border-border/60">
              <AccordionTrigger className="text-left font-medium text-foreground hover:text-primary hover:no-underline py-5">
                Is construction management software scalable between small residential projects and large commercial
                constructions?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5">
                Construction management software is indeed developed to scale up and down to any project size. It
                can fit your workflow and scale (with residential construction estimating software) all the way up
                to complex commercial projects.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3" className="bg-background rounded-xl px-6 border border-border/60">
              <AccordionTrigger className="text-left font-medium text-foreground hover:text-primary hover:no-underline py-5">
                What is the estimated time frame of coming up with an estimate through construction estimating
                software?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5">
                Substantial cost estimates can be created in minutes instead of hours using the estimating software
                in construction. Since AI construction estimates software, analysis of blueprints, and calculation
                of materials are automated to give quicker results.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4" className="bg-background rounded-xl px-6 border border-border/60">
              <AccordionTrigger className="text-left font-medium text-foreground hover:text-primary hover:no-underline py-5">
                What is the accuracy of AI construction estimating software when applied to real-world projects?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5">
                The software of AI construction estimating is very accurate because it analyzes blueprints and
                previous project data. It eliminates human error and enhances the accuracy of budgeting, and makes
                reliable cost projections of real-world construction projects.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q5" className="bg-background rounded-xl px-6 border border-border/60">
              <AccordionTrigger className="text-left font-medium text-foreground hover:text-primary hover:no-underline py-5">
                Does it have subscription plans to the construction company software?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5">
                Yes, our construction company software solutions include flexible subscription plans, which have been
                designed to meet the various business requirements. The choices are usually small business packages
                containing construction management applications of small business specifications, and enterprise
                levels.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>
      </div>
    </section>

    <Footer />
  </main>
);

export default SmartConstructionPage;
