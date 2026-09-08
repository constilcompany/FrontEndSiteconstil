import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import BlueprintScanner from "@/components/BlueprintScanner";

const TryIt = ({ tryItContent }: { tryItContent?: { heading: string, title: React.ReactNode, description: React.ReactNode, buttonText: string, path: string } }) => (
  <section className="relative section-navy py-28 overflow-hidden">
    {/* Scanner as background */}
    <BlueprintScanner />

    {/* Dimming overlay for readability */}
    <div className="absolute inset-0 bg-gradient-to-b from-navy/75 via-navy/55 to-navy/85" />

    <div className="relative z-10 container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7 }}
        className="max-w-3xl mx-auto text-center"
      >
        <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 border border-primary/40 text-primary text-xs font-semibold tracking-wider uppercase mb-6 backdrop-blur-sm">
          Scan · Analyze · Estimate
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-5">
          {tryItContent?.heading || "The Future of Automated Construction Estimating Begins Here"}
        </h2>
        <p className="text-primary-foreground/80 font-medium leading-relaxed mb-4">
          {tryItContent?.title ||
            "Find out why contractors are moving to smart construction company software that saves time and is more likely to boost margins."}
        </p>
        <p className="text-primary-foreground/65 leading-relaxed mb-8">
          {tryItContent?.description ||
            "Experience precision. Experience automation. Experience the CONSTIL."}
        </p>
        <ul className="flex flex-wrap justify-center gap-x-8 gap-y-3 mb-9">
          {[
            "Real-time blueprint analysis",
            "Automated quantity takeoff",
            "Instant cost breakdown",
          ].map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm text-primary-foreground/80">
              <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <a
          href={tryItContent?.path || "https://app.constil.com/"}
          className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary-hover transition-all duration-300 glow-primary focus-visible:outline focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          {tryItContent?.buttonText || "Try Free Trial"}
          <ArrowRight className="w-4 h-4" />
        </a>
      </motion.div>
    </div>
  </section>
);

export default TryIt;