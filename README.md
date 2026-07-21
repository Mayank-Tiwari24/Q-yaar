# Q Yaar — Mobile App

React Native mobile application built with Expo SDK 54. Available as an Android APK.

## Tech Stack
- **Framework:** React Native 0.81 + Expo SDK 54
- **Navigation:** React Navigation (Native Stack)
- **Push Notifications:** Expo Notifications
- **Camera:** Expo Camera (QR scanning)
- **Real-time Chat:** Socket.io Client
- **Build:** EAS Build (APK/AAB)

## Features
- **Onboarding:** Animated welcome screens
- **Auth:** Phone-based login/registration
- **QR Scanner:** Scan vehicle QRs using camera
- **Vehicle Management:** Register vehicles, link QR codes
- **Push Notifications:** Real-time alerts when someone scans your QR
- **Chat:** Encrypted real-time messaging between scanner & vehicle owner
- **Profile:** Manage account and vehicle details

## Folder Structure
```
├── screens/
│   ├── auth/          → Onboarding, Login, Register, UserDetails, Selection
│   ├── main/          → Home, Scan, ScanResult, Vehicles, Activity, Profile, MyQR, SearchVehicle
│   └── chat/          → ChatList, Chat
├── context/           → UserContext (global state management)
├── services/          → Push notification registration & listeners
├── config/            → API URL configuration
├── assets/            → App icons (icon.png, adaptive-icon.png, favicon)
├── App.js             → Entry point + Navigation stack
├── app.json           → Expo configuration
├── eas.json           → EAS Build profiles (development, preview APK, production)
└── package.json
```

## Environment Variables
```env
EXPO_PUBLIC_API_URL=https://qyaar-backend.onrender.com/api
```

## Getting Started
```bash
npm install
npx expo start         # Start Metro bundler
npx expo start --android   # Run on Android device/emulator
```

## Building APK
```bash
# Preview APK (direct install)
eas build --profile preview --platform android

# Production AAB (Play Store)
eas build --profile production --platform android
```

## Important Notes
- Push notifications require a **physical device** (not Expo Go in SDK 54+)
- Build a development client or preview APK for full functionality
- QR scanning requires camera permissions
