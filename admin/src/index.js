/**
 * Cose Vintage Admin - Cloudflare Worker
 * v1.0.0 - 2026-01-13
 *
 * API endpoints for product management
 */

import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from './products.js';

import {
  uploadImage,
  deleteImage,
  addProductImage,
  getProductImages,
  deleteProductImage,
  setPrimaryImage
} from './images.js';

import { renderAdminPage } from './ui.js';

/**
 * CORS headers for API responses
 */
function corsHeaders(env) {
  return {
    'Access-Control-Allow-Origin': env.CORS_ORIGIN || '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

/**
 * JSON response helper
 */
function jsonResponse(data, status = 200, env = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(env)
    }
  });
}

/**
 * Check authentication
 */
function checkAuth(request, env) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) return false;

  const [type, credentials] = authHeader.split(' ');
  if (type !== 'Basic') return false;

  const decoded = atob(credentials);
  const [, password] = decoded.split(':');

  return password === env.ADMIN_PASSWORD;
}

/**
 * Main request handler
 */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // Handle CORS preflight
    if (method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders(env)
      });
    }

    // Serve admin UI at root
    if (path === '/' || path === '/admin') {
      return new Response(renderAdminPage(), {
        headers: { 'Content-Type': 'text/html' }
      });
    }

    // API routes require authentication
    if (path.startsWith('/api/')) {
      if (!checkAuth(request, env)) {
        return jsonResponse({ error: 'Unauthorized' }, 401, env);
      }

      // Route to appropriate handler
      return handleApiRequest(request, env, path, method);
    }

    return new Response('Not Found', { status: 404 });
  }
};

/**
 * Handle API requests
 */
async function handleApiRequest(request, env, path, method) {
  const db = env.DB;
  const r2 = env.IMAGES;

  try {
    // Products endpoints
    if (path === '/api/products') {
      if (method === 'GET') {
        const url = new URL(request.url);
        const filters = {
          categoria: url.searchParams.get('categoria'),
          genere: url.searchParams.get('genere'),
          disponibile: url.searchParams.get('disponibile') === 'true' ? true : undefined,
          epoca: url.searchParams.get('epoca')
        };
        // Remove undefined filters
        Object.keys(filters).forEach(k => filters[k] === undefined && delete filters[k]);

        const result = await getProducts(db, filters);
        return jsonResponse(result, result.success ? 200 : 500, env);
      }

      if (method === 'POST') {
        const data = await request.json();
        const result = await createProduct(db, data);
        return jsonResponse(result, result.success ? 201 : 400, env);
      }
    }

    // Single product endpoints
    const productMatch = path.match(/^\/api\/products\/(\d+)$/);
    if (productMatch) {
      const id = parseInt(productMatch[1]);

      if (method === 'GET') {
        const result = await getProductById(db, id);
        return jsonResponse(result, result.success ? 200 : 404, env);
      }

      if (method === 'PUT') {
        const data = await request.json();
        const result = await updateProduct(db, id, data);
        return jsonResponse(result, result.success ? 200 : 400, env);
      }

      if (method === 'DELETE') {
        const result = await deleteProduct(db, id);
        return jsonResponse(result, result.success ? 200 : 404, env);
      }
    }

    // Product images endpoints
    const imagesMatch = path.match(/^\/api\/products\/(\d+)\/images$/);
    if (imagesMatch) {
      const productId = parseInt(imagesMatch[1]);

      if (method === 'GET') {
        const result = await getProductImages(db, productId);
        return jsonResponse(result, 200, env);
      }

      if (method === 'POST') {
        // Handle multipart form data for image upload
        const formData = await request.formData();
        const file = formData.get('image');

        if (!file) {
          return jsonResponse({ success: false, error: 'No image provided' }, 400, env);
        }

        const arrayBuffer = await file.arrayBuffer();
        const fileData = new Uint8Array(arrayBuffer);

        // Upload to R2
        const uploadResult = await uploadImage(r2, fileData, file.name, file.type);
        if (!uploadResult.success) {
          return jsonResponse(uploadResult, 400, env);
        }

        // Add reference to database
        const isPrimary = formData.get('isPrimary') === 'true';
        const dbResult = await addProductImage(db, productId, uploadResult.url, isPrimary);

        return jsonResponse({
          success: true,
          imageId: dbResult.id,
          url: uploadResult.url,
          key: uploadResult.key
        }, 201, env);
      }
    }

    // Single image endpoints
    const imageMatch = path.match(/^\/api\/images\/(\d+)$/);
    if (imageMatch) {
      const imageId = parseInt(imageMatch[1]);

      if (method === 'DELETE') {
        const result = await deleteProductImage(db, imageId);
        return jsonResponse(result, result.success ? 200 : 404, env);
      }
    }

    // Set primary image
    const primaryMatch = path.match(/^\/api\/products\/(\d+)\/images\/(\d+)\/primary$/);
    if (primaryMatch && method === 'PUT') {
      const productId = parseInt(primaryMatch[1]);
      const imageId = parseInt(primaryMatch[2]);
      const result = await setPrimaryImage(db, productId, imageId);
      return jsonResponse(result, result.success ? 200 : 400, env);
    }

    return jsonResponse({ error: 'Not Found' }, 404, env);

  } catch (error) {
    console.error('API Error:', error);
    return jsonResponse({ error: error.message }, 500, env);
  }
}
