
import banner1 from "@/assets/images/banner1.jpg";
import banner3 from "@/assets/images/banner3.jpg";
import designmore from "@/assets/images/designmore.jpg";
import featureImage from "@/assets/images/powerfulfunctionality.jpg";
import brandImage from "@/assets/images/Strong-Integrations-to-a-Networked.jpg";




import featureImage1 from "@/assets/images/prepare.jpeg";
import featureImage2 from "@/assets/images/Make-Precise.jpg";
import featureImage3 from "@/assets/images/Better-Estimation.jpg";
import featureImage4 from "@/assets/images/Designed-for-Residential.jpg";



import constructionclient from "@/assets/images/modernconstruction.jpg";
import clientmanagement from "@/assets/images/The-Right-System.jpeg";
import smartclient from "@/assets/images/ntelligent-Estimating-Build.jpeg";
import { Link } from "react-router-dom";
const bannerContent = {
    heading: "Design More Budgets and Build Stronger with Construction Estimating Software",
    title: "Advanced construction estimating software designed to meet contractor and construction team needs assists in creating project estimates, costing materials and labour, with a single system aimed at making estimating processes easier. Budgeting is important in residential construction as well as compact and large-scale commercial projects. ",
    image: designmore,
    description: "The Smart construction cost estimating software enables contractors to prepare sound estimates in the shortest time possible, improve bid quality, and maintain transparent financial visibility before the commencement of all projects",
    path: "https://app.constil.com/signup",
    btnText: "Get Started Free"
}

const InvoiceAboutContent = {
    heading: "A Smarter Solution for Modern Construction Estimating",
    image: constructionclient,
    details: [
        {
            title: "Construction projects today are much more than a simple calculation of materials. The contractors should consider labour costs, material price changes, subcontractor expenses, permits, and changes to project scope. The lack of systematic estimation software for construction has led construction teams to work in unrelated spreadsheets, perform manual calculations, and produce cost estimates that are inaccurate and result in over-budgeting and inaccurate bidding.",

        },
        {
            title: "Smartest construction estimator software brings all cost information, materials, labour rates, and subcontractor prices together on a single platform. The contractors can develop accurate estimates, easily revise them, and maintain well-organized, transparent workflows. This solution supports residential and commercial projects, simplifying the process by estimating the work and helping teams to provide competitive bids.",

        },


    ],
    path: "/contact",
    btnText: "Let’s Talk"
}


const SmartClientManagement = {
    heading: "The Right System Makes Smarter Construction Estimating",
    image: clientmanagement,
    btnText: "Join Now",
    path: "/contact",
    details: [
        {
            title: "It effectively links financial preparation with project planning through a robust construction estimator software designed to meet the needs of modern contractors. It also enables teams to manage budgets using a built-in system of estimating, maintain formal libraries of costs, monitor estimate revisions, and analyse project budgets all in a single connected platform.",

        },
        {
            title: <p>Contractors do not have to use disconnected tools to prepare, review, and approve all estimates; they can manage everything clearly within a single environment. This enhances teamwork in the workplace and enables starting each project with proper, clear <Link to="/payment_tracking">cost planning.</Link></p>,

        },


    ],

}

const tryItContent = {
    heading: "Turn Complex Estimates into Simple Workflows with Estimating Software",
    title: "Any successful construction project is based on accurate budgeting. The estimating software assists contractors in developing organised estimates, minimising costly calculation errors, and presenting a competent bid with ease. Start managing your project costs, increasing the precision of your estimates, and understanding your project's financials before construction starts.",
    description: "",
    buttonText: "Start Free Trial",
    path: "https://app.constil.com/signup",
};

const featureSectionData = {
    heading: "Powerful Functionality In Our Estimating Platform Contractor-built",
    image: featureImage,
    description: "CONSITL offers smart systems within its estimating software to assist contractors in preparing accurate estimates, tabulating project costs, and maintaining monetary simplicity during the planning process.",
    tabsData: [
        {
            label: "Prepare and Arrangement of Full Cost Estimates",
            heading: "Prepare and Arrangement of Full Cost Estimates",
            image: featureImage1,
            content: (
                <p className="text-sm text-slate-800">
                    Organise materials, labour, subcontractor fees, and equipment costs with construction cost estimating software. Contractors can develop an in-depth cost structure, archive pricing information, and ensure that each estimate is presented properly and systematically. Having all project cost information on a single platform would give construction teams improved financial visibility and prevent them from getting lost in project planning.
                </p>
            )
        },
        {
            label: "Make Precise Estimates using Intelligent Cost Tracking",
            heading: "Make Precise Estimates using Intelligent Cost Tracking",
            image: featureImage2,

            content: (
                <p className="text-sm text-slate-800">
                    Minimise errors in all estimates with advanced construction project estimating software. Real-time tracking of material quantities, labour rates, and budget adjustments. <Link to="/payment_tracking">Automated calculations</Link> eliminate manual errors, help the contractor produce credible estimates more quickly, and ensure that each project budget reflects the correct project requirements.
                </p>
            )
        },
        {
            label: "Better Estimation with AI-Powered Cost Analysis",
            heading: "Better Estimation with AI-Powered Cost Analysis",
            image: featureImage3,

            content: (
                <p className="text-sm text-slate-800">
                    Enhance project prediction by applying AI construction estimating software to analyse past project records and cost patterns. This allows the contractor to determine the possible risks in the budget, modify estimations, and develop competitive bids without compromising profitability.
                </p>
            )
        },
        {
            label: "Designed for Residential and Commercial Projects",
            heading: "Designed for Residential and Commercial Projects",
            image: featureImage4,

            content: (
                <p className="text-sm text-slate-800">
                    CONSITL supplies residential construction estimating software as well as commercial construction estimating software requirements. Contractors can feel confident in managing the complex structure of costs, whether they are preparing small estimates for home renovations or large development budgets, without resorting to disorganised estimating processes.
                </p>
            )
        }
    ]
};

const howWorkSectionData = {
    heading: "The Simplified Workflow with Construction Estimating Software",
    subHeading: "",
    stepsData: [
        {
            id: 1,
            title: "Requirement capture of the Project",
            text: [
                "First, you need to input the project information, scope, material and labour expectations in your estimating software. Every vital data is kept in a single integrated system, which does not require manual records and separate files."
            ]
        },
        {
            id: 2,
            title: "Organize Components of Cost",
            text: [
                "Project cost organising intelligent building construction cost estimation software. Materials, labour, equipment, and subcontractor costs are automatically formatted into detailed cost breakdowns, which are transparent and easy to manipulate."
            ]
        },
        {
            id: 3,
            title: "Refine and Analyse Estimates",
            text: [
                "With advanced estimation software for construction, the contractors will be able to audit the project budgets, modify assumptions on the costs and revise the prices immediately. Calculations performed in real time make each estimate accurate, even in the case that project scope changes."
            ]
        },
        {
            id: 4,
            title: "Complete and Share Estimates",
            text: [
                "Create professional estimates and proposals through systematic templates on the platform. The contractors are able to make bids with confidence and can have complete financial visibility at every stage of the project life cycle."
            ]
        }
    ]
};

const benefitsSectionData = {
    heading: "Benefits of This Construction Estimating Software",
    description: "",
    cards: [
        {
            title: "More Precise Project Budgets",
            description: "The hand calculators can result in financial errors and cost overruns. Structured estimating software will enable the contractors to make better budgets and still have total control of the materials, labour and project costs.",
            icon: (
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            )
        },
        {
            title: "More Rapid Estimating and Bidding",
            description: "Construction estimator software allows teams to prepare estimates much quicker with automated calculation and organized workflows. This allows the contractors to quickly respond to the project opportunities and provide competitive bids without affecting the accuracy.",
            icon: (
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            )
        },
        {
            title: "More Powerful Financial Planning and Profitabilityh",
            description: <p> Estimates that are structured and accurate give the <Link to={'/'}>construction companies</Link> superior control of the project budgets. Smart construction cost estimating software assists contractors to guard their profit margins, secure financial risk and plan projects with more assurance.</p>,
            icon: (
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
            )
        }
    ]
};

const tryItContentCenter = {
    heading: "Automate Your Budgets and Improve Project Precision",
    title: "Construction companies do not just need spreadsheets and manual calculations. Our construction estimating software will allow the contractors to draw up organized estimates, control the costs of the projects, and retain financial clarity from the very initial stages of planning.",
    description: "Raise the standard of how you estimate your building projects and lay a more solid financial base for each project your team comes up with.",
    buttonText: "Start Free Trial",
    path: "https://app.constil.com/signup",
};

const integrationsSectionData = {
    heading: "Strong Integrations to a Networked Construction Ecosystem",
    image: brandImage,
    points: [
        <p>We integrate with key construction equipment using sophisticated integrations. Contractors are able to connect the <Link to={'/invoices_management'}>accounting software,</Link> document storage solutions, <Link to={'/client_management_software'}>Client management</Link> solutions and communication tools to form a single operational environment.</p>,
        "With construction estimator accounting software integration, the financial data would run between the estimating and accounting systems. This will remove manual data, enhance financial accuracy and keep budgets and costs of projects in check.",
        <p>The entire cost planning, project management, and <Link to={'/payment_tracking'}>financial tracking</Link> are then integrated into a single connected ecosystem using your estimating software for construction.</p>
    ]
};


const WhyChooseData = {
    heading: "The reasons why AI Construction Estimating Software Increases Predictive Planning",
    description: "Simplified workflow and smart technology make estimation easier and increase the accuracy of budgeting projects.",
    cards: [
        {
            title: "Development Designed to meet Construction Industry needs",
            text: "Built on the basis of actual contractor processes, rather than general financial instruments.",
            dark: true
        },
        {
            title: "Accurate Cost Planning",
            text: "building construction cost estimating software in a structured fashion provides proper organisation of the project costs.",
            dark: false
        },
        {
            title: "Automation Reduces Errors",
            text: "Intelligent automation accelerates the estimation process and reduces the possibility of manual calculation errors.",
            dark: true
        }

        ,
        {
            title: "Better Team Collaboration",
            text: "The work of estimators, managers, and finance teams takes place at the same platform.",
            dark: false
        }

        ,
        {
            title: "Growth Businesses",
            text: "Construction estimating software for small contractors is flexible to expand with your business to larger teams and more complex projects.",
            dark: true
        },
        {
            title: "Supports All Project Types",
            text: "Manage budgets for residential construction estimating software, commercial builds, and remodelling projects with one unified platform.",
            dark: false
        }
    ]
}

const tryItContentBottom = {
    heading: "Create More Reliable estimates with Certainty",
    title: "Why base your budget on fragmented spreadsheets and manual calculations. The construction estimating software​ that we provide assists contractors in arranging the project cost, creating structured estimates and maintaining a clear view of budgets prior to construction. Provide your staff with a more intelligent estimating platform that will maximise accuracy, speed, and financial management in all projects.",
    description: "",
    buttonText: "Start Free Trail",
    path: "https://app.constil.com/signup",
};




const SmartSystemtContent = {
    heading: "Intelligent Estimating Build Smarter Project Budgets",
    btnText: "Contact Now",
    path: "/contact",
    image: smartclient,
    details: [
        {
            title: "Arm your construction team with trusted estimation software for construction that makes cost planning easier and enhances the level of accuracy in the estimations.",

        },
        {
            title: "We assist contractors to plan project expenses, create elaborate estimates and keep maximum financial transparency until construction commences. With the estimated system, you can make sure that you plan the projects with self-confidence and deliver them successfully due to the fact that the manual spreadsheets are substituted by the structured estimating system, which provides your business with the needed clarity and efficiency.",

        },


    ]
}


const testimonialsData = {
    heading: "Read Why Contractors Trust This Construction Estimating Platform",
    description:
        'false',
    testimonialCards: [
        {
            id: 1,
            name: "Matt",
            company: "Residential Contractor",
            image: banner1,
            quote: "The preparation of project budgets has been enhanced by all means through the use of estimating software. We have now organised our estimates, made them accurate and the bidding process has also become a lot faster.",
            location: "Brownsburg, IN",
        },
        {
            id: 2,
            name: "Scott",
            company: "Development Co. Construction Company",
            image: banner3,
            quote: "In the past, big projects could be estimated in a rather complicated and time-intensive way. The construction cost estimating software has assisted us in organising budgets in a clear manner and minimising errors in computation in our commercial projects.",
            location: "Omaha, NE",
        },
        {
            id: 3,
            name: "haryy",
            company: "General Contractor",
            image: banner1,
            quote: "They ensured that estimating was easy for our group. The construction estimator software manages the cost of all materials, labour rates in addition to the project calculations under one roof, which has enabled us to provide better estimates to customers.",
            location: "Omaha, NE",
        },
    ],
};


const faqs = [
    { q: "What is construction estimating software and what is its operation?", a: "The estimating software assists the contractors in estimating the costs of the project by grouping materials, labour, equipment, and subcontractor costs within a single software. It will create structured estimates and cost breakdowns automatically to make certain project budgeting." },
    { q: "How precise are estimates made by current estimation software on construction?", a: "The computerised estimation tools that are applicable in the construction industry enhance precision due to the use of systematised cost data, automated analysis, and real-time pricing. This minimises human errors and assists the contractors in preparing sound project budgets." },
    { q: "How does AI construction estimating software make the estimation process better?", a: "AI construction estimating software is a software used to analyse historical project data and cost trends in order to come up with smarter estimations. It assists the contractors in determining how costly the contract could be and bid more competitively." },
    { q: "Does this software come easily to learn and use?", a: "The majority of estimating software platforms are being developed with easy-to-use dashboards and pre-defined templates. The system can be learnt quickly and the contractors and estimators are able to begin preparing estimates efficiently." },


    { q: "What determines the cost of the construction cost estimating software?", a: "The construction cost estimating software cost varies according to features, number of users, integrations and projects. Such features as automation, reporting, and AI tools can also influence the price." },




];

export { bannerContent, InvoiceAboutContent, SmartClientManagement, tryItContent, featureSectionData, howWorkSectionData, testimonialsData, faqs, benefitsSectionData, tryItContentCenter, integrationsSectionData, WhyChooseData, SmartSystemtContent, tryItContentBottom }