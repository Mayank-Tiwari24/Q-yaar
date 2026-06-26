# Chapter 6 — Software Design Diagrams (PlantUML)
# Har diagram ka code copy karo aur plantuml.com/plantuml/uml/ pe paste karo → PNG download karo

---

## 6.1 Use Case Diagram — Vehicle Owner Module
## plantuml.com pe paste karo:

```
@startuml
left to right direction
skinparam actorStyle awesome
skinparam packageStyle rectangle

actor "Vehicle Owner" as Owner

rectangle "Q Yaar - Vehicle Owner Module" {
    usecase "Register via QR Scan" as UC1
    usecase "Login with Mobile Number" as UC2
    usecase "View Home Dashboard" as UC3
    usecase "View My Vehicles" as UC4
    usecase "View My QR Code" as UC5
    usecase "Share / Download QR" as UC6
    usecase "Receive Push Notifications" as UC7
    usecase "View Notifications" as UC8
    usecase "Reply in Chat Session" as UC9
    usecase "Block Scanner User" as UC10
    usecase "View Chat List" as UC11
    usecase "Edit Profile" as UC12
    usecase "Logout" as UC13
}

Owner --> UC1
Owner --> UC2
Owner --> UC3
Owner --> UC4
Owner --> UC5
Owner --> UC6
Owner --> UC7
Owner --> UC8
Owner --> UC9
Owner --> UC10
Owner --> UC11
Owner --> UC12
Owner --> UC13
@enduml
```

---

## 6.2 Use Case Diagram — Scanner / Public User Module
## plantuml.com pe paste karo:

```
@startuml
left to right direction
skinparam actorStyle awesome
skinparam packageStyle rectangle

actor "Scanner / Public User" as Scanner

rectangle "Q Yaar - Scanner Module" {
    usecase "Register via QR Scan" as UC1
    usecase "Login with Mobile Number" as UC2
    usecase "Scan Vehicle QR Code" as UC3
    usecase "View Vehicle Details" as UC4
    usecase "Send Notification to Owner" as UC5
    usecase "Start Chat with Owner" as UC6
    usecase "Send Messages (Max 3)" as UC7
    usecase "View Chat List" as UC8
    usecase "Search Vehicle by Number" as UC9
    usecase "View Own Notifications" as UC10
}

Scanner --> UC1
Scanner --> UC2
Scanner --> UC3
Scanner --> UC4
Scanner --> UC5
Scanner --> UC6
Scanner --> UC7
Scanner --> UC8
Scanner --> UC9
Scanner --> UC10

UC6 ..> UC7 : <<include>>
@enduml
```

---

## 6.3 Use Case Diagram — Admin Module
## plantuml.com pe paste karo:

```
@startuml
left to right direction
skinparam actorStyle awesome
skinparam packageStyle rectangle

actor "Admin" as Admin

rectangle "Q Yaar - Admin Module" {
    usecase "Login to Admin Panel" as UC1
    usecase "Generate QR Codes (Bulk)" as UC2
    usecase "View All Generated QRs" as UC3
    usecase "Track QR Status" as UC4
    usecase "View Registered Users" as UC5
    usecase "View Vehicle Registrations" as UC6
    usecase "Monitor System Analytics" as UC7
    usecase "Manage QR Batches" as UC8
}

Admin --> UC1
Admin --> UC2
Admin --> UC3
Admin --> UC4
Admin --> UC5
Admin --> UC6
Admin --> UC7
Admin --> UC8

UC4 ..> UC3 : <<extend>>
@enduml
```

---

## 6.4 ER Diagram — Database
## plantuml.com pe paste karo:

```
@startuml
skinparam linetype ortho

entity "QR" as QR {
    *qrId : string <<PK>>
    --
    mobileNumber : string
    status : string [GENERATED|USED]
    vehicleNumber : string
    ownerName : string
    model : string
    color : string
    fuel : string
    scanCount : int
    expoPushToken : string
    claimedAt : datetime
    createdAt : datetime
}

entity "ChatSession" as CS {
    *sessionId : string <<PK>>
    --
    qrId : string <<FK>>
    scannerMobile : string
    ownerMobile : string
    status : string [ACTIVE|EXPIRED|BLOCKED]
    scannerMessageCount : int
    ownerHasReplied : boolean
    lastMessageText : string
    lastMessageTimestamp : datetime
    expiresAt : datetime
    createdAt : datetime
}

entity "Message" as MSG {
    *_id : string <<PK>>
    --
    sessionId : string <<FK>>
    senderMobile : string
    text : string
    isRead : boolean
    createdAt : datetime
}

entity "Notification" as NOTIF {
    *_id : string <<PK>>
    --
    recipientMobile : string
    senderName : string
    message : string
    qrId : string <<FK>>
    createdAt : datetime
}

QR ||--o{ CS : "has many"
QR ||--o{ NOTIF : "receives"
CS ||--o{ MSG : "contains"
@enduml
```

---

## 6.5 High Level Architecture Diagram
## plantuml.com pe paste karo:

```
@startuml
skinparam componentStyle rectangle
skinparam defaultFontSize 12

package "Client Layer" {
    [Mobile App\nReact Native / Expo] as MA
    [Admin Panel\nReact.js] as AP
    [QR Landing Page\nReact + Vite] as WEB
}

package "Server Layer" {
    [REST API\nExpress.js] as API
    [Real-Time Chat\nSocket.io] as SOCKET
    [Push Notification\nExpo Push Service] as PUSH
}

database "Database Layer" {
    [MongoDB Atlas] as DB
}

cloud "External Services" {
    [Render Cloud\nHosting] as RENDER
    [Vercel\nFrontend Hosting] as VERCEL
    [Expo Push Server] as EXPO
}

MA --> API : HTTP/REST
MA --> SOCKET : WebSocket
AP --> API : HTTP/REST
WEB --> API : HTTP/REST
API --> DB : CRUD Operations
SOCKET --> DB : Session Events
API --> PUSH : Send Token
PUSH --> EXPO : Deliver
EXPO --> MA : Push Notification
API -- RENDER
AP -- VERCEL
WEB -- VERCEL
@enduml
```

---

## 6.6 Low Level Diagram — QR Scan & Chat Flow
## plantuml.com pe paste karo:

```
@startuml
start
:User Opens App;
:Navigate to Scan Screen;
:Camera Opens with QR Scanner;

repeat
    :Scan for QR Code;
repeat while (QR Detected?) is (No)
->Yes;

:Extract UUID from QR Data;
:API Call: GET /api/qr/scan/:qrId;

if (Vehicle Found?) then (No)
    :Show Error: QR Not Registered;
    stop
else (Yes)
    :Show Scan Result Screen\n(Vehicle Details);
endif

if (User Action?) then (Send Notification)
    :API Call: POST /api/qr/notify;
    :Push Notification Sent to Owner;
    :Show Success Message;
    stop
else (Start Chat)
    :API Call: POST /api/chat/initiate;
endif

if (Session Created?) then (Blocked)
    :Show Blocked Message;
    stop
else (Success)
    :Open Chat Screen;
endif

:Connect Socket.io to Session Room;

repeat
    :Send / Receive Messages;
    if (Scanner Limit 3 msgs?) then (Yes)
        :Show "Wait for Reply";
    else (No)
    endif
repeat while (Session Expired 24hrs?) is (No)
->Yes;

:Show Session Expired;
stop
@enduml
```

---

## 6.7 Low Level Diagram — Notification System
## plantuml.com pe paste karo:

```
@startuml
start
:Scanner Scans QR Code;
:API: GET Vehicle Details;
:Scan Result Screen Displayed;
:User Clicks "Send Notification";
:API: POST /api/qr/send-notification;

if (Owner Has Push Token?) then (No)
    :Save Notification to DB Only;
else (Yes)
    :Send Expo Push Notification;
    :Expo Push Server Delivers to Device;

    if (App State?) then (Foreground)
        :Show In-App Alert Banner;
    else (Background / Killed)
        :Show System Push Notification;
        :User Taps Notification;
        :App Opens → Activity Screen;
    endif
endif

:Notification Stored in MongoDB;
:User Views All Notifications;

if (User Action?) then (Reply via Chat)
    :Navigate to Chat Screen;
else (Dismiss)
    :Stay on Activity Screen;
endif

stop
@enduml
```
