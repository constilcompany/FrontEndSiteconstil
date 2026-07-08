import { motion } from "framer-motion";
import workerImg from "@/assets/happy-worker.jpg";
import siteImg from "@/assets/construction-site.jpg";
import { Link } from "react-router-dom";

const WhyChooseUs = () => (
  <section className="relative py-24 overflow-hidden">
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: `url(${siteImg})` }}
    />
    <div className="absolute inset-0 bg-foreground/80" />

    {/* Futuristic grid overlay */}
    <div className="absolute inset-0 opacity-5" style={{
      backgroundImage: `linear-gradient(hsl(217 100% 63% / 0.5) 1px, transparent 1px), linear-gradient(90deg, hsl(217 100% 63% / 0.5) 1px, transparent 1px)`,
      backgroundSize: '80px 80px'
    }} />

    <div className="relative z-10 container mx-auto md:px-10 px-4">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-6 text-primary-foreground">
            Why choose AI construction estimating software

          </h2>
          <p className="text-primary-foreground/70 leading-relaxed text-lg mb-4">
            CONSTIL is designed as the best software for residential construction estimating, and it is able to provide the most accurate results to home builders and remodelers.          </p>
          <p className="text-primary-foreground/70 leading-relaxed text-lg mb-4">
            Our smart system minimizes human mistakes and enhances bid competition, and at the same time, profitability.
          </p>
          <p className="text-primary-foreground/70 leading-relaxed text-lg mb-4">
            In the case of large companies, we also offer sophisticated <Link to={'/estimates-software'}>commercial construction estimating software</Link> in order to take complicated projects with certainty.
          </p>

        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative"
        >
          <img
            src={workerImg}
            alt="Happy construction worker"
            className="rounded-3xl shadow-2xl w-full max-h-[400px] object-cover border-4 border-primary-foreground/10"
          />
        </motion.div>
      </div>
    </div>
  </section>
);

export default WhyChooseUs;
