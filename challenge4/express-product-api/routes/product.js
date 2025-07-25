import express from 'express';
import * as controller from '../controllers/productController.js';

const router = express.Router();

router.get('/', controller.getAll);
router.post('/', controller.create);
router.get('/:id', controller.getById);
router.get('/slug/:slug', controller.getBySlug);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);
router.delete('/', controller.removeAll);

export default router;
