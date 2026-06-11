import React, { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import featureImage from "@/assets/images/banner1.jpg";
import featureImage1 from "@/assets/images/strongfinancial.jpg";
import featureImage2 from "@/assets/images/Centralised-Invoice.jpg";
import featureImage3 from "@/assets/images/AI-powered.jpg";
import featureImage4 from "@/assets/images/Constructfinancial.jpg";
export interface TabData {
  label: string;
  heading: string;
  content: React.ReactNode;
  image: string;
}

export interface FeatureSectionProps {
  heading?: string;
  description?: string;
  tabsData?: TabData[];
  image?: string;
}

const defaultTabsData: TabData[] = [
  {
    label: "Maintain the integrity of your invoice process",
    heading: "Redirect resources to what matters most",
    image: featureImage1,
    content: (
      <ul className="space-y-4 text-sm text-slate-800">
        <li>
          <span className="font-semibold">Increase team productivity:</span>{" "}
          Realize 5x more capacity for your AP team.
        </li>
        <li>
          <span className="font-semibold">Scale for growth:</span>{" "}
          Effortlessly manage increasing invoice volumes without additional headcount.
        </li>
      </ul>
    ),
  },
  {
    label: "Improve data accuracy and code your way",
    heading: "Redirect resources to what matters most",
    image: featureImage2,
    content: (
      <ul className="space-y-4 text-sm text-slate-800">
        <li>
          <span className="font-semibold">Increase team productivity:</span>{" "}
          Realize 5x more capacity for your AP team.
        </li>
        <li>
          <span className="font-semibold">Scale for growth:</span>{" "}
          Effortlessly manage increasing invoice volumes without additional headcount.
        </li>
      </ul>
    ),
  },
  {
    label: "Accelerate invoice processing times",
    heading: "Redirect resources to what matters most",
    image: featureImage3,
    content: (
      <ul className="space-y-4 text-sm text-slate-800">
        <li>
          <span className="font-semibold">Increase team productivity:</span>{" "}
          Realize 5x more capacity for your AP team.
        </li>
        <li>
          <span className="font-semibold">Scale for growth:</span>{" "}
          Effortlessly manage increasing invoice volumes without additional headcount.
        </li>
      </ul>
    ),
  },
  {
    label: "Redirect resources to what matters most",
    heading: "Redirect resources to what matters most",
    image: featureImage4,
    content: (
      <ul className="space-y-4 text-sm text-slate-800">
        <li>
          <span className="font-semibold">Increase team productivity:</span>{" "}
          Realize 5x more capacity for your AP team.
        </li>
        <li>
          <span className="font-semibold">Scale for growth:</span>{" "}
          Effortlessly manage increasing invoice volumes without additional headcount.
        </li>
      </ul>
    ),
  },
];

export default function FeatureSetion({
  heading = "Marketplace Strong Functionality within our client management Tool, which serves contractors.",
  image,
  description = "",
  tabsData = defaultTabsData,
}: FeatureSectionProps) {
  const [activeTab, setActiveTab] = useState(0);
  console.log(image, 'dddddddddddddddd');
  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        {/* Heading */}
        <h2 className="mb-8 text-3xl font-bold tracking-tight text-slate-900 md:text-3xl text-center">
          {heading}
        </h2>
        <p className="mb-8 max-w-4xl mx-auto text-sm  tracking-tight text-slate-900 md:text-sm text-center">
          {description}
        </p>

        {/* Tabs row */}
        <div className="mb-10 border-b border-slate-200">
          <div className="flex overflow-auto">
            {tabsData.map((tab, index) => {
              const isActive = activeTab === index;
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveTab(index)}
                  className={`flex-1 border-r border-slate-200 px-6 py-4 text-left text-sm font-medium transition
                    ${isActive
                      ? "border-b-2 border-b-black bg-white text-black"
                      : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                    }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content area */}
        <div className="grid items-start gap-10 md:grid-cols-2">
          {/* LEFT: Image */}
          <div className="overflow-hidden rounded-lg bg-slate-100">
            <img
              src={tabsData[activeTab].image}
              alt={tabsData[activeTab].heading}
              className="h-full max-h-60 w-full object-cover"
            />
          </div>

          {/* RIGHT: Text */}
          <div>
            <h3 className="mb-4 text-2xl font-semibold text-slate-900">
              {tabsData[activeTab].heading}
            </h3>
            {tabsData[activeTab].content}
          </div>
        </div>
      </div>
    </section>
  );
}