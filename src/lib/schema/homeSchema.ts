const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Constil",
    "url": "https://constil.com/",
    "description": "Improve efficiency with AI construction estimating software. Generate fast, reliable estimates and optimize project costs.",
    "email": "support@constil.com",
    "telephone": "+1-857-930-1710",
    "address": {
        "@type": "PostalAddress",
        "streetAddress": "9221 Calabria Dr",
        "addressLocality": "Portland",
        "addressRegion": "ME",
        "postalCode": "04101",
        "addressCountry": "US"
    },
    "areaServed": {
        "@type": "Country",
        "name": "United States"
    },
    "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer support",
        "email": "support@constil.com",
        "telephone": "+1-857-930-1710",
        "availableLanguage": "English"
    },
    "sameAs": []
};

const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
        {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://constil.com/"
        }
    ]
};

const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {
            "@type": "Question",
            "name": "What is the level of compatibility between construction estimating software and mobile and cloud-based workflow?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "The majority of construction estimating software is entirely mobile compatible and supports cloud-based technologies to be accessed in real-time. Working teams have the ability to work together, revise estimations, and monitor the progress of projects anywhere, thus project workflow management remains smooth."
            }
        },
        {
            "@type": "Question",
            "name": "Is construction management software scalable between small residential projects and large commercial constructions?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Construction management software is indeed developed to scale up and down to any project size. It can fit your workflow and scale (with residential construction estimating software) all the way up to complex commercial projects."
            }
        },
        {
            "@type": "Question",
            "name": "What is the estimated time frame of coming up with an estimate through construction estimating software?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Substantial cost estimates can be created in minutes instead of hours using the estimating software in construction. Since AI construction estimates software, analysis of blueprints, and calculation of materials are automated to give quicker results."
            }
        },
        {
            "@type": "Question",
            "name": "What is the accuracy of AI construction estimating software when applied to real-world projects?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "The software of AI construction estimating is very accurate because it analyzes blueprints and previous project data. It eliminates human error and enhances the accuracy of budgeting, and makes reliable cost projections of real-world construction projects."
            }
        },
        {
            "@type": "Question",
            "name": "Does it have subscription plans to the construction company software?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, our construction company software solutions include flexible subscription plans, which have been designed to meet the various business requirements. The choices are usually small business packages containing construction management applications of small business specifications, and enterprise levels."
            }
        }
    ]
};
export { organizationSchema, breadcrumbSchema, faqSchema }