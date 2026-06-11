import { motion } from "framer-motion";
import { ArrowRight, Calendar, User } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

const blogPosts = [
    {
        id: 1,
        title: "10 Reasons Why Construction Estimating Software is Essential",
        excerpt: "Discover how modern software is revolutionizing the way contractors estimate costs and materials, leading to more profitable projects.",
        category: "Estimating",
        date: "March 20, 2026",
        author: "Jane Doe",
        imageUrl: "https://plus.unsplash.com/premium_photo-1664474493968-dbab638f26fa?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        id: 2,
        title: "Streamlining Client Management in the Digital Age",
        excerpt: "Keeping track of clients, documents, and communications doesn't have to be a headache. Learn our top strategies for client management.",
        category: "Management",
        date: "March 15, 2026",
        author: "John Smith",
        imageUrl: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=800",
    },
    {
        id: 3,
        title: "The Future of Payment Tracking in Construction",
        excerpt: "No more chasing down invoices. See how automated payment tracking can improve your cash flow and save you time.",
        category: "Finance",
        date: "March 10, 2026",
        author: "Alice Johnson",
        imageUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800",
    },
    {
        id: 4,
        title: "How AI is Changing Construction Blueprints",
        excerpt: "Artificial Intelligence is making it easier to analyze complex blueprints and detect errors before construction even begins.",
        category: "Technology",
        date: "March 5, 2026",
        author: "David Lee",
        imageUrl: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=800",
    },
    {
        id: 5,
        title: "Best Practices for On-Site Invoice Management",
        excerpt: "A guide on how to efficiently manage invoices directly from the job site to ensure you get paid faster.",
        category: "Invoicing",
        date: "February 28, 2026",
        author: "Sarah Brown",
        imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800",
    },
    {
        id: 6,
        title: "Maximizing ROI with CONSTIL Features",
        excerpt: "An in-depth look at how to leverage our robust features to get the most out of your construction projects.",
        category: "Product",
        date: "February 20, 2026",
        author: "The CONSTIL Team",
        imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800",
    }
];

const Blog = () => {
    return (
        <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20">
            <Navbar />

            <main className="flex-grow pt-16 pb-16">
                {/* Header Section */}
                <section className="bg-primary/5 py-16 md:py-24 mb-12 border-b border-border">
                    <div className="container mx-auto px-4 max-w-7xl text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="inline-block mb-4 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold tracking-wide"
                        >
                            Our Journal
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6"
                        >
                            Insights & <span className="text-primary">News</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
                        >
                            Discover the latest strategies, tips, and updates in the world of construction software and project management.
                        </motion.p>
                    </div>
                </section>

                {/* Blog Grid */}
                <section className="container mx-auto px-4 max-w-7xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogPosts.map((post, index) => (
                            <motion.article
                                key={post.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border hover:shadow-xl hover:-translate-y-1 hover:border-primary/30 transition-all duration-300 group flex flex-col"
                            >
                                <div className="relative h-60 overflow-hidden bg-muted">
                                    <img
                                        src={post.imageUrl}
                                        alt={post.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        loading="lazy"
                                    />
                                    <div className="absolute top-4 left-4 z-10">
                                        <span className="bg-background/90 backdrop-blur-md text-foreground text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm border border-border/50">
                                            {post.category}
                                        </span>
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>

                                <div className="p-6 md:p-8 flex flex-col flex-grow bg-background">
                                    <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground mb-4">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-4 h-4 text-primary/70" />
                                            {post.date}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <User className="w-4 h-4 text-primary/70" />
                                            {post.author}
                                        </div>
                                    </div>

                                    <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                                        <Link to={`/blog/${post.id}`}>
                                            {post.title}
                                        </Link>
                                    </h3>

                                    <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                                        {post.excerpt}
                                    </p>

                                    <Link
                                        to={`/blog/${post.id}`}
                                        className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:text-primary-hover mt-auto group/link"
                                    >
                                        Read Full Article
                                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                                    </Link>
                                </div>
                            </motion.article>
                        ))}
                    </div>

                    {/* Load More Button */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="mt-16 text-center"
                    >
                        <button className="px-8 py-3 rounded-full border-2 border-primary text-primary font-bold hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                            Load More Articles
                        </button>
                    </motion.div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Blog;
