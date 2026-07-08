// Schema Definitions
const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": "https://constil.com/invoices-management-software#software",
    "name": "AI Invoice Management Software",
    "description": "AI Invoice Management Software simplifies invoice handling by reducing errors, increasing processing speed, and improving overall financial efficiency.",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "WebApplication",
    "url": "https://constil.com/invoices-management-software",
    "creator": {
        "@type": "Organization",
        "name": "Constil",
        "url": "https://constil.com/",
        "email": "support@constil.com"
    },
    "areaServed": {
        "@type": "Country",
        "name": "United States"
    }
};

const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": "https://constil.com/invoices-management-software#breadcrumb",
    "itemListElement": [
        {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://constil.com/"
        },
        {
            "@type": "ListItem",
            "position": 2,
            "name": "Invoice Management Software",
            "item": "https://constil.com/invoices-management-software"
        }
    ]
};

const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {
            "@type": "Question",
            "name": "What is the AI invoice management software and how it works?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "The software of ai invoice management automatically extracts invoice information, sorts invoices of suppliers, and directs them through defined approval processes. It assists businesses in tracking invoices, handling of payments and keeping proper financial documents."
            }
        },
        {
            "@type": "Question",
            "name": "What are the benefits of invoice management automation on financial processes?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Invoicing management automation eliminates manual entry and invoice approval time delays. The system intercepts the contents of invoices automatically and directs invoices through established approval procedures."
            }
        },
        {
            "@type": "Question",
            "name": "Is this software capable of assisting construction firms in managing supplier invoices?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, construction invoice management software is a software tailor-made to handle contractor invoices, supplier invoices and invoices related to a project all in one organised system."
            }
        },
        {
            "@type": "Question",
            "name": "What do the best invoice tracking software have to offer to businesses?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "An optimal invoice tracking system is one which must offer automatic invoice capture, approval procedures, real-time tracking, reporting features and access to accounting systems."
            }
        },
        {
            "@type": "Question",
            "name": "Does invoice automation fit well in expanding businesses?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, invoice automation software is the best solution to assist growing companies with the growing invoice volumes and to ensure the correct financial records and properly structured working processes"
            }
        }
    ]
};

export { softwareSchema, breadcrumbSchema, faqSchema };
