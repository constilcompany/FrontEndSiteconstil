
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
import { bannerContent, InvoiceAboutContent, SmartClientManagement, tryItContent, featureSectionData, howWorkSectionData, benefitsSectionData, tryItContentCenter, WhyChooseData, tryItContentBottom, SmartSystemtContent, testimonialsData, faqs } from '@/lib/dummydata/paymentTracking'
import PaymentProcess from '@/components/PaymentProcess'
const PaymentTrackingManagementPage = () => {

    return (
        <>
            <Navbar />
            <BannerInvoice bannerContent={bannerContent} />
            <InvoiceAbout InvoiceAboutContent={InvoiceAboutContent} />
            {/* <InvoiceManagement /> */}
            <FeatureSetion {...featureSectionData} />
            <TryIt tryItContent={tryItContent} />
            <InvoiceAbout InvoiceAboutContent={SmartClientManagement} />
            <HowWork {...howWorkSectionData} />
            <Benefits {...benefitsSectionData} />
            <PaymentProcess />
            <div className='md:mt-24'>
                <TryIt tryItContent={tryItContentCenter} />
            </div>
            {/* <WorkFlow /> */}
            {/* <IntegrationsSection {...integrationsSectionData} /> */}
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