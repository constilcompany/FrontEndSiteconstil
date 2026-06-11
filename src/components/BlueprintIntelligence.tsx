import { motion } from "framer-motion";
import { Upload, Cpu, DollarSign, FileText } from "lucide-react";

const items = [
  { icon: Upload, title: "Intelligent Detection of Measuring", desc: "Automatically derives the correct dimensions of blueprints." },
  { icon: Cpu, title: "Proper Material Quantification", desc: "Determines resources and estimates precise amounts." },
  { icon: DollarSign, title: "Instant Cost Breakdown", desc: "Creates cost estimates for construction with a couple of clicks." },
  { icon: FileText, title: "AI-Based Interpretation of a Plan", desc: "Smarts up smartly analysis of complex drawings." },
  { icon: FileText, title: "Continuous Takeoff Integration", desc: "Relates takeoffs with workflow estimation." },

];




const BlueprintIntelligence = () => (
  <section className="section-white py-24">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        {/* <span className="text-primary text-sm font-semibold uppercase tracking-wider">Blueprint Intelligence</span> */}
        <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-2 text-foreground">
Turn All Blueprints into Stepped-out Project Insights        </h2>
 <p className="text-muted-foreground leading-relaxed mb-4">

Post any blueprint for construction and leave the heavy work to our smart engine.


          </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
        {items.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="card-futuristic rounded-2xl p-6"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
              <item.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2 text-foreground">{item.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default BlueprintIntelligence;
