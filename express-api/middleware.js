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

