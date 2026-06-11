import React from "react";

const Faq = () => {
  const faqData = [
    {
      question:
        "1. What is the level of compatibility between construction estimating software and mobile and cloud-based workflow?",
      answer:
        "The majority of construction estimating software is entirely mobile compatible and supports cloud-based technologies to be accessed in real-time. Working teams have the ability to work together, revise estimations, and monitor the progress of projects anywhere, thus project workflow management remains smooth.",
    },
    {
      question:
        "2. Is construction management software scalable between small residential projects and large commercial constructions?",
      answer:
        "Construction management software is indeed developed to scale up and down to any project size. It can fit your workflow and scale (with residential construction estimating software) all the way up to complex commercial projects.",
    },
    {
      question:
        "3. What is the estimated time frame of coming up with an estimate through construction estimating software?",
      answer:
        "Substantial cost estimates can be created in minutes instead of hours using the estimating software in construction. Since AI construction estimates software, analysis of blueprints, and calculation of materials are automated to give quicker results.",
    },
    {
      question:
        "4. What is the accuracy of AI construction estimating software when applied to real-world projects?",
      answer:
        "The software of AI construction estimating is very accurate because it analyzes blueprints and previous project data. It eliminates human error and enhances the accuracy of budgeting, and makes reliable cost projections of real-world construction projects.",
    },
    {
      question:
        "5. Does it have subscription plans to the construction company software?",
      answer:
        "Yes, our construction company software solutions include flexible subscription plans, which have been designed to meet the various business requirements. The choices are usually small business packages containing construction management applications of small business specifications, and enterprise levels.",
    },
  ];

  return (
    <section id="faq" className="bg-white py-16 md:py-24">
      <div className="container mx-auto max-w-7xl px-4 md:px-8">
        <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 md:text-4xl">
          Frequently Asked Questions (FAQ)
        </h2>

        <div className="space-y-4">
          {faqData.map((item, index) => (
            <details
              key={index}
              className="group rounded-lg border border-gray-200 bg-white"
            >
              <summary className="flex cursor-pointer items-center justify-between px-6 py-4 text-left font-medium text-gray-900 hover:bg-gray-50">
                {item.question}
                <svg
                  className="h-5 w-5 text-gray-500 transition-transform group-open:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </summary>
              <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
                <p className="text-sm leading-relaxed text-gray-600">
                  {item.answer}
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;
