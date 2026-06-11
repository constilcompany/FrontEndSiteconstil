import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, X, Bot } from "lucide-react";
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
  text: "Hi! I'm the CONSITL assistant. How can I help with estimates, invoices, or our Construction Intelligence platform?",
  timestamp: new Date(),
};

const MOCK_REPLIES = [
  "CONSITL offers AI-powered estimates from blueprints, professional invoicing, and smart benchmarking. Would you like to know more about any feature?",
  "You can get started by creating an account at app.constil.com/signup. We have plans for different needs.",
  "Our edge is Construction Intelligence: estimate intelligence, payment intelligence, and smart benchmarking in one platform.",
  "For technical or sales support, email support@constil.com. We're here to help!",
  "Thanks for reaching out. If you have more questions about CONSITL, just ask.",
];

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
              sm:bottom-24 sm:left-auto sm:right-6 sm:w-[360px] sm:max-h-[400px] sm:rounded-2xl"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">CONSITL Chat</h3>
                  <p className="text-xs text-muted-foreground">Construction Intelligence</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors touch-manipulation min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto min-h-[200px] max-h-[50vh] sm:min-h-[280px] sm:max-h-[400px] p-4 space-y-4"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-muted text-foreground rounded-bl-md"
                      }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-2.5 text-sm text-muted-foreground flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 rounded-full bg-current animate-bounce" />
                  </div>
                </div>
              )}
            </div>

            <div className="p-3 pb-5 sm:pb-4 border-t border-border bg-muted/20 mb-2">
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  className="flex-1 min-h-[44px] rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
                <button
                  type="button"
                  onClick={sendMessage}
                  disabled={!input.trim()}
                  className="p-2.5 min-w-[44px] min-h-[44px] rounded-xl bg-primary text-primary-foreground hover:bg-primary-hover disabled:opacity-40 disabled:pointer-events-none transition-all shrink-0 flex items-center justify-center"
                  aria-label="Send"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 w-14 h-14 min-w-[56px] min-h-[56px] rounded-2xl bg-primary text-primary-foreground shadow-lg hover:bg-primary-hover flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background touch-manipulation"
        aria-label={isOpen ? "Close chat" : "Open CONSITL chat"}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>
    </>
  );
};

export default ConstilChatBot;
