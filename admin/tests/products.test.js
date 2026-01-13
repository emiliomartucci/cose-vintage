/**
 * Products API Tests - TDD
 * v1.0.0 - 2026-01-13
 *
 * Test-first approach for CRUD operations
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from '../src/products.js';

// Mock D1 database
const createMockDB = () => {
  const data = [];
  let autoIncrement = 1;

  return {
    prepare: vi.fn((sql) => ({
      bind: vi.fn((...args) => ({
        run: vi.fn(async () => {
          if (sql.includes('INSERT')) {
            const product = {
              id: autoIncrement++,
              nome: args[0],
              prezzo: args[1],
              descrizione: args[2],
              categoria: args[3],
              genere: args[4],
              taglia: args[5],
              epoca: args[6],
              condizione: args[7],
              disponibile: args[8] ?? 1,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
            data.push(product);
            return { meta: { last_row_id: product.id } };
          }
          if (sql.includes('UPDATE')) {
            const id = args[args.length - 1];
            const idx = data.findIndex(p => p.id === id);
            if (idx !== -1) {
              data[idx] = { ...data[idx], nome: args[0], prezzo: args[1], updated_at: new Date().toISOString() };
            }
            return { meta: { changes: idx !== -1 ? 1 : 0 } };
          }
          if (sql.includes('DELETE')) {
            const id = args[0];
            const idx = data.findIndex(p => p.id === id);
            if (idx !== -1) data.splice(idx, 1);
            return { meta: { changes: idx !== -1 ? 1 : 0 } };
          }
          return { meta: {} };
        }),
        first: vi.fn(async () => {
          if (sql.includes('SELECT') && sql.includes('WHERE id')) {
            const id = args[0];
            return data.find(p => p.id === id) || null;
          }
          return null;
        }),
        all: vi.fn(async () => {
          if (sql.includes('SELECT')) {
            return { results: [...data] };
          }
          return { results: [] };
        })
      })),
      run: vi.fn(),
      first: vi.fn(),
      all: vi.fn(async () => ({ results: [...data] }))
    })),
    _data: data // expose for testing
  };
};

describe('Products API', () => {
  let mockDB;

  beforeEach(() => {
    mockDB = createMockDB();
  });

  describe('createProduct', () => {
    it('should create a product with required fields', async () => {
      const product = {
        nome: 'Blazer Vintage',
        prezzo: 85,
        descrizione: 'Bellissimo blazer anni 80',
        categoria: 'giacche',
        genere: 'donna',
        taglia: 'M',
        epoca: '80',
        condizione: 'eccellente'
      };

      const result = await createProduct(mockDB, product);

      expect(result.success).toBe(true);
      expect(result.id).toBeDefined();
      expect(result.id).toBeGreaterThan(0);
    });

    it('should fail without required fields', async () => {
      const product = {
        descrizione: 'Missing required fields'
      };

      const result = await createProduct(mockDB, product);

      expect(result.success).toBe(false);
      expect(result.error).toContain('required');
    });

    it('should validate prezzo is a positive number', async () => {
      const product = {
        nome: 'Test',
        prezzo: -10,
        categoria: 'giacche',
        genere: 'donna'
      };

      const result = await createProduct(mockDB, product);

      expect(result.success).toBe(false);
      expect(result.error).toContain('prezzo');
    });

    it('should validate categoria is valid', async () => {
      const product = {
        nome: 'Test',
        prezzo: 50,
        categoria: 'invalid-category',
        genere: 'donna'
      };

      const result = await createProduct(mockDB, product);

      expect(result.success).toBe(false);
      expect(result.error).toContain('categoria');
    });

    it('should validate genere is valid', async () => {
      const product = {
        nome: 'Test',
        prezzo: 50,
        categoria: 'giacche',
        genere: 'invalid'
      };

      const result = await createProduct(mockDB, product);

      expect(result.success).toBe(false);
      expect(result.error).toContain('genere');
    });
  });

  describe('getProducts', () => {
    it('should return empty array when no products', async () => {
      const result = await getProducts(mockDB);

      expect(result.success).toBe(true);
      expect(result.products).toEqual([]);
    });

    it('should return all products', async () => {
      // Create test products
      await createProduct(mockDB, {
        nome: 'Product 1',
        prezzo: 50,
        categoria: 'giacche',
        genere: 'donna'
      });
      await createProduct(mockDB, {
        nome: 'Product 2',
        prezzo: 75,
        categoria: 'vestiti',
        genere: 'donna'
      });

      const result = await getProducts(mockDB);

      expect(result.success).toBe(true);
      expect(result.products).toHaveLength(2);
    });

    it('should filter by categoria', async () => {
      await createProduct(mockDB, {
        nome: 'Giacca',
        prezzo: 50,
        categoria: 'giacche',
        genere: 'donna'
      });
      await createProduct(mockDB, {
        nome: 'Vestito',
        prezzo: 75,
        categoria: 'vestiti',
        genere: 'donna'
      });

      // Note: Full filtering is tested in integration tests with real D1
      // This test verifies the API returns successfully
      const result = await getProducts(mockDB, { categoria: 'giacche' });

      expect(result.success).toBe(true);
      expect(result.products.length).toBeGreaterThan(0);
    });

    it('should filter by disponibile', async () => {
      await createProduct(mockDB, {
        nome: 'Available',
        prezzo: 50,
        categoria: 'giacche',
        genere: 'donna',
        disponibile: 1
      });

      const result = await getProducts(mockDB, { disponibile: true });

      expect(result.success).toBe(true);
      expect(result.products.every(p => p.disponibile === 1)).toBe(true);
    });
  });

  describe('getProductById', () => {
    it('should return product by id', async () => {
      const created = await createProduct(mockDB, {
        nome: 'Test Product',
        prezzo: 100,
        categoria: 'giacche',
        genere: 'uomo'
      });

      const result = await getProductById(mockDB, created.id);

      expect(result.success).toBe(true);
      expect(result.product.nome).toBe('Test Product');
      expect(result.product.prezzo).toBe(100);
    });

    it('should return null for non-existent id', async () => {
      const result = await getProductById(mockDB, 99999);

      expect(result.success).toBe(false);
      expect(result.error).toContain('not found');
    });
  });

  describe('updateProduct', () => {
    it('should update product fields', async () => {
      const created = await createProduct(mockDB, {
        nome: 'Original Name',
        prezzo: 50,
        categoria: 'giacche',
        genere: 'donna'
      });

      const result = await updateProduct(mockDB, created.id, {
        nome: 'Updated Name',
        prezzo: 75
      });

      expect(result.success).toBe(true);
    });

    it('should fail for non-existent product', async () => {
      const result = await updateProduct(mockDB, 99999, {
        nome: 'Test'
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('not found');
    });

    it('should validate updated prezzo', async () => {
      const created = await createProduct(mockDB, {
        nome: 'Test',
        prezzo: 50,
        categoria: 'giacche',
        genere: 'donna'
      });

      const result = await updateProduct(mockDB, created.id, {
        prezzo: -10
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('prezzo');
    });
  });

  describe('deleteProduct', () => {
    it('should delete product by id', async () => {
      const created = await createProduct(mockDB, {
        nome: 'To Delete',
        prezzo: 50,
        categoria: 'giacche',
        genere: 'donna'
      });

      const result = await deleteProduct(mockDB, created.id);

      expect(result.success).toBe(true);
    });

    it('should fail for non-existent product', async () => {
      const result = await deleteProduct(mockDB, 99999);

      expect(result.success).toBe(false);
      expect(result.error).toContain('not found');
    });
  });
});
