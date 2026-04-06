# Q Yaar — QR Code Generation & Claim System

A complete QR code system for vehicle identification. Generate unique QR codes, share them with vehicle owners, and link vehicles permanently when scanned.

## 🏗️ Architecture

```
qr-system/
├── backend/          # Node.js + Express + MongoDB
│   ├── config/       # Database connection
│   ├── controllers/  # Business logic
│   ├── middleware/    # Validation & error handling
│   ├── models/       # Mongoose schemas
│   ├── routes/       # API routes
│   └── server.js     # Entry point
│
└── frontend/         # React + Vite + Tailwind CSS
    └── src/
        ├── components/  # Reusable UI components
        ├── pages/       # Page components
        ├── api.js       # API client
        └── App.jsx      # Root component
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Start Backend

```bash
cd qr-system/backend
npm install
npm run dev
```

Backend runs on `http://localhost:5000`

### 2. Start Frontend

```bash
cd qr-system/frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

## 📋 API Endpoints

| Method | Endpoint            | Description              |
|--------|---------------------|--------------------------|
| POST   | `/api/qr/generate`  | Generate new QR code     |
| POST   | `/api/qr/claim`     | Claim/link a vehicle     |
| GET    | `/api/qr/:qrId`     | Get QR details           |
| GET    | `/api/qr`           | List all QR codes        |
| GET    | `/api/health`       | Health check             |

## 🔐 Security

- UUID-based QR IDs (non-guessable)
- QR codes are permanently locked after claim
- Input validation on all endpoints
- Rate limiting (100 req/15min general, 10 req/min for generate)
- CORS configured

## 🎨 Design

- Soft teal/mint green theme (#6FD3C1)
- Rounded cards with subtle shadows
- Clean, minimal, mobile-responsive UI
- Smooth animations and transitions
