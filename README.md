# Node.js CRUD Application

## Project Description
This is a Node.js-based CRUD (Create, Read, Update, Delete) application that uses PostgreSQL as the database. The project is containerized using Docker and includes JWT-based authentication for secure user management. It is designed to be a robust and scalable backend solution for managing user data.

## Technologies Used
- **Node.js**: Backend runtime environment.
- **Express.js**: Web framework for building RESTful APIs.
- **PostgreSQL**: Relational database for data storage.
- **Docker**: Containerization platform for easy deployment.
- **JWT (JSON Web Tokens)**: Authentication and authorization.
- **Nodemon**: Development tool for auto-restarting the server.

## Project Structure
```
node-crud-app/
├── db.js
├── docker-compose.yml
├── Dockerfile
├── dockerstart.sh
├── index.js
├── nodemon.json
├── package.json
├── swagger.js
├── docs/
│   ├── swagger/
│   ├── auth.js
│   ├── schemas.js
│   └── users.js
├── middleware/
│   └── auth.js
├── models/
│   ├── refreshToken.js
│   └── users.js
└── routes/
    └── users.js
```

## Node Version
This project requires **Node.js v16.x** or higher. Please ensure you have the correct version installed before proceeding.

## Setup Instructions

### Prerequisites
1. Install [Docker](https://www.docker.com/).
2. Install [Node.js](https://nodejs.org/) and npm.

### Steps to Run the Project

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd node-crud-app
   ```

2. **Set Up Environment Variables**
   Create a `.env` file in the root directory and copy the contents of `.env-example` into it. Update the values as needed.

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Run the Application Locally**
   ```bash
   npm start
   ```
   This will start the application on `http://localhost:3000`.

5. **Run the Application with Docker**
   ```bash
   docker-compose up --build
   ```
   This will start the application in a Docker container.

6. **Access API Documentation**
   The Swagger API documentation is available at `http://localhost:3000/api-docs`.

## Features
- User authentication with JWT.
- CRUD operations for user data.
- Token-based refresh mechanism.
- API documentation with Swagger.

## License
This project is licensed under the MIT License.