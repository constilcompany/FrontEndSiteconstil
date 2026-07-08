import banner1 from "@/assets/images/banner1.jpg";
import banner3 from "@/assets/images/banner3.jpg";
import future from "@/assets/images/cashflow.jpg";
import featureImage from "@/assets/images/potentfunctionality.jpg";



import featureImage1 from "@/assets/images/Monitor-and-manage.jpeg";
import featureImage2 from "@/assets/images/Track-Payments.jpg";
import featureImage3 from "@/assets/images/Automate-Workflows.jpg";
import featureImage4 from "@/assets/images/Master-built.jpg";


import constructionclient from "@/assets/images/automateprocess.jpeg";
import clientmanagement from "@/assets/images/The-Right-System-Makes-Wiser.jpeg";
import smartclient from "@/assets/images/enhancefinancialprocesses.jpg";
import { Link } from "react-router-dom";

const bannerContent = {
    heading: "Enhance the Accuracy of Cash flow with Online payment tracking Software",
    title: "Construction teams also find it difficult to deal with payments among the clients, invoices, and projects. Contractors' Online payment tracking software will provide the ability to receive payments, monitor invoices and have full financial visibility within a single system.",
    image: future,
    btnText: "Get Started",
    path: "https://app.constil.com/signup",
    description: "An organized payment management system will be used to organize all transactions, eliminating the use of fragmented spreadsheets. The smart payment tracking system assists in tracking of dues, collection and reducing payment cycle delays.",
}

const InvoiceAboutContent = {
    heading: "Automate the process of invoices through an Invoice Payment Tracking System",
    image: constructionclient,
    details: [
        {
            title: <p>Construction projects come with <Link to={'/invoices-management-software'}>various invoices</Link>, advances, client approvals and follow-ups. Contractors are using spreadsheets and tools dotted about without an appropriate payment monitoring software, resulting in delayed payments, uncollected amounts, and a lack of financial visibility.</p>

        },
        {
            title: <p>All payment processes are put under a single system with the help of a digital payment tracking platform. The invoices, outstanding bills and schedules can be efficiently tracked by contractors and the collections can be streamlined, and proper <Link to={'/invoices-management-software'}>financial tracking</Link> of residential and commercial projects can be maintained with the help of this software."</p>,

        },


    ],
    btnText: "Let’s Talk",
    path: "/contact",
}



const featureSectionData = {
    heading: "Potent Functionality in Our Pay Track System built for contractors",
    description: "CONSTIL has smart systems as part of its payment management system that assist the contractors to monitor and keep track of payment, collection and ensure financial clarity at all phases of the project lifecycle.",
    image: featureImage,
    tabsData: [
        {
            label: "Monitor and manage invoice payment",
            heading: "Monitor and manage invoice payment",
            image: featureImage1,
            content: (
                <p className="text-sm text-slate-800">
                    Reduce confusion with a smart<Link to={'/invoices-management-software'}> invoice payment monitoring tool</Link> that provides real-time updates on payment status across multiple projects and clients. This enables the contractors to monitor paid, pending invoices and those outstanding invoices and have a clear view of all financial transactions under a single roof, which enhances transparency and accountability.
                </p>
            )
        },
        {
            label: "Track Payments in Real-Time",
            heading: "Track Payments in Real-Time",
            image: featureImage2,
            content: (
                <p className="text-sm text-slate-800">
                    Minimize confusion by using a smart invoice payment monitoring system that offers real-time payment status information on a series of projects and <Link to={'/client-management-software'}>clients. Contractors</Link> are able to know the outstanding balances instantly and make sure that none of the payments are missed in the course of the project implementation and avoid expensive delays.
                </p>
            )
        },
        {
            label: "Automate Workflows in Collection of Payments",
            heading: "Automate Workflows in Collection of Payments",
            image: featureImage3,
            content: (
                <p className="text-sm text-slate-800">
                    Effortlessly automate collections through payment collection tracking software to handle invoices. Automate follow-ups, control due dates, and track unpaid invoices consistently and consistently without using manual processes, which will accelerate the speed of collection and the overall productivity of a team.
                </p>
            )
        },
        {
            label: "Master-built to All Construction Payment Requirements",
            heading: "Master-built to All Construction Payment Requirements",
            image: featureImage4,
            content: (
                <p className="text-sm text-slate-800">
                    Contractor payment tracking software is applicable in both small residential projects and in complex commercial constructions and assists in the organized tracking of all types of projects to provide teams with consistency and control of payments, as well as ensuring the unproblematic management of finances in any project.
                </p>
            )
        }
    ]
};

const SmartClientManagement = {
    heading: "The Right System Makes Wiser Payment Tracking",
    btnText: "Get Your Quote",
    path: "/contact",
    image: clientmanagement,
    details: [
        {
            title: "An integrated online payment management system of invoices is linked to track payment and financial processes in general. It enables the contractors to keep track of invoice status, invoice collections, and keep a well-organized payment history in one platform.",

        },
        {
            title: "Contractors do not have to use their disconnected tools to monitor payments. Under invoice status tracking software, all financial information is arranged, visible, and manageable, enhancing coordination of teams and consistency in cash flow across projects.",

        },


    ]
}

const tryItContent = {
    heading: "Transform Payments Tracking into an apparent Financial Process",
    title: <p><Link to={'/'}>Construction enterprises</Link> handle hundreds of payments and <Link to={'/invoices-management-software'}>invoices involving clients</Link> and projects. Payment tracking Application assists teams to capture invoices automatically, approvals and deal with financial processes easily. Automate tracking payment collection software and provide a clear and well-structured payment management Network to facilitate a smooth cash flow.</p>,
    description: "",
    buttonText: "Start Free Trail",
    path: "https://app.constil.com/signup",
};



const howWorkSectionData = {
    heading: "A Clear Workflow for Efficient Project Payments",
    subHeading: "",
    stepsData: [
        {
            id: 1,
            title: "Take the Invoice and Payment Information",
            text: [
                "The first stage is that the contractors enter the data of invoices, clients and payment terms into the system. The Payment tracking tool is able to consolidate all the financial records in a single location, this means that there is no manual records of the finances and accuracy is better."
            ]
        },
        {
            id: 2,
            title: "Monitor payment Status Effectively",
            text: [
                "With an invoicing status tracking software, teams have the possibility to track invoices on whether they are paid, pending, or overdue. This will make all the transactions transparent and documented."
            ]
        },
        {
            id: 3,
            title: "Automate Collection and Follow-Ups",
            text: [
                "With invoice collection automation software, contractors can manage outstanding payments and automate follow-ups. The system has made sure that the timing of actions taken is not dependent on manual processes."
            ]
        },
        {
            id: 4,
            title: "Analyse and Manage Cash Flow",
            text: [
                "This tracking system gives details in terms of the payment trends, money owed, and performance. A structured payment management system will help the contractors control their cash flow."
            ]
        }
    ]
};

const benefitsSectionData = {
    heading: "Major Advantages of Online Payment Tracking Software",
    description: "",
    cards: [
        {
            title: "Better Multitasking of Cash",
            description: "A structured payment management Tool will guarantee that all the transactions are maintained and tracked appropriately on several projects and clients. Contractors are able to have manageable cash flow, less financial risk, no missed or late payments, and are able to predict future spending without any reservations.",
            icon: (
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            )
        },
        {
            title: "Quickened Collection of Payments",
            description: "By following the payment collection tracking software, the contractors will be able to enhance the efficiency of collection, simplify the follow-ups, minimize the time of payments delayed, and increase the cash inflow without disorganizing all invoices and missing a system to monitor them collectively.",
            icon: (
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            )
        },
        {
            title: "Enhanced Financial Transparency and Management",
            description: "An integrated digital payment tracking platform will give full access to the financial operations, payment schedules, balances and reporting to enable contractors to make better decisions and enjoy financial control over all projects.",
            icon: (
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
            )
        }
    ]
};

const tryItContentCenter = {
    heading: "Enhance Cash Tracking and Fortify Cash Flow",
    title: "Tracking systems that are done manually are likely to be confusing and may result in payment lapses. An organized online payment tracking software assists the contractors in keeping all the transactions clear.",
    description: "It is time to enhance your financial systems, minimize debts, and have more control over them with an advanced payment management Network.",
    buttonText: "Start Free Trial",
    path: "https://app.constil.com/signup"
};

// const integrationsSectionData = {
//     heading: "Strong Integrations to a smarter construction Ecosystem",
//     points: [
//         "Connect the accounting software, email platforms, project management software, cloud storage systems and payment gateways with seamless integrations and a push of a button, you can expand and automate your workflows.",
//         "Your Construction Client Management Software is made to be the core of the operation and synchronise data between the systems and make sure that your team operates within a single, connected, and smart ecosystem designed to operate construction businesses."
//     ]
// };


const WhyChooseData = {
    heading: "The reasons why the Invoice Payment Control System is the Solution for Scalable Growth",
    description: "Have complete visibility on all the payments, facilitate collections, and have proper management of cash flow in all projects.",
    cards: [
        {
            title: "Constructed on Construction Processes",
            text: "To address the requirements of the contractors with contractor payment tracking software.",
            dark: true
        },
        {
            title: "Tracking of payments in a central place",
            text: "Anything to do with finances is handled using a business payment tracking system.",
            dark: false
        },
        {
            title: "Automation Reduces Delays",
            text: "More rapid collections are achieved through the use of automated workflows that are driven by an invoice collection automation tool.",
            dark: true
        }

        ,
        {
            title: "Better Team Collaboration",
            text: "The collaboration of teams is based on a common set of payment management solutions.",
            dark: false
        }

        ,
        {
            title: "Scales with Your Business",
            text: "The digital payment tracking Interface will be flexible to address the demands of growing projects.",
            dark: true
        },
        {
            title: "Supports All Payment Types",
            text: <p>Manage full, partial, and milestone payments with a complex <Link to={'/invoices-management-software'}>invoice payment control system.</Link></p>,
            dark: false
        }
    ]
}

const tryItContentBottom = {
    heading: "Enhance Financial Processes through Digital Invoicing Management",
    title: "Digital Payment Tracking System will enable you to simulate an online payment system to track your payments easily, have greater financial transparency, and make sure that all transactions are recorded properly to make optimal business decisions.",
    description: "Follow payments, control collections, and maintain organized work processes with the help of the dependable system of online invoice payment management developed with the needs of the modern contractor in mind, and help the team to minimize delays, increase cash flow, and to maintain order in all the projects.",
    buttonText: "Start Free Trail",
    path: "https://app.constil.com/signup"
};




const SmartSystemtContent = {
    heading: "Enhance Financial Processes through Digital Invoicing Management",
    image: smartclient,
    details: [
        {
            title: "Digital Payment Tracking System will enable you to simulate an online payment system to track your payments easily, have greater financial transparency, and make sure that all transactions are recorded properly to make optimal business decisions.",

        },
        {
            title: "Follow payments, control collections, and maintain organized work processes with the help of the dependable system of online invoice payment management developed with the needs of the modern contractor in mind, and help the team to minimize delays, increase cash flow, and to maintain order in all the projects.",

        },



    ],
    btnText: "Get Started",
    path: "/contact",
}


const testimonialsData = {
    heading: "Monitor Payments Easily through Online Payment Tracker Software",
    description:
        'Eliminate the use of manual spreadsheets and disjointed records. The Online payment tracking software assists contractors in tracking their invoices and collecting them effectively, and also maintains all their payment data.Enhance the cash flow and keep all transactions under control with one structured system.',
    testimonialCards: [
        {
            id: 1,
            name: "Matt",
            company: "Residential Contractor",
            image: banner1,
            quote: "The application of the digital cash flow tracking platform has assisted us in sorting all our payments and enhancing the visibility of our cash flows.",
            location: "Brownsburg, IN",
        },
        {
            id: 2,
            name: "Scott",
            company: " Construction Company",
            image: banner3,
            quote: "The invoice payment tracking system helped in avoiding confusion in keeping track of the payments in various projects.",
            location: "Omaha, NE",
        },
        {
            id: 3,
            name: "haryy",
            company: "General Contractor",
            image: banner1,
            quote: "To enhance the collection process, we had automated reminders by using automatic payment reminder software",
            location: "Omaha, NE",
        },
    ],
};


const faqs = [
    { q: "Does the software to track payments of contractors accommodate different payment methods?", a: "Yes, the majority of the contractor payment tracking software will accommodate any of the following payment options: credit/debit cards, ACH transfers, and checks. This is flexible, making transactions quicker and easier for the clients and contractors." },
    { q: "What is the length of time for installing an online payment tracking software?", a: "The initial installation process can be completed in a matter of hours or a few days, depending on the program and the level of your payment processes. The setup wizards are provided in most platforms to make it easier." },
    { q: "How often does an invoice payment tracking system change payment statuses?", a: "The status of payment is typically updated within seconds or a few minutes of every transaction. This will guarantee proper monitoring of outstanding, paid or unpaid payments." },
    { q: "What is the security of an online tracking software for sensitive financial information?", a: "Trusted sources have a high-level of encryption, two-factor authentication and adherence to data security standards such as PCI DSS. Your financial information is not exposed to theft and fraud." },


    { q: "Do payment management systems have the ability to monitor overdue payments and notify automatically?", a: "Yes, a majority of the payment management systems have a feature of automatically highlighting overdue invoices and sending notifications to the clients. This assists in enhancing the flow of cash and minimizing the chances of late payments." },

    { q: "Does it have a business payment tracking system subscriptions or not?", a: "Yes, in the majority of systems, tiered subscription plans are provided by features, number of users or transaction volume. Others also offer a free trial in order to experiment with the software before committing." },




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
    WhyChooseData,
    tryItContentBottom,
    SmartSystemtContent,
    testimonialsData,
    faqs,
};