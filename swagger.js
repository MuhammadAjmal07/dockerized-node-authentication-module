const swaggerJSDoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Authentication-module-API's",
    version: "0.0.1",
    description: "User can register himself using through this API",
  },
};

const options = {
  swaggerDefinition,
  apis: ["./routes/*.js"], // Path to the API routes in your Node.js application
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
