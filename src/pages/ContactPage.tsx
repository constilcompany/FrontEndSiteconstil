import ContactForm from "@/components/ContactForm"
import Footer from "@/components/Footer"
import Navbar from "@/components/Navbar"

const ContactPage = () => {
    return (
        <div>
            <Navbar />
            <div className="min-h-screen  bg-gray-400">
                <ContactForm />
            </div>
            <Footer />
        </div>
    )
}

export default ContactPage