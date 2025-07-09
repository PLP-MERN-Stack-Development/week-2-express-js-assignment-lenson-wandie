// server.js - Starter Express server for Week 2 assignment

// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

dotenv.config();
// Middleware setup
app.use(bodyParser.json());

// Sample in-memory products database
let products = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM',
    price: 1200,
    category: 'electronics',
    inStock: true
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest model with 128GB storage',
    price: 800,
    category: 'electronics',
    inStock: true
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with timer',
    price: 50,
    category: 'kitchen',
    inStock: false
  }
];

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Product API! Go to /api/products to see all products.');
});

// TODO: Implement the following routes:
// GET /api/products - Get all products
app.get('/api/products', async (req, res) => {
  try {
    const allProducts =products.find() 
    
    const simplifiedProduct= await allProducts.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      inStock: product.inStock
    }));
    res.status(200).json(simplifiedProduct);

  } catch (error) {
    res.status(500).json({err0r:'Internal Server Error' });
  }

})
// GET /api/products/:id - Get a specific product
app.get('/api/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  res.status(200).json(product);
    
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
  
});

// POST /api/products - Create a new product

app.post('/api/products', async (req, res) => {
  try {
    const newProduct = await {
      id: uuidv4(),
      ...req.body
    };

    if (!newProduct.name || !newProduct.price) {
      return res.status(400).json({ error: 'Name and price are required' });
    }
    products.push(newProduct);
  res.status(201).json(newProduct);
  
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
  
  
});
// PUT /api/products/:id - Update a product
app.put('/api/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const updatedProduct = { ...products[productIndex], ...req.body };
    products[productIndex] = updatedProduct;
    
    res.status(200).json(updatedProduct);
    
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// DELETE /api/products/:id - Delete a product
app.delete('/api/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    products.splice(productIndex, 1);
    
    res.status(204).send();
    
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Example route implementation for GET /api/products
app.get('/api/products', (req, res) => {
  res.json(products);
});

// TODO: Implement custom middleware for:
// - Request logging
  // Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next(); // Pass control to the next middleware
});
    
// - Authentication
// Authentication middleware
app.use((req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  // For simplicity, use a hardcoded token for validation
  const validToken = 'my-secret-token';
  if (token !== validToken) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }

  next(); // Pass control to the next middleware
});
// - Error handling
  // Global error-handling middleware
app.use((err, req, res, next) => {
  console.error(`[Error] ${err.message}`); 
  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: err.message || 'Something went wrong',
  });
});
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing purposes
module.exports = app; 