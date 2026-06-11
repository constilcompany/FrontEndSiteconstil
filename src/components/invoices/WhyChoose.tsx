import React from "react";

interface Card {
  title: string;
  text: string;
  dark?: boolean;
}

interface WhyChooseProps {
  heading: string;
  description?: string;
  cards: Card[];
}

const WhyChoose: React.FC<WhyChooseProps> = ({ heading, description, cards = [] }) => {
  return (
    <section className="w-full bg-[#E7F0E9] py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        {/* Heading */}
        <div className="mb-10 text-center">
          <h2 className="mb-4 text-3xl font-bold leading-tight text-[#053327] md:text-4xl">
            {heading}
          </h2>
          {description && (
            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-[#335347]">
              {description}
            </p>
          )}
        </div>

        {/* Cards grid */}
        <div className="grid gap-5 md:grid-cols-3">
          {cards.map((card, index) => (
            <div
              key={card.title + index}
              className={`rounded-md p-6 text-sm leading-relaxed shadow-sm ${card.dark
                ? "bg-[#448AFF] text-white"
                : "bg-white text-[#053327]"
                }`}
            >
              <h3
                className={`mb-3 text-lg font-semibold ${card.dark ? "text-white" : "text-[#053327]"
                  }`}
              >
                {card.title}
              </h3>
              <p className={card.dark ? "text-[#E5F4EA]" : "text-[#264538]"}>
                {card.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;