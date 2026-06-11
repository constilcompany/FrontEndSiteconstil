import {
    Users,
    FileSignature,
    PlayCircle,
    Activity,
    Handshake,
    ChevronRight
} from "lucide-react";

const steps = [
    {
        id: 1,
        title: "Lead Capture and Qualification",
        description: "Identify prospects and vet capture with ease.",
        icon: Users,
    },
    {
        id: 2,
        title: "Proposal Approval and Estimation",
        description: "Prepare estimates and get approvals from clients in time.",
        icon: FileSignature,
    },
    {
        id: 3,
        title: "Project Start and Signing of Contracts",
        description: "Make decisions and launch systematic processes.",
        icon: PlayCircle,
    },
    {
        id: 4,
        title: "Execution and Change Management of the Project",
        description: "Monitor progress and changes in an orderly manner.",
        icon: Activity,
    },
    {
        id: 5,
        title: "Clients and Handover Completion and Following Up",
        description: "Make it a smooth delivery and relationship.",
        icon: Handshake,
    }
];

const WorkFlow = () => {
    return (
        <section className="py-12 md:py-16 bg-white relative">
            <div className="container mx-auto px-4 md:px-6">

                <div className="text-center max-w-4xl mx-auto mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        How Client Management Software  <span className="text-blue-600">Streamlines Your Workflow Workflow</span>
                    </h2>
                    {/* <p className="text-lg text-slate-600">
                        Our structured client management platform drives each of the stages.
                    </p> */}
                </div>

                {/* Visual Workflow Diagram */}
                <div className="max-w-6xl mx-auto mb-16 hidden lg:block px-10">
                    <div className="flex items-start justify-between relative">
                        {/* Connecting Line */}
                        <div className="absolute top-[40px] left-0 w-full h-1 bg-gradient-to-r from-blue-100 via-blue-300 to-blue-100 -translate-y-1/2 -z-10 rounded-full" />

                        {steps.map((step, index) => (
                            <div key={step.id} className="flex flex-col items-center relative z-10 w-44">
                                <div className="w-20 h-20 bg-white rounded-full border border-blue-100 shadow-xl flex items-center justify-center text-blue-600 mb-6 transition-transform hover:-translate-y-2 duration-300">
                                    <div className="w-[60px] h-[60px] rounded-full bg-blue-600 outline outline-4 outline-blue-50 text-white flex items-center justify-center">
                                        <step.icon size={28} strokeWidth={1.5} />
                                    </div>
                                </div>

                                <div className="text-center">
                                    <h3 className="font-bold text-slate-800 text-[15px] leading-snug px-2">
                                        {step.title}
                                    </h3>
                                </div>

                                {index !== steps.length - 1 && (
                                    <div className="absolute top-[40px] -right-[12px] transform -translate-y-1/2 text-blue-400 z-0 bg-white rounded-full p-1 shadow-sm border border-blue-50">
                                        <ChevronRight size={20} strokeWidth={3} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content List Below (Matches provided structure) */}
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-10">
                        {steps.map((step) => (
                            <div key={step.id} className="flex flex-col items-start gap-3 bg-slate-50 border border-slate-100 p-5 rounded-2xl hover:shadow-md transition-shadow">
                                <div className="flex-shrink-0 font-bold text-[24px] text-blue-600 bg-blue-50 w-12 h-12 flex items-center justify-center rounded-full">
                                    {step.id}
                                </div>
                                <div>
                                    <h4 className="font-bold text-[16px] text-slate-900 mb-2 leading-tight">{step.title}</h4>
                                    <p className="text-slate-600 text-[14px] leading-relaxed">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center pt-8 border-t border-slate-200">
                        <p className="text-slate-800 font-medium text-lg inline-flex items-center justify-center">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600 font-bold mr-3 text-sm inline-flex">✓</span>
                            Our structured client management platform drives each of the stages.
                        </p>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default WorkFlow;