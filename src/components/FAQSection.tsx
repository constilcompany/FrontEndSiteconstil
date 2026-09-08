import { motion } from "framer-motion";
import { CircleHelp } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection = ({ faqs }) => (
  <section id="faq" className="section-light py-24">
    <div className="container mx-auto md:px-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
          <CircleHelp className="w-3.5 h-3.5" />
          FAQ
        </span>
        <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4 text-foreground">
          Frequently Asked Questions
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
          Everything you need to know about CONSTIL. Can't find the answer?
          Get in touch with our team.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="max-w-3xl mx-auto"
      >
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="group rounded-2xl px-5 sm:px-6 border border-border bg-background shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-md data-[state=open]:border-primary/40 data-[state=open]:shadow-lg data-[state=open]:shadow-primary/5"
            >
              <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary hover:no-underline py-5 gap-4 [&>svg]:shrink-0 [&>svg]:p-1.5 [&>svg]:box-content [&>svg]:rounded-full [&>svg]:text-primary [&>svg]:transition-all [&>svg]:duration-300 group-hover:[&>svg]:bg-primary/10">
                <span className="flex items-center gap-4 min-w-0">
                  <span className="hidden sm:inline-flex items-center justify-center w-9 h-9 shrink-0 rounded-xl bg-primary/10 border border-primary/20 text-sm font-bold text-primary">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm sm:text-base py-0.5">{faq.q}</span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm sm:text-[15px] leading-relaxed pl-0 sm:pl-[52px] pr-1">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </div>
  </section>
);

export default FAQSection;