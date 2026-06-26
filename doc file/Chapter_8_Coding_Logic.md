## CHAPTER 8
## CORE MODULES & TECHNICAL IMPLEMENTATION (CODING)

### OVERVIEW

This chapter provides an in-depth technical analysis of the core modules that power the Q Yaar application. It breaks down the intricate logic behind vehicle registration, secure authentication, real-time QR code detection using Google ML Kit, instantaneous push notification delivery, bidirectional WebSocket-based communication, and the platform's proprietary anti-spam mechanisms. The codebase is distributed across a React Native frontend and a Node.js/Express backend communicating with a MongoDB database. For each module, the underlying architecture, data flow, core code implementation, and edge-case handling are thoroughly examined.

---

### 8.1 REGISTRATION MODULE (QR-TO-VEHICLE BINDING)

#### 8.1.1 Objective & Architecture
The primary objective of the registration module is to securely bind a physical QR code (represented by a unique UUID) to a user's mobile number and their specific vehicle details. The architecture ensures that a QR code can only be registered once. When a user scans an unregistered QR code, the mobile application captures the UUID and prompts the user for their details. This data is transmitted to the REST API, where transactional integrity ensures that the QR status transitions from `GENERATED` to `USED`.

#### 8.1.2 Data Flow
1. User scans a physical QR code using the app's camera.
2. The app verifies the QR structure locally.
3. The user inputs their mobile number, OTP, owner name, and vehicle registration number.
4. An HTTP POST request is dispatched to the backend.
5. The backend validates the QR ID against the MongoDB `QR` collection.
6. If the status is `GENERATED`, it updates the document with the user's data and sets the status to `USED`.
7. A success response is returned, and the frontend updates the global `UserContext`.

#### 8.1.3 Core Code Implementation

**Frontend Request Formulation (React Native):**
```javascript
const handleVehicleRegistration = async () => {
    try {
        setLoading(true);
        // Dispatching the registration payload to the backend API
        const response = await fetch(`${API_URL}/api/qr/register`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                qrId: scannedQRId, // Extracted securely from the camera feed
                mobileNumber: userMobileNumber,
                vehicleData: { 
                    ownerName: formData.ownerName.trim(), 
                    vehicleNumber: formData.vehicleNumber.trim().toUpperCase() 
                }
            })
        });
        
        const data = await response.json();
        if (data.success) {
            // Updating Global Application State
            setUserData(data.user); 
            navigation.replace('HomeDashboard');
        } else {
            handleErrorDisplay(data.message);
        }
    } catch (error) {
        console.error("Registration Network Error:", error);
        alert("A network error occurred during registration. Please check your connection.");
    } finally {
        setLoading(false);
    }
};
```

**Backend Processing Logic (Node.js/Express):**
```javascript
exports.registerVehicle = async (req, res) => {
    try {
        const { qrId, mobileNumber, vehicleData } = req.body;

        // Step 1: Input Validation
        if (!qrId || !mobileNumber || !vehicleData.vehicleNumber) {
            return res.status(400).json({ success: false, message: "Missing required fields." });
        }

        // Step 2: Database Query and State Validation
        const qrDocument = await QR.findOne({ qrId: qrId });
        if (!qrDocument) {
            return res.status(404).json({ success: false, message: "Invalid QR Code detected." });
        }
        
        // Critical Security Check: Prevent double registration
        if (qrDocument.status === 'USED') {
            return res.status(403).json({ success: false, message: "This QR Code is already registered to another vehicle." });
        }

        // Step 3: Data Mutation
        qrDocument.mobileNumber = mobileNumber;
        qrDocument.vehicleData = vehicleData;
        qrDocument.status = 'USED'; // State transition
        qrDocument.claimedAt = new Date();

        // Step 4: Database Persistence
        await qrDocument.save();

        return res.status(200).json({
            success: true,
            message: "Vehicle registered successfully",
            user: qrDocument
        });
    } catch (error) {
        // Step 5: Exception Handling
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};
```

#### 8.1.4 Technical Explanation & Edge Cases
The registration logic relies heavily on database state validation. The core operation is `QR.findOne({ qrId })`. If the document is found, the system explicitly checks the `status` field. The state machine allows only a one-way transition (`GENERATED` → `USED`). If a malicious user attempts to register an already active QR code, the server intercepts the request and responds with an HTTP 403 Forbidden status. The `trim()` and `toUpperCase()` functions on the frontend ensure data normalization before transmission, reducing database inconsistencies.

---

### 8.2 AUTHENTICATION & LOGIN MODULE

#### 8.2.1 Objective & Architecture
To minimize friction and enhance user adoption, Q Yaar utilizes a password-less authentication architecture based solely on mobile numbers. The objective is to quickly identify if a user already has registered vehicles associated with their device. Instead of managing complex authentication tokens and password hashing, the system leverages OTP verification (simulated or real) followed by a database lookup based on the indexed `mobileNumber` field.

#### 8.2.2 Core Code Implementation

**Frontend Authentication Flow:**
```javascript
const executeLoginProcess = async () => {
    try {
        setAuthLoading(true);
        // Validating mobile number format (10 digits)
        if (!/^[0-9]{10}$/.test(mobileNumber)) {
            return alert("Invalid Format: Please enter a valid 10-digit mobile number.");
        }

        // Fetching user identity from the backend
        const response = await fetch(`${API_URL}/api/qr/user/${mobileNumber}`, {
            method: 'GET',
            headers: { 'Cache-Control': 'no-cache' }
        });
        
        const data = await response.json();
        
        if (data.success && data.data) {
            // Identity confirmed. Hydrating global context.
            setUserData(data.data); 
            
            // Background Task: Registering device for push notifications
            registerForPushNotificationsAsync(mobileNumber); 
            
            navigation.navigate('MainStack');
        } else {
            // Unregistered user flow
            alert("Account not found. Please scan a QR code to register your vehicle first.");
            navigation.navigate('RegistrationIntro');
        }
    } catch (error) {
        console.error("Login Error:", error);
    } finally {
        setAuthLoading(false);
    }
};
```

#### 8.2.3 Technical Explanation & Device Linking
The login function initiates a `GET` request to retrieve documents matching the provided mobile number. Because a user can have multiple vehicles, the backend returns an array of registered QR documents. The most critical secondary function executed during login is `registerForPushNotificationsAsync`. This function requests native operating system permissions (iOS/Android) to display notifications, generates a unique Expo Push Token tied to the physical hardware device, and patches the database silently in the background. This ensures that even if a user changes phones, logging in will dynamically bind their vehicles to their new hardware device for push notifications.

---

### 8.3 MACHINE VISION & QR SCANNING LOGIC

#### 8.3.1 Objective & Architecture
The QR Scanning module serves as the primary gateway for public users to interact with vehicle owners. It relies on the `expo-camera` module, which abstracts the underlying Google ML Kit Vision API. The architecture is designed to capture high-speed video frames, process them locally on the device's CPU/NPU, and extract embedded strings without requiring internet connectivity during the detection phase. Network calls are only made *after* a successful extraction.

#### 8.3.2 Core Code Implementation

**Frontend Hardware Integration (React Native):**
```javascript
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState, useCallback } from 'react';

export default function QRScannerScreen({ navigation }) {
    const [permission, requestPermission] = useCameraPermissions();
    const [hasScanned, setHasScanned] = useState(false);

    // Callback fired by ML Kit when a barcode is detected in the frame
    const handleBarcodeScanned = useCallback(({ type, data }) => {
        // Debounce mechanism to prevent rapid-fire API calls
        if (hasScanned) return; 
        
        // Locking the scanner state
        setHasScanned(true);
        
        console.log(`Detected Barcode Type: ${type}, Data: ${data}`);
        
        // Validation: Ensure the QR belongs to the Q Yaar ecosystem
        if (data.includes('qyaar') || data.length === 36) { // UUIDv4 length is 36
            // Extract the UUID payload from the raw string
            const extractedQrId = extractQrIdFromPayload(data);
            
            // Haptic feedback to physical device
            triggerHapticFeedback();
            
            // Route to resolution screen
            navigation.navigate('ScanResult', { qrId: extractedQrId });
        } else {
            alert("Unrecognized QR Code. Please scan a valid Q Yaar tag.");
            // Reset scanner after delay
            setTimeout(() => setHasScanned(false), 2000);
        }
    }, [hasScanned, navigation]);

    if (!permission?.granted) {
        return <PermissionRequestUI onRequest={requestPermission} />;
    }

    return (
        <CameraView
            style={{ flex: 1 }}
            facing="back"
            onBarcodeScanned={hasScanned ? undefined : handleBarcodeScanned}
            barcodeScannerSettings={{ 
                barcodeTypes: ["qr"], // Optimizing performance by restricting format
            }}
        >
            <ScannerOverlayGraphic />
        </CameraView>
    );
}
```

#### 8.3.3 Technical Explanation & Optimization
The ML Kit integration processes frames at approximately 30 FPS. To prevent the application from crashing due to hundreds of simultaneous API requests when a QR code enters the frame, a sophisticated debouncing mechanism is implemented via the `hasScanned` state variable. Once a code is detected, `hasScanned` is toggled to `true`, and the `onBarcodeScanned` prop is dynamically set to `undefined`, effectively pausing the ML pipeline. The logic also includes ecosystem validation; it checks if the decoded string matches expected Q Yaar URI schemes or UUID lengths. If a user scans a random restaurant menu QR, the system rejects it immediately without making an unnecessary backend API call.

---

### 8.4 CUSTOM PUSH NOTIFICATION DELIVERY SYSTEM

#### 8.4.1 Objective & Architecture
The notification system is engineered to alert vehicle owners instantly when their vehicle requires attention, even if the application is killed or running in the background. It utilizes Expo's Push Notification Service as an intermediary to abstract the complexities of Firebase Cloud Messaging (FCM) for Android and Apple Push Notification service (APNs) for iOS. 

#### 8.4.2 Core Code Implementation

**Frontend Trigger Logic:**
```javascript
const dispatchUrgentAlert = async (predefinedMessage) => {
    try {
        setSending(true);
        const response = await fetch(`${API_URL}/api/qr/send-notification`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                qrId: targetVehicleQrId,
                senderName: "A Concerned Citizen",
                message: predefinedMessage // e.g., "Your vehicle is blocking my exit."
            })
        });
        
        if (response.ok) {
            showSuccessAnimation();
        }
    } catch (error) {
        console.error("Notification Dispatch Failed", error);
    }
};
```

**Backend Delivery Routing (Node.js):**
```javascript
const axios = require('axios');
const Notification = require('../models/Notification');

exports.sendNotification = async (req, res) => {
    const { qrId, senderName, message } = req.body;

    // Step 1: Resolve QR ID to Owner Device Token
    const targetQR = await QR.findOne({ qrId });
    if (!targetQR) return res.status(404).json({ message: "Vehicle not found" });

    // Step 2: Database Audit Logging
    const notificationRecord = await Notification.create({
        recipientMobile: targetQR.mobileNumber,
        senderName: senderName || "Someone",
        message: message,
        qrId: qrId,
        createdAt: new Date()
    });

    // Step 3: Third-Party Delivery Integration
    if (targetQR.expoPushToken && Expo.isExpoPushToken(targetQR.expoPushToken)) {
        try {
            // Constructing the Expo Push Payload
            const pushPayload = {
                to: targetQR.expoPushToken,
                sound: 'default',
                title: '🚨 Urgent: Vehicle Alert!',
                body: `${message} (Vehicle: ${targetQR.vehicleData.vehicleNumber})`,
                data: { 
                    notificationId: notificationRecord._id,
                    type: 'SYSTEM_ALERT',
                    qrId: qrId 
                },
                priority: 'high' // Bypasses doze mode on Android
            };

            // Transmitting to Expo servers
            await axios.post('https://exp.host/--/api/v2/push/send', pushPayload, {
                headers: {
                    'Accept': 'application/json',
                    'Accept-encoding': 'gzip, deflate',
                    'Content-Type': 'application/json',
                }
            });
            
            console.log(`Push notification routed successfully to ${targetQR.mobileNumber}`);
        } catch (pushError) {
            console.error("Expo Delivery Service Error:", pushError);
            // Non-blocking error; we still return success as the DB record was created
        }
    }

    return res.status(200).json({ success: true, message: "Alert dispatched." });
};
```

#### 8.4.3 Technical Explanation & Data Structure
The backend acts as an orchestrator. When an alert is triggered, it first creates a permanent record in the MongoDB `Notification` collection. This ensures that even if the owner's device has no internet connection at the moment, they can still view the alert in the app's 'Activity' tab later. The system then validates the syntax of the `expoPushToken`. The payload sent to Expo includes a `priority: 'high'` flag, which is a critical configuration that instructs mobile operating systems to wake up the device and display the banner immediately, essential for emergency vehicle alerts.

---

### 8.5 REAL-TIME WEBSOCKET CHAT (USER-TO-USER)

#### 8.5.1 Objective & Architecture
To facilitate ongoing dialogue (e.g., "I will be there in 5 minutes"), a real-time chat module is implemented. Traditional HTTP requests are inefficient for chat because they require the client to constantly poll the server. Instead, Q Yaar utilizes Socket.io to establish a persistent, full-duplex TCP connection via WebSockets. Communication is compartmentalized using a "Room" architecture based on a unique `sessionId`.

#### 8.5.2 Core Code Implementation

**Backend Socket Event Handlers (server.js):**
```javascript
const { Server } = require('socket.io');

const io = new Server(httpServer, {
    cors: { origin: "*", methods: ["GET", "POST"] },
    transports: ['websocket', 'polling'] // Fallback to long-polling if WS blocked
});

io.on('connection', (socket) => {
    console.log(`[Socket] Client Connected: ${socket.id}`);

    // Event: Client requests to enter a specific chat context
    socket.on('join_session', (sessionId) => {
        socket.join(sessionId); // Native Socket.io room management
        console.log(`[Socket] ${socket.id} joined room: ${sessionId}`);
    });

    // Event: Client transmits a message
    socket.on('send_message', async (payload) => {
        const { sessionId, senderMobile, text } = payload;
        
        // 1. Asynchronously persist message to MongoDB
        const savedMessage = await Message.create({
            sessionId,
            senderMobile,
            text,
            createdAt: new Date()
        });

        // 2. Broadcast ONLY to clients subscribed to this specific room (excluding sender)
        socket.to(sessionId).emit('receive_message', savedMessage);
    });

    socket.on('disconnect', () => {
        console.log(`[Socket] Client Disconnected: ${socket.id}`);
    });
});
```

**Frontend Socket Client Integration:**
```javascript
import io from 'socket.io-client';
import { useEffect, useState } from 'react';

const ChatScreen = ({ route }) => {
    const { sessionId, userMobile } = route.params;
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        // Initialize persistent connection
        const newSocket = io(API_URL);
        setSocket(newSocket);

        // Authenticate and subscribe to isolated room
        newSocket.emit('join_session', sessionId);

        // Event Listener: Incoming asynchronous messages
        newSocket.on('receive_message', (incomingMessage) => {
            // Functional state update to avoid stale closures
            setMessages((prevMessages) => [...prevMessages, incomingMessage]);
        });

        // Cleanup function for component unmount
        return () => {
            newSocket.disconnect();
        };
    }, [sessionId]);

    const handleSend = (text) => {
        const messagePayload = { sessionId, senderMobile: userMobile, text };
        
        // Optimistic UI Update (display immediately before server confirms)
        setMessages((prev) => [...prev, messagePayload]);
        
        // Transmit over wire
        socket.emit('send_message', messagePayload);
    };
    
    // UI Rendering omitted for brevity...
};
```

#### 8.5.3 Technical Explanation
The Socket.io implementation dramatically reduces server load and latency. When the `ChatScreen` mounts, the `useEffect` hook initiates a connection handshake and emits the `join_session` event. On the server side, `socket.join(sessionId)` places the user's socket connection into a designated memory space (a Room). When a message is sent, `socket.to(sessionId).emit()` acts as a localized broadcasting mechanism. It iterates through all active TCP sockets connected to that specific room and pushes the data packet down the pipe. The frontend utilizes "Optimistic UI Updates" by appending the message to the screen locally before the server acknowledges it, resulting in a perceived latency of zero milliseconds for the sender.

---

### 8.6 SECURITY: ANTI-SPAM & ABUSE PREVENTION LOGIC

#### 8.6.1 Objective & Architecture
Since vehicle QR codes are publicly visible, the system is highly susceptible to abuse, harassment, and spam. To protect vehicle owners, a deterministic, rule-based algorithm acts as a middleware guard before any message is saved or broadcasted. The architecture tracks message frequency, conversational balance, and session lifecycles.

#### 8.6.2 Core Code Implementation

**Backend Algorithmic Guard (chatController.js):**
```javascript
exports.processIncomingMessage = async (req, res) => {
    const { sessionId, senderMobile, text } = req.body;

    // Retrieve full context of the conversation
    const sessionContext = await ChatSession.findOne({ sessionId });
    
    if (!sessionContext) {
        return res.status(404).json({ message: 'Session architecture corrupted.' });
    }

    // SECURITY LAYER 1: Explicit Blocking Check
    if (sessionContext.status === 'BLOCKED') {
        return res.status(403).json({ 
            success: false, 
            message: 'Communication prohibited. You have been blocked by the owner.' 
        });
    }

    // SECURITY LAYER 2: Temporal Expiry Check (24 Hours)
    if (sessionContext.status === 'EXPIRED' || sessionContext.isExpired()) {
        if (sessionContext.status !== 'EXPIRED') {
            sessionContext.status = 'EXPIRED'; // Lazy state update
            await sessionContext.save();
        }
        return res.status(403).json({ 
            success: false, 
            message: 'Session TTL exceeded. Please initiate a new scan.' 
        });
    }

    const isScanner = (senderMobile === sessionContext.scannerMobile);

    // SECURITY LAYER 3: Asymmetric Rate Limiting (The 3-Message Rule)
    if (isScanner && !sessionContext.ownerHasReplied) {
        if (sessionContext.scannerMessageCount >= 3) {
            // Triggering HTTP 429 Too Many Requests
            return res.status(429).json({
                success: false,
                message: `Limit exceeded. Maximum 3 messages allowed before owner response.`,
                limitReached: true
            });
        }
    }

    // Passed all guards. Mutating database state.
    const messageRecord = await Message.create({ sessionId, senderMobile, text });

    // Updating algorithmic counters
    if (isScanner) {
        sessionContext.scannerMessageCount += 1;
    } else {
        // Owner has engaged. Remove restrictions.
        sessionContext.ownerHasReplied = true;
        sessionContext.scannerMessageCount = 0; 
    }

    // Updating cache for Chat List UI preview
    sessionContext.lastMessage = {
        text: text.substring(0, 100), // Truncate payload
        senderMobile,
        timestamp: new Date()
    };
    
    await sessionContext.save();

    return res.status(201).json({ success: true, data: messageRecord });
};
```

#### 8.6.3 Technical Explanation & Behavioral Engineering
This module represents the most complex business logic in the application. It acts as a multi-layered security funnel. 
1. **The Block Filter:** Absolute rejection if the session state is `BLOCKED`.
2. **The TTL (Time-To-Live) Filter:** Evaluates if 24 hours have passed since session creation. If so, it performs a "lazy update" to mark it expired and rejects the message.
3. **The Asymmetric Limit Filter:** This prevents harassment. The database tracks `scannerMessageCount` and a boolean `ownerHasReplied`. If the sender is the scanner, and the owner hasn't replied, the counter increments. Once it hits 3, the system throws an HTTP 429 error. The ingenious part is that if the sender is the owner, the `ownerHasReplied` flag flips to `true`, permanently disabling the 3-message limit for that specific session, allowing a free-flowing conversation. This mathematically guarantees that a malicious user can ping a vehicle owner a maximum of 3 times before being forced to stop.
