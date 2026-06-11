import Competitive from '@/components/estimate/Competitive'
import SolutionSection from '@/components/estimate/SolutionSection'
import Faq from '@/components/Faq'
import Footer from '@/components/Footer'
import BannerInvoice from '@/components/invoices/BannerInvoice'
import Benefits from '@/components/invoices/Benefits'
import CTAButton from '@/components/invoices/CTAButton'
import CTRSection from '@/components/invoices/CTRSection'
import FeatureSetion from '@/components/invoices/FeatureSetion'
import HowWork from '@/components/invoices/HowWork'
import IntegrationsSection from '@/components/invoices/IntegrationsSection'
import InvoiceAbout from '@/components/invoices/InvoiceAbout'
import InvoiceManagement from '@/components/invoices/InvoiceManagement'
import WhyChoose from '@/components/invoices/WhyChoose'
import Navbar from '@/components/Navbar'
import AutomatedReminders from '@/components/payment_tracking/AutomatedReminders'
import Testimonials from '@/components/Testimonials'

const PaymentTrackingPage = () => {
    return (
        <>
            <Navbar />
            <BannerInvoice />
            <SolutionSection />
            <FeatureSetion />
            <CTAButton />
            <CTRSection />
            <Benefits />
            <HowWork />
            <InvoiceAbout />
            <Benefits />
            <AutomatedReminders />
            {/* add second section here */}
            <CTRSection />
            <Competitive />
            <WhyChoose />
            <CTRSection />
            <CTAButton />
            <Testimonials />
            <Faq />
            <Footer />

        </>
    )
}

export default PaymentTrackingPage