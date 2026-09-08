import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { Quote } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";

interface TestimonialCard {
  id: number;
  name: string;
  company: string;
  image: string;
  quote: string;
  location: string;
}

interface TestimonialsProps {
  heading: string;
  description: string;
  testimonialCards: TestimonialCard[];
}

const Testimonials = ({
  heading,
  description,
  testimonialCards,
}: TestimonialsProps) => {
  const getInitials = (name: string) =>
    name
      .split(" ")
      .filter(Boolean)
      .map((s) => s[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  return (
    <section className="bg-gradient-to-b from-white to-gray-50 py-16 md:py-24">
      <div className="container mx-auto md:px-10 px-4">

        <div className="mb-12 text-center max-w-3xl mx-auto">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold tracking-wider uppercase mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl mb-3">
            {heading}
          </h2>
          <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>

        <Swiper
          modules={[Autoplay]}
          spaceBetween={28}
          loop
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          breakpoints={{
            0: { slidesPerView: 1 },
            640: { slidesPerView: 1.2 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {testimonialCards.map((testimonial) => (
            <SwiperSlide key={testimonial.id} className="flex">
              <div className="flex h-full w-full flex-col rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/60 hover:-translate-y-1">
                <Quote className="w-6 h-6 text-primary/30 mb-3 rotate-180" />

                <p className="grow text-sm leading-relaxed text-gray-600 mb-6">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>

                <div className="flex items-center gap-3 border-t border-gray-100 pt-5">
                  <div className="flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-hover text-white w-11 h-11 text-sm font-bold shrink-0">
                    {getInitials(testimonial.name)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {testimonial.name}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">
                      {testimonial.company}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {testimonial.location}
                </div>

              </div>
            </SwiperSlide>
          ))}
        </Swiper>

      </div>
    </section>
  );
};

export default Testimonials;