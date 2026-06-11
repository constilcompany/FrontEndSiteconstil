import React from "react";
import { Button } from "../ui/button";
import heroImage from "@/assets/images/banner1.jpg";
import { Link } from "react-router-dom";


interface BannerContentProps {
  bannerContent: {
    heading: string;
    title: string;
    path:string;
    btnText:string;
    image: string;
    description: string;
  };
}

const BannerInvoice: React.FC<BannerContentProps> = ({ bannerContent }) => {
  const { heading, title, image, description,path,btnText } = bannerContent;
  return (
    <section className="relative md:pt-[150px]  flex min-h-[400px] w-full  overflow-hidden py-16 md:min-h-[450px] lg:min-h-[500px]">
      {/* Background Image */}
      <img
        src={image}
        alt="Construction Background"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col  px-4   md:pl-16">
        <h1 className="mb-6 max-w-5xl text-3xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
          {heading}
        </h1>

        <p className="mb-10 md:max-w-3xl text-sm leading-relaxed text-white/90 md:text-lg ">
          {title}
        </p>

        <p className="mb-10 md:max-w-3xl text-sm leading-relaxed text-white/90 md:text-lg ">
          {description}
        </p>
        <Link to={path}>
          <Button
            className="rounded-lg bg-[#448AFF] px-8 py-6 text-base font-semibold text-white transition-colors hover:bg-blue-600"
          >
         {btnText}
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default BannerInvoice;
