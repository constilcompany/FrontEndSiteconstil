import { motion } from "framer-motion";
import { ArrowRight, Calendar, User } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import BlogHeader from '@/components/BlogHeader';
import { blogPosts } from '@/mock/blogPosts';

const Blog = () => {
    return (
        <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20">
            <Helmet>
                <title>Blog - Constil</title>
                <meta name="description" content="Read the latest articles, insights, and updates from Constil on construction estimating, project management, and industry trends." />
                <link rel="canonical" href="https://constil.com/blogs"></link>
            </Helmet>
            <Navbar />

            <main className="flex-grow pt-16 pb-16">
                <BlogHeader />

                <section className="container mx-auto px-4 max-w-7xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogPosts.map((post, index) => (
                            <Link
                                key={post.id}
                                to={`/blogs/${post.slug}`}
                                className="block"
                            >
                                <motion.article
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border hover:shadow-xl hover:-translate-y-1 hover:border-primary/30 transition-all duration-300 group flex flex-col h-full cursor-pointer"
                                >
                                    <div className="relative h-60 overflow-hidden bg-muted">
                                        <img
                                            src={post.imageUrl}
                                            alt={post.title}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />

                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>

                                    <div className="p-4 flex flex-col flex-grow bg-background">
                                        <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground mb-4">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-4 h-4 text-primary/70" />
                                                {post.date}
                                            </div>
                                        </div>

                                        <h1 className="text-xl md:text-[18px] font-bold text-foreground mb-3 leading-snug group-hover:text-primary transition-colors line-clamp-3">
                                            {post.title}
                                        </h1>

                                        <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                                            {post.shortDescription}
                                        </p>

                                        <div className="inline-flex items-center gap-2 text-primary font-semibold text-sm mt-auto">
                                            Read Full Article
                                            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                                        </div>
                                    </div>
                                </motion.article>
                            </Link>
                        ))}
                    </div>

                    {blogPosts.length > 6 && <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="mt-16 text-center"
                    >
                        <button className="px-8 py-3 rounded-full border-2 border-primary text-primary font-bold hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                            Load More Articles
                        </button>
                    </motion.div>}
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Blog;
