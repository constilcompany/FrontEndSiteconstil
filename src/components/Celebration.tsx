import { useMemo } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";

interface CelebrationProps {
  open: boolean;
  onDone?: () => void;
}

type Particle = {
  x: number;
  y: number;
  rotation: number;
  color: string;
  delay: number;
  duration: number;
  size: number;
  shape: "circle" | "square" | "rect";
};

const COLORS = ["#f59e0b", "#22c55e", "#3b82f6", "#ec4899", "#8b5cf6", "#ef4444", "#14b8a6"];

const Celebration = ({ open, onDone }: CelebrationProps) => {
  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: 80 }, (_, i) => ({
        x: (Math.random() - 0.9) * 420,
        y: -(Math.random() * 420 + 120),
        rotation: (Math.random() - 0.5) * 720,
        color: COLORS[i % COLORS.length],
        delay: Math.random() * 0.2,
        duration: 1.2 + Math.random() * 0.8,
        size: 6 + Math.random() * 6,
        shape: (i % 3 === 0 ? "circle" : i % 3 === 1 ? "square" : "rect") as Particle["shape"],
      })),
    []
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      {particles.map((p, i) => (
        <motion.span
          key={i}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0.5 }}
          animate={{ x: p.x, y: p.y, opacity: 0, rotate: p.rotation, scale: 1 }}
          transition={{ duration: p.duration, delay: p.delay, ease: "easeOut" }}
          className="absolute"
          style={{
            width: p.size * (p.shape === "rect" ? 2 : 1),
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.shape === "circle" ? "9999px" : "2px",
            right: 60,
            bottom: 70,
          }}
        />
      ))}

      <div className="fixed bottom-5 right-5 pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, x: 60, scale: 0.85 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
          className="relative flex items-start gap-3 bg-background border border-border rounded-2xl shadow-2xl p-4 pl-3 max-w-xs"
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => onDone?.()}
            className="absolute top-2 right-2 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 12, delay: 0.2 }}
            className="shrink-0 w-10 h-10 rounded-full bg-green-500/15 flex items-center justify-center"
          >
            <CheckCircle2 className="w-6 h-6 text-green-500" />
          </motion.div>
          <div className="pr-4">
            <p className="text-sm font-semibold text-foreground">Message received!</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We're thrilled you reached out — our team will get back to you shortly.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Celebration;