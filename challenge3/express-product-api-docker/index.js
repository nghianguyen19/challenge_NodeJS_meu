import express from 'express';
import dotenv from 'dotenv';
import productRoutes from './routes/product.js';

dotenv.config();
const app = express();
app.use(express.json());

app.use('/api/product', productRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Product API!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running: http://localhost:${PORT}`);
});
