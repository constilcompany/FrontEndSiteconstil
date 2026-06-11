
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
import { bannerContent, InvoiceAboutContent, SmartClientManagement, tryItContent, featureSectionData, howWorkSectionData, testimonialsData, faqs, benefitsSectionData, tryItContentCenter, integrationsSectionData, WhyChooseData, SmartSystemtContent, tryItContentBottom } from '@/lib/dummydata/EstimatesManagement'


const EstimatesSoftwarePage = () => {
    return (
        <>
            <Navbar />
            <BannerInvoice bannerContent={bannerContent} />
            <InvoiceAbout InvoiceAboutContent={InvoiceAboutContent} />
            <FeatureSetion {...featureSectionData} />
            <TryIt tryItContent={tryItContent} />
            <InvoiceAbout InvoiceAboutContent={SmartClientManagement} />
            <HowWork  {...howWorkSectionData} />
            <Benefits {...benefitsSectionData} />
            <TryIt tryItContent={tryItContentCenter} />
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

export default EstimatesSoftwarePage