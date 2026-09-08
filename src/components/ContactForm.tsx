import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, User, MessageSquare, Building, MapPin, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import diverseImg from "@/assets/diverse-engineers.jpg";
import axios from "axios";

const ContactForm = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", message: "", company_name: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.first_name.trim() || !form.last_name.trim() || !form.email.trim() || !form.message.trim() || !form.company_name.trim()) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast({ title: "Please enter a valid email", variant: "destructive" });
      return;
    }

    setSending(true);
    axios.post("https://hasrpxdysyoukmsxveba.supabase.co/functions/v1/submit-support-query", form).then((response) => {
      toast({ title: "Message sent!", description: "We'll get back to you shortly." });
      setForm({ first_name: "", last_name: "", email: "", message: "", company_name: "" });
    }).catch((error) => {
      toast({ title: "Error", description: "Something went wrong. Please try again later.", variant: "destructive" });
    }).finally(() => {
      setSending(false);
    });
  };

  const inputClass =
    "w-full pl-11 pr-4 py-3.5 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all";

  const iconWrapClass = "absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none";
  const contactInfo = [
    { icon: Mail, label: "Email us", value: "support@constil.com" },
  ];

  return (
    <section id="contact" className="section-light py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold tracking-wider uppercase mb-4">
            Contact Us
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Get In Touch With Our Team
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Have questions about our AI-powered platform? Send us a message and we'll get back to you quickly.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 max-w-6xl mx-auto items-stretch">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative min-h-[440px] rounded-3xl overflow-hidden shadow-2xl"
          >
            <img
              src={diverseImg}
              alt="Diverse team of engineers collaborating"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="flex flex-col gap-2 mb-5">
                {contactInfo.map((info) => (
                  <div
                    key={info.label}
                    className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-5 py-3 w-full"
                  >
                    <info.icon className="w-4 h-4 text-white/90 shrink-0" />
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-white/60">{info.label}</p>
                      <p className="text-sm font-medium text-white">{info.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 border-t border-white/15 pt-5">
                <div className="flex items-center justify-center rounded-full bg-white/15 backdrop-blur-sm border border-white/20 p-3">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-white/60">Our Office</p>
                  <p className="text-sm font-medium text-white">Supporting contractors nationwide</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="card-futuristic rounded-2xl p-8 lg:p-9 space-y-5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">First Name</label>
                <div className="relative">
                  <User className={iconWrapClass + " w-4 h-4 text-muted-foreground"} />
                  <input
                    type="text"
                    value={form.first_name}
                    onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                    placeholder="John"
                    maxLength={50}
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Last Name</label>
                <div className="relative">
                  <User className={iconWrapClass + " w-4 h-4 text-muted-foreground"} />
                  <input
                    type="text"
                    value={form.last_name}
                    onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                    placeholder="Smith"
                    maxLength={50}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Company Name</label>
              <div className="relative">
                <Building className={iconWrapClass + " w-4 h-4 text-muted-foreground"} />
                <input
                  type="text"
                  value={form.company_name}
                  onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                  placeholder="Acme Construction"
                  maxLength={100}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Email Address</label>
              <div className="relative">
                <Mail className={iconWrapClass + " w-4 h-4 text-muted-foreground"} />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="john@company.com"
                  maxLength={255}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Message</label>
              <div className="relative">
                <MessageSquare className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us about your project and how we can help..."
                  maxLength={1000}
                  rows={4}
                  className={inputClass + " resize-none min-h-[110px]"}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary-hover transition-all duration-300 glow-primary disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {sending ? (
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Message
                </>
              )}
            </button>

            <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
              We typically respond within one business day.
            </p>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
