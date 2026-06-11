import { Linkedin, Instagram, Facebook } from "lucide-react";

const socialLinks = [
  { href: "https://web.facebook.com/app.constil", icon: Facebook, label: "Facebook" },
  { href: "https://www.instagram.com/app.constil/", icon: Instagram, label: "Instagram" },
  { href: "https://www.tiktok.com/@app.constil?is_from_webapp=1&sender_device=pc", label: "TikTok", isTikTok: true },
  { href: "https://www.linkedin.com/in/app-constil-2a0887394/", icon: Linkedin, label: "LinkedIn" },
];

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

const Footer = () => (
  <footer className="bg-navy py-14 md:py-16">
    <div className="container mx-auto px-4 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-10 md:gap-12">
        <div className="text-center md:text-left">
          <div className="text-2xl font-bold tracking-tight text-primary-foreground mb-2">
            CONST<span className="text-primary">IL</span>
          </div>
          <p className="text-primary-foreground/60 text-sm leading-relaxed max-w-xs">
            AI-Powered Construction Estimation & Invoicing
          </p>
        </div>

        <div className="flex flex-col items-center md:items-end gap-3">
            <a
              href="mailto:support@constil.com"
              className="text-sm text-primary-foreground/60 hover:text-primary transition-colors duration-200"
            >
              support@constil.com
            </a>
            <div className="flex gap-2">
              {socialLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-primary-foreground/10 border border-primary-foreground/10 flex items-center justify-center text-primary-foreground/60 hover:text-primary hover:border-primary/30 hover:bg-primary/10 transition-all duration-200"
                  aria-label={item.label}
                >
                  {item.isTikTok ? (
                    <TikTokIcon className="w-4 h-4" />
                  ) : (
                    <item.icon className="w-4 h-4" />
                  )}
                </a>
              ))}
            </div>
        </div>
      </div>

      <div className="mt-10 pt-8 border-t border-primary-foreground/10 text-center text-xs text-primary-foreground/50">
        © {new Date().getFullYear()} CONSTIL. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
