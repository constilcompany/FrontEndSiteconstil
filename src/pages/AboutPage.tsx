import Footer from '@/components/Footer'
import BannerInvoice from '@/components/invoices/BannerInvoice'
import InvoiceAbout from '@/components/invoices/InvoiceAbout'
import TryIt from '@/components/TryIt'
import Navbar from '@/components/Navbar'
import { Helmet } from 'react-helmet'
import officeImg from "@/assets/images/civil.jpg"
import diverseEngineersImg from "@/assets/images/our-vision.jpg"
import bannerImage from "@/assets/hero-construction.jpg"

const AboutPage = () => {
    const bannerContent = {
        heading: "About Us",
        title: "Constil is an AI-based construction software that has been designed to make it easier for contractors to estimate, price, and manage projects.",
        path: "/contact",
        btnText: "Contact Us",
        image: bannerImage,
        description: "It has been designed based on industry challenges in reality and substituted slow manual processes with fast and data-driven workflows. From estimating to invoicing, Constil brings everything into one system, helping contractors save time, reduce errors, and operate more efficiently. By combining automation with intelligence, Constil enables construction professionals to focus less on paperwork and more on winning projects and growing their business."
    };

    const solutionContent = {
        heading: "Smarter construction management using AI",
        image: officeImg,
        btnText: "Get Started Now",
        path: "https://app.constil.com/signup",
        details: [
            {
                title: "All-in-one construction management system that revolutionises the way contractors estimate, price and manage projects. It eliminates the need for spreadsheets, manual calculations, and disconnected tools, offering a centralized system that streamlines every step of the process."
            },
            {
                title: "With AI at its core, Constil analyzes project data, supports faster decision-making, and reduces the time required to generate accurate estimates. It assists contractors in speeding up operations and making them more efficient and scalable, whether it comes to takeoffs and proposals, invoicing, or workflow automation."
            }
        ],
        reverse: true
    };

    const tryItContent = {
        heading: "Grow Your Construction Company through Intelligent Automation",
        title: "Simplify estimating, automate processes, and manage projects with one powerful platform.",
        description: "Start using AI to save time and win more projects.",
        buttonText: "Try Free Trial",
        path: "https://app.constil.com/signup"
    };

    return (
        <>
            <Helmet>
                <title>About Us | Constil Construction Software</title>
                <meta name="description" content="Learn about Constil, the AI-based construction software designed to make estimating, pricing, and managing projects easier for contractors." />
                <link rel="canonical" href="https://constil.com/about" />
            </Helmet>

            <Navbar />
            <BannerInvoice bannerContent={bannerContent} />

            <InvoiceAbout InvoiceAboutContent={solutionContent} />

            {/* Our Story Section */}
            <section className="bg-slate-50 py-16 md:py-24">
                <div className="container mx-auto px-4 md:px-8 max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 md:text-4xl mb-4">Our Story</h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">The Evolution of Constil from Idea to Intelligent Platform</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <h3 className="text-xl font-bold text-primary mb-4">The Beginning</h3>
                            <p className="text-gray-600 leading-relaxed">Constil commenced by identifying a definite issue in the construction sector, estimating was tedious, uneven and more often relied on instincts. Contractors were missing opportunities just because they were not able to react quickly.</p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <h3 className="text-xl font-bold text-primary mb-4">The Turning Point</h3>
                            <p className="text-gray-600 leading-relaxed">To address this, Constil brought automation in estimating and project processes. With the development of technology, AIs have become part of the platform, enabling it to make faster, more accurate, and more intelligent pricing decisions using real-world information.</p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <h3 className="text-xl font-bold text-primary mb-4">Where It Is Today</h3>
                            <p className="text-gray-600 leading-relaxed">Constil is now a full construction platform that is not limited to estimating. It facilitates proposals, invoicing, pricing smarts, and workflow automation, enabling contractors to work faster, make improved decisions and scale their business with confidence.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Vision Section */}
            <section className="bg-white py-16 md:py-24">
                <div className="container mx-auto px-4 md:px-8 max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 md:text-4xl mb-4">Our Vision</h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">Powering the Next Era of Construction Intelligence</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="mb-8 p-6 bg-blue-50 rounded-xl border-l-4 border-blue-600">
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">Mission</h3>
                                <p className="text-gray-700 leading-relaxed">Constil’s mission is to simplify construction workflows through automation and intelligent technology. It aims to eliminate inefficiencies, reduce manual work, and help contractors make faster, data-driven decisions.</p>
                            </div>
                            <div className="p-6 bg-blue-50 rounded-xl border-l-4 border-blue-600">
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">Vision</h3>
                                <p className="text-gray-700 leading-relaxed">The vision is to be the hub of construction businesses, where estimating, pricing and project management are all integrated into a single system. By continuously advancing AI capabilities, Constil strives to empower contractors to improve productivity, increase profitability, and scale their operations with confidence.</p>
                            </div>
                        </div>
                        <div className="hidden md:block rounded-xl overflow-hidden shadow-xl">
                            <img src={diverseEngineersImg} alt="Construction Vision" className="w-full h-full object-cover aspect-square" />
                        </div>
                    </div>
                </div>
            </section>

            <TryIt tryItContent={tryItContent} />
            <Footer />
        </>
    )
}

export default AboutPage
