/**
 * Images Operations - R2 Storage + DB References
 * v1.0.0 - 2026-01-13
 *
 * Upload, delete, and manage product images
 */

// Valid image types
const VALID_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB

/**
 * Generate unique key for image storage
 */
function generateImageKey(filename) {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const ext = filename.split('.').pop() || 'jpg';
  return `products/${timestamp}-${random}.${ext}`;
}

/**
 * Get public URL for an image key
 */
export function getImageUrl(key, bucketPublicUrl = '') {
  // Serve images via Worker /images/ endpoint
  return `/images/${key}`;
}

/**
 * Upload image to R2
 */
export async function uploadImage(r2, file, filename, contentType) {
  // Validate content type
  if (!VALID_IMAGE_TYPES.includes(contentType)) {
    return {
      success: false,
      error: `Invalid file type. Allowed types: ${VALID_IMAGE_TYPES.join(', ')}`
    };
  }

  // Validate file size
  if (file.length > MAX_FILE_SIZE) {
    return {
      success: false,
      error: `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB`
    };
  }

  try {
    const key = generateImageKey(filename);

    await r2.put(key, file, {
      httpMetadata: {
        contentType: contentType
      }
    });

    return {
      success: true,
      key: key,
      url: getImageUrl(key)
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Delete image from R2
 */
export async function deleteImage(r2, key) {
  try {
    await r2.delete(key);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Add image reference to product in database
 */
export async function addProductImage(db, productId, url, isPrimary = false) {
  try {
    const stmt = db.prepare(`
      INSERT INTO product_images (product_id, url, is_primary)
      VALUES (?, ?, ?)
    `);

    const result = await stmt.bind(
      productId,
      url,
      isPrimary ? 1 : 0
    ).run();

    return {
      success: true,
      id: result.meta.last_row_id
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Get all images for a product
 */
export async function getProductImages(db, productId) {
  try {
    const stmt = db.prepare(`
      SELECT * FROM product_images
      WHERE product_id = ?
      ORDER BY is_primary DESC, created_at ASC
    `);

    const result = await stmt.bind(productId).all();

    return {
      success: true,
      images: result.results || []
    };
  } catch (error) {
    return { success: false, error: error.message, images: [] };
  }
}

/**
 * Delete image reference from database
 */
export async function deleteProductImage(db, imageId) {
  try {
    const stmt = db.prepare('DELETE FROM product_images WHERE id = ?');
    await stmt.bind(imageId).run();

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Set an image as primary for a product
 */
export async function setPrimaryImage(db, productId, imageId) {
  try {
    // First, unset all primary images for this product
    await db.prepare(`
      UPDATE product_images SET is_primary = 0 WHERE product_id = ?
    `).bind(productId).run();

    // Then set the specified image as primary
    await db.prepare(`
      UPDATE product_images SET is_primary = 1 WHERE id = ? AND product_id = ?
    `).bind(imageId, productId).run();

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export { VALID_IMAGE_TYPES, MAX_FILE_SIZE };
