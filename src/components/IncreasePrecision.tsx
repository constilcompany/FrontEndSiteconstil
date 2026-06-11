import { motion } from "framer-motion";
import contractorImg from "@/assets/images/Constructioncostestimatingsoftware.jpg";

const IncreasePrecision = () => (
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
          <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-6 text-foreground  ">
            Increase Precision using Construction cost estimating software

          </h2>
          <p className="text-muted-foreground leading-relaxed mb-2">
            Modernize your construction company software, which will revolutionize the manner in which you structure, control and execute projects. CONSITL simplifies the working process, elevates the level of cost accuracy, and strengthens team cooperation. Start using it today and start to enjoy the benefits of genuine automated construction estimating designed with the modern building professional in mind and the need to achieve efficiency, precision and long-term development.


          </p>






          {/* <a
            href="https://app.constil.com/signup"
            className="inline-block px-8 py-3.5 rounded-xl bg-primary  mt-4 text-primary-foreground font-semibold hover:bg-primary-hover transition-all duration-300 glow-primary"
          >
            Get Started Now
          </a> */}
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
              alt="Construction cost estimating software"
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

export default IncreasePrecision;
