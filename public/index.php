<?php
// Supabase Configuration
$supabaseUrl = "https://avppbvsxayehguepyjkb.supabase.co";
$supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2cHBidnN4YXllaGd1ZXB5amtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwMzM5NjIsImV4cCI6MjA5MjYwOTk2Mn0.9deO5EvQLpilKfIWdAFqfoWkKx5wOwRbdnX7o0N1Yek";

// Parse the Request URL
$requestUri = $_SERVER['REQUEST_URI'];
$parsedUrl = parse_url($requestUri);
$path = $parsedUrl['path'];

// Check if the route is a blog route (e.g. /blogs/slug or /blog/slug)
$isBlogRoute = false;
$slug = "";

if (preg_match('#^/blogs?/([^/]+)/?$#i', $path, $matches)) {
    $isBlogRoute = true;
    $slug = $matches[1];
}

// Function to format slug to title case (Fallback)
function formatSlugToTitle($slug) {
    if (empty($slug)) return "Blog Post";
    $words = explode('-', $slug);
    $words = array_map('ucfirst', $words);
    return implode(' ', $words);
}

// Load the compiled React index.html
$htmlFilePath = __DIR__ . '/index.html';
if (!file_exists($htmlFilePath)) {
    die("Error: index.html not found.");
}
$html = file_get_contents($htmlFilePath);

if ($isBlogRoute && !empty($slug)) {
    // 1. Fetch from Supabase
    $apiUrl = $supabaseUrl . "/rest/v1/blogs?slug=eq." . urlencode($slug) . "&select=*";
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $apiUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "apikey: " . $supabaseAnonKey,
        "Authorization: Bearer " . $supabaseAnonKey
    ]);
    curl_setopt($ch, CURLOPT_TIMEOUT, 3); // 3 seconds timeout
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    $seoTitle = "";
    $seoDescription = "";
    
    if ($httpCode == 200 && $response) {
        $data = json_decode($response, true);
        if (is_array($data) && count($data) > 0) {
            $post = $data[0];
            
            // Priority for Title: meta_title -> title
            $seoTitle = !empty($post['meta_title']) ? $post['meta_title'] : (!empty($post['title']) ? $post['title'] : "");
            
            // Priority for Description: meta_description -> short_description -> title
            $seoDescription = !empty($post['meta_description']) ? $post['meta_description'] : (!empty($post['short_description']) ? $post['short_description'] : $seoTitle);
        }
    }
    
    // 2. Fallbacks
    if (empty($seoTitle)) {
        $seoTitle = formatSlugToTitle($slug) . " | CONSTIL";
    }
    if (empty($seoDescription)) {
        $seoDescription = "Read our latest blog post on CONSTIL. AI-powered construction estimation and invoicing insights.";
    }
    
    // 3. Inject into HTML
    // Replace <title> tag
    $html = preg_replace('/<title>.*?<\/title>/i', '<title>' . htmlspecialchars($seoTitle) . '</title>', $html);
    
    // Replace <meta name="description"> tag
    $html = preg_replace('/<meta\s+name=["\']description["\']\s+content=["\'].*?["\']\s*\/?>/i', '<meta name="description" content="' . htmlspecialchars($seoDescription) . '" />', $html);
}

// Output the final HTML
echo $html;
?>
