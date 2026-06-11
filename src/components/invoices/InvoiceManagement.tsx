
import React, { useState } from "react";
import officeImg from "@/assets/images/reliedonby.jpg";
import { Link } from "react-router-dom";

const benefitItems = [







  {
    title: "Record all contacts with clients.",
    description:
      "Automatically compare invoices, delivery notes and credit notes to flag missing lines, duplicate invoices, and abnormal price or quantity changes.",
  },
  {
    title: " Improve response time.",
    description:
      "Catch overbilling before payment is made and get instant alerts when amounts exceed agreed contracts or purchase orders.",
  },
  {
    title: "Increase repeat business.",
    description:
      "Replace manual spreadsheet checks with automated, AI-powered controls that run continuously in the background.",
  },
  {
    title: " Ensure total transparency in projects.",
    description:
      "Replace manual spreadsheet checks with automated, AI-powered controls that run continuously in the background.",
  },
];

const InvoiceManagement = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleItem = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="container mx-auto grid max-w-6xl items-center gap-10 px-4 md:grid-cols-2 md:px-8">
        <div>
          <h2 className="mb-4 text-3xl font-bold leading-tight text-slate-900 md:text-3xl">
            Relied on by Construction Teams Who treasure Client Clarity

          </h2>

          <p className="mb-3 text-[15px] text-slate-600">
            <Link to="/"> CONSITL </Link> has been trusted with construction businesses since it is created in their reality.
            Independent contractors to growing construction companies, the teams will use our client tracking software to
          </p>



          <div className="space-y-3">
            {benefitItems.map((item, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 transition hover:border-blue-500"
                >
                  <button
                    type="button"
                    // onClick={() => toggleItem(index)}
                    className="flex w-full items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 text-left">
                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-full bg-blue-500 text-xs text-white transition-transform ${isOpen ? "rotate-90" : ""
                          }`}
                      >
                        ▶
                      </span>
                      <span className="text-sm font-medium text-slate-800">
                        {item.title}
                      </span>
                    </div>

                    {/* <span className="text-xs text-slate-400">
                      {isOpen ? "Hide" : "Show"}
                    </span> */}
                  </button>

                  {/* <div
                    className={`mt-2 overflow-hidden text-sm text-slate-600 transition-all duration-200 ${isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                      }`}
                  >
                    <p className="pt-1">{item.description}</p>
                  </div> */}
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-[15px] text-slate-600">
            CONSITL assists in transforming reactive communication into proactive engagement with the clients.
          </p>
        </div>
        {/* LEFT */}
        <div className="flex justify-center">
          <img
            src={officeImg}
            alt="Construction professionals reviewing blueprints using AI estimation software"
            className="h-auto w-full rounded-lg shadow-lg"
            loading="lazy"
            decoding="async"
          />
        </div>

        {/* RIGHT */}

      </div>
    </section>
  );
};

export default InvoiceManagement;