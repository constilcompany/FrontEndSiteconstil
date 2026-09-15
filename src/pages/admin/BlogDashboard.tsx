import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBlogs, addBlog, updateBlog, deleteBlog, BlogPost } from '@/lib/blogStorage';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const BlogDashboard = () => {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentBlog, setCurrentBlog] = useState<Partial<BlogPost>>({});

    useEffect(() => {
        if (localStorage.getItem('constil_admin_auth') !== 'true') {
            navigate('/admin');
            return;
        }
        loadBlogs();
    }, [navigate]);

    const loadBlogs = () => setBlogs(getBlogs());

    const handleLogout = () => {
        localStorage.removeItem('constil_admin_auth');
        navigate('/admin');
    };

    const generateSlug = (text: string) => {
        return text.toString().toLowerCase()
            .replace(/\s+/g, '-')           // Replace spaces with -
            .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
            .replace(/\-\-+/g, '-')         // Replace multiple - with single -
            .replace(/^-+/, '')             // Trim - from start of text
            .replace(/-+$/, '');            // Trim - from end of text
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        const autoSlug = generateSlug(title);
        
        // Only override slug if it's currently empty, or if it matched the previous title's slug
        const prevAutoSlug = currentBlog.title ? generateSlug(currentBlog.title) : '';
        if (!currentBlog.slug || currentBlog.slug === prevAutoSlug) {
            setCurrentBlog({ ...currentBlog, title, slug: autoSlug });
        } else {
            setCurrentBlog({ ...currentBlog, title });
        }
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!currentBlog.title || !currentBlog.slug || !currentBlog.date) {
            alert('Please fill out Title, Slug, and Date at minimum.');
            return;
        }

        if (currentBlog.id) {
            updateBlog(currentBlog.id, currentBlog as BlogPost);
        } else {
            addBlog(currentBlog as Omit<BlogPost, 'id'>);
        }
        
        setIsEditing(false);
        setCurrentBlog({});
        loadBlogs();
    };

    const handleEdit = (blog: BlogPost) => {
        setCurrentBlog(blog);
        setIsEditing(true);
    };

    const handleDelete = (id: string | number) => {
        if (window.confirm('Are you sure you want to delete this blog?')) {
            deleteBlog(id);
            loadBlogs();
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Check file size (e.g. 2MB max to not blow up localStorage)
            if (file.size > 2 * 1024 * 1024) {
                alert('File is too large. Please select an image under 2MB.');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setCurrentBlog({...currentBlog, imageUrl: reader.result as string});
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-foreground">Blog Dashboard</h1>
                    <button onClick={handleLogout} className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-lg hover:bg-red-100 font-medium transition-colors">Logout</button>
                </div>

                {isEditing ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-border p-8 mb-8">
                        <h2 className="text-2xl font-semibold mb-6 text-foreground">{currentBlog.id ? 'Edit Blog' : 'Add New Blog'}</h2>
                        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-slate-700">Title *</label>
                                <input className="w-full border border-border rounded-lg p-2.5 focus:ring-1 focus:ring-primary focus:border-primary" value={currentBlog.title || ''} onChange={handleTitleChange} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-slate-700">Slug * (e.g. my-new-post)</label>
                                <input className="w-full border border-border rounded-lg p-2.5 focus:ring-1 focus:ring-primary focus:border-primary" value={currentBlog.slug || ''} onChange={e => setCurrentBlog({...currentBlog, slug: e.target.value})} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-slate-700">Cover Image</label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-lg hover:border-primary transition-colors relative overflow-hidden bg-white h-[120px]">
                                    {currentBlog.imageUrl ? (
                                        <div className="absolute inset-0 w-full h-full">
                                            <img src={currentBlog.imageUrl} alt="Cover" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                <p className="text-white font-medium">Click or Drag to change</p>
                                            </div>
                                            <input 
                                                type="file" 
                                                accept="image/*"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                onChange={handleImageUpload}
                                            />
                                        </div>
                                    ) : (
                                        <div className="space-y-1 text-center flex flex-col items-center justify-center h-full">
                                            <div className="flex text-sm text-slate-600 justify-center">
                                                <span className="font-medium text-primary">Upload a file</span>
                                                <p className="pl-1">or drag and drop</p>
                                            </div>
                                            <p className="text-xs text-slate-500">PNG, JPG up to 2MB</p>
                                            <input 
                                                type="file" 
                                                accept="image/*"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                onChange={handleImageUpload}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-slate-700">Publish Date *</label>
                                <input type="date" className="w-full border border-border rounded-lg p-2.5 focus:ring-1 focus:ring-primary focus:border-primary" value={currentBlog.date || ''} onChange={e => setCurrentBlog({...currentBlog, date: e.target.value})} required />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-2 text-slate-700">Short Description</label>
                                <textarea className="w-full border border-border rounded-lg p-2.5 h-20 focus:ring-1 focus:ring-primary focus:border-primary" value={currentBlog.shortDescription || ''} onChange={e => setCurrentBlog({...currentBlog, shortDescription: e.target.value})} />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-2 text-slate-700 flex items-center justify-between">
                                    <span>Full Content (Rich Text)</span>
                                    {currentBlog.id && !currentBlog.content && <span className="text-amber-500 font-normal">Legacy dummy blog format detected. Editing this will overwrite it as custom content.</span>}
                                </label>
                                <div className="bg-white rounded-lg [&_.ql-editor]:min-h-[300px] [&_.ql-toolbar]:rounded-t-lg [&_.ql-container]:rounded-b-lg">
                                    <ReactQuill 
                                        theme="snow"
                                        value={currentBlog.content || ''} 
                                        onChange={value => setCurrentBlog({...currentBlog, content: value})} 
                                        modules={{
                                            toolbar: [
                                                [{ 'header': [1, 2, 3, false] }],
                                                [{ 'size': ['small', false, 'large', 'huge'] }],
                                                ['bold', 'italic', 'underline', 'strike'],
                                                [{ 'color': [] }, { 'background': [] }],
                                                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                                                [{ 'align': [] }],
                                                ['link', 'image'],
                                                ['clean']
                                            ]
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="md:col-span-2 border-t border-border pt-6 mt-2">
                                <h3 className="text-lg font-semibold text-slate-800 mb-4">SEO Settings</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-slate-700">Meta Title</label>
                                        <input className="w-full border border-border rounded-lg p-2.5 focus:ring-1 focus:ring-primary focus:border-primary" value={currentBlog.metaTitle || ''} onChange={e => setCurrentBlog({...currentBlog, metaTitle: e.target.value})} placeholder="Leave blank to use Blog Title" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-slate-700">Meta Description</label>
                                        <textarea className="w-full border border-border rounded-lg p-2.5 h-[42px] focus:ring-1 focus:ring-primary focus:border-primary" value={currentBlog.metaDescription || ''} onChange={e => setCurrentBlog({...currentBlog, metaDescription: e.target.value})} placeholder="Leave blank to use Short Description" />
                                    </div>
                                </div>
                            </div>
                            <div className="md:col-span-2 flex gap-4 mt-2">
                                <button type="submit" className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-semibold hover:opacity-90 transition-opacity">Save Blog</button>
                                <button type="button" onClick={() => { setIsEditing(false); setCurrentBlog({}); }} className="bg-slate-100 text-slate-700 px-6 py-2.5 rounded-lg font-semibold hover:bg-slate-200 transition-colors">Cancel</button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
                        <div className="flex justify-between items-center p-6 border-b border-border bg-slate-50/50">
                            <h2 className="text-xl font-semibold text-foreground">All Blogs</h2>
                            <button onClick={() => setIsEditing(true)} className="bg-primary text-primary-foreground px-5 py-2 rounded-lg hover:opacity-90 font-medium transition-opacity">Add New Blog</button>
                        </div>
                        <ul className="divide-y divide-border">
                            {blogs.map(blog => (
                                <li key={blog.id} className="flex justify-between items-center p-6 hover:bg-slate-50 transition-colors">
                                    <div className="flex gap-4 items-center">
                                        <div className="w-16 h-12 bg-slate-200 rounded overflow-hidden flex-shrink-0 border border-border">
                                            {blog.imageUrl && <img src={blog.imageUrl} alt="" className="w-full h-full object-cover" />}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg text-foreground mb-1">{blog.title}</h3>
                                            <p className="text-sm text-slate-500">{blog.date} &middot; <a href={`/blogs/${blog.slug}`} target="_blank" className="text-primary hover:underline">/{blog.slug}</a></p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEdit(blog)} className="px-4 py-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-medium transition-colors">Edit</button>
                                        <button onClick={() => handleDelete(blog.id)} className="px-4 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-medium transition-colors">Delete</button>
                                    </div>
                                </li>
                            ))}
                            {blogs.length === 0 && <li className="p-8 text-center text-slate-500">No blogs found.</li>}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogDashboard;
