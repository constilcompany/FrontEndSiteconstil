import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Check, Minus } from "lucide-react";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";

const API_BASE = 'https://avppbvsxayehguepyjkb.supabase.co/functions/v1/user-api';

const matchesBillingInterval = (billingInterval: string | undefined, yearly: boolean) => {
  const billing = (billingInterval || '').toLowerCase();
  if (yearly) return ['yearly', 'year', 'annual'].includes(billing);
  return ['monthly', 'month'].includes(billing);
};

const isFreeTrialPackage = (pkg: { trial_enabled?: boolean; name?: string }) =>
  Boolean(pkg.trial_enabled) || (pkg.name || '').toLowerCase() === 'free trial';

const isStarterPackage = (pkg: {
  trial_enabled?: boolean;
  name?: string;
  template_tier?: string;
}) => {
  if (pkg.trial_enabled || isFreeTrialPackage(pkg)) return false;

  const name = (pkg.name || '').toLowerCase();
  if (name.includes('starter')) return true;

  return (pkg.template_tier || '').toLowerCase() === 'basic';
};

type PlanFeature = { text: string; included: boolean };

type PlanContent = {
  name: string;
  tagline: string;
  features: PlanFeature[];
};

const FREE_TRIAL_DAYS = 7;

const PLAN_CONTENT: Record<string, PlanContent> = {
  'free-trial': {
    name: 'Free Trial',
    tagline: 'Try Constil with your own blueprints. No credit card required.',
    features: [
      { text: '5 blueprint estimates', included: true },
      { text: 'Full trade breakdown', included: true },
      { text: 'PDF export', included: true },
      { text: 'Email estimate to customer', included: true },
      { text: 'Saved estimate history', included: false },
      { text: 'Unlimited estimates', included: false },
    ],
  },
  starter: {
    name: 'Starter',
    tagline: 'For solo contractors bidding up to 20 jobs a month.',
    features: [
      { text: '20 estimates per month', included: true },
      { text: 'Full trade breakdown', included: true },
      { text: 'PDF export', included: true },
      { text: 'Email estimate to customer', included: true },
      { text: 'Saved estimate history', included: true },
      { text: 'Unlimited estimates', included: false },
    ],
  },
  pro: {
    name: 'Pro',
    tagline: 'Unlimited estimates. For contractors who bid seriously.',
    features: [
      { text: 'Unlimited estimates', included: true },
      { text: 'Full trade breakdown', included: true },
      { text: 'PDF export + branded cover', included: true },
      { text: 'Email estimate to customer', included: true },
      { text: 'Full estimate history', included: true },
      { text: 'Edit any line item', included: true },
    ],
  },
  team: {
    name: 'Team',
    tagline: 'For crews with multiple estimators. 3 seats included.',
    features: [
      { text: 'Everything in Pro', included: true },
      { text: '3 team seats', included: true },
      { text: 'Shared estimate library', included: true },
      { text: 'Admin dashboard', included: true },
      { text: 'Priority support', included: true },
      { text: 'Custom branding on PDFs', included: true },
    ],
  },
};

const PricingSkeleton = () => (
  <div className="w-full max-w-7xl mx-auto px-0 sm:px-2">
    <div className="grid gap-4 sm:gap-5 lg:gap-6 xl:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className={`flex flex-col h-full rounded-2xl p-5 sm:p-6 border border-border/60 bg-background ${i === 2 ? "shadow-card" : ""}`}
        >
          <Skeleton className="h-6 w-24 mb-3" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-3/4 mb-6" />
          <Skeleton className="h-10 w-24 mb-1" />
          <Skeleton className="h-4 w-16 mb-6" />
          <div className="space-y-3 mb-8 flex-1">
            {Array.from({ length: 6 }).map((_, idx) => (
              <Skeleton key={idx} className="h-4 w-full" />
            ))}
          </div>
          <Skeleton className={`h-11 w-full rounded-xl ${i === 2 ? "bg-primary/30" : ""}`} />
        </div>
      ))}
    </div>
  </div>
);

const getPlanKey = (plan: {
  name?: string;
  template_tier?: string;
  trial_enabled?: boolean;
}) => {
  if (isFreeTrialPackage(plan)) return 'free-trial';

  const name = (plan.name || '').toLowerCase();
  const tier = (plan.template_tier || '').toLowerCase();

  if (name.includes('starter')) return 'starter';
  if (name.includes('pro') || tier === 'professional') return 'pro';
  if (name.includes('team') || tier === 'enterprise') return 'team';

  return 'starter';
};

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
    const activePackages = packages.filter((pkg) => pkg.is_active !== false);
    const filtered = activePackages.filter((pkg) =>
      matchesBillingInterval(pkg.billing_interval, yearly)
    );

    const freeTrial = yearly
      ? activePackages.find(
          (pkg) =>
            matchesBillingInterval(pkg.billing_interval, false) &&
            isFreeTrialPackage(pkg)
        )
      : filtered.find((pkg) => isFreeTrialPackage(pkg));

    const starter = filtered.find((pkg) => isStarterPackage(pkg));
    const pro = filtered.find(
      (pkg) => (pkg.template_tier || '').toLowerCase() === 'professional'
    );
    const team = filtered.find(
      (pkg) => (pkg.template_tier || '').toLowerCase() === 'enterprise'
    );

    return [freeTrial, starter, pro, team].filter(Boolean);
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
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-semibold tracking-wider uppercase mb-4">
            Pricing
          </span>
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
          <PricingSkeleton />
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
              const planKey = getPlanKey(plan);
              const content = PLAN_CONTENT[planKey];
              const isFreeTrial = planKey === 'free-trial';
              const popular = planKey === 'pro';
              const price = isFreeTrial
                ? '$0'
                : `$${yearly ? Math.round(plan.price) : plan.price}`;
              const pricePeriod = isFreeTrial
                ? `${FREE_TRIAL_DAYS} days`
                : yearly
                  ? 'per year'
                  : 'per month';

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className={`flex flex-col h-full rounded-2xl p-5 sm:p-6 lg:p-7 pt-8 sm:pt-9 min-w-0 relative border transition-all duration-300 hover:-translate-y-1 ${popular
                    ? "bg-navy border-primary shadow-2xl scale-[1.02] hover:shadow-primary/20"
                    : "bg-background border-border/60 hover:border-primary/30 hover:shadow-lg"
                    }`}
                >
                  {popular && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10 px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-lg whitespace-nowrap">
                      Most Popular
                    </span>
                  )}

                  <div className="flex items-baseline justify-between gap-2 mb-3">
                    <h3 className={`text-lg sm:text-xl font-bold break-words ${popular ? "text-primary-foreground" : "text-foreground"}`}>
                      {content.name}
                    </h3>
                    <span className={`text-[10px] font-semibold uppercase tracking-wider ${popular ? "text-primary/80" : "text-muted-foreground/70"}`}>
                      {planKey}
                    </span>
                  </div>

                  <p className={`text-xs sm:text-sm mb-5 leading-relaxed ${popular ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    {content.tagline}
                  </p>

                  <div className="mb-6">
                    <div className={`text-4xl sm:text-5xl font-extrabold tracking-tight ${popular ? "text-primary-foreground" : "text-foreground"}`}>
                      {price}
                    </div>
                    <div className={`text-sm mt-1.5 ${popular ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                      {pricePeriod}
                    </div>
                  </div>

                  <ul className="space-y-2.5 mb-8 flex-1">
                    {content.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className={`flex items-start gap-3 min-w-0 ${feature.included
                          ? popular ? 'text-primary-foreground/85' : 'text-muted-foreground'
                          : 'text-muted-foreground/40'
                          }`}
                      >
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${feature.included
                            ? popular
                              ? "bg-primary/25 text-primary"
                              : "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground/50"
                            }`}
                        >
                          {feature.included ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <Minus className="w-3 h-3" />
                          )}
                        </span>
                        <span className={`text-xs sm:text-sm min-w-0 break-words ${feature.included ? "" : "line-through"}`}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href="https://app.constil.com/signup"
                    className={`mt-auto block text-center py-3 rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 ${popular
                      ? "bg-primary text-primary-foreground hover:bg-primary-hover glow-primary"
                      : "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                      }`}
                  >
                    {isFreeTrial ? "Start Free Trial" : "Choose Plan"}
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