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
    integrationsSectionData,
    WhyChooseData,
    tryItContentBottom,
    SmartSystemtContent,
    testimonialsData,
    faqs
} from '@/lib/dummydata/clientManagement'
import { Helmet } from 'react-helmet'
import { breadcrumbSchema, faqSchema, softwareApplicationSchema } from '@/lib/schema/clientSchema'

const ClientManagementSoftwarePage = () => {



    return (
        <>
            <Helmet>
                <title>Client Management for Contractors Built to Scale Your Business</title>
                <meta name="description" content="Client management for contractors built to scale your business. Organize clients, manage documents, and improve communication across every project." />
                <link rel="canonical" href="https://constil.com/client-management-software" />

                <script type="application/ld+json">
                    {JSON.stringify(softwareApplicationSchema)}
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
            <InvoiceManagement />
            <TryIt tryItContent={tryItContent} />
            <FeatureSetion {...featureSectionData} />
            <InvoiceAbout InvoiceAboutContent={SmartClientManagement} />
            <HowWork {...howWorkSectionData} />
            <Benefits {...benefitsSectionData} />
            <div className='md:mt-24'>
                <TryIt tryItContent={tryItContentCenter} />
            </div>
            <WorkFlow />
            <IntegrationsSection {...integrationsSectionData} />
            <WhyChoose {...WhyChooseData} />
            <InvoiceAbout InvoiceAboutContent={SmartSystemtContent} />
            <TryIt tryItContent={tryItContentBottom} />
            <Testimonials {...testimonialsData} />
            <FAQSection faqs={faqs} />
            <Footer />
        </>
    )
}

export default ClientManagementSoftwarePage