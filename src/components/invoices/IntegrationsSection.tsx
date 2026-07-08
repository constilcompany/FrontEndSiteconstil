import { motion } from "framer-motion";
import brandImage from "@/assets/images/banner1.jpg";
import { Link } from "react-router-dom";

interface IntegrationsSectionProps {
  heading: string;
  points: React.ReactNode[];
  image?: string;
}

const IntegrationsSection = ({ heading, points = [], image }: IntegrationsSectionProps) => {
  return (
    <section className="w-full bg-[#050505] py-16 md:py-24 overflow-hidden">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 px-4 md:flex-row md:items-start md:px-8">

        {/* LEFT: Text content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-full md:w-1/2"
        >
          <h2 className="mb-6 text-3xl font-extrabold leading-tight text-white md:text-4xl lg:text-[40px]">
            {heading}
          </h2>

          <div className="mb-8 space-y-4">
            {points.map((point, index) => (
              <p key={index} className="max-w-xl text-base leading-relaxed text-zinc-300">
                {point}
              </p>
            ))}
          </div>
          <Link to={'https://app.constil.com/signup'}>
            <button
              type="button"
              className="inline-flex items-center rounded-xl border border-zinc-600 bg-zinc-800 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-white hover:text-black hover:scale-105 active:scale-95 shadow-lg"
            >
              See All Integrations
              <span className="ml-2 text-xl leading-none">›</span>
            </button>
          </Link>
        </motion.div>

        {/* RIGHT: Image */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full md:w-1/2 mt-8 md:mt-0"
        >
          <div className="relative overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10 pointer-events-none"></div>
            <img
              src={image || brandImage}
              alt="Integration ecosystem"
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default IntegrationsSection;