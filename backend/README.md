# Q Yaar Backend API

This is the Express.js and MongoDB backend server. It handles REST API requests from the mobile app, the website, and the QR portal. It also runs a `Socket.io` server for real-time chat functionality.

## Folder Structure
- `config/`: Contains `db.js` for MongoDB connection.
- `models/`: Mongoose schemas (`QR.js`, `ChatSession.js`, `Message.js`, `Notification.js`).
- `controllers/`: Core business logic (`qrController.js`, `chatController.js`).
- `routes/`: Express route definitions connecting endpoints to controllers.
- `middleware/`: Validation and error handling middleware.

## Getting Started
1. Run `npm install` to install dependencies.
2. Ensure you have a `.env` file with `MONGO_URI` and `PORT`. You can copy `.env.example` to `.env`.
3. Run `npm start` (or `node server.js`) to start the server.
4. The server usually runs on `http://localhost:5000`.
