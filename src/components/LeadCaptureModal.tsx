import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Phone, Sparkles, ShieldCheck, Loader2 } from "lucide-react";
import { useConsent } from "@/contexts/ConsentContext";
import { trackLead } from "@/utils/pixel";
import { trackGAGenerateLead } from "@/utils/analytics";
import { trackGAEvent } from "@/lib/analytics";
import { getFullForensicLeadPayload, getGA4VisitorParams } from "@/lib/visitorContext";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/lib/supabase";

export const LeadCaptureModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialTimerRef = useRef<number | null>(null);
  const reopenIntervalRef = useRef<number | null>(null);
  const { toast } = useToast();
  const hasConsent = useConsent();

  // 1. Initial 4-second timer when website opens
  useEffect(() => {
    // If lead was already captured, never show popup
    if (typeof window === "undefined") return;
    if (localStorage.getItem("lead_captured") === "true") {
      return;
    }

    initialTimerRef.current = window.setTimeout(() => {
      if (localStorage.getItem("lead_captured") !== "true") {
        setIsOpen(true);
      }
    }, 4000);

    return () => {
      if (initialTimerRef.current) window.clearTimeout(initialTimerRef.current);
      if (reopenIntervalRef.current) window.clearInterval(reopenIntervalRef.current);
    };
  }, []);

  // 2. Handle close (X button or outside click)
  const handleClose = () => {
    setIsOpen(false);

    // If already captured, never reopen
    if (localStorage.getItem("lead_captured") === "true") {
      return;
    }

    // Clear any existing reopen interval
    if (reopenIntervalRef.current) {
      window.clearInterval(reopenIntervalRef.current);
    }

    // Set recurring 5-minute interval (5 * 60 * 1000 ms) to reopen
    reopenIntervalRef.current = window.setInterval(() => {
      if (localStorage.getItem("lead_captured") === "true") {
        if (reopenIntervalRef.current) window.clearInterval(reopenIntervalRef.current);
        return;
      }
      setIsOpen(true);
    }, 5 * 60 * 1000);
  };

  // When modal opens, clear the reopen interval so it doesn't trigger while user is viewing it
  useEffect(() => {
    if (isOpen && reopenIntervalRef.current) {
      window.clearInterval(reopenIntervalRef.current);
      reopenIntervalRef.current = null;
    }
  }, [isOpen]);

  // 3. Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !phone.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in your Name, Email, and Phone Number.",
        variant: "destructive",
      });
      return;
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Lead captured:", { name: name.trim(), email: email.trim(), phone: phone.trim() });

      // Direct insert into public.newsleads with full visitor forensics
      try {
        const forensics = await getFullForensicLeadPayload();

        const fullPayload = {
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          page_url: typeof window !== "undefined" ? window.location.href : null,
          timezone: forensics.timezone || "UTC",
          ip_address: forensics.ip_address,
          city: forensics.city,
          region: forensics.region,
          country: forensics.country,
          landing_page: forensics.landing_page,
          referrer: forensics.referrer,
          utm_source: forensics.utm_source,
          utm_medium: forensics.utm_medium,
          utm_campaign: forensics.utm_campaign,
          utm_term: forensics.utm_term,
          utm_content: forensics.utm_content,
          is_new_user: forensics.is_new_user,
          session_count: forensics.session_count,
          screen_resolution: forensics.screen_resolution,
          browser_language: forensics.browser_language,
          navigation_history: forensics.navigation_history,
          metadata: forensics,
        };

        const { data, error } = await supabase.from("newsleads").insert([fullPayload]).select();

        if (error) {
          console.warn("Extended columns insert failed, falling back to core newsleads schema:", error.message);
          const corePayload = {
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
            page_url: typeof window !== "undefined" ? window.location.href : null,
            timezone: forensics.timezone || "UTC",
          };
          const fallbackRes = await supabase.from("newsleads").insert([corePayload]).select();
          if (fallbackRes.error) {
            console.error("SUPABASE NEWSLEAD FALLBACK ERROR:", fallbackRes.error);
          } else {
            console.log("SUPABASE NEWSLEAD SUCCESS (CORE SCHEMA):", fallbackRes.data);
          }
        } else {
          console.log("SUPABASE NEWSLEAD SUCCESS (FULL FORENSICS):", data);
        }
      } catch (insertErr) {
        console.error("SUPABASE NEWSLEAD ERROR:", insertErr);
      }

      // Non-blocking submission to contact-form API
      axios.post("https://avppbvsxayehguepyjkb.supabase.co/functions/v1/contact-form", {
        firstName: name.trim(),
        lastName: "",
        email: email.trim(),
        phoneNumber: phone.trim(),
        message: "Lead captured via popup modal",
        companyName: "Web Consultation Lead",
      }).catch((err) => {
        console.warn("Contact form edge submission error (fallback):", err);
      });

      // Fire analytics and pixel events if user has consent (Meta Pixel / CAPI 100% untouched)
      if (hasConsent) {
        try {
          const eventId = uuidv4();
          trackLead({}, eventId);
          trackGAGenerateLead({ form_name: "lead_capture_modal" });
          trackGAEvent('lead_form_submitted', {
            form_name: 'lead_modal',
            ...getGA4VisitorParams(),
          });
        } catch (analyticsErr) {
          console.warn("Analytics lead tracking error:", analyticsErr);
        }
      }

      // Mark lead as captured permanently in localStorage
      localStorage.setItem("lead_captured", "true");

      // Clear any pending timers / intervals
      if (reopenIntervalRef.current) {
        window.clearInterval(reopenIntervalRef.current);
        reopenIntervalRef.current = null;
      }
      if (initialTimerRef.current) {
        window.clearTimeout(initialTimerRef.current);
        initialTimerRef.current = null;
      }

      toast({
        title: "Thank You! 🎉",
        description: "Your details have been received. An estimating specialist will connect with you shortly.",
      });

      // Close modal permanently
      setIsOpen(false);
    } catch (error) {
      console.error("Error submitting lead:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // If already captured, render nothing
  if (typeof window !== "undefined" && localStorage.getItem("lead_captured") === "true") {
    return null;
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent className="sm:max-w-md p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl">
        <DialogHeader className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold w-fit">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Free Construction Takeoff Consultation</span>
          </div>
          <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Get Your Free Estimate & Pricing Guide
          </DialogTitle>
          <DialogDescription className="text-slate-600 dark:text-slate-400 text-sm">
            Speak with an estimating expert to see how CONSTIL cuts takeoff time by 80% on blueprints.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="lead-name" className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Full Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                id="lead-name"
                type="text"
                required
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-9 h-11 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="lead-email" className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Work Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                id="lead-email"
                type="email"
                required
                placeholder="john@construction.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9 h-11 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="lead-phone" className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Phone Number
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                id="lead-phone"
                type="tel"
                required
                placeholder="(555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="pl-9 h-11 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 text-base font-semibold bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </span>
            ) : (
              "Get Free Consultation"
            )}
          </Button>

          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>100% confidential. No spam or unsolicited calls.</span>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LeadCaptureModal;

