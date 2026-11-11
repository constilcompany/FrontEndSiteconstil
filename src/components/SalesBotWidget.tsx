import React, { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  ExternalLink,
  ArrowRight,
  Check,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { supabase } from "@/lib/supabase";
import { trackGAEvent } from "@/lib/analytics";
import { getFullForensicLeadPayload, getGA4VisitorParams } from "@/lib/visitorContext";

interface ActionLink {
  label: string;
  url: string;
}

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  time: string;
  link?: ActionLink;
  actions?: ActionLink[];
  showForm?: boolean;
  formSubmitted?: boolean;
}

interface VisitorLead {
  name?: string;
  email?: string;
  phone?: string;
}

const formatCurrentTime = () => {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const STANDARD_SUPPORT_ACTIONS: ActionLink[] = [
  { label: "Launch App / Sign Up", url: "https://app.constil.com/signup" },
  { label: "View All Plans", url: "https://app.constil.com/subscribe" },
];

const FORM_INVITATION_TEXT =
  "I can unlock complimentary test credits so you can run a blueprint right now. Fill in your details below to activate your free test access:";

// ---------------------------------------------------------------------------
// 1. NLP Typo Tolerance & Levenshtein Matching
// ---------------------------------------------------------------------------

function levenshteinDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

function hasFuzzyToken(tokens: string[], targets: string[]): boolean {
  for (const token of tokens) {
    if (token.length < 3) continue;
    for (const target of targets) {
      if (token === target) return true;
      if (token.length >= 4 && (token.includes(target) || target.includes(token))) return true;
      const allowedDist = target.length >= 7 ? 2 : 1;
      if (Math.abs(token.length - target.length) <= allowedDist) {
        if (levenshteinDistance(token, target) <= allowedDist) {
          return true;
        }
      }
    }
  }
  return false;
}

// ---------------------------------------------------------------------------
// 2. Contact Extraction Regex & Natural Language Engine
// ---------------------------------------------------------------------------

const STOP_WORDS = new Set([
  "hi", "hello", "hey", "howdy", "sup", "yo", "pricing", "price", "prices", "cost", "costing", "costs",
  "subscription", "subscriptions", "subscribe", "subcribe", "subcription", "subcriptions", "plan", "plans",
  "package", "packages", "tier", "tiers", "rate", "rates", "takeoff", "takeoffs", "blueprint", "blueprints",
  "pdf", "pdfs", "sheet", "sheets", "drywall", "framing", "concrete", "flooring", "roofing", "plumbing",
  "electrical", "hvac", "yes", "no", "ok", "okay", "sure", "thanks", "thank", "you", "help", "demo", "trial",
  "test", "credits", "credit", "how", "what", "why", "where", "when", "constil", "app", "contractor",
  "contractors", "commercial", "residential", "estimate", "estimating", "estimator", "accuracy", "accurate",
  "cad", "dwg", "arch", "invoice", "invoicing", "proposal", "proposals", "quote", "quotes", "excel", "export"
]);

function extractContactDetails(
  rawText: string,
  waitingForName: boolean
): { email?: string; phone?: string; name?: string } {
  const emailMatch = rawText.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
  const email = emailMatch ? emailMatch[1].trim() : undefined;

  const phoneMatch = rawText.match(/(?:\+?1[-.\s]*)?(?:\([0-9]{3}\)|[0-9]{3})[-.\s]*[0-9]{3}[-.\s]*[0-9]{4}/);
  const phone = phoneMatch ? phoneMatch[0].trim() : undefined;

  let name: string | undefined;

  const namePatterns = [
    /(?:my name is|i am|i'm|name is|call me|this is|name:?)\s+([A-Za-z]+(?:\s+[A-Za-z]+)?)/i,
    /^([A-Za-z]+(?:\s+[A-Za-z]+)?)\s+(?:here|reporting)/i,
  ];

  for (const pat of namePatterns) {
    const match = rawText.match(pat);
    if (match && match[1]) {
      const candidate = match[1].trim();
      const lower = candidate.toLowerCase();
      if (!STOP_WORDS.has(lower) && !["a", "an", "the", "looking", "interested", "trying"].includes(lower)) {
        name = candidate;
        break;
      }
    }
  }

  if (!name && (email || phone)) {
    let remainder = rawText;
    if (email) remainder = remainder.replace(email, " ");
    if (phone) remainder = remainder.replace(phone, " ");
    remainder = remainder
      .replace(/[,:;/\-()!]/g, " ")
      .replace(/\b(my|name|is|email|phone|cell|mobile|number|here|and|at|with)\b/gi, " ")
      .trim();
    const candidateWords = remainder.split(/\s+/).filter(Boolean);
    if (candidateWords.length >= 1 && candidateWords.length <= 3) {
      const isPureName = candidateWords.every(
        (w) => /^[a-zA-Z'-]+$/.test(w) && !STOP_WORDS.has(w.toLowerCase())
      );
      if (isPureName) {
        name = candidateWords.join(" ");
      }
    }
  }

  if (!name && !email && !phone && waitingForName) {
    const trimmed = rawText.trim().replace(/[,:;/\-()!.]/g, "");
    const candidateWords = trimmed.split(/\s+/).filter(Boolean);
    if (candidateWords.length >= 1 && candidateWords.length <= 3) {
      const isPureName = candidateWords.every(
        (w) => /^[a-zA-Z'-]+$/.test(w) && !STOP_WORDS.has(w.toLowerCase())
      );
      if (isPureName) {
        name = candidateWords.join(" ");
      }
    }
  }

  return { email, phone, name };
}

// ---------------------------------------------------------------------------
// 3. Visitor Metadata & Supabase Lead Persistence
// ---------------------------------------------------------------------------

function detectTradeFromMessages(msgs: ChatMessage[]): string {
  const userTexts = msgs
    .filter((m) => m.sender === "user")
    .map((m) => m.text.toLowerCase())
    .join(" ");

  const tradeRules: { trade: string; keywords: string[] }[] = [
    { trade: "Drywall", keywords: ["drywall", "sheetrock", "gypsum"] },
    { trade: "Framing", keywords: ["framing", "carpenter", "carpentry", "wood frame", "metal stud"] },
    { trade: "Roofing", keywords: ["roofing", "roof", "shingle"] },
    { trade: "Concrete", keywords: ["concrete", "cement", "slab", "foundation"] },
    { trade: "Insulation", keywords: ["insulation", "batt", "spray foam"] },
    { trade: "Flooring", keywords: ["flooring", "tile", "hardwood", "carpet"] },
    { trade: "Painting & Finishes", keywords: ["painting", "paint", "finishes"] },
    { trade: "Electrical", keywords: ["electrical", "electrician", "wiring"] },
    { trade: "Plumbing", keywords: ["plumbing", "pipe", "pipes"] },
    { trade: "HVAC", keywords: ["hvac", "mechanical", "duct"] },
    { trade: "General Contractor", keywords: ["gc", "general contractor", "residential", "commercial"] },
  ];

  for (const rule of tradeRules) {
    if (rule.keywords.some((k) => userTexts.includes(k))) {
      return rule.trade;
    }
  }
  return "General Construction";
}

async function persistLeadWithMetadata(
  lead: VisitorLead,
  conversationSummary?: string,
  historyMessages: ChatMessage[] = [],
  customTrade?: string
): Promise<{ success: boolean; data?: any; error?: any }> {
  try {
    const forensics = await getFullForensicLeadPayload();

    console.log("Alex AI Sales Representative: Saving visitor lead with forensics", {
      ...lead,
      forensics,
    });

    // 1. Direct Supabase insert into public.chatbot_leads with full forensics
    const tradeToSave = customTrade || detectTradeFromMessages(historyMessages);
    const messagesJson = historyMessages.map((m) => ({
      id: m.id,
      sender: m.sender,
      text: m.text,
      time: m.time,
    }));

    let insertResult: { success: boolean; data?: any; error?: any } = { success: true };

    const fullPayload = {
      name: lead.name || "Chat Visitor",
      email: lead.email || null,
      phone: lead.phone || null,
      trade: tradeToSave,
      messages: messagesJson,
      referrer: forensics.referrer,
      page_url: forensics.current_page || (typeof window !== "undefined" ? window.location.href : null),
      timezone: forensics.timezone || "UTC",
      ip_address: forensics.ip_address,
      city: forensics.city,
      region: forensics.region,
      country: forensics.country,
      landing_page: forensics.landing_page,
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

    try {
      const { data, error } = await supabase.from("chatbot_leads").insert([fullPayload]).select();

      if (error) {
        console.warn("Extended columns insert failed for chatbot_leads, falling back to core schema:", error.message);
        // Fallback to core columns if migration SQL has not been executed yet
        const corePayload = {
          name: lead.name || "Chat Visitor",
          email: lead.email || null,
          phone: lead.phone || null,
          trade: tradeToSave,
          messages: messagesJson,
          referrer: forensics.referrer,
          page_url: forensics.current_page || (typeof window !== "undefined" ? window.location.href : null),
          timezone: forensics.timezone || "UTC",
        };
        const fallbackRes = await supabase.from("chatbot_leads").insert([corePayload]).select();
        if (fallbackRes.error) {
          console.error("Chatbot leads fallback insert error:", fallbackRes.error);
          insertResult = { success: false, error: fallbackRes.error };
        } else {
          console.log("Chatbot lead successfully saved to Supabase (Core Schema):", fallbackRes.data);
          insertResult = { success: true, data: fallbackRes.data };
          try {
            localStorage.setItem("lead_captured", "true");
          } catch {}
        }
      } else {
        console.log("Chatbot lead successfully saved to Supabase (Full Forensics):", data);
        insertResult = { success: true, data };
        try {
          localStorage.setItem("lead_captured", "true");
        } catch {}
      }
    } catch (chatbotErr) {
      console.error("Direct chatbot_leads exception:", chatbotErr);
      insertResult = { success: false, error: chatbotErr };
    }

    // 2. Post to existing contact-form edge function endpoint
    axios.post("https://avppbvsxayehguepyjkb.supabase.co/functions/v1/contact-form", {
      firstName: lead.name || "Chat Visitor",
      lastName: "",
      email: lead.email || "no-email@chat.constil.com",
      phoneNumber: lead.phone || "",
      message: `Captured via Alex (AI Sales Consultant)\n\nVisitor Metadata:\n• IP: ${forensics.ip_address || "Unknown"}\n• Location: ${[forensics.city, forensics.region, forensics.country].filter(Boolean).join(", ") || "Unknown"}\n• Page: ${forensics.current_page}\n• Referrer: ${forensics.referrer}\n• Timezone: ${forensics.timezone}\n• Notes: ${conversationSummary || "Lead captured during live chat consultation"}`,
      companyName: "Web Sales Chat Lead",
    }).catch((err) => {
      console.warn("Contact form edge submission error (fallback):", err);
    });

    return insertResult;
  } catch (err) {
    console.warn("Visitor lead persistence warning:", err);
    return { success: false, error: err };
  }
}

// ---------------------------------------------------------------------------
// 4. Domain Knowledge Base Answers (Concise & Helpful Value)
// ---------------------------------------------------------------------------

function getDomainKnowledgeAnswer(rawQuery: string): string {
  const normalized = rawQuery.toLowerCase().replace(/[^\w\s]/g, " ").trim();
  const tokens = normalized.split(/\s+/).filter(Boolean);

  // 1. Pricing & Subscriptions
  const PRICING_KEYWORDS = [
    "pricing", "price", "prices", "cost", "costing", "costs",
    "subscription", "subscriptions", "subscribe", "subcribe", "subcription", "subcriptions", "subscribtion",
    "plan", "plans", "package", "packages", "tier", "tiers", "rate", "rates",
    "membership", "memberships", "charge", "charges", "fee", "fees",
    "how much", "cheap", "expensive", "pay", "payment", "credits", "wallet", "credit"
  ];
  if (hasFuzzyToken(tokens, PRICING_KEYWORDS) || normalized.includes("how much")) {
    return "We keep pricing straightforward! Subcontractors bidding occasionally love our Pay-As-You-Go credit packs with zero monthly commitment, while active General Contractors use our Unlimited Monthly plan for unlimited blueprint takeoffs and CSI exports.";
  }

  // 2. Free Trial & Getting Started
  const TRIAL_KEYWORDS = [
    "trial", "free", "signup", "register", "registration", "account",
    "demo", "get started", "onboarding", "join", "test", "credits", "free trial"
  ];
  if (hasFuzzyToken(tokens, TRIAL_KEYWORDS) || normalized.includes("sign up") || normalized.includes("free trial")) {
    return "You can start right now in under 30 seconds—no credit card required! We automatically gift you free starter credits upon signup so you can upload your actual PDF blueprints and see the automated takeoff tables live.";
  }

  // 3. Supported Trades & CSI Divisions
  const TRADES_KEYWORDS = [
    "trade", "trades", "drywall", "drywalling", "framing", "finishes", "insulation",
    "concrete", "flooring", "roofing", "plumbing", "electrical", "hvac",
    "csi", "division", "divisions", "carpentry", "siding", "windows", "doors",
    "studs", "drywalls", "mep", "foundation", "foundations", "tile", "paint"
  ];
  if (hasFuzzyToken(tokens, TRADES_KEYWORDS)) {
    return "Alex here—yes, we specialize in those trades! CONSTIL automatically organizes your takeoff into standard CSI MasterFormat divisions (Drywall, Framing, Concrete, Insulation, Roofing, Finishes) with localized US labor and material rates.";
  }

  // 4. Blueprint Formats, Sheets & Measurements (ARCH D/E)
  const BLUEPRINT_KEYWORDS = [
    "blueprint", "blueprints", "bluprint", "pdf", "pdfs", "sheet", "sheets",
    "arch d", "arch e", "cad", "dwg", "vector", "layer", "layers",
    "measurement", "measurements", "sf", "lf", "square feet", "linear feet", "m2",
    "square meters", "metric", "imperial", "scale", "takeoff", "takeoffs", "multi page"
  ];
  if (hasFuzzyToken(tokens, BLUEPRINT_KEYWORDS) || normalized.includes("arch d") || normalized.includes("arch e")) {
    return "Our engine is built specifically for real-world blueprint sets! We handle large-format ARCH D (24x36\"), ARCH E (36x48\"), and multi-sheet PDF drawings, calculating both Imperial (SF/LF) and Metric (M²) in under 2 minutes.";
  }

  // 5. Invoicing, Proposals & Excel Exports
  const INVOICE_KEYWORDS = [
    "invoice", "invoices", "invoicing", "proposal", "proposals",
    "quote", "quotes", "bill", "billing", "excel", "xlsx", "export",
    "csv", "client", "clients", "crm", "retainage"
  ];
  if (hasFuzzyToken(tokens, INVOICE_KEYWORDS)) {
    return "Once your AI takeoff is done, you can turn those line items into persuasive narrative client proposals with Claude AI, or convert them straight into branded client invoices and Excel (.xlsx) exports with a single click.";
  }

  // 6. Accuracy & Human Overrides
  const ACCURACY_KEYWORDS = [
    "accuracy", "accurate", "precision", "exact", "reliable", "trust",
    "error", "mistake", "guarantee", "quality", "human"
  ];
  if (hasFuzzyToken(tokens, ACCURACY_KEYWORDS)) {
    return "We achieve trade-level precision by rasterizing plans at 150 DPI so vector linework stays razor sharp. Plus, you get an interactive spreadsheet-style viewer where you can review measurements, adjust unit rates, and apply custom waste factors before finalizing.";
  }

  // 7. Human Support & Walkthroughs
  const SUPPORT_KEYWORDS = [
    "support", "contact", "help", "phone", "email", "human", "person",
    "call", "agent", "representative", "talk", "sales", "demo", "zoom", "walkthrough"
  ];
  if (hasFuzzyToken(tokens, SUPPORT_KEYWORDS)) {
    return "Our support and estimating engineering team is reachable at support@constil.com, and we also offer personalized 1-on-1 walkthroughs with your team's live project drawings.";
  }

  // 8. General Platform Overview / Explanations
  const isPlatformIntent =
    hasFuzzyToken(tokens, ["platform", "website", "overview", "constil"]) ||
    normalized.includes("what is") ||
    normalized.includes("what does") ||
    normalized.includes("what do you do") ||
    normalized.includes("who are you") ||
    normalized.includes("tell me about") ||
    normalized.includes("information");

  if (isPlatformIntent) {
    return "Alex here! CONSTIL is an AI platform built for US contractors. Simply upload your architectural PDF blueprints, and our engine measures the spaces, quantities, and scope—producing complete CSI division estimates and client invoices in minutes.";
  }

  // 9. Conversational Greetings
  const isGreeting = /\b(hi|hello|hey|howdy|greetings|good morning|good afternoon|good evening|sup|yo)\b/i.test(normalized);
  if (isGreeting) {
    return "Hey! Alex here from CONSTIL. We help contractors automate blueprint takeoffs and estimating down to under 2 minutes.";
  }

  // 10. General Consultative Fallback
  return "CONSTIL turns multi-page architectural PDF blueprints into accurate material takeoffs and client invoices in minutes, helping contractors bid faster without tedious manual scaling.";
}

// ---------------------------------------------------------------------------
// 5. Conversational Response Resolver (Turn 2 Form Card & Support Guide)
// ---------------------------------------------------------------------------

interface ResolverResult {
  reply: {
    text: string;
    link?: ActionLink;
    actions?: ActionLink[];
    showForm?: boolean;
  };
  updatedLead: VisitorLead;
  newlyCompleted: boolean;
  hasOfferedTestCredits: boolean;
}

function resolveAlexSalesResponse(
  rawQuery: string,
  existingLead: VisitorLead,
  isCaptured: boolean,
  hasOfferedCredits: boolean
): ResolverResult {
  const detected = extractContactDetails(rawQuery, hasOfferedCredits && !existingLead.name);

  const updatedLead: VisitorLead = {
    name: detected.name || existingLead.name,
    email: detected.email || existingLead.email,
    phone: detected.phone || existingLead.phone,
  };

  const hasAllThree = Boolean(updatedLead.name && updatedLead.email && updatedLead.phone);

  // If user typed all 3 details directly into the chat input
  if (hasAllThree && !isCaptured) {
    const greetingName = updatedLead.name || "friend";
    return {
      reply: {
        text: `Awesome, ${greetingName}! You're all set. Your test access request has been sent to our team. In the meantime, feel free to ask me anything about navigating the platform or getting started.`,
        actions: STANDARD_SUPPORT_ACTIONS,
      },
      updatedLead,
      newlyCompleted: true,
      hasOfferedTestCredits: true,
    };
  }

  const baseAnswer = getDomainKnowledgeAnswer(rawQuery);

  // If lead is not yet captured, bot responses ALWAYS include the interactive inline capture card
  if (!isCaptured) {
    return {
      reply: {
        text: `${baseAnswer}\n\n${FORM_INVITATION_TEXT}`,
        showForm: true,
      },
      updatedLead,
      newlyCompleted: false,
      hasOfferedTestCredits: true,
    };
  }

  // Once lead is captured, return standard answer with support links
  return {
    reply: {
      text: baseAnswer,
      actions: STANDARD_SUPPORT_ACTIONS,
    },
    updatedLead,
    newlyCompleted: false,
    hasOfferedTestCredits: true,
  };
}

// ---------------------------------------------------------------------------
// 6. SalesBotWidget Component
// ---------------------------------------------------------------------------

export const SalesBotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showProactiveBubble, setShowProactiveBubble] = useState(false);

  // Lead State & Lifecycle (scoped to this chat session so new users can always submit)
  const [isLeadCaptured, setIsLeadCaptured] = useState<boolean>(false);
  const [leadState, setLeadState] = useState<VisitorLead>({});
  const [hasOfferedTestCredits, setHasOfferedTestCredits] = useState<boolean>(false);

  // Inline Form State
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  // Turn 1 (Greeting): Warm hello as Alex from CONSTIL without asking for contact details
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial-welcome",
      sender: "bot",
      text: "Hey there! Welcome to CONSTIL. I help contractors automate blueprint takeoffs and estimating. What kind of projects or trades are you looking to estimate?",
      time: formatCurrentTime(),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 1. Auto-Open on Page Visit (Automatically pop up 6 to 8 seconds after landing)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const isDismissed = sessionStorage.getItem("alex_chat_auto_dismissed") === "true";
    if (isDismissed || isOpen) return;

    const autoOpenTimer = setTimeout(() => {
      const alreadyDismissed = sessionStorage.getItem("alex_chat_auto_dismissed") === "true";
      if (!alreadyDismissed) {
        setIsOpen(true);
        setShowProactiveBubble(false);
      }
    }, 7000); // 7 seconds (within 6 to 8 seconds range)

    return () => clearTimeout(autoOpenTimer);
  }, []);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setShowProactiveBubble(false);
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen]);

  // Close handler: remembers dismissal in session so it doesn't pop open again
  const handleCloseChat = () => {
    setIsOpen(false);
    sessionStorage.setItem("alex_chat_auto_dismissed", "true");
    localStorage.setItem("alex_proactive_dismissed", "true");
    setShowProactiveBubble(false);
  };

  const addBotResponse = (
    text: string,
    link?: ActionLink,
    actions?: ActionLink[],
    showForm?: boolean
  ) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}-${Math.random()}`,
          sender: "bot",
          text,
          time: formatCurrentTime(),
          link,
          actions,
          showForm,
        },
      ]);
      setIsTyping(false);
    }, 400);
  };

  // Helper to handle query progression
  const handleQuery = (queryText: string) => {
    const outcome = resolveAlexSalesResponse(
      queryText,
      leadState,
      isLeadCaptured,
      hasOfferedTestCredits
    );

    if (outcome.updatedLead) {
      setLeadState(outcome.updatedLead);
    }
    if (outcome.hasOfferedTestCredits) {
      setHasOfferedTestCredits(true);
    }
    if (outcome.newlyCompleted) {
      setIsLeadCaptured(true);
      // Mark any prior form card as submitted
      setMessages((prev) =>
        prev.map((m) => (m.showForm ? { ...m, formSubmitted: true } : m))
      );
      trackGAEvent('lead_form_submitted', {
        form_name: 'salesbot',
        ...getGA4VisitorParams(),
      });
      persistLeadWithMetadata(outcome.updatedLead, `Captured during live chat: "${queryText}"`, messages);
    }

    addBotResponse(
      outcome.reply.text,
      outcome.reply.link,
      outcome.reply.actions,
      outcome.reply.showForm
    );
  };

  // 2. Inline Form Submission Handler
  const handleInlineFormSubmit = async (messageId: string) => {
    const trimmedName = formName.trim();
    const trimmedEmail = formEmail.trim();
    const trimmedPhone = formPhone.trim();

    if (!trimmedName) {
      setFormError("Please enter your full name.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      setFormError("Please enter a valid work email address.");
      return;
    }

    const phoneClean = trimmedPhone.replace(/[^\d+]/g, "");
    if (!trimmedPhone || phoneClean.length < 7) {
      setFormError("Please enter a valid direct phone number.");
      return;
    }

    setFormError("");
    setIsSubmittingForm(true);

    const lead: VisitorLead = {
      name: trimmedName,
      email: trimmedEmail,
      phone: trimmedPhone,
    };

    setLeadState(lead);

    // Persist lead with visitor metadata and complete conversation history
    const result = await persistLeadWithMetadata(lead, "Captured via chat inline form card", messages);

    // Fire GA4 lead form submitted event
    trackGAEvent('lead_form_submitted', {
      form_name: 'salesbot',
      ...getGA4VisitorParams(),
    });

    // Explicit alert and log as requested
    if (result.error) {
      alert("Lead submitted: " + (result.error.message || JSON.stringify(result.error)));
      console.error("Chatbot lead submission error:", result.error);
    } else {
      alert("Lead submitted: SUCCESS");
      console.log("Chatbot lead submission SUCCESS:", result.data);

      setIsLeadCaptured(true);
      setHasOfferedTestCredits(true);

      // Replace form with success checkmark
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, formSubmitted: true } : msg
        )
      );

      // Follow-up Alex confirmation message with action buttons
      addBotResponse(
        "Awesome! Your test credits are being set up. How else can I help you navigate CONSTIL today?",
        undefined,
        STANDARD_SUPPORT_ACTIONS
      );
    }

    setIsSubmittingForm(false);
  };

  // Quick Action Handlers
  const handleHowItWorks = () => {
    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        sender: "user",
        text: "How does CONSTIL work?",
        time: formatCurrentTime(),
      },
    ]);

    const explanation =
      "It takes just 3 steps: 1) Drop in your PDF plan (residential or commercial). 2) Our AI calculates wall lengths, square footages, counts, and CSI divisions. 3) You get an editable estimate with localized labor and materials ready to export to Excel or invoice!";

    if (isLeadCaptured) {
      addBotResponse(explanation, undefined, STANDARD_SUPPORT_ACTIONS);
    } else {
      setHasOfferedTestCredits(true);
      addBotResponse(
        `${explanation}\n\n${FORM_INVITATION_TEXT}`,
        undefined,
        undefined,
        true
      );
    }
  };

  const handleViewPricing = () => {
    window.open("https://app.constil.com/subscribe", "_blank", "noopener,noreferrer");
    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        sender: "user",
        text: "I want to see pricing & subscription options",
        time: formatCurrentTime(),
      },
    ]);

    const pricingExplanation =
      "Opening our pricing page in a new tab! We offer flexible Pay-As-You-Go credit packs for occasional bidding and an Unlimited Monthly plan for active General Contractors with full CSI exports and invoice tools.";

    if (isLeadCaptured) {
      addBotResponse(pricingExplanation, undefined, STANDARD_SUPPORT_ACTIONS);
    } else {
      setHasOfferedTestCredits(true);
      addBotResponse(
        `${pricingExplanation}\n\n${FORM_INVITATION_TEXT}`,
        undefined,
        undefined,
        true
      );
    }
  };

  const handleUnlockCredits = () => {
    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        sender: "user",
        text: "Can I get complimentary test credits?",
        time: formatCurrentTime(),
      },
    ]);

    if (isLeadCaptured) {
      addBotResponse(
        "Your test access is already registered! You can jump straight into the portal to run your blueprints, or review all plans below.",
        undefined,
        STANDARD_SUPPORT_ACTIONS
      );
    } else {
      setHasOfferedTestCredits(true);
      addBotResponse(
        FORM_INVITATION_TEXT,
        undefined,
        undefined,
        true
      );
    }
  };

  const handleStartFreeTrial = () => {
    window.open("https://app.constil.com/signup", "_blank", "noopener,noreferrer");
    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        sender: "user",
        text: "I want to start my free trial",
        time: formatCurrentTime(),
      },
    ]);

    const trialExplanation =
      "Taking you to create your free account! You'll receive instant starter credits in your wallet to run your first blueprint takeoff immediately with zero commitment.";

    if (isLeadCaptured) {
      addBotResponse(trialExplanation, undefined, STANDARD_SUPPORT_ACTIONS);
    } else {
      setHasOfferedTestCredits(true);
      addBotResponse(
        `${trialExplanation}\n\n${FORM_INVITATION_TEXT}`,
        undefined,
        undefined,
        true
      );
    }
  };

  // User Message Submission
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const query = input.trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      time: formatCurrentTime(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    handleQuery(query);
  };

  return (
    <>
      {/* Floating Toggle Button (Positioned at bottom-[88px] right-6 directly above the bottom chat button) */}
      <div className="fixed bottom-[88px] right-6 z-50">
        <button
          onClick={() => {
            if (isOpen) {
              handleCloseChat();
            } else {
              setIsOpen(true);
              setShowProactiveBubble(false);
            }
          }}
          aria-label={isOpen ? "Close Alex" : "Open Alex - AI Sales Advisor"}
          className="relative flex items-center justify-center w-14 h-14 rounded-full bg-primary hover:bg-primary/95 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 group focus:outline-none focus:ring-4 focus:ring-primary/20"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <X className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="relative"
              >
                <MessageCircle className="w-7 h-7" />
                {/* Active pulse dot */}
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900"></span>
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Floating Chat Card (Positioned cleanly at bottom-[152px] right-4 sm:right-6 above both buttons) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed bottom-[152px] right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[410px] h-[580px] max-h-[calc(100vh-170px)] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3.5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white border-b border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center w-9 h-9 rounded-full bg-primary/20 border border-primary/30 text-primary font-bold text-xs tracking-wider">
                  AC
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-900"></span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-sm leading-tight text-white">Alex from CONSTIL</span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs text-slate-300 font-medium">Online • Estimating Advisor</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCloseChat}
                className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conversation Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50 dark:bg-slate-950/40 text-sm">
              {messages.map((msg) => {
                const isBot = msg.sender === "bot";
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isBot ? "items-start" : "items-end"} space-y-1`}
                  >
                    <div
                      className={`max-w-[92%] px-3.5 py-2.5 rounded-2xl whitespace-pre-wrap leading-relaxed ${
                        isBot
                          ? "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/60 rounded-tl-sm shadow-sm"
                          : "bg-primary text-white rounded-tr-sm shadow-sm"
                      }`}
                    >
                      {msg.text}

                      {/* INLINE FORM CARD (Rendered on Turn 2 if lead not yet captured) */}
                      {msg.showForm && !msg.formSubmitted && !isLeadCaptured && (
                        <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-900/90 rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-2.5">
                          <div className="space-y-1">
                            <label className="text-[11px] font-medium text-slate-700 dark:text-slate-300">
                              Full Name
                            </label>
                            <input
                              type="text"
                              value={formName}
                              onChange={(e) => {
                                setFormName(e.target.value);
                                if (formError) setFormError("");
                              }}
                              placeholder="Full Name"
                              className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] font-medium text-slate-700 dark:text-slate-300">
                              Work Email
                            </label>
                            <input
                              type="email"
                              value={formEmail}
                              onChange={(e) => {
                                setFormEmail(e.target.value);
                                if (formError) setFormError("");
                              }}
                              placeholder="name@company.com"
                              className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] font-medium text-slate-700 dark:text-slate-300">
                              Phone Number
                            </label>
                            <input
                              type="tel"
                              value={formPhone}
                              onChange={(e) => {
                                setFormPhone(e.target.value);
                                if (formError) setFormError("");
                              }}
                              placeholder="(555) 000-0000"
                              className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                            />
                          </div>

                          {formError && (
                            <p className="text-[11px] text-rose-500 font-medium px-0.5">
                              {formError}
                            </p>
                          )}

                          <button
                            type="button"
                            onClick={() => handleInlineFormSubmit(msg.id)}
                            disabled={isSubmittingForm}
                            className="w-full mt-1 py-2 px-3 bg-primary hover:bg-primary/95 active:scale-[0.99] text-white font-semibold text-xs rounded-lg shadow-sm transition-all duration-200 flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            {isSubmittingForm ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Activating Credits...</span>
                              </>
                            ) : (
                              <span>Unlock Free Test Credits 🚀</span>
                            )}
                          </button>
                        </div>
                      )}

                      {/* SUCCESS CONFIRMATION CHECKMARK (Replaces the form after submission) */}
                      {msg.formSubmitted && (
                        <div className="mt-2.5 p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200/80 dark:border-emerald-800/60 flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          </div>
                          <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-200">
                            Test Credits Activated Successfully!
                          </span>
                        </div>
                      )}

                      {/* Action buttons inside bot message */}
                      {(msg.link || (msg.actions && msg.actions.length > 0)) && (
                        <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex flex-wrap gap-2">
                          {msg.actions && msg.actions.length > 0 ? (
                            msg.actions.map((act) => (
                              <a
                                key={act.label}
                                href={act.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-primary text-white hover:bg-primary/90 shadow-sm transition-all"
                              >
                                <span>{act.label}</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </a>
                            ))
                          ) : msg.link ? (
                            <a
                              href={msg.link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 dark:text-sky-400 hover:underline transition-colors"
                            >
                              <span>{msg.link.label}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </a>
                          ) : null}
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 px-1">{msg.time}</span>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 w-fit px-3 py-2 rounded-2xl rounded-tl-sm shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]"></span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions Bar */}
            <div className="px-3.5 py-2 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={handleHowItWorks}
                className="shrink-0 text-xs px-2.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium transition-colors"
              >
                💡 How it works
              </button>

              {isLeadCaptured ? (
                <>
                  <a
                    href="https://app.constil.com/signup"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-xs px-2.5 py-1.5 rounded-full bg-primary text-white hover:bg-primary/90 font-semibold transition-colors inline-flex items-center gap-1 shadow-sm"
                  >
                    <span>🚀 Launch App</span>
                    <ExternalLink className="w-3 h-3 opacity-80" />
                  </a>
                  <a
                    href="https://app.constil.com/subscribe"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-xs px-2.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium transition-colors inline-flex items-center gap-1"
                  >
                    <span>🏷️ View All Plans</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleViewPricing}
                    className="shrink-0 text-xs px-2.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium transition-colors inline-flex items-center gap-1"
                  >
                    <span>🏷️ Pricing</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </button>
                  <button
                    type="button"
                    onClick={handleUnlockCredits}
                    className="shrink-0 text-xs px-2.5 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold transition-colors inline-flex items-center gap-1 border border-emerald-200/60 dark:border-emerald-800/40"
                  >
                    <span>🎁 Unlock Credits</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleStartFreeTrial}
                    className="shrink-0 text-xs px-2.5 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20 text-primary font-semibold transition-colors inline-flex items-center gap-1"
                  >
                    <span>🚀 Free Trial</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </button>
                </>
              )}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={handleSendMessage}
              className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  isLeadCaptured
                    ? "Ask about takeoffs, ARCH D/E, pricing, or exports..."
                    : "Ask a question, trade, or enter your details..."
                }
                className="flex-1 text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary text-white hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm focus:outline-none"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SalesBotWidget;
