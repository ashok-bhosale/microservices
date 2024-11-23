// const express = require('express');
// const app = express();
// const port = 3001;

// // Sample data to simulate Collibra API
// const data = {
//   items: [
//     { id: 1, name: 'Item 1', description: 'This is item 1' },
//     { id: 2, name: 'Item 2', description: 'This is item 2' },
//     { id: 3, name: 'Item 3', description: 'This is item 3' }
//   ]
// };

// // REST endpoint to fetch items
// app.get('/items', (req, res) => {
//   res.json(data);
// });

// app.listen(port, () => {
//   console.log(`Collibra API running on http://localhost:${port}`);
// });

// index.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes'); // Import user routes

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes); // Set the route for users

// Sample data to simulate Collibra API
const data = {
  items: [
    { id: 1, name: 'Item 1', description: 'This is item 1' },
    { id: 2, name: 'Item 2', description: 'This is item 2' },
    { id: 3, name: 'Item 3', description: 'This is item 3' }
  ]
};

// REST endpoint to fetch items
app.get('/items', (req, res) => {
  res.json(data);
});


// Global error handler (for unhandled routes)
// app.use((req, res, next) => {
//     res.status(404).json({ message: 'Resource not found' });
//  });
 
//  // Custom error handler middleware
//  app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).json({ message: 'Internal Server Error' });
//  });

 
app.get('/', (req, res) => {
    res.send('Hello, World!');
    //throw new Error("my error");
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

