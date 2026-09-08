import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, X, Bot, Sparkles, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Message = {
  id: string;
  role: "user" | "bot";
  text: string;
  timestamp: Date;
};

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "bot",
  text: "Hi! I'm the CONSTIL assistant. How can I help with estimates, invoices, or our Construction Intelligence platform?",
  timestamp: new Date(),
};

const MOCK_REPLIES = [
  "CONSTIL offers AI-powered estimates from blueprints, professional invoicing, and smart benchmarking. Would you like to know more about any feature?",
  "You can get started by creating an account at app.constil.com/signup. We have plans for different needs.",
  "Our edge is Construction Intelligence: estimate intelligence, payment intelligence, and smart benchmarking in one platform.",
  "For technical or sales support, email support@constil.com. We're here to help!",
  "Thanks for reaching out. If you have more questions about CONSTIL, just ask.",
];

const formatTime = (date: Date) =>
  date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const ConstilChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      text: trimmed,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI reply
    const randomReply = MOCK_REPLIES[Math.floor(Math.random() * MOCK_REPLIES.length)];
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `b-${Date.now()}`,
          role: "bot",
          text: randomReply,
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
    }, 800 + Math.random() * 400);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed z-[60] flex flex-col border border-border bg-background shadow-2xl overflow-hidden
              bottom-0 left-0 right-0 rounded-t-2xl max-h-[85vh]
              sm:bottom-24 sm:left-auto sm:right-6 sm:w-[380px] sm:max-h-[520px] sm:rounded-2xl"
          >
            {/* Header */}
            <div className="relative flex items-center justify-between px-4 py-3.5 bg-navy border-b border-primary/20">
              <div
                className="absolute inset-0 opacity-40 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(120px 90px at 85% -20%, hsl(var(--primary) / 0.35), transparent 70%)",
                }}
              />
              <div className="relative flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm leading-tight tracking-wide">
                    CONSTIL Chat
                  </h3>
                  <p className="text-[11px] text-primary/80 leading-tight">
                    Construction Intelligence
                  </p>
                </div>
              </div>
              <div className="relative flex items-center gap-1">
                <span className="hidden sm:inline-flex items-center gap-1.5 mr-1 text-[11px] font-medium text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-full px-2.5 py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online
                </span>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors touch-manipulation min-w-[40px] min-h-[40px] sm:min-w-0 sm:min-h-0 flex items-center justify-center"
                  aria-label="Close chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto min-h-[220px] max-h-[48vh] sm:min-h-[300px] sm:max-h-[400px] p-4 space-y-4 bg-gradient-to-b from-background to-muted/30 chat-scroll"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`flex gap-2 max-w-[88%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    {msg.role === "bot" && (
                      <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mt-0.5 shrink-0">
                        <Sparkles className="w-3.5 h-3.5 text-primary" />
                      </div>
                    )}
                    <div
                      className={`px-3.5 py-2.5 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground rounded-2xl rounded-br-md shadow-sm"
                          : "bg-background border border-border/70 text-foreground rounded-2xl rounded-bl-md shadow-sm"
                      }`}
                    >
                      {msg.text}
                      <span
                        className={`block mt-1 ${msg.role === "user" ? "text-primary-foreground/60" : "text-muted-foreground/60"} text-[10px] text-right`}
                      >
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-start gap-2">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mt-0.5 shrink-0">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div className="bg-background border border-border/70 rounded-2xl rounded-bl-md px-4 py-3 text-muted-foreground flex gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 sm:p-3.5 border-t border-border bg-background">
              <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/40 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 transition-all">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  className="flex-1 min-h-[44px] bg-transparent px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
                <button
                  type="button"
                  onClick={sendMessage}
                  disabled={!input.trim()}
                  className="m-1 p-2.5 min-w-[40px] min-h-[40px] rounded-lg bg-primary text-primary-foreground hover:bg-primary-hover disabled:opacity-40 disabled:pointer-events-none transition-all shrink-0 flex items-center justify-center"
                  aria-label="Send"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="flex items-center justify-center gap-1 mt-2 text-[10px] text-muted-foreground/70">
                <ShieldCheck className="w-3 h-3" />
                CONSTIL AI assistant · replies may be simulated
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating button */}
      <motion.button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 group"
        aria-label={isOpen ? "Close chat" : "Open CONSTIL chat"}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
      >
        <span className="flex items-center gap-3 pl-4 pr-4 sm:pr-5 py-3.5 rounded-2xl bg-navy text-white shadow-2xl shadow-navy/40 border border-primary/30 hover:border-primary/60 transition-colors">
          <span className="relative flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-primary" />
            <span className="absolute -top-0.5 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-navy animate-pulse" />
          </span>
          <span className="hidden sm:block text-sm font-semibold tracking-wide">
            Chat with CONSTIL
          </span>
        </span>
      </motion.button>
    </>
  );
};

export default ConstilChatBot;