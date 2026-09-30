export const compressHtmlBase64Images = async (html: string): Promise<string> => {
    if (!html.includes('data:image/')) return html;

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const images = Array.from(doc.querySelectorAll('img'));
    
    let modified = false;

    for (const img of images) {
        const src = img.getAttribute('src');
        if (src && src.startsWith('data:image/') && src.length > 500000) { // Only compress if > ~500KB
            try {
                // Convert base64 to Blob
                const res = await fetch(src);
                const blob = await res.blob();
                const file = new File([blob], 'image.jpeg', { type: 'image/jpeg' });
                
                // Compress
                const imageCompression = (await import('browser-image-compression')).default;
                const compressedFile = await imageCompression(file, { maxSizeMB: 0.5, maxWidthOrHeight: 1920, useWebWorker: true });
                
                // Convert back to base64
                const compressedSrc = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.onerror = reject;
                    reader.readAsDataURL(compressedFile);
                });
                
                img.setAttribute('src', compressedSrc);
                modified = true;
            } catch (err) {
                console.error('Failed to compress inline image:', err);
            }
        }
    }

    return modified ? doc.body.innerHTML : html;
};
