import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

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
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-8">

        <div className="mb-12 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl mb-2">
            {heading}
          </h2>
          <p className="text-sm text-gray-600">{description}</p>
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
              <div className="flex h-80 w-full flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

                <div className="mb-4 flex items-center gap-3">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="rounded-full w-10 h-10 object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {testimonial.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {testimonial.company}
                    </p>
                  </div>
                </div>

                <p className="grow text-sm leading-relaxed text-gray-600">
                  {testimonial.quote}
                </p>

                <div className="mt-6 flex items-center gap-2 text-sm text-gray-500">
                  <span className="text-orange-500">●</span>
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