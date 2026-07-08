import { motion } from "framer-motion";

const BlogHeader = () => {
    return (
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
    )
}

export default BlogHeader