import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { Calendar, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { blogPosts } from "@/mock/blogPosts";
import NotFound from "./NotFound";
import { generateBlogSchema } from "@/lib/schema/blogSchema";

const BlogDetail = () => {
    const { slug } = useParams<{ slug: string }>();
    const post = blogPosts.find((p) => p.slug === slug);
    const schema = generateBlogSchema(post);

    const getCleanText = (value) => {
        if (!value) return "";
        if (value?.props?.children) {
            return Array.isArray(value.props.children)
                ? value.props.children.join("")
                : value.props.children;
        }

        return "";
    };

    if (!post) {
        return <NotFound />;
    }

    return (
        <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20">
            <Helmet>
                <title>{post.metaTitle}</title>
                <meta name="description" content={post.metaDescription} />
                <link rel="canonical" href={`https://constil.com/blogs/${post.slug}`} />
                <script type="application/ld+json">
                    {JSON.stringify(schema)}
                </script>
            </Helmet>
            <Navbar />

            <main className="flex-grow pt-24 pb-16">
                <article className="container mx-auto px-4 max-w-6xl">
                    <Link
                        to="/blogs"
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 group"
                    >
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        Back to Blogs
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >


                        <div className="rounded-2xl overflow-hidden mb-5 shadow-lg border border-border">
                            <img
                                src={post.imageUrl}
                                alt={post.title}
                                className="w-full h-auto object-fit max-h-[500px]"
                            />
                        </div>
                        <div className="flex items-center gap-2 text-sm text-primary mb-4 font-medium">
                            <Calendar className="w-4 h-4" />
                            <time dateTime={post.date}>{post.date}</time>
                        </div>

                        <h1 className="text-2xl md:text-4xl font-extrabold text-foreground mb-8 leading-tight">
                            {post.title}
                        </h1>

                        <div className="prose max-w-none prose-headings:text-foreground prose-p:text-black prose-p:leading-relaxed prose-a:text-primary hover:prose-a:text-primary-hover prose-headings:mt-[18px] prose-headings:mb-[18px] prose-p:mt-[14px] prose-p:mb-[14px] ">

                            {post.description && post.description.map((paragraph, index) => (
                                typeof paragraph === 'string' && paragraph.trim() !== "" && (
                                    <p key={index} className="text-[17px] text-black">
                                        {paragraph}
                                    </p>
                                )
                            ))}

                            {post.Section && post.Section.map((sec, sIndex) => (
                                <div key={sIndex}>
                                    {sec.heading && sec.heading}

                                    {console.log("HEADING:", sec.heading)}

                                    {sec.img && (
                                        <div className="rounded-2xl overflow-hidden w-full h-[500px]">
                                            <img src={sec.img} alt={getCleanText(sec.heading)} className="w-full h-full object-contain" />
                                        </div>
                                    )}

                                    {sec.para && sec.para.map((p, pIndex) => (
                                        <p key={pIndex} className="text-[17px] text-black mb-6">
                                            {p}
                                        </p>
                                    ))}


                                    {sec.pointHeading && sec.pointHeading}

                                    {(sec.points) && (sec.points).length > 0 && (
                                        <ul className="list-disc pl-6 space-y-3 mb-8 marker:text-black">
                                            {(sec.points).map((pt, ptIndex) => (
                                                <li key={ptIndex} className="text-[17px] text-black">
                                                    {pt}
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    {sec.solutions && sec.solutions.map((sol, solIndex) => (
                                        <div key={solIndex} className="mt-8">
                                            {sol.title && <div className="mb-3">{sol.title}</div>}
                                            {sol.para && (
                                                <p className="text-[17px] text-black">
                                                    {sol.para}
                                                </p>
                                            )}
                                        </div>
                                    ))}

                                    {(sec.SolutionsPoints) && (sec.SolutionsPoints).length > 0 && (
                                        <ul className="list-disc pl-6 space-y-3 mb-8 marker:text-black">
                                            {(sec.SolutionsPoints).map((pt, ptIndex) => (
                                                <li key={ptIndex} className="text-[17px] text-black">
                                                    {pt}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}

                            {post.faqheading && <div className="my-5">{post.faqheading}</div>}

                            {post.faq && post.faq.length > 0 && (
                                <div className="space-y-6">
                                    {post.faq.map((f, fIndex) => (
                                        <div key={fIndex} className="bg-muted/50 p-4 rounded-xl border border-border">
                                            <h3 className="text-xl font-bold mb-3 mt-0 text-foreground">{f.quest}</h3>
                                            <p className="text-[17px] text-black m-0">{f.ans}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </article>
            </main>

            <Footer />
        </div >
    );
};

export default BlogDetail;