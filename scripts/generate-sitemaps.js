import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf-8');
  envConfig.split('\n').forEach((line) => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/(^['"]|['"]$)/g, '');
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  });
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY");
  process.exit(1);
}

import WebSocket from 'ws';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false
  },
  global: {
    fetch: fetch,
  },
  realtime: {
    transport: WebSocket
  }
});

const BASE_URL = 'https://constil.com';
const PUBLIC_DIR = path.resolve(__dirname, '../public');

// Ensure public directory exists
if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

async function generateSitemaps() {
  const now = new Date().toISOString();

  // 1. Master Sitemap
  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${BASE_URL}/pages-sitemap.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/blogs-sitemap.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
</sitemapindex>`;

  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemapIndex);

  // 2. Pages Sitemap
  const pages = [
    { url: '/', priority: '1.0' },
    { url: '/invoices-management-software', priority: '0.8' },
    { url: '/client-management-software', priority: '0.8' },
    { url: '/estimates-software', priority: '0.8' },
    { url: '/payment-tracking-software', priority: '0.8' },
    { url: '/blogs', priority: '0.9' },
    { url: '/contact', priority: '0.8' },
    { url: '/about', priority: '0.8' },
    { url: '/price', priority: '0.8' },
  ];

  const pagesXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(p => `  <url>
    <loc>${BASE_URL}${p.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  fs.writeFileSync(path.join(PUBLIC_DIR, 'pages-sitemap.xml'), pagesXml);

  // 3. Blogs Sitemap
  let blogs = [];
  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('slug, created_at, publish_date');

    if (error) {
      console.error("Error fetching blogs:", error.message);
    } else if (data) {
      blogs = data;
    }
  } catch (err) {
    console.error("Failed to fetch blogs from Supabase:", err);
  }

  // Static blogs requested by user
  const staticBlogs = [
    { slug: 'what-is-ai-construction-estimating-software', date: now },
    { slug: 'how-ai-construction-takeoff-software-improves-estimating-accuracy', date: now }
  ];

  const blogEntries = [];
  
  // Add static blogs first
  staticBlogs.forEach(sb => {
    // only add if not already in dynamic blogs
    if (!blogs.find(b => b.slug === sb.slug)) {
      blogEntries.push({
        url: `/blogs/${sb.slug}`,
        lastmod: sb.date,
        priority: '0.8'
      });
    }
  });

  // Add dynamic blogs
  blogs.forEach(b => {
    const date = b.publish_date || b.created_at || now;
    // ensure date is valid ISO
    let isoDate = now;
    try {
      if (date) {
        isoDate = new Date(date).toISOString();
      }
    } catch(e) {
      // fallback
    }
    blogEntries.push({
      url: `/blogs/${b.slug}`,
      lastmod: isoDate,
      priority: '0.8'
    });
  });

  const blogsXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${blogEntries.map(b => `  <url>
    <loc>${BASE_URL}${b.url}</loc>
    <lastmod>${b.lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${b.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  fs.writeFileSync(path.join(PUBLIC_DIR, 'blogs-sitemap.xml'), blogsXml);

  console.log('✅ Sitemaps generated successfully.');
}

generateSitemaps().catch(console.error);
