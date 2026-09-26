import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import WebSocket from 'ws';

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

function formatDate(dateString) {
  const d = new Date(dateString);
  // Format as YYYY-MM-DDTHH:mm:ss+00:00
  return d.toISOString().split('.')[0] + '+00:00';
}

async function generateSitemaps() {
  const nowISO = new Date().toISOString();
  const nowStr = formatDate(nowISO);

  let urls = [];

  // Pages
  const pages = [
    { url: '/', priority: '1.0000' },
    { url: '/invoices-management-software', priority: '0.8000' },
    { url: '/client-management-software', priority: '0.8000' },
    { url: '/estimates-software', priority: '0.8000' },
    { url: '/payment-tracking-software', priority: '0.8000' },
    { url: '/blogs', priority: '0.9000' },
    { url: '/contact', priority: '0.8000' },
    { url: '/about', priority: '0.8000' },
    { url: '/price', priority: '0.8000' },
  ];

  pages.forEach(p => {
    urls.push(`  <url>
       <loc>${BASE_URL}${p.url}</loc>
       <lastmod>${nowStr}</lastmod>
       <priority>${p.priority}</priority>
  </url>`);
  });

  // Blogs
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

  const staticBlogs = [
    { slug: 'what-is-ai-construction-estimating-software', date: nowISO },
    { slug: 'how-ai-construction-takeoff-software-improves-estimating-accuracy', date: nowISO }
  ];

  const blogEntries = [];
  staticBlogs.forEach(sb => {
    if (!blogs.find(b => b.slug === sb.slug)) {
      blogEntries.push({
        url: `/blogs/${sb.slug}`,
        lastmod: formatDate(sb.date),
        priority: '0.8000'
      });
    }
  });

  blogs.forEach(b => {
    const date = b.publish_date || b.created_at || nowISO;
    let formattedDate = nowStr;
    try {
      if (date) formattedDate = formatDate(date);
    } catch(e) {}
    blogEntries.push({
      url: `/blogs/${b.slug}`,
      lastmod: formattedDate,
      priority: '0.8000'
    });
  });

  blogEntries.forEach(b => {
    urls.push(`  <url>
       <loc>${BASE_URL}${b.url}</loc>
       <lastmod>${b.lastmod}</lastmod>
       <priority>${b.priority}</priority>
  </url>`);
  });

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/css" href="https://www.xml-sitemaps.com/css/sitemap.css"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>`;

  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemapXml);
  
  // Optionally delete the old ones so they don't linger
  if (fs.existsSync(path.join(PUBLIC_DIR, 'pages-sitemap.xml'))) {
      fs.unlinkSync(path.join(PUBLIC_DIR, 'pages-sitemap.xml'));
  }
  if (fs.existsSync(path.join(PUBLIC_DIR, 'blogs-sitemap.xml'))) {
      fs.unlinkSync(path.join(PUBLIC_DIR, 'blogs-sitemap.xml'));
  }

  console.log('✅ Single Sitemap generated successfully.');
}

generateSitemaps().catch(console.error);
