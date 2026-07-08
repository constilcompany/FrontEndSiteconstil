import ContactForm from "@/components/ContactForm"
import Footer from "@/components/Footer"
import Navbar from "@/components/Navbar"
import { Helmet } from "react-helmet"

const ContactPage = () => {
    return (
        <div>
            <Helmet>
                <title>Contact Us - Constil</title>
                <meta name="description" content="Get in touch with Constil for any inquiries or support. We're here to help you with your construction estimating and management needs." />
                <link rel="canonical" href="https://constil.com/contact"></link>
            </Helmet>
            <Navbar />
            <div className="min-h-screen  bg-gray-400">
                <ContactForm />
            </div>
            <Footer />
        </div>
    )
}

export default ContactPage