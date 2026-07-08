const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": "https://constil.com/estimates-software#software",
    "name": "Construction Estimating Software",
    "description": "Make confident project decisions with construction estimating software that provides clear cost insights and accurate forecasts.",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "WebApplication",
    "url": "https://constil.com/estimates-software",
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
    "@id": "https://constil.com/estimates-software#breadcrumb",
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
            "name": "Construction Estimating Software",
            "item": "https://constil.com/estimates-software"
        }
    ]
};

const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {
            "@type": "Question",
            "name": "What is construction estimating software and what is its operation?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "The estimating software assists the contractors in estimating the costs of the project by grouping materials, labour, equipment, and subcontractor costs within a single software. It will create structured estimates and cost breakdowns automatically to make certain project budgeting."
            }
        },
        {
            "@type": "Question",
            "name": "How precise are estimates made by current estimation software on construction?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "The computerised estimation tools that are applicable in the construction industry enhance precision due to the use of systematised cost data, automated analysis, and real-time pricing. This minimises human errors and assists the contractors in preparing sound project budgets."
            }
        },
        {
            "@type": "Question",
            "name": "How does AI construction estimating software make the estimation process better?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "AI construction estimating software is a software used to analyse historical project data and cost trends in order to come up with smarter estimations. It assists the contractors in determining how costly the contract could be and bid more competitively."
            }
        },
        {
            "@type": "Question",
            "name": "Does this software come easily to learn and use?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "The majority of estimating software platforms are being developed with easy-to-use dashboards and pre-defined templates. The system can be learnt quickly and the contractors and estimators are able to begin preparing estimates efficiently."
            }
        },
        {
            "@type": "Question",
            "name": "What determines the cost of the construction cost estimating software?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "The construction cost estimating software cost varies according to features, number of users, integrations and projects. Such features as automation, reporting, and AI tools can also influence the price."
            }
        }
    ]
};

export {
    softwareSchema,
    breadcrumbSchema,
    faqSchema
}
