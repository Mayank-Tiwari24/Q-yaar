# Q Yaar — QR System Portal

The QR Code management portal for Q Yaar. Handles QR code generation, dashboards, and public scan result pages. Built with React + Vite + Tailwind CSS.

## Live URL
**[https://qyaar-qr.vercel.app](https://qyaar-qr.vercel.app)**

## Tech Stack
- **Framework:** React 19 + Vite 8
- **Styling:** Tailwind CSS v4
- **HTTP Client:** Axios
- **QR Generation:** qrcode.react
- **Routing:** React Router DOM v7
- **Deployment:** Vercel

## Features
- **QR Generation:** Generate unique QR codes with download/print support
- **Dashboard:** View all generated QRs, filter by status (USED/UNUSED)
- **Public Scan Page:** When someone scans a vehicle QR, shows vehicle details + notify owner form
- **Notification System:** Send messages to vehicle owners directly from scan page

## Folder Structure
```
├── public/           → Favicons, SVG icons
├── src/
│   ├── assets/       → Images (hero, logos)
│   ├── components/   → Navbar, Loader
│   ├── pages/        → GeneratePage, DashboardPage, QRScanPage, NotFoundPage
│   ├── api.js        → Axios API client (connects to backend)
│   ├── App.jsx       → Router setup
│   ├── index.css     → Global styles & design system
│   └── main.jsx      → React entry point
├── index.html        → HTML template
├── vite.config.js    → Vite + Tailwind config
└── vercel.json       → Vercel SPA rewrites
```

## Environment Variables
```env
VITE_API_URL=https://qyaar-backend.onrender.com/api
```

## Getting Started
```bash
npm install
npm run dev            # Starts on http://localhost:5173
npm run build          # Production build
npm run preview        # Preview production build
```

## Deployment
```bash
vercel --prod
```
