import { blogPosts as dummyBlogPosts } from '@/mock/blogPosts';
import { supabase } from './supabase';

export interface BlogPost {
    id: number | string;
    slug: string;
    metaTitle: string;
    metaDescription: string;
    title: string;
    shortDescription: string;
    description?: (string | any)[];
    date: string;
    imageUrl: string;
    author?: string;
    category?: string;
    content?: string; // New rich text content field for custom blogs
    Section?: any[];
    faqheading?: any;
    faq?: any[];
    created_at?: string;
}

export const getBlogs = async (): Promise<BlogPost[]> => {
    try {
        const { data, error } = await supabase
            .from('blogs')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching blogs from Supabase:', error);
            return dummyBlogPosts as BlogPost[];
        }

        const mappedDbBlogs = data.map(blog => ({
            ...blog,
            imageUrl: blog.image_url || blog.imageUrl,
            shortDescription: blog.short_description || blog.shortDescription,
            metaTitle: blog.meta_title || blog.metaTitle,
            metaDescription: blog.meta_description || blog.metaDescription,
        })) as BlogPost[];

        return [...mappedDbBlogs, ...dummyBlogPosts];
    } catch (e) {
        console.error('Exception fetching blogs:', e);
        return dummyBlogPosts as BlogPost[];
    }
}

export const getBlogBySlug = async (slug: string): Promise<BlogPost | null> => {
    try {
        const { data, error } = await supabase
            .from('blogs')
            .select('*')
            .eq('slug', slug)
            .single();
            
        if (error || !data) {
            const dummy = dummyBlogPosts.find(b => b.slug === slug);
            return (dummy as BlogPost) || null;
        }
        
        return {
            ...data,
            imageUrl: data.image_url || data.imageUrl,
            shortDescription: data.short_description || data.shortDescription,
            metaTitle: data.meta_title || data.metaTitle,
            metaDescription: data.meta_description || data.metaDescription,
        } as BlogPost;
    } catch (e) {
        const dummy = dummyBlogPosts.find(b => b.slug === slug);
        return (dummy as BlogPost) || null;
    }
}

export const addBlog = async (blog: Omit<BlogPost, 'id'>) => {
    const payload = {
        slug: blog.slug,
        title: blog.title,
        meta_title: blog.metaTitle,
        meta_description: blog.metaDescription,
        short_description: blog.shortDescription,
        date: blog.date,
        image_url: blog.imageUrl,
        content: blog.content,
    };
    const { error } = await supabase.from('blogs').insert([payload]);
    if (error) {
        console.error('Error adding blog:', error);
        throw error;
    }
}

export const updateBlog = async (id: number | string, updatedBlog: BlogPost) => {
    const payload = {
        slug: updatedBlog.slug,
        title: updatedBlog.title,
        meta_title: updatedBlog.metaTitle,
        meta_description: updatedBlog.metaDescription,
        short_description: updatedBlog.shortDescription,
        date: updatedBlog.date,
        image_url: updatedBlog.imageUrl,
        content: updatedBlog.content,
    };
    
    // First try to update
    const { error } = await supabase
        .from('blogs')
        .update(payload)
        .eq('id', id);

    if (error) {
        console.error('Error updating blog:', error);
        throw error;
    }
}

export const deleteBlog = async (id: number | string) => {
    const { error } = await supabase.from('blogs').delete().eq('id', id);
    if (error) {
        console.error('Error deleting blog:', error);
        throw error;
    }
}
