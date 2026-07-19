# Q Yaar Mobile App

This is the React Native mobile application built using Expo. It handles user registration, vehicle linking (via QR scan), and real-time chat with people who scan your vehicle's QR code.

## Folder Structure
- `screens/`: Contains all the UI screens.
  - `auth/`: Screens related to login, registration, and onboarding.
  - `main/`: Core app screens (Home, Scan, Vehicles, Profile, Activity).
  - `chat/`: Screens for the real-time chat functionality.
- `context/`: `UserContext.js` manages global state (current user, etc.).
- `services/`: `notifications.js` handles Expo push notifications.
- `config/`: `api.js` contains the backend API URL.

## Getting Started
1. Run `npm install` to install dependencies.
2. Run `npx expo start` to start the development server.
3. Use the Expo Go app on your phone (or an Android emulator/iOS simulator) to run the app.

**Note:** Push notifications only work on physical devices or when built into a standalone APK.
