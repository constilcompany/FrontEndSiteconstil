import React from 'react'

export interface BenefitCard {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export interface BenefitsProps {
  heading?: string;
  description?: string;
  cards?: BenefitCard[];
}

const defaultCards: BenefitCard[] = [
  {
    title: "Invoice Management",
    description: "Easily create, send, and track professional invoices in real time—fast, simple, and powered by AI, with automatic invoice creation included.",
    icon: (
      <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  },
  {
    title: "Estimates & Quotes",
    description: "Generate detailed estimates in a few clicks, turn them into invoices once approved, and track your project blueprints with our AI tools—making every proposal more professional and complete.",
    icon: (
      <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    title: "Client Management",
    description: "Save and manage all your client information in one central place. Access contact details, view past invoices and estimates, and streamline communication.",
    icon: (
      <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  },
  {
    title: "Payment Tracking",
    description: "Monitor all incoming and outgoing payments with ease. Get notified about unpaid invoices and maintain a healthy cash flow year money.",
    icon: (
      <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    )
  }
];

const Benefits = ({
  heading = "What We Offer to Power Your Business",
  description = "Our invoicing platform comes packed with essential tools to help you save time, stay organized, and get paid faster.",
  cards = defaultCards
}: BenefitsProps) => {
  return (
    <div className="relative z-10 container mx-auto px-4 md:px-8 md:mt-16">
      <div className="rounded-xl bg-white/90 backdrop-blur-sm p-6 md:p-10 shadow-xl">

        {/* Section Header */}
        {(heading || description) && (
          <div className="mb-12 text-center">
            {heading && (
              <h3 className="mb-2 text-2xl font-bold text-gray-900 md:text-3xl">
                {heading}
              </h3>
            )}
            {description && (
              <p className="mx-auto max-w-2xl text-sm text-gray-600">
                {description}
              </p>
            )}
          </div>
        )}
        {/* Service Cards */}{" "}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {cards.map((card, index) => (
            <div key={index} className="rounded-lg border border-gray-200 bg-white p-6 text-center transition-shadow hover:shadow-lg">
              {card.icon && (
                <div className="mb-4 flex justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                    {card.icon}
                  </div>
                </div>
              )}
              <h4 className="mb-3 text-lg font-semibold text-gray-900">
                {card.title}
              </h4>
              <p className="text-sm leading-relaxed text-gray-600">
                {card.description}
              </p>
            </div>
          ))}
        </div>{" "}
      </div>{" "}
    </div>)
}

export default Benefits
