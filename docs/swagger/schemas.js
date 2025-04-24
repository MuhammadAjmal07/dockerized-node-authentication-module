/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - userName
 *         - password
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the user
 *         name:
 *           type: string
 *           description: The name of the user
 *         email:
 *           type: string
 *           description: The email of the user
 *         userName:
 *           type: string
 *           description: The username for login
 *         password:
 *           type: string
 *           description: The user's password
 *         createdAt:
 *           type: string
 *           format: date-time
 */

module.exports = {};
