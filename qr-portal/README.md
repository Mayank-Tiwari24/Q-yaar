# Q Yaar QR Portal

This is a separate React web application (built with Vite) that handles the QR Code ecosystem.
It serves two main purposes:
1. **Public QR Scanning:** When someone scans a QR code that is placed on a vehicle, they are directed here (`/qr/:qrId`) to see vehicle details and send notifications.
2. **QR Generation:** A dashboard/tool (`/generate`) to generate new QR codes to be printed.

## Folder Structure
- `src/pages/`: 
  - `QRScanPage.jsx`: The page shown to people scanning a car.
  - `GeneratePage.jsx`: The tool to generate new QRs.
- `src/api.js`: Axios configuration to talk to the backend.

## Getting Started
1. Run `npm install` to install dependencies.
2. Run `npm run dev` to start the local development server.
