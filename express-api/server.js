// server.js - Starter Express server for Week 2 assignment


// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;



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
   // GET /api/products - List all products
   app.get('/api/products', (req, res) => {
       res.json(products);
   });
   
// GET /api/products/:id - Get a specific product

   app.get('/api/products/:id', (req, res) => {
       const product = products.find(p => p.id === req.params.id);
       if (product) {
           res.json(product);
       } else {
           res.status(404).json({ message: 'Product not found' });
       }
   });
   

   // POST /api/products - Create a new product
   app.post('/api/products', (req, res) => {
       const newProduct = {
           id: uuidv4(), // Generate a unique ID
           name: req.body.name,
           description: req.body.description,
           price: req.body.price,
           category: req.body.category,
           inStock: req.body.inStock
       };
       products.push(newProduct);
       res.status(201).json(newProduct);
   });
   
   // PUT /api/products/:id - Update a product
   app.put('/api/products/:id', (req, res) => {
       const productIndex = products.findIndex(p => p.id === req.params.id);
       if (productIndex !== -1) {
           const updatedProduct = {
               id: req.params.id,
               name: req.body.name,
               description: req.body.description,
               price: req.body.price,
               category: req.body.category,
               inStock: req.body.inStock
           };
           products[productIndex] = updatedProduct;
           res.json(updatedProduct);
       } else {
           res.status(404).json({ message: 'Product not found' });
       }
   });
   
   // DELETE /api/products/:id - Delete a product
   app.delete('/api/products/:id', (req, res) => {
       const productIndex = products.findIndex(p => p.id === req.params.id);
       if (productIndex !== -1) {
           products.splice(productIndex, 1);
           res.status(204).send(); // No content
       } else {
           res.status(404).json({ message: 'Product not found' });
       }
   });
   

// Example route implementation for GET /api/products
app.get('/api/products', (req, res) => {
  res.json(products);
});

// TODO: Implement custom middleware for:

// Logger middleware
app.use((req, res, next) => {
  const now = new Date().toISOString();
  console.log(`[${now}] ${req.method} ${req.url}`);
  next();
});

// - Request logging
app.use(bodyParser.json());

// - Authentication

// Authentication middleware
const authenticate = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const VALID_API_KEY = '12345'; // Example; should be stored securely in real apps

  if (apiKey === VALID_API_KEY) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized: Invalid API Key' });
  }
};

// - Error handling

// Validation middleware
const validateProduct = (req, res, next) => {
  const { name, description, price, category, inStock } = req.body;

  if (
    typeof name !== 'string' ||
    typeof description !== 'string' ||
    typeof price !== 'number' ||
    typeof category !== 'string' ||
    typeof inStock !== 'boolean'
  ) {
    return res.status(400).json({ message: 'Invalid product data format' });
  }

  next();
};

// Custom Error Classes
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.status = 404;
  }
}

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.status = 400;
  }
}

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnauthorizedError';
    this.status = 401;
  }
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    error: {
      name: err.name,
      message,
      status
    }
  });
});

app.get('/api/products/:id', (req, res, next) => {
  try {
    const product = products.find(p => p.id === req.params.id);
    if (!product) throw new NotFoundError('Product not found');
    res.json(product);
  } catch (err) {
    next(err);
  }
});

const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

app.post('/api/products', authenticate, validateProduct, asyncHandler(async (req, res) => {
  const newProduct = {
    id: uuidv4(),
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    inStock: req.body.inStock
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
}));

//Global Error-Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log error to console

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    error: {
      name: err.name,
      message,
      status
    }
  });
});

require('dotenv').config();


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing purposes
module.exports = app; 