import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, LogIn, UserPlus, ChevronDown, Receipt, Users, Calculator, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


const solutionsLinks = [
  {
    label: "Invoices-Management Software",
    to: "/invoices-management-software",
    icon: Receipt,
    description: "Centralize billing, invoices & payments",
  },
  {
    label: "Client-Management Software",
    to: "/client-management-software",
    icon: Users,
    description: "Organize clients, projects & partnerships",
  },
  {
    label: "Estimating Software",
    to: "/estimates-software",
    icon: Calculator,
    description: "AI-powered construction cost estimating",
  },
];

const mainLinks = [
  { label: "About", to: "/about" },
  // { label: "Features", to: "/#features" },
  // { label: "Pricing", to: "/#pricing" },
  { label: "Contact", to: "/contact" },
  { label: "Blogs", to: "/blogs" },
];

const Navbar = () => {
  const location = useLocation();
  const isActive = ['/blogs', '/contact', '/blogs/slug'].includes(location.pathname) || location.pathname.startsWith('/blogs/');
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? "bg-background shadow-sm"
        : "bg-transparent"
        }`}
    >
      <div className="container mx-auto md:px-10 px-4 flex items-center justify-between h-16">
        <Link
          to="/"
          className={`text-xl md:text-2xl font-bold tracking-tight transition-colors duration-200 ${scrolled || isActive ? "text-foreground hover:text-primary" : "text-primary-foreground"
            }`}
        >
          CONST<span className="text-primary">IL</span>
        </Link>

        <div className="hidden lg:flex items-center gap-6">
          <Link
            to="/"
            className={`text-sm font-medium px-3 py-1.5 rounded-full transition-colors duration-200 ${scrolled || isActive ? "text-foreground hover:bg-primary/10 hover:text-primary" : "text-primary-foreground/90 hover:bg-primary/10 hover:text-primary"
              }`}
          >
            Home
          </Link>

          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={`inline-flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-full transition-colors duration-200 ${scrolled ? "text-foreground hover:bg-primary/10 hover:text-primary" : "text-primary-foreground/90 hover:bg-primary/10 hover:text-primary"
                  }`}
                aria-label="Open solutions menu"
              >
                Solutions
                <ChevronDown className="w-4 h-4 opacity-80" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="min-w-[280px] w-max max-w-[min(90vw,320px)] bg-background text-foreground border border-border rounded-xl py-2 px-1 shadow-dropdown"
            >
              {solutionsLinks.map((l) => (
                <DropdownMenuItem
                  key={l.to}
                  asChild
                  className="cursor-pointer focus:bg-primary/10 focus:text-primary rounded-lg px-3 py-2.5"
                >
                  <Link to={l.to} className="w-full flex items-center gap-2 text-sm whitespace-nowrap">
                    {l.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu> */}



          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={`inline-flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-full transition-colors duration-200 ${scrolled || isActive ? "text-foreground hover:bg-primary/10 hover:text-primary" : "text-primary-foreground/90 hover:bg-primary/10 hover:text-primary"
                  } [&>svg]:transition-transform [&[data-state=open]>svg]:rotate-180`}
                aria-label="Open services menu"
              >
                Services
                <ChevronDown className="w-4 h-4 opacity-80" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              sideOffset={12}
              className="w-[min(90vw,360px)] bg-white text-foreground border border-border rounded-2xl p-2 shadow-[0_20px_60px_-15px_hsl(220_20%_10%/0.25)] overflow-hidden"
            >
              <div className="flex items-center justify-between px-3 pt-2 pb-3">
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                  Our Solutions
                </span>
                <span className="h-px flex-1 mx-3 bg-primary/15" />
              </div>

              <div className="flex flex-col gap-1">
                {solutionsLinks.map((l) => {
                  const Icon = l.icon;
                  return (
                    <DropdownMenuItem
                      key={l.to}
                      asChild
                      className="group cursor-pointer rounded-xl p-0 focus:bg-secondary/70 focus:text-foreground"
                    >
                      <Link to={l.to} className="flex items-start gap-3 px-3 py-2.5">
                        <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                          <Icon className="h-5 w-5" />
                        </span>
                        <span className="flex flex-col gap-0.5">
                          <span className="text-sm font-semibold leading-tight">{l.label}</span>
                          <span className="text-xs text-muted-foreground leading-snug">{l.description}</span>
                        </span>
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
              </div>

              <div className="mt-2 border-t border-border/70 px-1 pt-2">
                <a
                  href="https://app.constil.com/signup"
                  className="group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
                >
                  See all solutions
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link
            to="/#pricing"
            className={`text-sm font-medium px-3 py-1.5 rounded-full transition-colors duration-200 ${scrolled || isActive ? "text-foreground hover:bg-primary/10 hover:text-primary" : "text-primary-foreground/90 hover:bg-primary/10 hover:text-primary"
              }`}
          >
            Price
          </Link>

          {mainLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-sm font-medium px-3 py-1.5 rounded-full transition-colors duration-200 ${scrolled || isActive ? "text-foreground hover:bg-primary/10 hover:text-primary" : "text-primary-foreground/90 hover:bg-primary/10 hover:text-primary"
                }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <a
            href="https://app.constil.com/"
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 border ${scrolled || isActive
              ? "border-border text-foreground hover:bg-muted"
              : "border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
              }`}
          >
            <LogIn className="w-4 h-4" />
            Log In
          </a>
          <a
            href="https://app.constil.com/signup"
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary-hover transition-all duration-300 glow-primary"
          >
            <UserPlus className="w-4 h-4" />
            Sign Up
          </a>
        </div>

        <button
          className={`lg:hidden ${scrolled ? "text-foreground" : "text-primary-foreground"}`}
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-background border-t border-border overflow-hidden"
          >
            <div className="flex flex-col gap-4 p-6">
              <Link
                to="/"
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-foreground px-3 py-2 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
              >
                Home
              </Link>

              {mainLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="text-sm font-medium text-foreground px-3 py-2 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  {l.label}
                </Link>
              ))}

              <div className="pt-2">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Solutions
                </p>
                <div className="flex flex-col gap-2">
                  {solutionsLinks.map((l) => (
                    <Link
                      key={l.to}
                      to={l.to}
                      onClick={() => setOpen(false)}
                      className="text-sm font-medium text-foreground px-3 py-2 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                to="/#pricing"
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-foreground px-3 py-2 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
              >
                Price
              </Link>

              <div className="flex flex-col gap-3 pt-4 border-t border-border">
                <a
                  href="https://app.constil.com/"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border text-foreground text-sm font-medium hover:bg-muted transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  Log In
                </a>
                <a
                  href="https://app.constil.com/signup"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary-hover transition-all"
                >
                  <UserPlus className="w-4 h-4" />
                  Sign Up
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
