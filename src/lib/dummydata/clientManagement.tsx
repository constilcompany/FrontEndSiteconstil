import banner1 from "@/assets/images/banner1.jpg";
import banner3 from "@/assets/images/banner3.jpg";
import future from "@/assets/images/future.jpg";
import featureImage from "@/assets/images/banner1.jpg";
import brandImage from "@/assets/images/Strong-Integrations-to-a-smarter.jpg";

import featureImage1 from "@/assets/images/strongfinancial.jpg";
import featureImage2 from "@/assets/images/Track-Every-Interaction.jpeg";
import featureImage3 from "@/assets/images/Make-Use-of-Resources.jpg";
import featureImage4 from "@/assets/images/Constructfinancial.jpg";


import constructionclient from "@/assets/images/managementdifficult.jpg";
import clientmanagement from "@/assets/images/smarterclient.jpg";
import smartclient from "@/assets/images/havesmartersystem.jpg";
import { Link } from "react-router-dom";

const bannerContent = {
    heading: "The Future of Client Management for Contractors Starts Here",
    title: "Constil offers a powerful Construction Client Management Software that targets builders, contractors, and real estate professionals. Manage all relationships, documentation, and interaction, simplify communication and ensure your entire client pipeline is organised with one intelligent system, which is easy to use since it starts with the first inquiry to final project completion.",
    image: future,
    btnText: "Get Started Now",
    path: "https://app.constil.com/signup",
    description: "Constructing businesses requires more than spreadsheets. Client Management for Contractors enables your business to handle clients more effectively, confuse operations less, and create a solid base out of scalable construction operations.",
}

const InvoiceAboutContent = {
    heading: "The reason why construction client management is more difficult than ever",
    image: constructionclient,
    path: "/contact",
    btnText: "Let’s Talk",
    details: [
        {
            title: "Construction businesses are not only the managers of the projects. They control individuals, anticipations, schedules, grants, adjustments and remittances. All client outreach has an impact on reputation and long-term growth.",

        },
        {
            title: "In the absence of an appropriate client management system software, contractors find it difficult to handle lost conversations, fragmented records and follow ups. Teams fail to update and to obtain significant opportunities.",

        },
        {
            title: "Constil is a single, strong software client management solution designed specifically to assist any contractor in keeping their teams organized and entirely controlling all their relationships with clients.",

        },


    ]
}


const SmartClientManagement = {
    heading: "A Smarter Client Management Strategy",
    image: clientmanagement,
    details: [
        {
            title: "Constil relates the activities of the projects and a powerhouse client management Tool tailored to contractors. Having a built-in client data management system, your team operates on a single platform that allows them to see all projects, have a structured document control, smart notifications, log of all activities and performance analytics, and have everything you need to manage clients in a clear and confident way.",

        },


    ],
    btnText: "Get Your Quote",
    path: "/contact",
}

const tryItContent = {
    heading: "Need to Simplify Your Client Operations with a Strong Client Management Platform?",
    title: "Get complete control of your pipeline with organised client management solutions that have been developed to grow the construction business. Keep all your leads in order, and remain in touch and control the entire process of your client journey",
    description: "",
    buttonText: "Start Free Trial",
    path: "https://app.constil.com/signup"
};

const featureSectionData = {
    heading: "Marketplace Strong Functionality within our client management Tool",
    image: featureImage,
    tabsData: [
        {
            label: "Organise and amplify your entire customer base",
            heading: "Organise and amplify your entire customer base",
            image: featureImage,
            content: (
                <p className="text-sm text-slate-800">
                    Efficiently organise all client information using robust client database management software suited to construction processes. Create infinite profiles, store significant documents and have a well-organised system that can be easily accessed by your team. Centralising all information of clients allows the contractors to see the whole picture, eliminate confusion and make all communication, project progress, and records safe and properly arranged.
                </p>
            )
        },
        {
            label: "Track Every Interaction with Precision",
            heading: "Track Every Interaction with Precision",
            image: featureImage2,
            content: (
                <p className="text-sm text-slate-800">
                    Keep up with all discussions and achievements with smart client tracking software. Real-time track approvals, project updates and client communications and automated follow-ups minimise missed tasks. This makes your pipeline blood and your team responsible. Under a stable system, all the interactions are documented and tracked, and the contractors are in full control of their clients.
                </p>
            )
        },
        {
            label: "Make Use of Resources without Fear",
            heading: "Make Use of Resources without Fear",
            image: featureImage3,
            content: (
                <p className="text-sm text-slate-800">
                    Organise your team efficiently with the client resource management software. Allot project managers, keep track of duties, and harmonise internal processes in order to enhance efficiency. Leading to project handover increases automation, which removes errors, improves communication and customer services. Contractors are able to manage resources with a lot of confidence since they are aware that the tasks are tracked, and the performance is visible and teams are aligned throughout all the stages of the construction process.
                </p>
            )
        },
        {
            label: "Comfortably Deal with Real Estate and Construction Customers",
            heading: "Comfortably Deal with Real Estate and Construction Customers",
            image: featureImage4,
            content: (
                <p className="text-sm text-slate-800">
                    Organise customers, sellers, and investors with ease through client management software for real estate. Automate workflows, client profile organisation, and add scaling to your system as your project and client base increase. CONSITL is adjusted to residential and commercial needs and may help a contractor to establish a proper communication structure, monitor the progress, and enhance the overall client satisfaction, preserving data and making operations effective.
                </p>
            )
        }
    ]
};

const howWorkSectionData = {
    heading: "How Our Client Management Platform Manages Your Clients",
    subHeading: "",
    stepsData: [
        {
            id: 1,
            title: "Capture and Centralise",
            text: [
                "Store all new enquiries, lead and customer information right within your client management software. Calls, emails or website forms, all information is stored immediately in one secure place and day one has not been plagued by the spreadsheets and tools not connected to each other."
            ]
        },
        {
            id: 2,
            title: "Organise and Structure",
            text: [
                <p>Automatically organise client profiles in your management software with predefined fields based on construction workflow. Contracts, documents,<Link to={'/estimates_software'}>estimates</Link> and history of communication are sorted appropriately and hence, retrieval is quick, precise and available to authorized team members.</p>
            ]
        },
        {
            id: 3,
            title: "Track and Monitor",
            text: [
                "Intelligent client records management software is used to track conversations, project updates, approvals and follow-ups in real time. All communications are recorded within your client data management platform so that there is no lost communication and no hiddenness between departments."
            ]
        },
        {
            id: 4,
            title: "Manage and Deliver",
            text: [
                "Efficiently coordinate teams with an in-built client resource management software application to assign responsibilities and organise schedules. Our Client Management Software enables you to have a structured workflow that takes your team onboarding to final delivery in a clear and controlled way."
            ]
        }
    ]
};

const benefitsSectionData = {
    heading: "Business Benefits of Using Client Management Software",
    description: "",
    cards: [
        {
            title: "Better Networking and Better Communication",
            description: "Create sustainable business relationships with client management solutions that group all conversations and updates. As the contractors can better recognise themselves and establish tidy workflows, they will react more quickly to contracting, preventing misunderstandings and confusion during the whole cycle of work with the clients.",
            icon: (
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            )
        },
        {
            title: "Less Mismanagement and More Control",
            description: "Hand tracking usually causes omission of details and economic errors. Reduce errors as data is arranged within a trusted client management platform, providing accurate records, clear data documentation, and improved management across projects to your team.",
            icon: (
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            )
        },
        {
            title: "Smart Retention and Growth",
            description: "When the clients feel transparency and efficiency, they come back to undertake future projects. Using smart Client Management for Contractors enables businesses to enhance retention rates, streamline operations and establish the foundation that would be used to impact the long term growth and operational visibility.",
            icon: (
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
            )
        }
    ]
};

const tryItContentCenter = {
    heading: "Ready to Upgrade to a Powerful Client Management for Contractors System?",
    title: "Construction companies in the modern world require more than excel spreadsheet and remote communication. Elevate the way you manage your clients by organising, tracking and managing all client relationships in a structure that is geared towards growth, visibility and long term success.",
    description: "",
    buttonText: "Start Free Trial",
    path: "https://app.constil.com/signup",
};

const integrationsSectionData = {
    heading: "Strong Integrations to a smarter construction Ecosystem",
    image: brandImage,
    points: [
        <p>Connect the <Link to="/invoices_management">accounting software</Link>, email platforms, project management software, cloud storage systems and payment gateways with seamless integrations and a push of a button, you can expand and automate your workflows.</p>,
        "Your Construction Client Management Software is made to be the core of the operation and synchronise data between the systems and make sure that your team operates within a single, connected, and smart ecosystem designed to operate construction businesses."
    ]
};


const WhyChooseData = {
    heading: "Why Construction Businesses Choose Us for Client Management for Contractors",
    description: "We integrate construction-specific automation and structured systems in order to streamline client operations, enhance visibility and build stronger long term relationships in all phases of your projects.",
    cards: [
        {
            title: "Constructed to meet the Construction Industry",
            text: "Our Construction Client Manager Software is built upon reversed contractor processes, project cycles and documentation requirements, rather than standard sales pipelines, which do not conform to construction operations.",
            dark: true
        },
        {
            title: "Zero Confusion Centralisation of clients",
            text: "One client management platform has conversations, contracts and updates all in a single location providing your team with all the clarity it needs without having to toggle between tools that are not connected.",
            dark: false
        },
        {
            title: "Robotization Which Minimizes Human Intervention",
            text: "Intelligent client management systems facilitate automatic follow-ups and reminders, workflow changeovers, and minimise redundant administration to enhance precision and reaction time.",
            dark: true
        }

        ,
        {
            title: "Increased Team Co-ordination and Visibility",
            text: "Having an organized tracking within your client data management helps the departments to work together with a sense of comfort, as nothing is overlooked between the lead capture to the final handover.",
            dark: false
        }

        ,
        {
            title: "Constructed to Expand along with Suing Contractors",
            text: "We scales with your projects. Our system helps to serve more clients, larger workgroups and more complicated processes at the same time, maintaining your Client Management for Contractors process steady and effective",
            dark: true
        }
    ]
}

const tryItContentBottom = {
    heading: "Take Full Control of Your Client Operations",
    title: <p>No more disconnected tools and manual tracking. Migrate to a client management platform that will provide your <Link to={'/client_management_software'}>construction company</Link> with full visibility, enhanced coordination and a uniform client experience through first touch to final handover.</p>,
    description: "And with CONSITL, you never simply manage contacts but create systematic structures that help you grow, retain and secure long term income.",
    buttonText: "Start Free Trial",
    path: "https://app.constil.com/signup",
};




const SmartSystemtContent = {
    heading: "How to Have Smarter Systems with Your Clients",
    image: smartclient,
    details: [
        {
            title: "Give your team the scalable client management system software that is specific to the construction businesses. Speed up the process of communication, systematize all client interactions and develop a systematic workflow, enhancing transparency, efficiency and long term retention as your company grows and grows.",

        },


    ],
    path: "/contact",
    btnText: "Get Your Quote"
}


const testimonialsData = {
    heading: "Read Why Contractors Like this Client Management System",
    description:
        'false',
    testimonialCards: [
        {
            id: 1,
            name: "Matt",
            company: "Residential Contractor",
            image: banner1,
            quote: "“Using CONSITLS Client Management for Contractors has completely changed how we track and manage client information. It is all organised, clear, and our team has never been quicker than it is at this point",
            location: "Brownsburg, IN",
        },
        {
            id: 2,
            name: "Scott",
            company: " Commercial Construction Firm",
            image: banner3,
            quote: "We have more streamlined projects since all communication with clients is centralised. The client management platform offered by CONSITL allowed us to minimise mistakes and make each team member work in one direction.",
            location: "Omaha, NE",
        },
        {
            id: 3,
            name: "haryy",
            company: "General Contractor",
            image: banner1,
            quote: "The management of clients is easy with CONSITL. The Construction Client Management Software has made us stay in documentation, follow-ups, and better positioned to develop our business.",
            location: "Omaha, NE",
        },
    ],
};


const faqs = [
    { q: "How does Construction Client Management Software make things easier on the side of the contractors?", a: "It integrates the information of clients, updates on projects and communication under a single platform. This minimises manual work and maintains teams throughout the course of a lead to project completion." },
    { q: "What are the projects that are best suited to client tracking software?", a: "The biggest value is realized in residential, commercial and mixed-use construction projects. All projects that have many clients, approvals or phases can be effectively managed and traced." },
    { q: " What is the length of time for implementing a client data management system in a construction firm?", a: "The process normally requires 26 weeks to implement, based on the size and complexity of the data in the company. Migration and training assistance mean that your staff is prepared to utilise it within a short period." },
    { q: "Is software client management customizable to construction team workflows?", a: "Yes, the majority of platforms permit customisation of tasks, approvals and notifications. You are able to make workflow adjustable according to the processes and projects of your company." },


    { q: "ROI of a contractor client management solution investment?", a: "The ROI is gained due to the speed of project completion, the moment of lowering the number of errors, and the client retention. Robots/data automation save time and boost the overall profitability." },




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