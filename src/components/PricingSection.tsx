import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Check, Loader2, Minus } from "lucide-react";
import axios from "axios";

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
                  <h3 className="text-lg sm:text-xl font-bold mb-2 text-foreground break-words">
                    {content.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-4 leading-relaxed">
                    {content.tagline}
                  </p>
                  <div className="mb-4 sm:mb-6">
                    <div className="text-3xl sm:text-4xl font-extrabold text-primary">{price}</div>
                    <div className="text-muted-foreground text-sm mt-1">{pricePeriod}</div>
                  </div>
                  <ul className="space-y-2 sm:space-y-2.5 mb-6 sm:mb-8 flex-1">
                    {content.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className={`flex items-start gap-2 sm:gap-3 min-w-0 ${
                          feature.included ? 'text-muted-foreground' : 'text-muted-foreground/50'
                        }`}
                      >
                        {feature.included ? (
                          <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        ) : (
                          <Minus className="w-4 h-4 mt-0.5 shrink-0" />
                        )}
                        <span className="text-xs sm:text-sm min-w-0 break-words">{feature.text}</span>
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
