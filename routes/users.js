// routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/users');
const { generateTokens, authenticateToken, verifyRefreshToken, revokeRefreshToken } = require('../middleware/auth');

// Login route
router.post('/login', async (req, res) => {
    try {
        const { userName, password } = req.body;

        // Find user by username
        const user = await User.findOne({ where: { userName } });
        
        // Check if user exists
        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Validate password
        const isValidPassword = await user.validatePassword(password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Generate tokens
        const { accessToken, refreshToken } = await generateTokens(user);

        // Don't send password in response
        const userResponse = {
            id: user.id,
            name: user.name,
            email: user.email,
            userName: user.userName,
            createdAt: user.createdAt
        };

        res.json({ 
            message: 'Login successful', 
            user: userResponse,
            accessToken,
            refreshToken
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Register new user
router.post('/register', async (req, res) => {
    try {
        console.log("Request body:", req.body);
        
        // Validate required fields
        const { name, email, userName, password } = req.body;
        if (!name || !email || !userName || !password) {
            return res.status(400).json({ 
                error: 'Missing required fields',
                required: ['name', 'email', 'userName', 'password']
            });
        }

        const user = await User.create({
            name,
            email,
            userName,
            password
        });

        // Don't send password in response
        const userResponse = {
            id: user.id,
            name: user.name,
            email: user.email,
            userName: user.userName,
            createdAt: user.createdAt
        };

        res.status(201).json(userResponse);
    } catch (err) {
        console.error("Error creating user:", err);
        if (err.name === 'SequelizeValidationError') {
            return res.status(400).json({ error: err.errors.map(e => e.message) });
        }
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: 'Username or email already exists' });
        }
        res.status(500).json({ error: err.message });
    }
});

// Protected route - Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] } // Don't send password
        });
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Refresh token route
router.post('/refresh-token', async (req, res) => {
    try {
        const { refreshToken } = req.body;
        
        if (!refreshToken) {
            return res.status(401).json({ error: 'Refresh token not found' });
        }

        // Verify the refresh token
        const decoded = await verifyRefreshToken(refreshToken);

        // Revoke the old refresh token
        await revokeRefreshToken(refreshToken);

        // Get user data
        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Generate new tokens
        const tokens = await generateTokens(user);

        res.json({ 
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken
        });
    } catch (err) {
        res.status(401).json({ error: 'Invalid refresh token' });
    }
});

// Logout route
router.post('/logout', authenticateToken, async (req, res) => {
    try {
        const { refreshToken } = req.body;
        
        if (refreshToken) {
            // Revoke the refresh token
            await revokeRefreshToken(refreshToken);
        }
        
        res.json({ message: 'Logged out successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// CREATE - Create a new user
router.post('/', authenticateToken, async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// READ - Get all users
router.get('/', authenticateToken, async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// READ - Get a single user by ID
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE - Update a user
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        await user.update(req.body);
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE - Delete a user
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        await user.destroy();
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;