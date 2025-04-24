// db.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME || 'self_node_postgres',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || 'postgres',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'postgres',
        logging: console.log, // Enable SQL query logging
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

// Test the connection
sequelize.authenticate()
  .then(() => console.log('Connected to PostgreSQL!'))
  .catch(err => console.error('Connection error:', err));

module.exports = sequelize;
