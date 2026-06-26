# Figure 7.1 — ML & QR Detection Pipeline Steps
# plantuml.com/plantuml/uml/ pe paste karo → PNG download karo

```
@startuml
skinparam activityFontSize 13
skinparam arrowFontSize 11

title Figure 7.1: ML & QR Detection Pipeline Steps

start

partition "Step 1: Image Capture" {
    :Device Camera Captures\nReal-Time Video Frames;
}

partition "Step 2: Preprocessing" {
    :Auto Exposure &\nWhite Balance Adjustment;
    :Grayscale Conversion;
    :Adaptive Thresholding\n& Binarization;
    :Edge Detection &\nPattern Isolation;
}

partition "Step 3: QR Detection (ML Kit CNN)" {
    :Finder Pattern\nLocalization;
    :Alignment Pattern\nDetection;
    :QR Boundary\nExtraction;
    if (QR Code Detected?) then (Yes)
    else (No)
        :Return to\nFrame Capture;
        stop
    endif
}

partition "Step 4: Decoding" {
    :Error Correction\n(Reed-Solomon);
    :Data Extraction\n(UUID from URL);
    :Output: Vehicle\nIdentifier (qrId);
}

partition "Step 5: Backend Lookup" {
    :API Call:\nGET /api/qr/scan/:qrId;
    :Fetch Vehicle Data\nfrom MongoDB;
}

partition "Step 6: Anti-Spam Classification" {
    :Check Session Status\n(ACTIVE / EXPIRED / BLOCKED);
    :Validate Scanner\nMessage Count <= 3;
    :Apply Rate Limiting\n& Session Expiry Rules;
}

partition "Step 7: Communication Routing" {
    :Route to Notification\nor Chat Module;
    :Deliver Push Notification\nvia Expo Push Service;
}

stop
@enduml
```

---

# DEPLOYMENT CHAPTER

## CHAPTER: DEPLOYMENT

### OVERVIEW

The deployment architecture of Q Yaar follows a distributed cloud-based model, where the backend services, frontend applications, and database are hosted on separate cloud platforms for optimal performance, scalability, and reliability. The deployment strategy ensures zero-downtime updates, automatic scaling, and secure communication across all components.

### BACKEND DEPLOYMENT (Render Cloud Platform)

The Node.js backend server, including the Express.js REST API and Socket.io real-time communication layer, is deployed on Render Cloud Platform. Render provides automatic HTTPS enforcement, continuous deployment from GitHub, and managed environment variables for secure configuration.

**Deployment Steps:**
1. The backend codebase is pushed to the GitHub repository (Master branch).
2. Render is connected to the GitHub repository for automatic deployments on every push.
3. Environment variables (MONGODB_URI, PORT, ALLOWED_ORIGINS) are configured securely through Render's dashboard.
4. Render automatically installs dependencies using `npm install` and starts the server using `node server.js`.
5. The backend is accessible at `https://qyaar-backend.onrender.com/api`.
6. Socket.io WebSocket connections are supported natively through Render's infrastructure with both WebSocket and long-polling transport.

**Server Configuration:**
- Build Command: `npm install`
- Start Command: `node server.js`
- Environment: Node.js 18+
- Auto-Deploy: Enabled on Master branch push
- Health Check Endpoint: `GET /api/health`

### DATABASE DEPLOYMENT (MongoDB Atlas)

The MongoDB database is hosted on MongoDB Atlas, a fully managed cloud database service. Atlas provides automated backups, monitoring, and global cluster distribution.

**Configuration:**
- Cluster Type: Shared (M0 Free Tier / M10 for production)
- Region: Mumbai (ap-south-1) for low latency in India
- Database Name: qyaar-db
- Collections: QR, ChatSession, Message, Notification
- Connection: Secured via connection string with authentication credentials stored in environment variables
- Backup: Automated daily snapshots with point-in-time recovery

### ADMIN PANEL DEPLOYMENT (Vercel)

The React.js admin dashboard for QR code management and system monitoring is deployed on Vercel, a serverless platform optimized for frontend frameworks.

**Deployment Steps:**
1. Admin panel code is pushed to the GitHub repository.
2. Vercel auto-deploys on every push to the main branch.
3. API base URL is configured as an environment variable pointing to the Render backend.
4. The admin panel is accessible at `https://qyaar-admin.vercel.app`.

### QR LANDING PAGE DEPLOYMENT (Vercel)

The public-facing QR scan landing page, built with React and Vite, is deployed on Vercel alongside the admin panel.

**Deployment Steps:**
1. Frontend code is pushed to the GitHub repository.
2. Vercel builds using `npm run build` and deploys the static assets.
3. The landing page is accessible at `https://q-yaar.vercel.app`.

### MOBILE APPLICATION DEPLOYMENT (Expo EAS Build)

The React Native mobile application is built and distributed using Expo Application Services (EAS Build), which provides cloud-based build infrastructure for generating production-ready APK (Android) and IPA (iOS) files.

**Deployment Steps:**
1. The `eas.json` configuration file defines build profiles:
   - **Preview Profile:** Generates a standalone APK for internal testing (`buildType: apk`).
   - **Production Profile:** Generates an optimized AAB for Google Play Store submission.
2. Build is triggered using the command: `eas build -p android --profile preview`.
3. EAS cloud service compiles the React Native code, bundles JavaScript assets, and produces the APK.
4. The generated APK is downloaded from the Expo dashboard and distributed to testers.
5. Push notification configuration requires the Expo project ID, which is embedded in `app.json`.

**EAS Build Configuration (eas.json):**
```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {}
  }
}
```

**App Configuration (app.json):**
- App Name: Q Yaar
- Package: com.qyaar.app
- SDK Version: Expo SDK 53
- Permissions: Camera (for QR scanning), Notifications (for push alerts)

### PUSH NOTIFICATION DEPLOYMENT

Push notifications are delivered through Expo Push Notification Service, which acts as a bridge between the Q Yaar backend and device notification systems (FCM for Android, APNs for iOS).

**Flow:**
1. Mobile app registers for push notifications on login and obtains an Expo Push Token.
2. The token is sent to the backend and stored in the QR document in MongoDB.
3. When a scanner sends a notification, the backend calls Expo Push API with the stored token.
4. Expo Push Server routes the notification to the appropriate platform (FCM/APNs).
5. The device receives and displays the notification even when the app is in background or killed state.

### DEPLOYMENT ARCHITECTURE DIAGRAM

```
@startuml
skinparam componentStyle rectangle

cloud "GitHub Repository" as GH

package "Cloud Hosting" {
    node "Render" {
        [Node.js Backend\nExpress + Socket.io] as BACKEND
    }
    node "Vercel" {
        [Admin Panel\nReact.js] as ADMIN
        [QR Landing Page\nReact + Vite] as LANDING
    }
    node "MongoDB Atlas" {
        database "qyaar-db" as DB
    }
    node "Expo EAS" {
        [Mobile APK Build\nReact Native] as EAS
    }
    node "Expo Push Server" {
        [Push Notification\nDelivery] as PUSH
    }
}

actor "Vehicle Owner" as USER
actor "Admin" as ADM

GH --> BACKEND : Auto Deploy
GH --> ADMIN : Auto Deploy
GH --> LANDING : Auto Deploy
GH --> EAS : Build Trigger

BACKEND --> DB : Read/Write
BACKEND --> PUSH : Send Notification
PUSH --> USER : Push Alert
USER --> BACKEND : API Calls
USER --> BACKEND : WebSocket
ADM --> ADMIN : Manage QRs
ADMIN --> BACKEND : API Calls
EAS --> USER : Install APK
@enduml
```

### CI/CD PIPELINE

The project follows a Continuous Integration and Continuous Deployment (CI/CD) workflow:

1. **Development:** Code is written and tested locally using Expo Dev Server (`npx expo start`).
2. **Version Control:** Changes are committed to feature branches on GitHub and merged to Master via pull requests.
3. **Auto-Deploy Backend:** Render automatically redeploys the backend on every push to Master branch.
4. **Auto-Deploy Frontend:** Vercel automatically rebuilds and redeploys the admin panel and landing page on every push.
5. **Mobile Build:** EAS Build is triggered manually using `eas build` command when a new APK release is needed.
6. **Testing:** API endpoints are tested using Postman, and the mobile app is tested on physical devices via the preview APK.
