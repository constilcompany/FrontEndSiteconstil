
import React from "react";
import { Check, X } from "lucide-react";
import { Button } from "../ui/button";
import heroImage from "@/assets/images/banner1.jpg";
import { Link } from "react-router-dom";
import bluebeam from "@/assets/images/bluebeam.png";
import procore from "@/assets/images/procore.png";
import buildertrend from "@/assets/images/buildertrend.png";
import logo from "@/assets/images/logo.png";

const features = [
  {
    name: "AI-Powered Estimate Generation",
    constil: true,
    procore: true,
    buildertrend: false,
    bluebeam: false,
  },
  {
    name: "Invoice Conversion with One Click",
    constil: true,
    procore: false,
    buildertrend: false,
    bluebeam: false,
  },
  {
    name: "Blueprint & Project Tracking",
    constil: true,
    procore: true,
    buildertrend: true,
    bluebeam: false,
  },
  {
    name: "Customizable Proposal Templates",
    constil: true,
    procore: true,
    buildertrend: true,
    bluebeam: false,
  },
  {
    name: "Integrated Cost Database",
    constil: true,
    procore: true,
    buildertrend: false,
    bluebeam: false,
  },
];

const Icon = ({ value }) =>
  value ? (
    <Check className="mx-auto text-green-500" size={22} />
  ) : (
    <X className="mx-auto text-red-500" size={22} />
  );

const Competitive = () => {
  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-8">

        {/* Heading */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
            How CONSTIL Compares to the Competition
          </h2>
          <p className="mt-3 text-slate-600">
            See why CONSTIL is the best choice for estimating and invoicing.
          </p>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr className="text-left">
                <th className="px-6 py-4 font-semibold text-slate-700">
                  Feature
                </th>

                <th className="px-6 py-4 text-center border-l bg-blue-50">
                  <div className="flex flex-col items-center gap-1">
                    <img className="w-24" src={logo} alt="Constil" />
                    <span className="text-xs text-blue-600 font-semibold">
                      Your Tool
                    </span>
                  </div>
                </th>

                <th className="px-6 py-4 text-center border-l">
                  <img className="w-24" src={procore || ''} alt="Procore" />
                </th>

                <th className="px-6 py-4 text-center border-l">
                  <img className="w-24" src={buildertrend || ''} alt="Buildertrend" />
                </th>

                <th className="px-6 py-4 text-center border-l">
                  <img className="w-24" src={bluebeam || ''} alt="Bluebeam" />
                </th>
              </tr>
            </thead>

            <tbody>
              {features.map((row, index) => (
                <tr key={index} className="border-t">
                  <td className="px-6 py-4 text-slate-700">{row.name}</td>

                  <td className="px-6 py-4 text-center border-l bg-blue-50">
                    <Icon value={row.constil} />
                  </td>

                  <td className="px-6 py-4 text-center border-l">
                    <Icon value={row.procore} />
                  </td>

                  <td className="px-6 py-4 text-center border-l">
                    <Icon value={row.buildertrend} />
                  </td>

                  <td className="px-6 py-4 text-center border-l">
                    <Icon value={row.bluebeam} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Bottom CTA */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-blue-600 px-6 py-5 text-white">
            <p className="text-center md:text-left font-medium">
              Switch to CONSTIL and get the edge on your estimates!
            </p>

            <Link to="https://app.constil.com/signup">
              <Button className="bg-white text-blue-600 hover:bg-blue-50">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Competitive;