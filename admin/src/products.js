/**
 * Products CRUD Operations
 * v1.0.0 - 2026-01-13
 *
 * Database operations for products table
 */

// Valid options for validation
const VALID_CATEGORIE = ['giacche', 'vestiti', 'camicie', 'gonne', 'maglieria', 'accessori'];
const VALID_GENERI = ['donna', 'uomo', 'unisex'];
const VALID_CONDIZIONI = ['eccellente', 'buona'];
const VALID_EPOCHE = ['60', '70', '80', '90'];

/**
 * Validate product data
 */
function validateProduct(data, isUpdate = false) {
  const errors = [];

  // Required fields (only for create)
  if (!isUpdate) {
    if (!data.nome || typeof data.nome !== 'string' || data.nome.trim() === '') {
      errors.push('nome is required');
    }
    if (data.prezzo === undefined || data.prezzo === null) {
      errors.push('prezzo is required');
    }
    if (!data.categoria) {
      errors.push('categoria is required');
    }
    if (!data.genere) {
      errors.push('genere is required');
    }
  }

  // Validate prezzo if provided
  if (data.prezzo !== undefined) {
    if (typeof data.prezzo !== 'number' || data.prezzo <= 0) {
      errors.push('prezzo must be a positive number');
    }
  }

  // Validate categoria if provided
  if (data.categoria && !VALID_CATEGORIE.includes(data.categoria.toLowerCase())) {
    errors.push(`categoria must be one of: ${VALID_CATEGORIE.join(', ')}`);
  }

  // Validate genere if provided
  if (data.genere && !VALID_GENERI.includes(data.genere.toLowerCase())) {
    errors.push(`genere must be one of: ${VALID_GENERI.join(', ')}`);
  }

  // Validate condizione if provided
  if (data.condizione && !VALID_CONDIZIONI.includes(data.condizione.toLowerCase())) {
    errors.push(`condizione must be one of: ${VALID_CONDIZIONI.join(', ')}`);
  }

  // Validate epoca if provided
  if (data.epoca && !VALID_EPOCHE.includes(data.epoca)) {
    errors.push(`epoca must be one of: ${VALID_EPOCHE.join(', ')}`);
  }

  return errors;
}

/**
 * Create a new product
 */
export async function createProduct(db, data) {
  const errors = validateProduct(data, false);
  if (errors.length > 0) {
    return { success: false, error: errors.join(', ') };
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO products (nome, prezzo, descrizione, categoria, genere, taglia, epoca, condizione, disponibile)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = await stmt.bind(
      data.nome.trim(),
      data.prezzo,
      data.descrizione || null,
      data.categoria.toLowerCase(),
      data.genere.toLowerCase(),
      data.taglia || null,
      data.epoca || null,
      data.condizione || 'buona',
      data.disponibile !== undefined ? (data.disponibile ? 1 : 0) : 1
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
 * Get all products with optional filters
 */
export async function getProducts(db, filters = {}) {
  try {
    let sql = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (filters.categoria) {
      sql += ' AND categoria = ?';
      params.push(filters.categoria.toLowerCase());
    }

    if (filters.genere) {
      sql += ' AND genere = ?';
      params.push(filters.genere.toLowerCase());
    }

    if (filters.disponibile !== undefined) {
      sql += ' AND disponibile = ?';
      params.push(filters.disponibile ? 1 : 0);
    }

    if (filters.epoca) {
      sql += ' AND epoca = ?';
      params.push(filters.epoca);
    }

    sql += ' ORDER BY created_at DESC';

    const stmt = db.prepare(sql);
    const result = params.length > 0
      ? await stmt.bind(...params).all()
      : await stmt.all();

    return {
      success: true,
      products: result.results || []
    };
  } catch (error) {
    return { success: false, error: error.message, products: [] };
  }
}

/**
 * Get a single product by ID
 */
export async function getProductById(db, id) {
  try {
    const stmt = db.prepare('SELECT * FROM products WHERE id = ?');
    const product = await stmt.bind(id).first();

    if (!product) {
      return { success: false, error: 'Product not found' };
    }

    return { success: true, product };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Update a product
 */
export async function updateProduct(db, id, data) {
  // First check if product exists
  const existing = await getProductById(db, id);
  if (!existing.success) {
    return { success: false, error: 'Product not found' };
  }

  // Validate update data
  const errors = validateProduct(data, true);
  if (errors.length > 0) {
    return { success: false, error: errors.join(', ') };
  }

  try {
    // Build dynamic update query
    const fields = [];
    const values = [];

    if (data.nome !== undefined) {
      fields.push('nome = ?');
      values.push(data.nome.trim());
    }
    if (data.prezzo !== undefined) {
      fields.push('prezzo = ?');
      values.push(data.prezzo);
    }
    if (data.descrizione !== undefined) {
      fields.push('descrizione = ?');
      values.push(data.descrizione);
    }
    if (data.categoria !== undefined) {
      fields.push('categoria = ?');
      values.push(data.categoria.toLowerCase());
    }
    if (data.genere !== undefined) {
      fields.push('genere = ?');
      values.push(data.genere.toLowerCase());
    }
    if (data.taglia !== undefined) {
      fields.push('taglia = ?');
      values.push(data.taglia);
    }
    if (data.epoca !== undefined) {
      fields.push('epoca = ?');
      values.push(data.epoca);
    }
    if (data.condizione !== undefined) {
      fields.push('condizione = ?');
      values.push(data.condizione.toLowerCase());
    }
    if (data.disponibile !== undefined) {
      fields.push('disponibile = ?');
      values.push(data.disponibile ? 1 : 0);
    }

    if (fields.length === 0) {
      return { success: false, error: 'No fields to update' };
    }

    fields.push('updated_at = datetime("now")');
    values.push(id);

    const sql = `UPDATE products SET ${fields.join(', ')} WHERE id = ?`;
    const stmt = db.prepare(sql);
    await stmt.bind(...values).run();

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Delete a product
 */
export async function deleteProduct(db, id) {
  // First check if product exists
  const existing = await getProductById(db, id);
  if (!existing.success) {
    return { success: false, error: 'Product not found' };
  }

  try {
    const stmt = db.prepare('DELETE FROM products WHERE id = ?');
    await stmt.bind(id).run();

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Export validation constants for use in other modules
export { VALID_CATEGORIE, VALID_GENERI, VALID_CONDIZIONI, VALID_EPOCHE };
