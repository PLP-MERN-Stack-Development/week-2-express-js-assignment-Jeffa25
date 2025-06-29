Product API - Express.js

This is a RESTful API built with Node.js and Express.js to manage a list of products. It supports basic CRUD operations, filtering, search, pagination, authentication, and statistics.

### Prerequisites

- Node.js (v14+)
- npm (v6+)

### Installation

1. Clone the repository or download the project files.
2. Navigate to the project folder.

bash
cd your-project-folder

install dependencies: 
bash
npm install express body-parser uuid

Start the server:
bash
node server.js  
The server will start on http://localhost:3000

 ### Authentication

This API uses a simple API key header:

Header key: x-api-key

Value: 12345 (default, for testing)

### API Endpoints

GET /api/products
Get all products, with optional query parameters:

Query Params:

category: Filter by category

page: Page number for pagination

limit: Number of items per page

Example:
Bash 
GET /api/products?category=electronics&page=1&limit=2

the response 
{
  "page": 1,
  "limit": 2,
  "total": 3,
  "data": [
    {
      "id": "1",
      "name": "Laptop",
      "description": "High-performance laptop",
      "price": 1200,
      "category": "electronics",
      "inStock": true
    }
  ]
}

 GET /api/products/:id
Fetch a single product by ID.

Example:
bash
GET /api/products/1

the response
{
  "id": "1",
  "name": "Laptop",
  "description": "High-performance laptop",
  "price": 1200,
  "category": "electronics",
  "inStock": true
}

 POST /api/products
Create a new product.
Requires API key

PUT /api/products/:id
Update an existing product.
Requires API key

Example:
Bash
PUT /api/products/1

Body JSON
{
  "name": "Gaming Laptop",
  "description": "16GB RAM, RTX GPU",
  "price": 1500,
  "category": "electronics",
  "inStock": true
}

DELETE /api/products/:id
Delete a product by ID.
Requires API key

Example:

bash
DELETE /api/products/1

Response:
204 No Content

GET /api/products/search?name=coffee
Search products by name.

Example:

pgsql
Copy code
GET /api/products/search?name=coffee
Response:

json
Copy code
[
  {
    "id": "3",
    "name": "Coffee Maker",
    "description": "Programmable coffee maker",
    "price": 50,
    "category": "kitchen",
    "inStock": false
  }
]
GET /api/products/stats
Get product count grouped by category.

Response:

jsoN
{
  "electronics": 2,
  "kitchen": 1
}
 Error Handling
All errors return in the following format:

json
{
  "error": {
    "name": "ValidationError",
    "message": "Invalid product data format",
    "status": 400
  }
}
