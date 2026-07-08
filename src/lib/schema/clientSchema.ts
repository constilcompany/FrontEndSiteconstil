const softwareApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": "https://constil.com/client-management-software#software",
    "name": "Client Management Software",
    "description": "Client management for contractors built to scale your business. Organize clients, manage documents, and improve communication across every project.",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "WebApplication",
    "url": "https://constil.com/client-management-software",
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
    "@id": "https://constil.com/client-management-software#breadcrumb",
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
            "name": "Client Management Software",
            "item": "https://constil.com/client-management-software"
        }
    ]
};

const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {
            "@type": "Question",
            "name": "How does Construction Client Management Software make things easier on the side of the contractors?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "It integrates the information of clients, updates on projects and communication under a single platform. This minimises manual work and maintains teams throughout the course of a lead to project completion."
            }
        },
        {
            "@type": "Question",
            "name": "What are the projects that are best suited to client tracking software?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "The biggest value is realized in residential, commercial and mixed-use construction projects. All projects that have many clients, approvals or phases can be effectively managed and traced."
            }
        },
        {
            "@type": "Question",
            "name": "What is the length of time for implementing a client data management system in a construction firm?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "The process normally requires 26 weeks to implement, based on the size and complexity of the data in the company. Migration and training assistance mean that your staff is prepared to utilise it within a short period."
            }
        },
        {
            "@type": "Question",
            "name": "Is software client management customizable to construction team workflows?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, the majority of platforms permit customisation of tasks, approvals and notifications. You are able to make workflow adjustable according to the processes and projects of your company."
            }
        },
        {
            "@type": "Question",
            "name": "ROI of a contractor client management solution investment?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "The ROI is gained due to the speed of project completion, the moment of lowering the number of errors, and the client retention. Robots/data automation save time and boost the overall profitability."
            }
        }
    ]
};

export { softwareApplicationSchema, breadcrumbSchema, faqSchema };