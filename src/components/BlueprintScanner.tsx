import { motion } from "framer-motion";
import { ScanLine } from "lucide-react";

const BlueprintScanner = () => (
  <div className="absolute inset-0" aria-hidden>
    <div className="relative w-full h-full bg-navy overflow-hidden">
      {/* Blueprint grid */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(hsl(217 100% 63% / 0.22) 1px, transparent 1px), linear-gradient(90deg, hsl(217 100% 63% / 0.22) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />

      {/* Corner brackets */}
      <div className="absolute left-6 top-6 w-10 h-10 border-l-2 border-t-2 border-primary/60 rounded-tl-lg" />
      <div className="absolute right-6 top-6 w-10 h-10 border-r-2 border-t-2 border-primary/60 rounded-tr-lg" />
      <div className="absolute left-6 bottom-6 w-10 h-10 border-l-2 border-b-2 border-primary/60 rounded-bl-lg" />
      <div className="absolute right-6 bottom-6 w-10 h-10 border-r-2 border-b-2 border-primary/60 rounded-br-lg" />

      {/* Scanning line */}
      <div className="absolute inset-x-0 h-[3px] bg-primary shadow-[0_0_24px_8px_rgba(80,150,255,0.55)] scan-line" />

      {/* Scanner mask — blueprint is revealed as the scan sweeps down */}
      <div className="absolute inset-0 scanner-mask">
        {/* Floor plan frame */}
        <div className="absolute inset-[15%] rounded-lg border-2 border-primary/60">
          {/* Interior walls */}
          <div className="absolute left-0 right-0 top-[42%] h-[3px] bg-primary/60" />
          <div className="absolute top-0 bottom-0 left-[38%] w-[3px] bg-primary/60" />
          <div className="absolute right-[26%] top-0 h-[42%] w-[3px] bg-primary/50" />
          <div className="absolute left-[38%] right-[26%] top-[42%] h-px bg-primary/30" />

          {/* Room labels */}
          <span className="absolute top-[13%] left-[20%] text-[10px] md:text-xs tracking-[0.35em] text-primary font-semibold">
            LIVING
          </span>
          <span className="absolute top-[13%] right-[48%] text-[10px] md:text-xs tracking-[0.35em] text-primary/80 font-medium">
            STUDY
          </span>
          <span className="absolute bottom-[18%] left-[9%] text-[10px] md:text-xs tracking-[0.35em] text-primary font-medium">
            BEDROOM 1
          </span>
          <span className="absolute bottom-[18%] right-[13%] text-[10px] md:text-xs tracking-[0.35em] text-primary/70 font-medium">
            BEDROOM 2
          </span>

          {/* Detection markers */}
          <span className="absolute w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-cyan-300 shadow-[0_0_8px_2px_rgba(103,232,249,0.8)] animate-pulse" style={{ left: "38%", top: "42%" }} />
          <span className="absolute w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-cyan-300 shadow-[0_0_8px_2px_rgba(103,232,249,0.8)] animate-pulse" style={{ left: "74%", top: "42%", animationDelay: "0.3s" }} />
          <span className="absolute w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-cyan-300 shadow-[0_0_8px_2px_rgba(103,232,249,0.8)] animate-pulse" style={{ left: "5%", bottom: "8%", animationDelay: "0.6s" }} />
        </div>

        {/* Top dimension line */}
        <div className="absolute top-[7%] left-[17%] right-[17%] h-px bg-primary/70">
          <span className="absolute -left-[5px] top-1/2 -translate-y-1/2 h-2.5 w-[2px] bg-primary" />
          <span className="absolute -right-[5px] top-1/2 -translate-y-1/2 h-2.5 w-[2px] bg-primary" />
        </div>
        <span className="absolute top-[4.5%] left-1/2 -translate-x-1/2 text-[9px] md:text-[11px] tracking-widest text-primary bg-navy px-1.5">
          54&apos;-6&quot;
        </span>

        {/* Left dimension line */}
        <div className="absolute left-[7%] top-[16%] bottom-[12%] w-px bg-primary/70">
          <span className="absolute -top-[5px] left-1/2 -translate-x-1/2 w-2.5 h-[2px] bg-primary" />
          <span className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 w-2.5 h-[2px] bg-primary" />
        </div>
        <span className="absolute left-[4.6%] top-1/2 -translate-y-1/2 text-[9px] md:text-[11px] tracking-widest text-primary bg-navy px-1.5 [writing-mode:vertical-rl]">
          32&apos;-0&quot;
        </span>
      </div>

      {/* HUD chips */}
      <motion.div
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-6 top-6 rounded-lg border border-primary/40 bg-navy/90 backdrop-blur px-3 py-2 text-[11px] font-medium text-primary-foreground shadow-lg flex items-center gap-2"
      >
        <ScanLine className="w-3.5 h-3.5 text-primary animate-pulse" />
        AI Scanning Blueprint
      </motion.div>

      <motion.div
        animate={{ y: [0, 7, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
        className="absolute right-6 top-6 rounded-lg border border-primary/40 bg-navy/90 backdrop-blur px-3 py-2 text-[11px] font-semibold text-primary-foreground shadow-lg hidden md:block"
      >
        <span className="text-white/60 font-normal">4 </span>rooms detected
      </motion.div>

      <motion.div
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        className="absolute left-6 bottom-6 rounded-lg border border-primary/40 bg-navy/90 backdrop-blur px-3 py-2 text-[11px] shadow-lg"
      >
        <span className="text-white/60">Estimate: </span>
        <span className="text-primary font-bold">$45,820</span>
      </motion.div>

      <motion.div
        animate={{ y: [0, 7, 0] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 0.9 }}
        className="absolute right-6 bottom-6 rounded-lg border border-primary/40 bg-navy/90 backdrop-blur px-3 py-2 text-[11px] shadow-lg hidden md:block"
      >
        <span className="text-white/60">Accuracy </span>
        <span className="text-primary font-bold">98.4%</span>
      </motion.div>
    </div>
  </div>
);

export default BlueprintScanner;