import express from 'express';
import * as controller from '../controllers/productController.js';
import { authorize } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validateMiddleware.js';
import { createProductDto, updateProductDto } from '../dto/productDto.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Product
 *   description: Product management APIs
 */

/**
 * @swagger
 * /api/product:
 *   get:
 *     summary: Get all products
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all products
 *       401:
 *         description: Unauthorized
 */
router.get('/', authorize, controller.getAll);


/**
 * @swagger
 * /api/product:
 *   post:
 *     summary: Create a new product
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/', authorize, createProductDto, validate, controller.create);

/**
 * @swagger
 * /api/product/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Product]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product found
 *       404:
 *         description: Product not found
 */
router.get('/:id', controller.getById);

/**
 * @swagger
 * /api/product/slug/{slug}:
 *   get:
 *     summary: Get product by slug
 *     tags: [Product]
 *     parameters:
 *       - name: slug
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product found
 *       404:
 *         description: Product not found
 */
router.get('/slug/:slug', controller.getBySlug);

/**
 * @swagger
 * /api/product/{id}:
 *   put:
 *     summary: Update product by ID
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */
router.put('/:id', authorize, updateProductDto, validate , controller.update);

/**
 * @swagger
 * /api/product/{id}:
 *   delete:
 *     summary: Delete product by ID
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */
router.delete('/:id', authorize, controller.remove);

/**
 * @swagger
 * /api/product:
 *   delete:
 *     summary: Delete all products
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All products deleted
 *       401:
 *         description: Unauthorized
 */
router.delete('/', authorize, controller.removeAll);

export default router;
