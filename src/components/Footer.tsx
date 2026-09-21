import { Linkedin, Instagram, Facebook, Twitter, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const socialLinks = [
  { href: "https://www.facebook.com/constilapp", icon: Facebook, label: "Facebook" },
  { href: "https://www.linkedin.com/company/constilapp/", icon: Linkedin, label: "LinkedIn" },
  { href: "https://www.instagram.com/constilapp", icon: Instagram, label: "Instagram" },
  { href: "https://x.com/Constilapp", icon: Twitter, label: "Twitter" },
];

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
  { to: "/blogs", label: "Blogs" },
];

const serviceLinks = [
  { to: "/invoices-management-software", label: "Invoicing Software" },
  { to: "/client-management-software", label: "Client Management" },
  { to: "/estimates-software", label: "Estimates Software" },
];



const linkClass =
  "text-sm text-primary-foreground/60 hover:text-primary transition-colors duration-200";

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/40 mb-4 text-left">
    {children}
  </h3>
);

const Footer = () => (
  <footer className="bg-navy">
    <div className="container mx-auto px-4 max-w-7xl pt-12 pb-8 md:pt-16 md:pb-10">
      {/* Brand */}
      <div className="text-center md:text-left mb-10 md:mb-14">
        <div className="text-2xl font-bold tracking-tight text-primary-foreground mb-2">
          CONST<span className="text-primary">IL</span>
        </div>
        <p className="text-primary-foreground/50 text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
          AI-Powered Construction Estimation & Invoicing
        </p>
      </div>

      {/* Mobile: 2-col grid, Contact/Social full width | Desktop: 4-col grid */}
      <div className="grid grid-cols-2 gap-y-10 gap-x-6 md:grid-cols-4 md:gap-8">
        {/* Company */}
        <div className="flex flex-col items-start">
          <SectionTitle>Company</SectionTitle>
          <nav className="flex flex-col items-start gap-2.5">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} className={linkClass}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Services */}
        <div className="flex flex-col items-start">
          <SectionTitle>Services</SectionTitle>
          <nav className="flex flex-col items-start gap-2.5">
            {serviceLinks.map((link) => (
              <Link key={link.to} to={link.to} className={linkClass}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Contact */}
        <div className="flex flex-col items-start col-span-2 md:col-span-1">
          <SectionTitle>Contact</SectionTitle>
          <div className="flex flex-col items-start gap-3">
            <a
              href="mailto:support@constil.com"
              className={`${linkClass} flex items-center gap-2.5`}
            >
              <Mail size={14} className="shrink-0 opacity-60" />
              support@constil.com
            </a>
            <a
              href="https://www.google.com/maps/search/?api=1&query=525+Forest+Avenue+Portland+Maine+04073"
              target="_blank"
              rel="noopener noreferrer"
              className={`${linkClass} flex items-start gap-2.5`}
            >
              <MapPin size={14} className="shrink-0 mt-0.5 opacity-60" />
              Portland, Maine 04073
            </a>
          </div>
        </div>

        {/* Social */}
        <div className="flex flex-col items-start col-span-2 md:col-span-1">
          <SectionTitle>Follow Us</SectionTitle>
          <div className="flex flex-wrap gap-2">
            {socialLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-primary-foreground/10 border border-primary-foreground/10 flex items-center justify-center text-primary-foreground/60 hover:text-primary hover:border-primary/30 hover:bg-primary/10 transition-all duration-200"
                aria-label={item.label}
              >
                <item.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Divider + Copyright */}
      <div className="mt-10 md:mt-12 pt-6 md:pt-8 border-t border-primary-foreground/10 text-center text-xs text-primary-foreground/40">
        &copy; {new Date().getFullYear()} CONSTIL. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
