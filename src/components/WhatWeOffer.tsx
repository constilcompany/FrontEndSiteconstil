import { motion } from "framer-motion";
import { FileText, Calculator, Users, CreditCard, ArrowRight } from "lucide-react";
import teamImg from "@/assets/team-professionals.jpg";
import { Link } from "react-router-dom";

const offers = [
  { icon: FileText, title: "Invoice Management", desc: "Automated construction estimating and invoicing capabilities in growing billing using sophisticated construction company software.", link: "/invoices-management-software" },
  { icon: Calculator, title: "Estimates & Quotes", desc: "Create precise suggestions through the use of effective construction estimating software and intelligent blueprint estimating software tools.", link: "/estimates-software" },
  { icon: Users, title: "Client Management", desc: "Small business projects should be managed using efficient construction management software to manage client data.", link: "/client-management-software" },
  { icon: CreditCard, title: "Payment Tracking", desc: "Make certain accountability of cash flow with incorporated construction cost estimating software and financial reporting software.", link: "/payment-tracking-software" },
];

const WhatWeOffer = () => (
  <section className="section-white py-24">
    <div className="container mx-auto md:px-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        {/* <span className="text-primary text-sm font-semibold uppercase tracking-wider">Our Services</span> */}
        <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4 text-foreground">
          What We Can Provide to Drive Your Business

        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed max-w-4xl mx-auto">The platform is smart, and it consists of a combination of powerful estimating, invoicing, and <Link to={'/client-management-software'}>Client management</Link> tools. Developed to meet the needs of the modern contractors, it enhances precision, conserves precious time, as well as assisting in maximizing profitability at each phase of your building endeavors.
        </p>

      </motion.div>

      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="grid sm:grid-cols-2 gap-6">
          {offers.map((o, i) => (
            <Link to={o.link}>
              <motion.div
                key={o.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="card-futuristic rounded-2xl  py-4 px-3"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <o.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-base mb-2 text-foreground">{o.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{o.desc}</p>
                <ArrowRight className="w-8 h-8 text-primary mt-2 bg-primary/10 p-2 rounded-full" />
              </motion.div>
            </Link>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <img
            src={teamImg}
            alt="Happy team of construction professionals"
            className="rounded-3xl shadow-2xl w-full"
          />
        </motion.div>
      </div>
    </div>
  </section>
);

export default WhatWeOffer;
