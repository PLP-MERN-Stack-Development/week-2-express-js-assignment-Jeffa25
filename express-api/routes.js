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

// TODO: Implement the following routes:

// GET /api/products - Get all products
   // GET /api/products - List all products
   app.get('/api/products', (req, res) => {
       res.json(products);
   });

   app.get('/api/products', (req, res) => {
  let filtered = products;

  // Check if the category query parameter exists
  if (req.query.category) {
    filtered = filtered.filter(p => p.category === req.query.category);
  }

  res.json(filtered);
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

//try/catch
app.get('/api/products/:id', (req, res, next) => {
  try {
    const product = products.find(p => p.id === req.params.id);
    if (!product) {
      throw new NotFoundError('Product not found');
    }
    res.json(product);
  } catch (err) {
    next(err); // Pass to error handler
  }
});

app.get('/api/products', (req, res) => {
  let filtered = products;

  if (req.query.category) {
    filtered = filtered.filter(p => p.category === req.query.category);
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || filtered.length;
  const start = (page - 1) * limit;
  const end = start + limit;

  const paginated = filtered.slice(start, end);

  res.json({
    page,
    limit,
    total: filtered.length,
    data: paginated
  });
});


app.get('/api/products/search', (req, res) => {
  const query = req.query.name?.toLowerCase();

  if (!query) {
    return res.status(400).json({ message: 'Search query missing' });
  }

  const results = products.filter(p =>
    p.name.toLowerCase().includes(query)
  );

  res.json(results);
});

//GET / api/products/stats

app.get('/api/products/stats', (req, res) => {
  const stats = products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {});

  res.json(stats);
});

