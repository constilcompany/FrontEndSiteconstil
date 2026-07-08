import Footer from '@/components/Footer'
import BannerInvoice from '@/components/invoices/BannerInvoice'
import Benefits from '@/components/invoices/Benefits'
import FeatureSetion from '@/components/invoices/FeatureSetion'
import HowWork from '@/components/invoices/HowWork'
import IntegrationsSection from '@/components/invoices/IntegrationsSection'
import InvoiceAbout from '@/components/invoices/InvoiceAbout'
import InvoiceManagement from '@/components/invoices/InvoiceManagement'
import WhyChoose from '@/components/invoices/WhyChoose'
import WorkFlow from '@/components/invoices/WorkFlow'
import Navbar from '@/components/Navbar'
import Testimonials from '@/components/Testimonials'
import TryIt from '@/components/TryIt'
import FAQSection from '@/components/FAQSection'
import { 
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
  faqs 
} from '@/lib/dummydata/paymentTracking'
import PaymentProcess from '@/components/PaymentProcess'
import { Helmet } from 'react-helmet'

const PaymentTrackingManagementPage = () => {

    // Schema Definitions
    const softwareSchema = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "@id": "https://constil.com/payment-tracking-software#software",
        "name": "AI Payment Tracking Software",
        "description": "Manage payments smartly with online payment tracking software. Track transactions in real time, reduce errors, and stay in full control.",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "WebApplication",
        "url": "https://constil.com/payment-tracking-software",
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
        "@id": "https://constil.com/payment-tracking-software#breadcrumb",
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
                "name": "Payment Tracking Software",
                "item": "https://constil.com/payment-tracking-software"
            }
        ]
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "Does the software to track payments of contractors accommodate different payment methods?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, the majority of the contractor payment tracking software will accommodate any of the following payment options: credit/debit cards, ACH transfers, and checks. This is flexible, making transactions quicker and easier for the clients and contractors."
                }
            },
            {
                "@type": "Question",
                "name": "What is the length of time for installing an online payment tracking software?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The initial installation process can be completed in a matter of hours or a few days, depending on the program and the level of your payment processes. The setup wizards are provided in most platforms to make it easier."
                }
            },
            {
                "@type": "Question",
                "name": "How often does an invoice payment tracking system change payment statuses?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The status of payment is typically updated within seconds or a few minutes of every transaction. This will guarantee proper monitoring of outstanding, paid or unpaid payments."
                }
            },
            {
                "@type": "Question",
                "name": "What is the security of an online tracking software for sensitive financial information?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Trusted sources have a high-level of encryption, two-factor authentication and adherence to data security standards such as PCI DSS. Your financial information is not exposed to theft and fraud."
                }
            },
            {
                "@type": "Question",
                "name": "Do payment management systems have the ability to monitor overdue payments and notify automatically?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, a majority of the payment management systems have a feature of automatically highlighting overdue invoices and sending notifications to the clients. This assists in enhancing the flow of cash and minimizing the chances of late payments."
                }
            },
            {
                "@type": "Question",
                "name": "Does it have a business payment tracking system subscriptions or not?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, in the majority of systems, tiered subscription plans are provided by features, number of users or transaction volume. Others also offer a free trial in order to experiment with the software before committing."
                }
            }
        ]
    };

    return (
        <>
            <Helmet>
                <title>Online Payment Tracking Software to Manage Payments Smartly</title>
                <meta name="description" content="Manage payments smartly with online payment tracking software. Track transactions in real time, reduce errors, and stay in full control." />
                <link rel="canonical" href="https://constil.com/payment-tracking-software" />
                
                {/* Structured Data Scripts */}
                <script type="application/ld+json">
                    {JSON.stringify(softwareSchema)}
                </script>
                <script type="application/ld+json">
                    {JSON.stringify(breadcrumbSchema)}
                </script>
                <script type="application/ld+json">
                    {JSON.stringify(faqSchema)}
                </script>
            </Helmet>

            <Navbar />
            <BannerInvoice bannerContent={bannerContent} />
            <InvoiceAbout InvoiceAboutContent={InvoiceAboutContent} />
            <FeatureSetion {...featureSectionData} />
            <TryIt tryItContent={tryItContent} />
            <InvoiceAbout InvoiceAboutContent={SmartClientManagement} />
            <HowWork {...howWorkSectionData} />
            <Benefits {...benefitsSectionData} />
            <PaymentProcess />
            <div className='md:mt-24'>
                <TryIt tryItContent={tryItContentCenter} />
            </div>
            <WhyChoose {...WhyChooseData} />
            <InvoiceAbout InvoiceAboutContent={SmartSystemtContent} />
            <TryIt tryItContent={tryItContentBottom} />
            <Testimonials {...testimonialsData} />
            <FAQSection faqs={faqs} />
            <Footer />
        </>
    )
}

export default PaymentTrackingManagementPage