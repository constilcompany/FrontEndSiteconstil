import React from 'react';
import { UserPlus, LayoutGrid, FileText, CheckCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const PaymentProcess = () => {
    const steps = [
        {
            title: "Add Client",
            desc: "Add client information.",
            icon: <UserPlus className="w-6 h-6" />,
        },
        {
            title: "Project Start",
            desc: "Monitor tasks and progress",
            icon: <LayoutGrid className="w-6 h-6" />,
        },
        {
            title: "Send Invoice",
            desc: "Write estimates or invoices.",
            icon: <FileText className="w-6 h-6" />,
        },
        {
            title: "Get Paid",
            desc: "Revised status on payment updated",
            icon: <CheckCircle className="w-6 h-6" />,
        },
    ];

    return (
        <div className="md:py-20 bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                        Computerized Notifications to Track Payments
                    </h1>

                </div>

                {/* Steps Container */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group"
                        >
                            {/* Accent Bar */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-[#448AFF] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />

                            {/* Icon Wrapper */}
                            <div className="w-14 h-14 bg-blue-50 text-[#448AFF] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#448AFF] group-hover:text-white transition-colors duration-300">
                                {step.icon}
                            </div>

                            {/* Content */}
                            <h3 className="text-xl font-bold text-gray-800 mb-2">{step.title}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed mb-4">
                                {step.desc}
                            </p>

                            {/* Step Number */}
                            <span className="text-5xl font-black text-gray-50 absolute bottom-4 right-4 -z-10 group-hover:text-blue-50 transition-colors">
                                0{index + 1}
                            </span>

                            {/* Connector Arrow (Desktop Only) */}
                            {index !== steps.length - 1 && (
                                <div className="hidden lg:block absolute -right-6 top-1/2 transform -translate-y-1/2 z-10">
                                    <ArrowRight className="w-6 h-6 text-gray-300" />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>

                {/* Bottom CTA or Summary (Optional) */}

            </div>
        </div>
    );
};

export default PaymentProcess;