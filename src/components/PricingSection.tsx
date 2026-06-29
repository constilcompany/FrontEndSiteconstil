import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import axios from "axios";

const API_BASE = 'https://avppbvsxayehguepyjkb.supabase.co/functions/v1/user-api';

const PLAN_TIERS = ['basic', 'professional', 'enterprise'] as const;

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

  const displayedPackages = useMemo(() => {
    const interval = yearly ? 'yearly' : 'monthly';
    const filtered = packages.filter((pkg) => pkg.billing_interval === interval);

    return PLAN_TIERS.map((tier) =>
      filtered.find((pkg) => (pkg.template_tier || '').toLowerCase() === tier)
    ).filter(Boolean);
  }, [packages, yearly]);

  return (
    <section id="pricing" className="section-white py-24">
      <div className="container mx-auto px-4">
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
          <div className="w-full max-w-7xl mx-auto px-0 sm:px-2">
            <div
              className="grid w-full min-w-0 gap-4 sm:gap-5 lg:gap-6 xl:gap-8 [grid-auto-rows:1fr]"
              style={
                displayedPackages.length > 0
                  ? {
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(min(16rem, 100%), 1fr))',
                    }
                  : undefined
              }
            >
            {displayedPackages.map((plan, i) => {
              const tier = (plan.template_tier || '').toLowerCase();
              const isPremium = ['premium', 'professional'].includes(tier);
              const planName = (plan.name || '').trim();
              const isFreeTrialTier = tier === 'basic';
              const displayName = isFreeTrialTier ? 'Free-trial' : planName;
              const popular = planName.toLowerCase() === 'pro';

              const features = isFreeTrialTier
                ? [
                    { label: 'Blueprints (Credits)', simple: true },
                    { label: 'Invoices (Credits)', simple: true },
                    { label: 'Estimates (Credits)', simple: true },
                    { label: '3 Invoice & Estimate Templates', simple: true },
                  ]
                : [
                    { label: `Blueprints`, value: plan.ai_estimate_credits, healthy: plan.ai_estimate_unlimited },
                    { label: `Invoices`, value: plan.invoice_credits, healthy: plan.invoice_unlimited },
                    { label: `Estimates`, value: plan.estimate_credits, healthy: plan.estimate_unlimited },
                    { label: `${tier === 'enterprise' ? 'Unlimited' : isPremium ? '8' : '3'} Invoice & Estimate Templates`, simple: true }
                  ];

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className={`flex flex-col h-full rounded-2xl p-4 sm:p-5 md:p-6 lg:p-7 min-w-0 relative ${popular
                    ? "bg-primary/5 border-2 border-primary glow-primary"
                    : "card-futuristic"
                    }`}
                >
                  {popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-lg">
                      Most Popular
                    </span>
                  )}
                  <h3 className="text-lg sm:text-xl font-bold mb-2 text-foreground break-words">{displayName || 'Plan'}</h3>
                  {isFreeTrialTier && yearly && plan.trial_days && (
                    <p className="text-xs sm:text-sm text-primary font-medium mb-2">{plan.trial_days}-day free trial</p>
                  )}
                  {tier === 'professional' && !plan.trial_enabled && (
                    <p className="text-xs sm:text-sm text-muted-foreground mb-2">Professional tier</p>
                  )}
                  <div className="mb-4 sm:mb-6">
                    <span className="text-3xl sm:text-4xl font-extrabold text-primary">
                      {isFreeTrialTier ? '$0.00' : `$${yearly ? Math.round(plan.price) : plan.price}`}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      {isFreeTrialTier ? ' / 7 days' : ` / ${plan.billing_interval}`}
                    </span>
                  </div>
                  {/* {yearly && (
                    <p className="text-sm text-primary mb-2 -mt-4 font-medium">Billed ${plan.price} annually</p>
                  )} */}
                  <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8 flex-1">
                    {features.map((f, idx) => (
                      <li key={idx} className="flex items-start gap-2 sm:gap-3 text-muted-foreground min-w-0">
                        <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        <div className="text-xs sm:text-sm min-w-0 break-words">
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
                    className={`mt-auto block text-center py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 ${popular
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
          </div>
        )}
      </div>
    </section>
  );
};

export default PricingSection;
