import { motion } from "framer-motion";
import officeImg from "@/assets/professionals-office.jpg";
import showcaseImg from "@/assets/feature-showcase.jpg";
import { Link } from "react-router-dom";

const TryIt = ({ tryItContent }: { tryItContent?: { heading: string, title: React.ReactNode, description: React.ReactNode, buttonText: string, path: string } }) => (
  <section className="section-light py-24 overflow-hidden border-2 border-blue-600">
    <div className="container mx-auto px-4">
      <div className="grid  justify-content-center gap-16 items-center max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl text-primary md:text-4xl text-center font-bold mt-3 mb-2 text-foreground">
            {tryItContent?.heading || "The Future of Automated Construction Estimating Begins Here"}            {/* <span className="text-primary">construction Intelligence</span> */}
          </h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed text-lg max-w-5xl mx-auto">
            <p className="text-foreground/90 font-medium text-center" >{tryItContent?.title || "Find out why contractors are moving to smart construction company software that saves time and is more likely to boost margins."}
            </p>

            <p className="text-center text-foreground/90 ">{tryItContent?.description}

            </p>
            <div className="flex justify-center  pt-4">
              <Link to={tryItContent?.path}><button className=" item-center bg-primary px-3 py-2 rounded-lg text-white text-[15px]">{tryItContent?.buttonText || "Try Free Trail"} </button></Link>
            </div>

          </div>
        </motion.div>


      </div>
    </div>
  </section>
);

export default TryIt;
