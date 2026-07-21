# Q Yaar — Backend API

Express.js + MongoDB + Socket.io backend server that powers the entire Q Yaar ecosystem.

## Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB Atlas (Mongoose ODM)
- **Real-time:** Socket.io (Chat system)
- **Push Notifications:** Expo Push API
- **Security:** CORS whitelist, Rate limiting, Input validation

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/qr/generate` | Generate a new QR code |
| `POST` | `/api/qr/claim` | Link QR to vehicle + phone |
| `PUT` | `/api/qr/update` | Update vehicle details |
| `GET` | `/api/qr/:qrId` | Get vehicle details by QR (+ increment scan count) |
| `GET` | `/api/qr` | List all QR codes (admin) |
| `POST` | `/api/qr/:qrId/notify` | Send notification to vehicle owner |
| `POST` | `/api/qr/:qrId/push-token` | Register Expo push token |
| `GET` | `/api/qr/:qrId/notifications` | Get notifications for a QR |
| `GET` | `/api/qr/user/:mobile` | Get all QRs for a user |
| `POST` | `/api/chat/initiate` | Start a chat session (24hr expiry) |
| `POST` | `/api/chat/send` | Send a message (anti-spam: max 3 before reply) |
| `GET` | `/api/chat/:sessionId/messages` | Get chat messages |
| `GET` | `/api/chat/list/:mobile` | Get chat list for a user |
| `POST` | `/api/chat/:sessionId/block` | Block a chat session (owner only) |
| `GET` | `/api/admin/stats` | Admin statistics |
| `GET` | `/api/admin/qrs` | Admin QR listing |
| `GET` | `/api/health` | Health check |

## Folder Structure
```
├── config/           → Database connection
├── controllers/      → Business logic (qrController, chatController)
├── middleware/        → Validators & error handlers
├── models/           → Mongoose schemas (QR, Notification, ChatSession, Message)
├── routes/           → Express route definitions
├── server.js         → App entry point
└── package.json
```

## Environment Variables
```env
PORT=5000
MONGODB_URI=mongodb+srv://...
FRONTEND_URL=https://qyaar-qr.vercel.app
ALLOWED_ORIGINS=https://qyaar-admin.vercel.app,https://qyaar-qr.vercel.app,https://q-yaar.vercel.app
```

## Getting Started
```bash
npm install
cp .env.example .env   # Fill in your MONGODB_URI
npm run dev            # Starts with nodemon (hot reload)
npm start              # Production start
```

## Deployment
Deployed on **Render**: `https://qyaar-backend.onrender.com`
