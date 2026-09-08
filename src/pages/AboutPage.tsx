import Footer from '@/components/Footer'
import TryIt from '@/components/TryIt'
import Navbar from '@/components/Navbar'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
    ArrowRight,
    BarChart3,
    CheckCircle2,
    Eye,
    Rocket,
    Target,
    Gauge,
} from 'lucide-react'
import { Helmet } from 'react-helmet'
import officeImg from "@/assets/images/civil.jpg"
import diverseEngineersImg from "@/assets/images/our-vision.jpg"
import bannerImage from "@/assets/hero-construction.jpg"

const fadeInUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
};

const stats = [
    { Icon: BarChart3, value: "10k+", label: "Estimates generated" },
    { Icon: Gauge, value: "70%", label: "Faster takeoffs" },
    { Icon: CheckCircle2, value: "98%", label: "Estimate accuracy" },
];

const storySteps = [
    {
        step: "01",
        Icon: Rocket,
        title: "The Beginning",
        text: "Constil started by fixing a real problem: estimating in construction was slow, inconsistent and relied too much on guesswork. Contractors were losing opportunities simply because they could not react in time.",
    },
    {
        step: "02",
        Icon: BarChart3,
        title: "The Turning Point",
        text: "We brought automation into estimating and project workflows. As the technology matured, AI became part of the platform — making pricing faster, more accurate and more intelligent with real-world data.",
    },
    {
        step: "03",
        Icon: CheckCircle2,
        title: "Where It Is Today",
        text: "Constil is now a complete construction platform: proposals, invoicing, pricing intelligence and workflow automation — helping contractors work faster, decide better and scale with confidence.",
    },
];

const AboutPage = () => {
    const tryItContent = {
        heading: "Ready to See the Difference Automation Makes?",
        title: "Join thousands of contractors using Constil to estimate faster, invoice on time and protect their margins.",
        description: "Start free today and upload your first blueprint — no spreadsheets, no manual takeoffs, no guesswork.",
        buttonText: "Start Free Trial",
        path: "https://app.constil.com/"
    };

    return (
        <main className="bg-background min-h-screen scroll-smooth">
            <Helmet>
                <title>About Us | Constil Construction Software</title>
                <meta name="description" content="Learn about Constil, the AI-based construction software designed to make estimating, pricing, and managing projects easier for contractors." />
                <link rel="canonical" href="https://constil.com/about" />
            </Helmet>

            <Navbar />

            {/* Hero */}
            <section className="relative overflow-hidden pt-32 pb-16 bg-navy text-primary-foreground">
                <img src={bannerImage} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-br from-navy/95 via-navy/85 to-navy/70" />
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage:
                            "linear-gradient(hsl(217 100% 63% / 0.4) 1px, transparent 1px), linear-gradient(90deg, hsl(217 100% 63% / 0.4) 1px, transparent 1px)",
                        backgroundSize: "60px 60px",
                    }}
                />

                <div className="relative container mx-auto px-4 max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 28 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        className="max-w-3xl mx-auto text-center"
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 border border-primary/40 text-primary text-xs font-semibold tracking-wider uppercase mb-6 backdrop-blur-sm">
                            About Constil
                        </span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
                            The <span className="text-primary">AI construction software</span> built for contractors who want more
                        </h1>
                        <p className="text-lg text-primary-foreground/85 leading-relaxed mb-4 max-w-2xl mx-auto">
                            From blueprint to invoice in one platform. Constil automates estimating, takeoffs and project
                            management so you bid faster, win more and protect your margins.
                        </p>
                        <p className="text-primary-foreground/70 leading-relaxed mb-10 max-w-2xl mx-auto">
                            Designed around real industry challenges, Constil replaces slow manual processes with fast,
                            data-driven workflows — less paperwork, more time on the projects you actually win.
                        </p>

                        <div className="flex flex-wrap justify-center gap-4 mb-12">
                            <a
                                href="https://app.constil.com/"
                                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary-hover transition-all duration-300 glow-primary"
                            >
                                Start Free Trial
                                <ArrowRight className="w-4 h-4" />
                            </a>
                            <Link
                                to="/contact"
                                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border-2 border-primary-foreground/30 text-primary-foreground font-semibold hover:bg-primary-foreground/10 backdrop-blur-sm transition-all duration-300"
                            >
                                Contact Sales
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
                            {stats.map(({ Icon, value, label }) => (
                                <motion.div
                                    key={label}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    variants={fadeInUp}
                                    transition={{ duration: 0.5 }}
                                    className="rounded-2xl border border-primary-foreground/15 bg-primary-foreground/5 backdrop-blur-sm px-5 py-4 text-center"
                                >
                                    <Icon className="w-5 h-5 text-primary mx-auto mb-1.5" />
                                    <div className="text-2xl font-extrabold">{value}</div>
                                    <div className="text-xs text-primary-foreground/70">{label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Solution */}
            <section className="section-light py-20">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -24 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.6 }}
                            className="relative order-2 lg:order-1"
                        >
                            <img
                                src={officeImg}
                                alt="Construction professionals using Constil software"
                                className="w-full h-[380px] object-cover rounded-3xl border border-border/60 shadow-sm"
                                loading="lazy"
                            />
                            <div className="absolute -bottom-5 -right-3 md:right-6 rounded-2xl border border-primary/30 bg-background shadow-lg px-5 py-4">
                                <span className="text-3xl font-extrabold text-primary">1</span>
                                <span className="text-sm text-muted-foreground ml-2">platform, end to end</span>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 24 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.6 }}
                            className="order-1 lg:order-2"
                        >
                            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-semibold tracking-wider uppercase mb-5">
                                Why Constil
                            </span>
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-5">
                                One platform for the entire construction workflow
                            </h2>
                            <p className="text-muted-foreground leading-relaxed mb-7">
                                Constil brings everything into a single intelligent system, so you eliminate the
                                spreadsheets, manual calculations and disconnected tools that slow you down — from
                                estimating and takeoffs to invoicing and workflow automation.
                            </p>
                            <ul className="space-y-4 mb-8">
                                {[
                                    "Estimates built from real blueprints — not spreadsheets",
                                    "Invoicing, client and payment tracking in one place",
                                    "AI insights that help you win bids and protect margins",
                                ].map((item) => (
                                    <li key={item} className="flex items-start gap-3 text-foreground/90">
                                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="flex flex-wrap gap-4">
                                <a
                                    href="https://app.constil.com/"
                                    className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary-hover transition-all duration-300 glow-primary"
                                >
                                    Get Started Now
                                    <ArrowRight className="w-4 h-4" />
                                </a>
                                <Link
                                    to="/smart-construction"
                                    className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl border-2 border-foreground/20 text-foreground font-semibold hover:bg-foreground/5 transition-all duration-300"
                                >
                                    See How It Works
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Our Story */}
            <section className="bg-white py-20">
                <div className="container mx-auto px-4 max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-14"
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-semibold tracking-wider uppercase mb-4">
                            Our Journey
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Our Story</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            The evolution of Constil, from a simple idea to an intelligent construction platform.
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid md:grid-cols-3 gap-6"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={{
                            hidden: { opacity: 0, y: 24 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.08 } },
                        }}
                    >
                        {storySteps.map(({ step, Icon, title, text }) => (
                            <motion.div
                                key={step}
                                variants={fadeInUp}
                                className="rounded-2xl border border-border/60 bg-surface-light p-7 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/20"
                            >
                                <div className="flex items-center justify-between mb-5">
                                    <div className="rounded-xl bg-primary/10 w-11 h-11 flex items-center justify-center">
                                        <Icon className="w-5 h-5 text-primary" />
                                    </div>
                                    <span className="text-sm font-extrabold text-primary/40">{step}</span>
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-3">{title}</h3>
                                <p className="text-muted-foreground leading-relaxed">{text}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Our Vision */}
            <section className="section-light py-20">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -24 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-semibold tracking-wider uppercase mb-5">
                                Why We Do This
                            </span>
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
                                Our Vision
                            </h2>

                            <div className="space-y-5">
                                <div className="rounded-2xl border border-border/60 bg-background p-6 flex gap-4">
                                    <div className="rounded-xl bg-primary/10 w-11 h-11 flex-shrink-0 flex items-center justify-center">
                                        <Target className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-foreground mb-2">Our Mission</h3>
                                        <p className="text-muted-foreground leading-relaxed">
                                            Simplify construction workflows through automation and intelligent
                                            technology — eliminating inefficiencies, reducing manual work and helping
                                            contractors make faster, data-driven decisions.
                                        </p>
                                    </div>
                                </div>
                                <div className="rounded-2xl border border-border/60 bg-background p-6 flex gap-4">
                                    <div className="rounded-xl bg-primary/10 w-11 h-11 flex-shrink-0 flex items-center justify-center">
                                        <Eye className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-foreground mb-2">Our Vision</h3>
                                        <p className="text-muted-foreground leading-relaxed">
                                            To become the hub of construction businesses, where estimating, pricing and
                                            project management live in one system — empowering contractors to grow
                                            productivity, profitability and scale with confidence.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 24 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            <img
                                src={diverseEngineersImg}
                                alt="Constil team empowering the next era of construction intelligence"
                                className="w-full h-[420px] object-cover rounded-3xl border border-border/60 shadow-sm"
                                loading="lazy"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            <TryIt tryItContent={tryItContent} />
            <div className="h-16 md:h-24 bg-white" aria-hidden />
            <Footer />
        </main>
    )
}

export default AboutPage