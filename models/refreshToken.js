const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const RefreshToken = sequelize.define('RefreshToken', {
    token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
    isRevoked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'refresh_tokens',
    timestamps: true
});

module.exports = RefreshToken;
