import { Link } from "react-router-dom"
import { CheckCircle } from "lucide-react";

interface InvoiceAboutProps {
  InvoiceAboutContent: {
    heading: string;
    image: string;
    btnText:string;
    path:string;
    details: {
      title: string | React.ReactNode;
    }[];
    reverse?: boolean;
  };
}

const InvoiceAbout: React.FC<InvoiceAboutProps> = ({ InvoiceAboutContent }) => {
  const { heading, image, reverse, details,btnText,path } = InvoiceAboutContent;

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="bg-white py-16 md:py-24"
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">

          {/* Image Container */}
          <div className={`${reverse ? "md:order-2" : "md:order-1"} order-2`}>
            <img
              src={image}
              alt="Professional content"
              className="h-auto w-full rounded-lg shadow-lg"
              loading="lazy"
              decoding="async"
            />
          </div>

          {/* Content Container */}
          <div className={`${reverse ? "md:order-1" : "md:order-2"} order-1`}>
            <h2
              id="about-heading"
              className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl"
            >
              {heading}
            </h2>

            {details?.map((detail, index) => (
              <p key={index} className="mb-4 text-base leading-relaxed text-gray-600">
                {detail?.title}
              </p>
            ))}

            <Link to={path}>
              <span className="inline-flex items-center rounded-md bg-[#448AFF] px-6 py-3 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
               {btnText}
              </span>
            </Link>
          </div>

        </div>
      </div>
    </section>
  )
}

export default InvoiceAbout