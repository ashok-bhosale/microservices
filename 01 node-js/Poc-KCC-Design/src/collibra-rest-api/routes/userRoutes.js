// routes/userRoutes.js

const express = require('express');
const router = express.Router();

// Sample in-memory users data
const users = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' }
];

// GET /users - Fetch all users
router.get('/', (req, res) => {
    res.json(users);
});

// GET /users/:id - Fetch user by ID
router.get('/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).send('User not found');
    res.json(user);
});

module.exports = router;
