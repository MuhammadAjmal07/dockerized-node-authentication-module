const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const RefreshToken = require('../models/refreshToken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'your-refresh-secret-key';

const generateTokens = async (user) => {
    // Generate access token
    const accessToken = jwt.sign(
        { 
            id: user.id,
            userName: user.userName,
            email: user.email
        },
        JWT_SECRET,
        { expiresIn: '2d' } // Short lived - 2 days
    );

    // Generate refresh token
    const refreshToken = jwt.sign(
        { id: user.id },
        REFRESH_SECRET,
        { expiresIn: '7d' } // Long lived - 7 days
    );

    // Save refresh token to database
    await RefreshToken.create({
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });

    return {
        accessToken,
        refreshToken
    };
};

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(403).json({ error: 'Invalid token.' });
    }
};

const verifyRefreshToken = async (token) => {
    try {
        // Verify the refresh token
        const decoded = jwt.verify(token, REFRESH_SECRET);
        console.log("Decoded token:", decoded);

        // Check if token exists and is not revoked in database
        const refreshToken = await RefreshToken.findOne({
            where: {
                token: token,
                userId: decoded.id,
                isRevoked: false
            }
        });

        console.log("Found refresh token:", refreshToken);

        if (!refreshToken) {
            throw new Error('Invalid refresh token');
        }

        return decoded;
    } catch (err) {
        console.error("Refresh token verification error:", err);
        throw new Error('Invalid refresh token');
    }
};

const revokeRefreshToken = async (token) => {
    await RefreshToken.update(
        { isRevoked: true },
        { where: { token: token } }
    );
};

module.exports = {
    generateTokens,
    authenticateToken,
    verifyRefreshToken,
    revokeRefreshToken,
    JWT_SECRET,
    REFRESH_SECRET
};
