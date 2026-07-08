export const generateBlogSchema = (blog) => {
    const url = `https://constil.com/blogs/${blog.slug}`;

    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "BlogPosting",
                "@id": `${url}#blogposting`,
                mainEntityOfPage: {
                    "@type": "WebPage",
                    "@id": url,
                },
                headline: blog.title,
                description: blog.metaDescription,
                url,
                image: {
                    "@type": "ImageObject",
                    url: url + blog.imageUrl,
                },
                author: {
                    "@type": "Organization",
                    name: "Constil",
                    url: "https://constil.com",
                },
                publisher: {
                    "@type": "Organization",
                    name: "Constil",
                    logo: {
                        "@type": "ImageObject",
                        url: "https://constil.com/favicon.ico",
                    },
                },
            },

            {
                "@type": "BreadcrumbList",
                "@id": `${url}#breadcrumb`,
                itemListElement: [
                    {
                        "@type": "ListItem",
                        position: 1,
                        name: "Home",
                        item: "https://constil.com",
                    },
                    {
                        "@type": "ListItem",
                        position: 2,
                        name: "Blogs",
                        item: "https://constil.com/blogs",
                    },
                    {
                        "@type": "ListItem",
                        position: 3,
                        name: blog.title,
                        item: url,
                    },
                ],
            },

            {
                "@type": "FAQPage",
                "@id": `${url}#faq`,
                mainEntity: blog.faq.map((faq) => ({
                    "@type": "Question",
                    name: faq.quest,
                    acceptedAnswer: {
                        "@type": "Answer",
                        text: faq.ans,
                    },
                })),
            },
        ],
    };
};