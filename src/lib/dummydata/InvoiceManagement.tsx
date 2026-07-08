import banner1 from "@/assets/images/banner1.jpg";
import banner3 from "@/assets/images/banner3.jpg";
import ai from "@/assets/images/ai.jpg";
import strongfinancial from "@/assets/images/strongfinancial.jpg";
import featureImage1 from "@/assets/images/strongfinancial.jpg";
import featureImage2 from "@/assets/images/Centralised-Invoice.jpg";
import featureImage3 from "@/assets/images/AI-powered.jpg";
import featureImage4 from "@/assets/images/Constructfinancial.jpg";
import brandImage from "@/assets/images/powerfulfunctionality.jpg";

import constructionclient from "@/assets/images/construction-client.jpg";
import clientmanagement from "@/assets/images/intelligentestimating.jpg";
import smartclient from "@/assets/images/smart-client.jpg";
import { Link } from "react-router-dom";

const bannerContent = {
    heading: "AI Invoice Management Software is the best way to manage Construction Finances",
    title: "The construction businesses can use the aid of AI invoice management software to manage invoices, keep track of payments and see the clear financial streams within one unified system. Supplier invoices, approvals and records can be handled by the contractors, finance teams and project managers without the need of using disconnected spreadsheets or manual tracking systems",
    image: ai,
    description: "Through smart invoice management automation, organizations are able to digitize their invoice capture, automate invoice approval and track their financial records in real time. The system is beneficial in the management of money used in construction activities, whether it is paying suppliers or project costs, the system enhances accuracy, visibility, and efficiency in financial management.",
    path: 'https://app.constil.com/signup',
    btnText: "Get Started Now"
}

const InvoiceAboutContent = {
    heading: "The Smartest Solution to New-Age Invoice Processing",
    image: constructionclient,
    btnText: "See How It Works",
    path: 'https://app.constil.com/signup',
    details: [
        {
            title: "The use of manual methods of project invoices tends to cause delays, lost records, and delays in the approval processes. The construction teams are used to working with invoices in emails, spreadsheets, and documents and this makes it hard to track money. Regardless of the lack of organized invoice management solutions, the businesses might not be able to track their records or payment schedules.",

        },
        {
            title: "Complex software for invoice processing will centralise the invoice data, supplier information and approvals in one platform. With interlinked invoice processing systems, finance departments are able to group invoices, monitor approval processes, and have financial visibility across the project life cycle.",

        },


    ],
    reverse: true
}


const SmartClientManagement = {
    heading: "Intelligent Construction Invoice Processing Software",
    image: clientmanagement,
    details: [
        {
            title: <h2 className="mb-4 text-base leading-relaxed text-gray-600">The way the <Link to="/">construction companies </Link> handle the financial documentation has changed with modern generative ai invoice management software. The AI technology has replaced manual entries of invoice data by automatically capturing invoice specifications, sorting costs, and sending invoices through formal approvals.</h2>

        },
        {
            title: <h2 className="mb-4 text-base leading-relaxed text-gray-600">Through an AI invoice management tool, contractors can use the software to track supplier bills, identify anomalies, and keep well-structured <Link to="/payment-tracking-software">records of payments</Link> by using artificial intelligence to manage invoices. This smart system enhances financial visibility and ease in the way project invoices are processed throughout the organisation.</h2>

        },
    ],
    path: '/contact',
    btnText: "Get Started Now",
    reverse: false
}

const tryItContent = {
    heading: "Automate the Process of Invoice Tracking",
    title: "Construction companies deal with hundreds of invoices from vendors, subcontractors, and suppliers and thus the manual process of tracking is slow and inefficient. Best invoice automation software assists the employees in automating the process of capturing invoices, structuring approvals, and financial operations at a single platform. Automate the invoice management and have a straightforward financial management of your projects.",
    description: "",
    buttonText: "Start Free Trial",
    path: "https://app.constil.com/signup"
};

const featureSectionData = {
    heading: "Strong Financial Management within our Intelligent Invoice Management System",
    image: strongfinancial,
    description: <p>We offer organised structures that assist <Link to="/">construction firms</Link> in the management of invoices, automate approvals and financial transparency during the project lifecycle.</p>,
    tabsData: [
        {
            label: "Automated Invoice Capture and processing",
            heading: "Automated Invoice Capture and processing",
            image: featureImage1,
            content: (
                <p className="text-sm text-slate-800">
                    With the help of the sophisticated software of the invoice processing, invoices are automatically captured using the documents and emails. This removes the need of manual entry of data and enables finance teams to have supplier invoices arranged within a single platform.
                </p>
            )
        },
        {
            label: "Centralised Invoice Tracking and Organisation",
            heading: "Centralised Invoice Tracking and Organisation",
            image: featureImage2,

            content: (
                <p className="text-sm text-slate-800">
                    Having an invoice tracker software built in, companies will be able to control invoices, track their payment status, and keep a clear track of the suppliers' transactions. This enhances the financial transparency and maintains all invoice records in order.
                </p>
            )
        },
        {
            label: "AI-Powered Invoice Analysis",
            heading: "AI-Powered Invoice Analysis",
            image: featureImage3,
            content: (
                <p className="text-sm text-slate-800">
                    Sophisticated generative invoice management software examines invoice information and determines anomalies or information gaps. This smart system assists in funding teams to identify any possible mistakes at an early stage and have trustworthy financial records.
                </p>
            )
        },
        {
            label: "Construct Financial Workflow Designer",
            heading: "Construct Financial Workflow Designer",
            image: featureImage4,
            content: (
                <p className="text-sm text-slate-800">
                    We provide invoice management software for construction industry that facilitates contractor billing, supplier invoice approvals, and the tracking of project expenses. This makes the financial workflows organized in residential and commercial projects.
                </p>
            )
        }
    ]
};

const howWorkSectionData = {
    heading: "The AI Invoice Management Software Simplified Workflow",
    subHeading: "",
    stepsData: [
        {
            id: 1,
            title: "Capture and Upload Invoices",
            text: [
                "To start with, invoices of suppliers are submitted to the online invoice tracker by email, documents, or integrations. The complete information of invoices is digitised and stored on a single, organised platform."
            ]
        },
        {
            id: 2,
            title: "Automated Invoice Data Processing",
            text: [
                "The software for invoice processing also extracts invoice information automatically in the system. The names of suppliers, the invoice numbers, and the amounts are keyed in without typing."
            ]
        },
        {
            id: 3,
            title: "Review and Approve Invoices",
            text: [
                "In the invoice management automation process, invoices are reviewed by the finance teams. The approvals are given to the respective managers and proper validation made prior to payment being processed."
            ]
        },
        {
            id: 4,
            title: "Track and Manage Payments",
            text: [
                "Through smart invoice tracker software, the teams will be able to track the invoice approval status, payment due dates, and supplier transactions in real-time with full financial transparency."
            ]
        }
    ]
};

const benefitsSectionData = {
    heading: "The Benefits of this Invoice Management Software",
    description: "",
    cards: [
        {
            title: "Enhanced Financing accuracy and control of invoices",
            description: "Paper-based invoice filling is prone to error and financial discrepancy. Under organized invoice handling programs, business organizations keep proper records and enhance their control of the payment to suppliers.",
            icon: (
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            )
        },
        {
            title: "Quickened Invoice Processing and Approvals",
            description: "Teams are able to automate invoice capture and approval processes using intelligent invoice processing platforms. This saves a lot of time taken to process invoices and enhances efficiency in operation.",
            icon: (
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            )
        },
        {
            title: "More Financial Transparency over Construction Projects",
            description: <p>Contractors traced with the help of special construction invoice management software, obtain clear information about the expenses of the supplier and the <Link to="/payment-tracking-software">state of payment.</Link> This enables the construction companies to have organised financial planning in the projects.</p>,
            icon: (
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
            )
        }
    ]
};

const tryItContentCenter = {
    heading: "Automate Invoices and Enhance Financial Transparency",
    title: "Paper-based invoice management may slow down the business and cause more errors in payroll. Our ai invoice management software will help the contractors to sort out invoices, automate the approvals and keep financial transparency of projects.",
    description: <p>Enhance your finance team in monitoring invoices of suppliers and payment automation with smart invoice management software designed to suit <Link to="/">construction in modern business.</Link></p>,
    buttonText: "Join Now",
    path: "https://app.constil.com/signup"

};

const integrationsSectionData = {
    image: brandImage,
    heading: "Powerful Interactions in a Linked Financial Ecosystem",
    points: [
        "The systems that are needed to operate in modern construction finance are several. Our invoice management software for construction is compatible with accounting software, document management software, and project management software.",
        "With the high-level integrations to the most popular invoice processing systems, invoice information moves between monetary systems. This will remove any redundancy in data entry, enhance financial precision and to some extent, the invoice authorization and payment registers will be in tandem with the entire organization."
    ]
};


const WhyChooseData = {
    heading: "Why choose our AI Invoice Management Software for your Financial Operations",
    description: "",
    cards: [
        {
            title: "Constructed for Financial Workflow Construction",
            text: <p>Specialised construction invoice management software that is based on the invoicing of contractors, suppliers, <Link to="/payment-tracking-software">payment, and project expenses.</Link></p>,
            dark: true
        },
        {
            title: "Automated Financial Processes",
            text: "With the best invoice automation software, the efficiency of workflow and manual handling of invoices can be minimized by construction teams.",
            dark: false
        },
        {
            title: "Centralised Invoice Visibility",
            text: "The embedded online invoice tracker system enables finance departments to keep track of every invoice and approval on a single network",
            dark: true
        }

        ,
        {
            title: "Proper Data Processing of Invoices",
            text: "Advanced software for invoice processing ensures invoice information is captured correctly and organised within correct format and structures the invoice information in structured workflows.",
            dark: false
        }

        ,
        {
            title: "Better Team Cooperation",
            text: "Shared invoice management solutions can be used by project managers, finance teams and administrators to work together in ensuring that there is financial transparency.",
            dark: true
        },
        {
            title: "Growing Construction Companies",
            text: "The construction businesses can maintain the growing amounts of invoices as the projects grow with the help of flexible invoice tracker software.",
            dark: false
        }
    ]
}






const SmartSystemtContent = {
    heading: "Smart Construction Business Invoice Management",
    image: smartclient,
    details: [
        {
            title: "Construction companies conduct intricate financial systems with suppliers, subcontractors and project crews. Our ai invoice management software streamlines the invoice tracking, approval processes, and monitoring the payment in a single, well-organised system.",

        },
        {
            title: "Through the adoption of an automated system, you can replace manual spreadsheets, contractors enjoy a better understanding of the financial situation of a project and better control over project costs.",

        },


    ],
    btnText: "Request Demo",
    path: '/contact'
}

const tryItContentBottom = {
    heading: "Control Construction Invoices more Confidently",
    title: "Every construction business needs transparency of finance. Building invoice management software enables teams to manage the supplier invoices, approvals and ensure good financial records.",
    description: "Give your finance department solid invoice management automation, enhancing efficiency and minimizing operational complexity.",
    buttonText: "Start Free Trial",
    path: 'https://app.constil.com/signup'
};


const testimonialsData = {
    heading: "Read Why Trust This Invoice Management Platform by Contractors",
    description:
        'false',
    testimonialCards: [
        {
            id: 1,
            name: "Matt",
            company: "Residential Contractor",
            image: banner1,
            quote: "Supplier invoices' invoice management was taking time, hours per week. With the ai invoice management software, the finance department will be able to track invoices and approvals under a single system.",
            location: "Brownsburg, IN",
        },
        {
            id: 2,
            name: "Scott",
            company: " Commercial Construction Firm",
            image: banner3,
            quote: "The construction invoice management software assisted us in the organisation of our project expenses and enhanced the invoice tracking of various vendors. It organized our payment process much better.",
            location: "Omaha, NE",
        },
        {
            id: 3,
            name: "haryy",
            company: "General Contractor",
            image: banner1,
            quote: "Before the adoption of this platform, invoice tracking was distributed in emails and spreadsheets. All invoices are now stored in the invoice tracker software that is easy to review and organise",
            location: "Omaha, NE",
        },
    ],
};


const faqs = [
    { q: "What is the AI invoice management software and how it works?", a: "The software of ai invoice management automatically extracts invoice information, sorts invoices of suppliers, and directs them through defined approval processes. It assists businesses in tracking invoices, handling of payments and keeping proper financial documents." },
    { q: "What are the benefits of invoice management automation on financial processes?", a: "Invoicing management automation eliminates manual entry and invoice approval time delays. The system intercepts the contents of invoices automatically and directs invoices through established approval procedures." },
    { q: "Is this software capable of assisting construction firms in managing supplier invoices?", a: "Yes, construction invoice management software is a software tailor-made to handle contractor invoices, supplier invoices and invoices related to a project all in one organised system." },
    { q: "What do the best invoice tracking software have to offer to businesses?", a: "An optimal invoice tracking system is one which must offer automatic invoice capture, approval procedures, real-time tracking, reporting features and access to accounting systems." },


    { q: "Does invoice automation fit well in expanding businesses?", a: "Yes, invoice automation software is the best solution to assist growing companies with the growing invoice volumes and to ensure the correct financial records and properly structured working processes." },




];





export {
    bannerContent,
    InvoiceAboutContent,
    SmartClientManagement,
    tryItContent,
    featureSectionData,
    howWorkSectionData,
    benefitsSectionData,
    tryItContentCenter,
    integrationsSectionData,
    WhyChooseData,
    tryItContentBottom,
    SmartSystemtContent,
    testimonialsData,
    faqs,
};