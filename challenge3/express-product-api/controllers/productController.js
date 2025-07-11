import db from '../db.js';
import { v4 as uuidv4 } from 'uuid';

export const getAll = async (req, res) => {
  const result = await db.query('SELECT * FROM product ORDER BY created_at DESC');
  res.json(result.rows);
};

export const getById = async (req, res) => {
  const result = await db.query('SELECT * FROM product WHERE id = $1', [req.params.id]);
  res.json(result.rows[0]);
};

export const getBySlug = async (req, res) => {
  const result = await db.query('SELECT * FROM product WHERE slug = $1', [req.params.slug]);
  res.json(result.rows[0]);
};

export const create = async (req, res) => {
  const { name, slug, quantity } = req.body;
  const id = uuidv4();
  const result = await db.query(
    'INSERT INTO product (id, name, slug, quantity) VALUES ($1, $2, $3, $4) RETURNING *',
    [id, name, slug, quantity]
  );
  res.status(201).json(result.rows[0]);
};

export const update = async (req, res) => {
  const { name, slug, quantity } = req.body;
  const result = await db.query(
    'UPDATE product SET name=$1, slug=$2, quantity=$3, updated_at=NOW() WHERE id=$4 RETURNING *',
    [name, slug, quantity, req.params.id]
  );
  res.json(result.rows[0]);
};

export const remove = async (req, res) => {
  await db.query('DELETE FROM product WHERE id = $1', [req.params.id]);
  res.json({ message: 'Product deleted' });
};
export const removeAll = async (req, res) => {
  await db.query('DELETE FROM product');
  res.json({ message: 'All products deleted' });
};

