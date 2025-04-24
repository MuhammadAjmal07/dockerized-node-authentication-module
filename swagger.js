const swaggerJSDoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Authentication-module-API's",
    version: "1.0.0",
    description: "User Authentication and Management API Documentation",
    contact: {
      name: "API Support",
      email: "support@example.com"
    }
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Development server"
    }
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    }
  }
};

const options = {
  swaggerDefinition,
  apis: [
    "./docs/swagger/*.js", 
    "./routes/*.js" 
  ],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
