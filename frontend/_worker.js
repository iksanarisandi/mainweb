// Cloudflare Pages Worker - Handle API and Storage routing
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Handle /storage/* - Proxy to R2
    if (url.pathname.startsWith('/storage/')) {
      return handleStorage(request, env, url);
    }
    
    // Handle /api/* - Proxy to Workers backend
    if (url.pathname.startsWith('/api/')) {
      return handleAPI(request, env);
    }
    
    // Default: serve static files from Pages
    return env.ASSETS.fetch(request);
  }
};

// Handle Storage - Proxy to R2 Bucket
async function handleStorage(request, env, url) {
  try {
    const path = url.pathname.replace('/storage/', '');
    
    // Get file from R2
    const object = await env.STORAGE.get(path);
    
    if (!object) {
      return new Response('File not found', { status: 404 });
    }
    
    // Create response with proper headers
    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);
    headers.set('cache-control', 'public, max-age=31536000');
    headers.set('access-control-allow-origin', '*');
    
    return new Response(object.body, { headers });
  } catch (error) {
    console.error('Storage error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

// Handle API - Proxy to Workers Backend
async function handleAPI(request, env) {
  // Get backend URL from environment or use default
  const backendUrl = env.BACKEND_URL || 'https://mainweb-workers.threadsauto.workers.dev';
  
  // Create new URL with backend domain
  const url = new URL(request.url);
  url.hostname = new URL(backendUrl).hostname;
  
  // Clone request with new URL
  const modifiedRequest = new Request(url.toString(), request);
  
  // Forward to backend
  return fetch(modifiedRequest);
}
