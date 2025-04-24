require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const userRoutes = require('./routes/users');
const sequelize = require('./db');
const User = require('./models/users');
const RefreshToken = require('./models/refreshToken');

const app = express();

// Enable CORS for all routes
app.use(cors());

app.use(bodyParser.json());
app.use(cookieParser());
app.use('/users', userRoutes);

// Serve Swagger documentation
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

// Define associations
RefreshToken.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(RefreshToken, { foreignKey: 'userId' });

// Sync database with force true to recreate tables
sequelize.sync({ force: true })
  .then(() => {
    console.log('Database & tables created!');
    // Start server after DB sync
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error syncing database:', err);
  });
