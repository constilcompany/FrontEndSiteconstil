
import React, { useEffect, useRef, useState } from "react";

export interface StepData {
  id: number;
  title: string;
  text: string[];
}

export interface HowWorkProps {
  heading?: string;
  subHeading?: string;
  stepsData?: StepData[];
}

const defaultSteps: StepData[] = [
  {
    id: 1,
    title: "Capture",
    text: [
      "Rillion automatically reads and extracts data from every incoming invoice using AI and OCR technology, whether it’s a scanned document, PDF, XML, or another digital format.",
      "The system identifies the vendor, amount, VAT, and reference details instantly, then suggests the right workflow based on supplier and accounting rules. All captured data is stored securely in the cloud, ready for review or approval.",
    ],
  },
  {
    id: 2,
    title: "Approve",
    text: [
      "Artificial intelligence and pre‑set approval rules automatically route and code to the right approver.",
      "Approvers get full visibility into the status of every invoice and can take action from anywhere.",
    ],
  },
  {
    id: 3,
    title: "Match & Control",
    text: [
      "Invoices are automatically matched against purchase orders and goods receipts.",
      "Exceptions are flagged instantly so your AP team can focus only on what needs attention.",
    ],
  },
  {
    id: 4,
    title: "Pay & Analyze",
    text: [
      "Once approved, invoices are transferred to your ERP or accounting system for payment.",
      "Real‑time analytics give finance leaders insight into spend, bottlenecks, and savings opportunities.",
    ],
  },
];

const StepItem = ({ step }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`relative flex gap-6 pb-12 transition-all duration-500 ease-out ${visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
    >
      {/* Number circle */}
      <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full  text-sm font-semibold text-black">
        {step.id}.
      </div>

      {/* Text content */}
      <div>
        <h3 className="mb-2 text-lg font-semibold text-[#053327]">
          {step.title}
        </h3>
        {step.text.map((p, idx) => (
          <p
            key={idx}
            className="mb-3 text-sm leading-relaxed text-[#24382F]"
          >
            {p}
          </p>
        ))}
      </div>
    </div>
  );
};

const HowWork = ({
  heading = "How Rillion’s intelligent AI invoice management software works",
  subHeading = "Follow a simple, automated workflow from capture to payment while keeping full control and visibility over every invoice.",
  stepsData = defaultSteps,
}: HowWorkProps) => {
  return (
    <section className="w-full bg-[#E7F0E9] py-16 md:py-24">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 md:flex-row md:px-8">
        {/* LEFT: Sticky heading text */}
        <div className="md:w-1/2 md:pr-12">
          <div className="md:sticky md:top-28">
            <h2
              className="mb-4 text-3xl font-bold leading-snug text-[#053327] md:text-4xl"
              dangerouslySetInnerHTML={{ __html: heading }}
            />
            <p className="max-w-md text-sm leading-relaxed text-[#355246]">
              {subHeading}
            </p>
          </div>
        </div>

        {/* RIGHT: Vertical timeline steps */}
        <div className="relative md:w-1/2">
          {/* Vertical line behind steps */}
          <div className="pointer-events-none absolute left-5 top-0 h-full w-px bg-[#B7CEC0]" />

          <div className="pl-10">
            {stepsData.map((step) => (
              <StepItem key={step.id} step={step} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowWork;