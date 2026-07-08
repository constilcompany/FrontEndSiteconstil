import Footer from '@/components/Footer'
import BannerInvoice from '@/components/invoices/BannerInvoice'
import Benefits from '@/components/invoices/Benefits'
import FeatureSetion from '@/components/invoices/FeatureSetion'
import HowWork from '@/components/invoices/HowWork'
import IntegrationsSection from '@/components/invoices/IntegrationsSection'
import InvoiceAbout from '@/components/invoices/InvoiceAbout'
import WhyChoose from '@/components/invoices/WhyChoose'
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
} from '@/lib/dummydata/InvoiceManagement'
import { Helmet } from 'react-helmet'
import { breadcrumbSchema, faqSchema, softwareSchema } from '@/lib/schema/invoiceSchema'

const ClientManagementSoftwarePage = () => {


    return (
        <>
            <Helmet>
                <title>AI Invoice Management Software for Intelligent Billing Systems</title>
                <meta name="description" content="AI Invoice Management Software simplifies invoice handling by reducing errors, increasing processing speed, and improving overall financial efficiency." />
                <link rel="canonical" href="https://constil.com/invoices-management-software" />

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
            <InvoiceAbout InvoiceAboutContent={SmartClientManagement} />
            <TryIt tryItContent={tryItContent} />
            <FeatureSetion {...featureSectionData} />
            <HowWork {...howWorkSectionData} />
            <Benefits {...benefitsSectionData} />
            <div className='md:mt-24'>
                <TryIt tryItContent={tryItContentCenter} />
            </div>
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