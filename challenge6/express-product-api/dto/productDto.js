import { body } from 'express-validator';

// DTO + validation cho tạo mới sản phẩm
export const createProductDto = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isString().withMessage('Name must be a string'),
  
  body('price')
    .notEmpty().withMessage('Price is required')
    .isNumeric().withMessage('Price must be a number'),

  body('description')
    .optional()
    .isString().withMessage('Description must be a string')
];

// DTO + validation cho cập nhật sản phẩm
export const updateProductDto = [
  body('name')
    .optional()
    .isString().withMessage('Name must be a string'),

  body('price')
    .optional()
    .isNumeric().withMessage('Price must be a number'),

  body('description')
    .optional()
    .isString().withMessage('Description must be a string')
];
