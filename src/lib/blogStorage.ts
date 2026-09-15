import { blogPosts as dummyBlogPosts } from '@/mock/blogPosts';

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
}

export const getCustomBlogs = (): BlogPost[] => {
    const stored = localStorage.getItem('constil_custom_blogs');
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            console.error('Failed to parse custom blogs', e);
        }
    }
    return [];
}

export const getDeletedDummyIds = (): (number | string)[] => {
    const stored = localStorage.getItem('constil_deleted_dummy_ids');
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            console.error('Failed to parse deleted dummy ids', e);
        }
    }
    return [];
}

export const saveCustomBlogs = (blogs: BlogPost[]) => {
    localStorage.setItem('constil_custom_blogs', JSON.stringify(blogs));
}

export const saveDeletedDummyIds = (ids: (number | string)[]) => {
    localStorage.setItem('constil_deleted_dummy_ids', JSON.stringify(ids));
}

export const getBlogs = (): BlogPost[] => {
    const customBlogs = getCustomBlogs();
    const deletedDummyIds = getDeletedDummyIds();
    
    // Filter out deleted dummy blogs
    const activeDummyBlogs = dummyBlogPosts.filter(b => !deletedDummyIds.includes(b.id)) as BlogPost[];
    
    // Combine custom and dummy blogs
    return [...customBlogs, ...activeDummyBlogs];
}

export const addBlog = (blog: Omit<BlogPost, 'id'>) => {
    const customBlogs = getCustomBlogs();
    const newBlog = {
        ...blog,
        id: `custom-${Date.now()}`
    };
    saveCustomBlogs([newBlog, ...customBlogs]);
}

export const updateBlog = (id: number | string, updatedBlog: BlogPost) => {
    const customBlogs = getCustomBlogs();
    const index = customBlogs.findIndex(b => b.id === id);
    
    if (index !== -1) {
        // Update existing custom blog
        customBlogs[index] = updatedBlog;
        saveCustomBlogs(customBlogs);
    } else {
        // User is editing a dummy blog. We "delete" the dummy and create a custom one with the same ID.
        const deletedIds = getDeletedDummyIds();
        if (!deletedIds.includes(id)) {
            saveDeletedDummyIds([...deletedIds, id]);
        }
        
        // Ensure we preserve the ID so URLs don't break if dependent on it (though we use slug for URLs)
        const newCustomBlog = { ...updatedBlog, id }; 
        saveCustomBlogs([newCustomBlog, ...customBlogs]);
    }
}

export const deleteBlog = (id: number | string) => {
    const customBlogs = getCustomBlogs();
    const index = customBlogs.findIndex(b => b.id === id);
    
    if (index !== -1) {
        // Delete custom blog
        customBlogs.splice(index, 1);
        saveCustomBlogs(customBlogs);
    } else {
        // Delete dummy blog
        const deletedIds = getDeletedDummyIds();
        if (!deletedIds.includes(id)) {
            saveDeletedDummyIds([...deletedIds, id]);
        }
    }
}
