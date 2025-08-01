import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express Product & Auth API',
      version: '1.0.0',
      description: 'API documentation for product management and user authentication',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./routes/*.js'], // Chứa các file có chú thích Swagger
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs };
