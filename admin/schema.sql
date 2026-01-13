-- Cose Vintage Database Schema
-- v1.0.0 - 2026-01-13 - Initial schema

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    prezzo REAL NOT NULL,
    descrizione TEXT,
    categoria TEXT NOT NULL,
    genere TEXT NOT NULL,
    taglia TEXT,
    epoca TEXT,
    condizione TEXT DEFAULT 'buona',
    disponibile INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Product images table (multiple images per product)
CREATE TABLE IF NOT EXISTS product_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    url TEXT NOT NULL,
    is_primary INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_products_categoria ON products(categoria);
CREATE INDEX IF NOT EXISTS idx_products_genere ON products(genere);
CREATE INDEX IF NOT EXISTS idx_products_disponibile ON products(disponibile);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
