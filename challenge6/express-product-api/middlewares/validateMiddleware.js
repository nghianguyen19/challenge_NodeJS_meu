import { validationResult } from 'express-validator';

// Middleware để kiểm tra kết quả validation
export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }

  next();
};
