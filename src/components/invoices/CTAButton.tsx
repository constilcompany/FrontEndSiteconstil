import React from "react";
import { Button } from "../ui/button";

const CTAButton = () => {
  return (
    <section className="w-full  bg-black py-16 md:py-20">
      <div className="mx-auto max-w-4xl px-4 text-center text-white">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-emerald-200/80">
          Ready for the next step?
        </p>

        <h2 className="mb-4 text-3xl font-extrabold leading-tight md:text-4xl lg:text-[40px]">
          Make your AP error-free with AI invoice
          <br className="hidden sm:block" />
          management software
        </h2>

        <p className="mx-auto mb-8 max-w-2xl text-sm md:text-base text-emerald-100/80">
          Turn your AP process into a touchless workflow with AI-powered
          automation that delivers speed, accuracy, and complete control.
        </p>

        <Button
          size="lg"
          className="bg-[#448AFF] text-base font-medium hover:bg-blue-700"
        >
          Book a demo
        </Button>
      </div>
    </section>
  );
};

export default CTAButton;