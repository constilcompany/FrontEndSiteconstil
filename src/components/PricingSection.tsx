import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import axios from "axios";

const API_BASE = 'https://hasrpxdysyoukmsxveba.supabase.co/functions/v1/user-api';

const PricingSection = () => {
  const [yearly, setYearly] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE}/packages`);
        setPackages(res?.data?.packages || []);
      } catch (err) {
        console.error('Error fetching packages:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  const displayedPackages = packages
    .filter((pkg) => pkg.billing_interval === (yearly ? 'yearly' : 'monthly'))
    .sort((a, b) => {
      const order: { [key: string]: number } = { basic: 1, premium: 2, professional: 2, enterprise: 3 };
      const tierA = (a.template_tier || '').toLowerCase();
      const tierB = (b.template_tier || '').toLowerCase();
      return (order[tierA] || 4) - (order[tierB] || 4);
    });

  return (
    <section id="pricing" className="section-white py-24">
      <div className="container mx-auto md:px-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-primary text-sm font-semibold uppercase tracking-wider">Pricing</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-6 text-foreground">
            Choose Your Subscription Plan
          </h2>

          <div className="flex items-center justify-center gap-4 mb-4">
            <span className={`text-sm font-medium ${!yearly ? "text-primary" : "text-muted-foreground"}`}>Monthly</span>
            <button
              onClick={() => setYearly(!yearly)}
              className="relative w-14 h-7 rounded-full bg-muted transition-colors border border-border"
              aria-label="Toggle billing"
            >
              <div
                className={`absolute top-0.5 w-6 h-6 rounded-full bg-primary transition-all duration-300 shadow-md ${yearly ? "left-7" : "left-0.5"
                  }`}
              />
            </button>
            <span className={`text-sm font-medium ${yearly ? "text-primary" : "text-muted-foreground"}`}>Yearly</span>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid md:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {displayedPackages.map((plan, i) => {
              const isPremium = ['premium', 'professional'].includes((plan.template_tier || '').toLowerCase());
              // Highlight as popular if tier falls into premium/professional
              const popular = isPremium;

              const features = [
                { label: `Blueprints`, value: plan.ai_estimate_credits, healthy: plan.ai_estimate_unlimited },
                { label: `Invoices`, value: plan.invoice_credits, healthy: plan.invoice_unlimited },
                { label: `Estimates`, value: plan.estimate_credits, healthy: plan.estimate_unlimited },
                { label: `${(plan.template_tier || '').toLowerCase() === 'enterprise' ? 'Unlimited' : isPremium ? '8' : '3'} Invoice & Estimate Templates`, simple: true }
              ];

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className={`rounded-2xl p-8 relative ${popular
                    ? "bg-primary/5 border-2 border-primary glow-primary"
                    : "card-futuristic"
                    }`}
                >
                  {popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-lg">
                      Most Popular
                    </span>
                  )}
                  <h3 className="text-xl font-bold mb-2 text-foreground capitalize">{plan.template_tier || plan.template_tier || 'PLAN'}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-extrabold text-primary">
                      ${yearly ? Math.round(plan.price) : plan.price}
                    </span>
                    <span className="text-muted-foreground text-sm"> / {plan.billing_interval}</span>
                  </div>
                  {/* {yearly && (
                    <p className="text-sm text-primary mb-2 -mt-4 font-medium">Billed ${plan.price} annually</p>
                  )} */}
                  <ul className="space-y-3 mb-8">
                    {features.map((f, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        <div className="text-sm">
                          {f.simple ? (
                            f.label
                          ) : (
                            <>
                              <span className="font-medium text-foreground">{f.healthy ? 'Unlimited' : f.value} {f.label}</span>
                              {!f.healthy && <span className="text-muted-foreground ml-1">({f.value} Credits)</span>}
                            </>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                  <a
                    href="https://app.constil.com/signup"
                    className={`block text-center py-3 rounded-xl font-semibold transition-all duration-300 ${popular
                      ? "bg-primary text-primary-foreground hover:bg-primary-hover glow-primary"
                      : "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                      }`}
                  >
                    Choose Plan
                  </a>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default PricingSection;
