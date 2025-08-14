import express from 'express';
import dotenv from 'dotenv';
import productRoutes from './routes/product.js';
import authRoutes from './routes/authRoutes.js';

// Swagger setup
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

dotenv.config();

const app = express();
app.use(express.json());

// Swagger configuration
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Product API with JWT and OTP Verification',
      version: '1.0.0',
      description: 'API documentation for the Challenge 4 Express.js server',
    },
    servers: [
      {
        url: 'http://localhost:' + (process.env.PORT || 3000),
      },
    ],
  },
  apis: ['./routes/*.js'], // nơi chứa comment mô tả Swagger
});

// Routes
app.use('/api/product', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
  res.send('Welcome to the Product API!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running: http://localhost:${PORT}`);
  console.log(`📚 Swagger Docs: http://localhost:${PORT}/api-docs`);
});
