# Q Yaar — Smart Vehicle Identity System 🚗

India's smartest QR-based vehicle identity and notification platform.

---

## 📁 Project Structure

```
Q-yaar/
├── 📱 app/              → React Native mobile app (Expo)
├── 🗄️ backend/           → Express.js + MongoDB API server
├── 🌍 website/           → Public landing website (React + Vite)
├── 🌐 qr-portal/         → QR scan portal website (React + Vite)
├── 🔧 admin/             → Admin dashboard (React + Vite)
└── 📄 docs/              → Project documentation & reports
```

---

## 📱 Mobile App (`app/`)

React Native app built with Expo SDK 54.

```
app/
├── screens/
│   ├── auth/          → Onboarding, Login, Register, UserDetails, Selection
│   ├── main/          → Home, Scan, ScanResult, Vehicles, Activity, Profile, MyQR, SearchVehicle
│   └── chat/          → ChatList, Chat
├── context/           → UserContext (global state)
├── services/          → Push notifications helper
├── config/            → API URL configuration
├── assets/            → App icons & images
├── App.js             → App entry point + navigation
├── app.json           → Expo configuration
├── eas.json           → EAS Build profiles
└── package.json       → Dependencies
```

**Run:** `cd app && npx expo start`

---

## 🗄️ Backend (`backend/`)

Express.js REST API + Socket.io for real-time chat.

```
backend/
├── config/            → Database connection (MongoDB)
├── controllers/       → QR & Chat business logic
├── middleware/         → Validators & error handlers
├── models/            → Mongoose schemas (QR, Notification, ChatSession, Message)
├── routes/            → API route definitions
├── server.js          → App entry point
└── package.json       → Dependencies
```

**Run:** `cd backend && node server.js`
**Deployed:** [qyaar-backend.onrender.com](https://qyaar-backend.onrender.com)

---

## 🌍 Website (`website/`)

Public-facing landing page + APK download.

**Run:** `cd website && npm run dev`
**Deployed:** [q-yaar.vercel.app](https://q-yaar.vercel.app)

---

## 🌐 QR Portal (`qr-portal/`)

QR scan result pages + QR generation dashboard.

**Run:** `cd qr-portal && npm run dev`
**Deployed:** [qyaar-qr.vercel.app](https://qyaar-qr.vercel.app)

---

## 🔧 Admin (`admin/`)

Admin dashboard for managing QR codes and users.

**Run:** `cd admin && npm run dev`

---

## 📄 Docs (`docs/`)

Project reports, diagrams, and documentation for the Q Yaar system.

---

## 🔗 Key APIs

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/qr/generate` | POST | Generate new QR code |
| `/api/qr/claim` | POST | Link QR to vehicle + phone |
| `/api/qr/:qrId` | GET | Get vehicle details by QR |
| `/api/qr/:qrId/notify` | POST | Send notification to vehicle owner |
| `/api/qr/user/:mobile` | GET | Get all QRs for a user |
| `/api/chat/initiate` | POST | Start a chat session |
| `/api/chat/:sessionId/messages` | GET | Get chat messages |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Mobile App | React Native + Expo SDK 54 |
| Backend | Node.js + Express.js |
| Database | MongoDB Atlas |
| Real-time | Socket.io |
| Push Notifications | Expo Push Service |
| Frontend | React + Vite |
| Deployment | Render (API), Vercel (Web) |

---

**Built with ❤️ in India**
