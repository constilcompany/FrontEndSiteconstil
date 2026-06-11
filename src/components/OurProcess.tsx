import { motion } from "framer-motion";
import { HardHat, DollarSign, BookOpen, RefreshCw } from "lucide-react";

const steps = [
  { icon: HardHat, title: "Upload Plans", desc: "Create your publications through our smart construction blueprint software interface." },
  { icon: DollarSign, title: " AI Analysis", desc: "Our AI construction estimating software scans and interprets your files in real time." },
  { icon: BookOpen, title: "Generate Estimate", desc: "Get cost breakdown in detail with powerful construction estimating software." },
  { icon: RefreshCw, title: "Manage & Execute", desc: "Monitor timelines, budgets and progress using built in construction estimating and project management software." },
];

const OurProcess = () => (
  <section className="section-light py-24">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-4xl text-primary font-bold mt-3 text-foreground">Our Artificial Intelligence Construction Estimating Process</h2>
      </motion.div>

      <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {steps.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="text-center"
          >
            <div className="relative mx-auto mb-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto">
                <s.icon className="w-7 h-7 text-primary" />
              </div>
              <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow-lg">
                {i + 1}
              </span>
            </div>
            <h3 className="font-semibold text-lg mb-2 text-foreground">{s.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default OurProcess;
