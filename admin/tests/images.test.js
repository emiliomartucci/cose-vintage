/**
 * Images Upload Tests - TDD
 * v1.0.0 - 2026-01-13
 *
 * Test-first approach for R2 image operations
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  uploadImage,
  deleteImage,
  getImageUrl,
  addProductImage,
  getProductImages,
  deleteProductImage
} from '../src/images.js';

// Mock R2 bucket
const createMockR2 = () => {
  const objects = new Map();

  return {
    put: vi.fn(async (key, data, options) => {
      objects.set(key, { data, options });
      return { key };
    }),
    delete: vi.fn(async (key) => {
      const existed = objects.has(key);
      objects.delete(key);
      return existed;
    }),
    get: vi.fn(async (key) => {
      return objects.get(key) || null;
    }),
    _objects: objects // expose for testing
  };
};

// Mock D1 database for product_images
const createMockDB = () => {
  const images = [];
  let autoIncrement = 1;

  return {
    prepare: vi.fn((sql) => ({
      bind: vi.fn((...args) => ({
        run: vi.fn(async () => {
          if (sql.includes('INSERT INTO product_images')) {
            const image = {
              id: autoIncrement++,
              product_id: args[0],
              url: args[1],
              is_primary: args[2] ?? 0,
              created_at: new Date().toISOString()
            };
            images.push(image);
            return { meta: { last_row_id: image.id } };
          }
          if (sql.includes('DELETE FROM product_images')) {
            const id = args[0];
            const idx = images.findIndex(i => i.id === id);
            if (idx !== -1) images.splice(idx, 1);
            return { meta: { changes: idx !== -1 ? 1 : 0 } };
          }
          return { meta: {} };
        }),
        all: vi.fn(async () => {
          if (sql.includes('SELECT') && sql.includes('product_images')) {
            const productId = args[0];
            return { results: images.filter(i => i.product_id === productId) };
          }
          return { results: [] };
        }),
        first: vi.fn(async () => {
          if (sql.includes('SELECT') && sql.includes('WHERE id')) {
            const id = args[0];
            return images.find(i => i.id === id) || null;
          }
          return null;
        })
      }))
    })),
    _images: images
  };
};

describe('Images API', () => {
  let mockR2;
  let mockDB;

  beforeEach(() => {
    mockR2 = createMockR2();
    mockDB = createMockDB();
  });

  describe('uploadImage', () => {
    it('should upload image to R2 and return URL', async () => {
      const file = new Uint8Array([1, 2, 3, 4]); // mock image data
      const filename = 'test-image.jpg';

      const result = await uploadImage(mockR2, file, filename, 'image/jpeg');

      expect(result.success).toBe(true);
      expect(result.url).toBeDefined();
      expect(result.key).toBeDefined();
      expect(mockR2.put).toHaveBeenCalled();
    });

    it('should generate unique key for each upload', async () => {
      const file = new Uint8Array([1, 2, 3]);

      const result1 = await uploadImage(mockR2, file, 'image1.jpg', 'image/jpeg');
      const result2 = await uploadImage(mockR2, file, 'image2.jpg', 'image/jpeg');

      expect(result1.key).not.toBe(result2.key);
    });

    it('should validate file type', async () => {
      const file = new Uint8Array([1, 2, 3]);

      const result = await uploadImage(mockR2, file, 'test.exe', 'application/x-msdownload');

      expect(result.success).toBe(false);
      expect(result.error).toContain('type');
    });

    it('should validate file size', async () => {
      // Create a "large" file (we'll check the validation logic)
      const largeFile = new Uint8Array(26 * 1024 * 1024); // 26MB

      const result = await uploadImage(mockR2, largeFile, 'large.jpg', 'image/jpeg');

      expect(result.success).toBe(false);
      expect(result.error).toContain('size');
    });

    it('should accept valid image types', async () => {
      const file = new Uint8Array([1, 2, 3]);
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

      for (const type of validTypes) {
        const result = await uploadImage(mockR2, file, `test.${type.split('/')[1]}`, type);
        expect(result.success).toBe(true);
      }
    });
  });

  describe('deleteImage', () => {
    it('should delete image from R2', async () => {
      // First upload
      const file = new Uint8Array([1, 2, 3]);
      const uploaded = await uploadImage(mockR2, file, 'test.jpg', 'image/jpeg');

      // Then delete
      const result = await deleteImage(mockR2, uploaded.key);

      expect(result.success).toBe(true);
      expect(mockR2.delete).toHaveBeenCalledWith(uploaded.key);
    });
  });

  describe('addProductImage', () => {
    it('should add image reference to product', async () => {
      const productId = 1;
      const imageUrl = 'https://example.com/image.jpg';

      const result = await addProductImage(mockDB, productId, imageUrl, true);

      expect(result.success).toBe(true);
      expect(result.id).toBeDefined();
    });

    it('should mark first image as primary by default', async () => {
      const productId = 1;

      const result = await addProductImage(mockDB, productId, 'https://example.com/image.jpg');

      expect(result.success).toBe(true);
    });
  });

  describe('getProductImages', () => {
    it('should return all images for a product', async () => {
      const productId = 1;

      // Add images
      await addProductImage(mockDB, productId, 'https://example.com/image1.jpg', true);
      await addProductImage(mockDB, productId, 'https://example.com/image2.jpg', false);

      const result = await getProductImages(mockDB, productId);

      expect(result.success).toBe(true);
      expect(result.images).toHaveLength(2);
    });

    it('should return empty array if no images', async () => {
      const result = await getProductImages(mockDB, 999);

      expect(result.success).toBe(true);
      expect(result.images).toEqual([]);
    });
  });

  describe('deleteProductImage', () => {
    it('should delete image reference from database', async () => {
      const productId = 1;
      const added = await addProductImage(mockDB, productId, 'https://example.com/image.jpg');

      const result = await deleteProductImage(mockDB, added.id);

      expect(result.success).toBe(true);
    });
  });
});
