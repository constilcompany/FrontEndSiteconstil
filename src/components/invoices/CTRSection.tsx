
import React, { useState } from "react";

const items = [
  {
    title: "Extracting invoice data using OCR and AI",
    text: "Automatically capture all key invoice fields — vendor, dates, amounts, VAT, and line items — using OCR and AI, so your team never has to key in data manually.",
  },
  {
    title: "Matching invoices with POs and delivery notes",
    text: "Match invoices against purchase orders and goods receipts to ensure quantities and prices are correct before anything is approved or paid.",
  },
  {
    title: "Routing for multi-level approval",
    text: "Send invoices through smart, rule-based approval workflows so the right people see the right invoices at the right time.",
  },
  {
    title: "Scheduling payments automatically",
    text: "Schedule payments based on due dates and cash-flow rules, reducing late fees and taking advantage of early-payment discounts.",
  },
  {
    title: "Logging all actions for audit readiness",
    text: "Maintain a full audit trail of every approval, comment, and change made to each invoice for complete compliance and transparency.",
  },
];

import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import ctrImage from "@/assets/images/banner3.jpg";

const CTRSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleItem = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="w-full bg-[#E8F4FF] py-16 md:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 md:grid-cols-2 md:px-8">
        {/* LEFT: Heading + accordion list */}
        <div>
          <h2 className="mb-3 text-3xl font-bold leading-tight text-blue-500 md:text-4xl">
            Automating invoice
            <br />
            management with AP software
          </h2>

          <p className="mb-6 text-sm leading-relaxed text-slate-700">
            Accounts payable automation software eliminates manual steps in the
            invoice process by:
          </p>

          <div className="space-y-2">
            {items.map((item, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={item.title}
                  className="rounded-md bg-white/70 p-3 shadow-sm transition hover:bg-white"
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(index)}
                    className="flex w-full items-center gap-3 text-left"
                  >
                    {/* Plus icon circle */}
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full border border-blue-500 text-xs font-bold text-blue-500 transition-transform ${isOpen ? "rotate-45" : ""
                        }`}
                    >
                      +
                    </span>
                    <span className="text-sm font-medium text-slate-800">
                      {item.title}
                    </span>
                  </button>

                  {/* Paragraph (collapsible) */}
                  <div
                    className={`pl-9 pr-2 text-xs text-slate-700 transition-all duration-200 ${isOpen ? "mt-2 max-h-40 opacity-100" : "max-h-0 opacity-0"
                      } overflow-hidden`}
                  >
                    <p>{item.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: Screenshot / dashboard image */}
        <div className="flex justify-center">
          <div className="relative w-full max-w-xl rounded-2xl bg-white p-3 shadow-[0_20px_45px_rgba(0,0,0,0.18)]">
            <img
              src={ctrImage} // yahan apni image ka path lagao
              alt="AP automation dashboard"

              className="h-full w-full rounded-xl object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTRSection;