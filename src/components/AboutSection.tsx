import { motion } from "framer-motion";
import contractorImg from "@/assets/happy-contractor.jpg";
import { Link } from "react-router-dom";

const AboutSection = () => (
  <section id="about" className="section-light py-24">
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* <span className="text-primary text-sm font-semibold uppercase tracking-wider">About Us</span> */}
          <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-6 text-foreground">
            Who We Are & Why We Built
            <br className="hidden sm:block" />
            {" "}This
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-2">
            Smart construction tools should be granted to construction professionals.


          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            CONSITL was developed to bridge the gap between traditional and modern technologies. Our AI blueprint analysis software is technologically advanced, and it reads and analyzes plans immediately, enabling contractors to transition to the budget within minutes.
          </p>




          <p className="text-muted-foreground leading-relaxed mb-4">

            It does not matter whether you are a residential construction builder or commercial contractor; we want to accomplish:          </p>

          <p className="text-muted-foreground leading-relaxed mb-4">

            Provide construction estimating and <Link to={'/client_management_software'}>Client management</Link> software that is the most reliable, saves time, costs, and increases profits.
          </p>
          <a
            href="https://app.constil.com/signup"
            className="inline-block px-8 py-3.5 rounded-xl bg-primary  mt-4 text-primary-foreground font-semibold hover:bg-primary-hover transition-all duration-300 glow-primary"
          >
            Get Started Now
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative">
            <img
              src={contractorImg}
              alt="Happy construction professional with tablet"
              className="rounded-3xl shadow-2xl w-full"
            />
            {/* Floating stats */}
            <div className="absolute -bottom-6 -left-6 bg-background rounded-2xl shadow-xl p-5 border border-border">
              <div className="text-3xl font-extrabold text-primary">15min</div>
              <div className="text-xs text-muted-foreground">Blueprint Analysis</div>
            </div>
            <div className="absolute -top-4 -right-4 bg-background rounded-2xl shadow-xl p-5 border border-border">
              <div className="text-3xl font-extrabold text-primary">99%</div>
              <div className="text-xs text-muted-foreground">Accuracy Rate</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default AboutSection;
