# Q Yaar — Admin Dashboard

Administrative panel for managing the Q Yaar system. View system statistics, manage QR codes, monitor notifications. Built with React + Vite.

## Tech Stack
- **Framework:** React 19 + Vite 8
- **HTTP Client:** Axios
- **QR Display:** qrcode.react
- **Notifications:** React Hot Toast
- **Deployment:** Vercel

## Features
- System-wide statistics (total QRs, active vehicles, scans, notifications)
- QR code management (view all, filter, delete)
- Notification monitoring
- Quick links to QR Generator and Website

## Folder Structure
```
├── public/
├── src/
│   ├── assets/
│   ├── pages/
│   │   └── Dashboard.jsx   → Main admin interface
│   ├── api.js              → Axios API client (admin endpoints)
│   ├── App.jsx             → App entry
│   ├── index.css           → Styles
│   └── main.jsx            → React entry point
├── index.html
├── vite.config.js          → Vite config (dev proxy to backend:5000)
└── vercel.json             → Vercel SPA rewrites
```

## Environment Variables
```env
VITE_API_URL=https://qyaar-backend.onrender.com/api
```

## Getting Started
```bash
npm install
npm run dev            # Starts on http://localhost:5175
npm run build          # Production build
```

## Deployment
```bash
vercel --prod
```
