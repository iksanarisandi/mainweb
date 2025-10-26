// Cloudflare Pages Worker - Handle API and Storage routing
// Proxy both /api/* and /storage/* to Workers backend
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const backendUrl = 'https://mainweb-workers.threadsauto.workers.dev';
    
    // Handle /storage/* - Proxy to Workers backend (which has R2 binding)
    if (url.pathname.startsWith('/storage/')) {
      return proxyToBackend(request, backendUrl);
    }
    
    // Handle /api/* - Proxy to Workers backend
    if (url.pathname.startsWith('/api/')) {
      return proxyToBackend(request, backendUrl);
    }
    
    // Default: serve static files from Pages
    return env.ASSETS.fetch(request);
  }
};

// Proxy request to Workers backend
async function proxyToBackend(request, backendUrl) {
  try {
    const url = new URL(request.url);
    
    // Create new URL with backend domain
    const targetUrl = backendUrl + url.pathname + url.search;
    
    // Clone request with new URL
    const modifiedRequest = new Request(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body,
      redirect: 'follow'
    });
    
    // Forward to backend
    const response = await fetch(modifiedRequest);
    
    // Return response with CORS headers
    const newResponse = new Response(response.body, response);
    newResponse.headers.set('access-control-allow-origin', '*');
    
    return newResponse;
  } catch (error) {
    console.error('Proxy error:', error);
    return new Response('Proxy error: ' + error.message, { status: 500 });
  }
}
