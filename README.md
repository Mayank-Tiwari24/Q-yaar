# Q Yaar — Website

The official public-facing landing page for Q Yaar. Built with React + Vite, deployed on Vercel.

## Live URL
**[https://q-yaar.vercel.app](https://q-yaar.vercel.app)**

## Tech Stack
- **Framework:** React 19 + Vite 8
- **Routing:** React Router DOM v7
- **Styling:** Vanilla CSS with custom design system (glassmorphism, animations)
- **Fonts:** Inter + Outfit (Google Fonts)
- **Deployment:** Vercel

## Features
- Modern landing page with scroll-reveal animations
- Direct APK download (served from `/public/Q-Yaar-v1.0.0.apk`)
- QR scan result page with vehicle details & notification form
- Responsive design (mobile-first)

## Folder Structure
```
├── public/           → Static assets (APK file, favicons, SVGs)
├── src/
│   ├── components/   → Navbar, Footer
│   ├── pages/        → LandingPage, DownloadPage, QRScanPage, NotFoundPage
│   ├── App.jsx       → Router setup
│   ├── index.css     → Design system (variables, animations, utilities)
│   └── main.jsx      → React entry point
├── index.html        → HTML template with SEO meta tags
├── vite.config.js    → Vite configuration
└── vercel.json       → Vercel SPA rewrites
```

## Environment Variables
```env
VITE_API_URL=https://qyaar-backend.onrender.com/api
```

## Getting Started
```bash
npm install
npm run dev            # Starts on http://localhost:5174
npm run build          # Production build
npm run preview        # Preview production build
```

## Deployment
```bash
# Auto-deploys on push to main via Vercel
vercel --prod
```
