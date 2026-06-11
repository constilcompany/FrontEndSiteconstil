import { motion } from "framer-motion";
import officeImg from "@/assets/professionals-office.jpg";
import showcaseImg from "@/assets/feature-showcase.jpg";
import { Link } from "react-router-dom";

const FeatureShowcase = () => (
  <section className="section-light py-24 overflow-hidden">
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl text-primary md:text-4xl font-bold mt-3 mb-6 text-foreground">
            Built for Builders, Powered by Intelligence
            {/* <span className="text-primary">construction Intelligence</span> */}
          </h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed text-lg">
            <p className="text-foreground/90 font-medium">We are the best professionals in construction.</p>

            <p>CONSITL is a company that assists a contractor at all levels of development and provides strong building construction project software that facilitates planning, budgeting and implementation. Our intelligent system streamlines complicated processes and enhances project visibility all the way to completion.
            </p>
            <p>
              Using the CONSITL software in <Link to="/estimates_software">estimating costs</Link>, materials, and labor to build the structure, advanced residential construction estimating software allows one to make correct cost and material estimates and labor estimates. Our system scales to any business needs and your project, whether it is a small housing project or a large commercial project.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative"
        >
          <img
            src={officeImg}
            alt="Happy professionals reviewing blueprints"
            className="rounded-3xl shadow-2xl w-full"
          />
          <img
            src={showcaseImg}
            alt="AI blueprint analysis"
            className="absolute -bottom-8 -left-8 w-48 h-32 object-cover rounded-2xl shadow-xl border-4 border-background hidden md:block"
          />
        </motion.div>
      </div>
    </div>
  </section>
);

export default FeatureShowcase;
