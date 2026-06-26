
# QR-BASED SMART VEHICLE IDENTITY AND COMMUNICATION SYSTEM (Q YAAR)

## A
## MAJOR PROJECT-II REPORT

Submitted in partial fulfillment of the requirements
for the degree of

### BACHELOR OF TECHNOLOGY
in
### COMPUTER SCIENCE & ENGINEERING

By

**GROUP NO. ___**

| Name | Enrollment No. |
|------|---------------|
| Mayank Tiwari | 0187CS221___ |
| Roshni _______ | 0187CS221___ |
| ______________ | 0187CS221___ |
| ______________ | 0187CS221___ |

Under the guidance of
**Dr. _______________**
(Associate Professor)

Department of Computer Science & Engineering
Sagar Institute of Science & Technology (SISTec), Bhopal (M.P)

Approved by AICTE, New Delhi & Govt. of M.P.
Affiliated to Rajiv Gandhi Proudyogiki Vishwavidyalaya, Bhopal (M.P.)

**June – 2026**

---

## Sagar Institute of Science & Technology (SISTec), Bhopal (M.P)
### Department of Computer Science & Engineering

## CERTIFICATE

We hereby certify that the work which is being presented in the B.Tech. Major Project-II Report entitled **QR-BASED SMART VEHICLE IDENTITY AND COMMUNICATION SYSTEM (Q YAAR)**, in partial fulfillment of the requirements for the award of the degree of Bachelor of Technology, submitted to the Department of Computer Science & Engineering, Sagar Institute of Science & Technology (SISTec), Bhopal (M.P.) is an authentic record of our own work carried out during the period from Jan-2026 to June-2026 under the supervision of **Dr. _______________**.

The content presented in this project has not been submitted by me for the award of any other degree elsewhere.

| Name | Enrollment No. |
|------|---------------|
| Mayank Tiwari | 0187CS221___ |
| Roshni _______ | 0187CS221___ |
| ______________ | 0187CS221___ |
| ______________ | 0187CS221___ |

This is to certify that the above statement made by the candidate is correct to the best of my knowledge.

Date:

| Project Guide | HOD, CSE | Principal |
|--------------|----------|-----------|
| Dr. _______________ | Prof. Nargish Gupta | Dr. Manish Billore |

---

## ACKNOWLEDGEMENT

We take this occasion to thank God, almighty for blessing us with his grace and taking our endeavor to a successful culmination. We extend our sincere and heartfelt thanks to our esteemed Project Guide, Dr. _______________, for providing us with the right guidance and advice at crucial junctures and for showing us the right way.

We would like to express our sincere thanks to Dr. Manish Billore, Principal, SISTec, Gandhi Nagar, Bhopal for giving us an opportunity to undertake this project.

We would like to express our sincere thanks to Dr. Swati Saxena, Vice Principal, SISTec, Gandhi Nagar, Bhopal, for giving us an opportunity to undertake this project.

We also take this opportunity to express a deep sense of gratitude to Prof. Nargish Gupta (HOD) of the Department of Computer Science & Engineering for his kindhearted support. I would like to thank all those people who helped me directly or indirectly to complete my project whenever I found myself in problems. All our faculties encouraged me and due to their kindness and helpful nature and help I got very much confidence in completing this project.

I am deeply inherited who devoted their precious time for providing us the information about the various aspects and giving support and guidance at every point of time. We are thankful to their kind and supportive nature. Their inspiring nature has always made our work easy.

---

## TABLE OF CONTENTS

| TITLE | PAGE NO |
|-------|---------|
| Abstract | i |
| List Of Abbreviation | ii |
| List Of Figures | iii |
| **Chapter 1 – Introduction** | |
| Overview Of Project | 1 |
| Current Scenario and Problem Description | 1 |
| Objective Of Project | 2 |
| Project Deliverables | 3 |
| **Chapter 2 – Software and Hardware Requirements** | |
| Software Requirements | 4 |
| Hardware Requirements | 4 |
| **Chapter 3 – Problem Description** | |
| Overview | 5 |
| 3.1 Challenges In The Current Vehicle Communication Ecosystem | 5 |
| 3.2 Proposed Solution Architecture | 6 |
| **Chapter 4 – Literature Survey** | 7 |
| **Chapter 5 – Software Requirements Specification** | |
| Functional Requirements | 8 |
| Non-Functional Requirements | 9 |

---

## ABSTRACT

Q Yaar is an innovative, mobile-first vehicle identity and communication platform developed to promote seamless, privacy-preserving interaction between vehicle owners and the general public using QR code technology. By integrating modern technologies—such as QR code-based vehicle identification, real-time chat powered by Socket.io, push notifications via Expo, and secure MongoDB-backed registration—Q Yaar bridges the persistent gap between vehicle owners and individuals needing to reach them, eliminating the unsafe practice of displaying personal contact details on dashboards. The system streamlines vehicle-related communication across parking disputes, emergency alerts, and general inquiries, empowering users to connect with vehicle owners instantly through a simple QR scan. With robust anti-spam mechanisms, auto-expiring 24-hour chat sessions, and owner-controlled blocking capabilities, the platform cultivates a scalable, secure digital infrastructure for responsible urban communication and vehicle management. Aligned with SDG 9 (Industry, Innovation, and Infrastructure) and SDG 11 (Sustainable Cities and Communities), Q Yaar fosters innovation, urban efficiency, and social connectivity by democratizing access to vehicle owner communication, thus contributing to building safer, smarter communities and accelerating progress toward sustainable urban development.

---

## LIST OF ABBREVIATIONS

| ACRONYM | FULL FORM |
|---------|-----------|
| API | Application Programming Interface |
| QR | Quick Response (Code) |
| DBMS | Database Management System |
| GUI | Graphical User Interface |
| HTTPS | Hypertext Transfer Protocol Secure |
| HTML | Hyper Text Markup Language |
| UML | Unified Modeling Language |
| RAM | Random Access Memory |
| UI | User Interface |
| UX | User Experience |
| SDK | Software Development Kit |
| HDD | Hard Disk Drive |
| SSD | Solid State Drive |
| CORS | Cross-Origin Resource Sharing |
| JWT | JSON Web Token |
| REST | Representational State Transfer |
| UUID | Universally Unique Identifier |

---

## LIST OF FIGURES

| FIGURE NO. | TITLE | PAGE NO. |
|-----------|-------|----------|
| 5.1 | Functional Requirements | 8 |
| 5.2 | Non-Functional Requirements | 9 |
| 6.1 | Use Case Diagram – Vehicle Owner Module | 10 |
| 6.2 | Use Case Diagram – Scanner/Public User Module | 11 |
| 6.3 | Use Case Diagram – Admin Module | 12 |
| 6.4 | ER Diagram | 13 |
| 6.5 | High Level Architecture Diagram | 14 |
| 6.6 | Low Level Diagram – QR Scan & Chat Flow | 15 |
| 6.7 | Low Level Diagram – Notification System | 16 |
| 9.1 | Onboarding Screen | 47 |
| 9.2 | Registration / QR Scan Screen | 47 |
| 9.3 | User Login Screen | 48 |
| 9.4 | Home Dashboard | 48 |
| 9.5 | QR Scanner Screen | 49 |
| 9.6 | Scan Result Screen | 49 |
| 9.7 | Chat Screen | 50 |
| 9.8 | Chat List Screen | 50 |
| 9.9 | Notifications / Activity Screen | 51 |
| 9.10 | My Vehicles Screen | 51 |
| 9.11 | My QR Screen | 52 |
| 9.12 | Profile Screen | 52 |
| 9.13 | Admin Dashboard | 53 |

---

## Chapter 1
## Introduction

---

## CHAPTER 1
## INTRODUCTION

### OVERVIEW OF THE PROJECT

Q Yaar represents a paradigm shift in how vehicle owners and the general public communicate in everyday urban scenarios. The project addresses a fundamental challenge faced by millions of vehicle owners globally—the inability to be contacted when their parked vehicle causes an obstruction, faces an emergency, or requires the owner's attention. In a rapidly growing urban landscape where parking spaces are increasingly contested and vehicle-related disputes are common, the need for a structured, technology-enabled vehicle communication platform has never been more critical. The contemporary urban ecosystem is characterized by significant communication gaps between vehicle owners and the public. While leaving phone numbers on dashboards is a common workaround, it exposes vehicle owners to privacy risks, spam calls, and potential security threats. Existing solutions like parking attendants and traffic police are reactive rather than proactive and are not scalable to meet the demands of growing urban populations. Q Yaar aims to democratize vehicle communication by creating a secure digital bridge where anyone can contact a vehicle owner through a simple QR scan, regardless of their location, without compromising the owner's personal contact information.

### CURRENT SCENARIO AND PROBLEM IDENTIFICATION

The current vehicle communication landscape operates primarily through informal methods such as leaving phone numbers on dashboards, relying on parking attendants, or depending on traffic police intervention. These traditional approaches suffer from several critical limitations that hinder their effectiveness and scalability. First, displaying personal phone numbers on vehicle dashboards exposes owners to privacy risks, spam calls, and potential harassment. Second, reaching a vehicle owner in emergencies—such as when their car is being towed, hit, or blocking an exit—depends entirely on chance and proximity, with no reliable communication channel available. Third, existing solutions do not provide any structured mechanism for anonymous yet accountable communication between vehicle owners and the public, leading to frustration and unresolved disputes. Furthermore, the rapid urbanization of Indian cities has intensified parking challenges, yet vehicle communication systems have not evolved to meet modern expectations. Current solutions lack sophisticated features such as QR-based instant identification, real-time messaging, push notifications for urgent alerts, and anti-spam protections. The absence of a dedicated vehicle communication platform that ensures privacy, enables instant contact, and provides a secure channel for interaction represents a significant gap that Q Yaar is positioned to address comprehensively.

### OBJECTIVES OF THE PROJECT

To enable instant vehicle owner contact: Create a platform that allows any individual to contact a vehicle owner instantly by scanning a QR code placed on the vehicle, without requiring the owner's personal phone number or any prior acquaintance.

To ensure owner privacy and security: Implement a communication architecture where vehicle owners' personal contact details are never exposed to scanners, ensuring complete privacy while still enabling meaningful contact through the platform's secure messaging system.

To facilitate real-time communication: Integrate embedded real-time chat powered by Socket.io and push notifications via Expo that facilitate seamless, instant communication between vehicle scanners and owners without requiring users to navigate external platforms.

To implement anti-spam and abuse protection: Develop robust mechanisms including message rate limiting (maximum 3 messages before owner replies), auto-expiring 24-hour chat sessions, and owner-controlled blocking capabilities that prevent misuse of the communication channel.

To automate notification delivery: Build an automated push notification system that instantly alerts vehicle owners when someone scans their QR code and sends a message, ensuring timely response even when the owner is not actively using the app.

To ensure platform reliability and security: Build a scalable, secure infrastructure using Node.js, Express, and MongoDB that protects user data, ensures communication integrity, and maintains consistent performance under varying load conditions.

To deliver superior user experience: Create intuitive, responsive interfaces across the React Native mobile application that minimize friction in the scan-to-communicate process and enhance overall user satisfaction through smooth animations, Material Design 3 aesthetics, and seamless navigation.

### PROJECT DELIVERABLES

Mobile Application (React Native / Expo): A fully functional cross-platform mobile app enabling vehicle owners to register their vehicles via QR code scanning, manage their vehicle profiles, receive notifications, engage in real-time chat, and view their QR codes for sharing.

Vehicle Owner Module: Features including vehicle registration through QR code scanning, vehicle details management, QR code viewing and sharing, notification management, chat session handling, and user blocking capabilities.

Scanner / Public User Module: Features enabling any registered user to scan a vehicle's QR code, view limited vehicle details, send notification alerts to the vehicle owner, and initiate time-limited chat sessions.

Admin Module: Admin dashboard (React.js) for QR code generation, batch management, user monitoring, vehicle registration oversight, and system analytics.

QR Code System: Complete QR code lifecycle management including bulk generation, unique UUID assignment, status tracking (GENERATED → USED), and vehicle-to-QR mapping.

Authentication & Security: Secure mobile-number-based login and registration system with backend validation through MongoDB.

Real-Time Communication: In-app real-time chat powered by Socket.io with typing indicators, message delivery tracking, and session-based communication with 24-hour auto-expiry.

Push Notification System: Expo push notification integration for instant owner alerts when their vehicle QR is scanned and messaged, with foreground and background notification handling.

---

## Chapter 2
## Software & Hardware Requirements

---

## CHAPTER 2
## SOFTWARE & HARDWARE REQUIREMENTS

### SOFTWARE REQUIREMENTS

Frontend (Mobile): React Native with Expo SDK – For building cross-platform, high-performance mobile interfaces with native feel using JavaScript.

Frontend (Admin Panel): React.js – For building fast, dynamic, and modular admin web interfaces for QR management and system monitoring.

Frontend (QR Landing Page): React.js with Vite – For building the public-facing QR scan landing page that enables communication initiation.

Backend: Node.js with Express Framework – For scalable, real-time backend with RESTful API setup and Socket.io integration for chat functionality.

Database: MongoDB (Cloud-based via MongoDB Atlas) – For flexible, cloud-based document storage and fast data retrieval with schema-less design.

Real-Time Communication: Socket.io – For bidirectional, event-driven real-time messaging between vehicle owners and scanners.

Push Notifications: Expo Notifications API – For delivering instant push notifications to vehicle owners on both Android and iOS devices.

Camera & QR Scanning: expo-camera with CameraView – For native QR code scanning capabilities within the mobile application.

Development Tools: VS Code, Postman – For coding, debugging, and API testing across frontend and backend components.

Version Control: Git & GitHub – For streamlined team collaboration and code management across multiple branches.

### HARDWARE REQUIREMENTS

Development Machine: A minimum Intel i5 with 8GB RAM and SSD storage ensures smooth coding, compiling, debugging, and multitasking in development environments.
- Processor: Intel i5 or equivalent
- RAM: 8GB minimum
- Storage: 256GB SSD or higher

Server: Render Cloud Platform with auto-scaling capabilities provides reliable performance, HTTPS support, and ample resources for hosting backend services and MongoDB Atlas database.
- Processor: Shared vCPU (cloud-managed)
- RAM: 512MB or higher (auto-scaled)
- Storage: Cloud-managed persistent storage

Mobile Testing Device: An Android device running Android 10+ or iOS device running iOS 14+ with camera support for QR code scanning functionality testing.
- Android 10+ or iOS 14+
- Minimum 3GB RAM
- Camera with autofocus support

---

## Chapter 3
## Problem Description

---

## CHAPTER 3
## PROBLEM DESCRIPTION

### OVERVIEW

Vehicle owners and the general public encounter numerous challenges in urban settings when communication is needed regarding parked vehicles. One of the most significant issues is the complete absence of a reliable, private, and instant communication channel between a vehicle and its owner when the owner is not physically present near the vehicle.

### CHALLENGES IN THE CURRENT VEHICLE COMMUNICATION ECOSYSTEM

Privacy Risks: The most common workaround—leaving phone numbers on dashboards—exposes vehicle owners to spam calls, telemarketing, harassment, and potential security threats. This practice compromises personal privacy for the sake of accessibility.

Lack of Instant Communication: When a vehicle is double-parked, blocking an exit, involved in a minor incident, or being towed, there is no reliable mechanism to instantly reach the owner. Relying on parking attendants or traffic police is slow, unreliable, and unavailable in most locations.

No Structured Communication Channel: Current methods lack any form of structured, accountable communication. Phone calls from unknown numbers are often ignored, and there is no way to verify whether the caller has a legitimate reason to contact the vehicle owner.

Absence of Anti-Abuse Mechanisms: Without any platform governing the communication, vehicle owners have no control over who contacts them, how frequently, or through what medium. There are no blocking, rate-limiting, or session-expiry mechanisms to prevent misuse.

Scalability Issues: Manual solutions like parking attendants, security guards, or neighborhood WhatsApp groups do not scale to meet the demands of rapidly urbanizing cities with millions of vehicles.

No Digital Record: Phone calls and face-to-face interactions leave no digital trail, making it impossible to track communication history, resolve disputes, or identify repeat offenders.

### PROPOSED SOLUTION

Q Yaar's technology-enabled platform solves these challenges through:

QR-Based Vehicle Identification: Each vehicle receives a unique QR code linked to the owner's account. Anyone can scan this QR to initiate communication without ever seeing the owner's phone number, ensuring complete privacy protection.

Real-Time Chat with Session Management: The platform provides Socket.io-powered real-time chat with 24-hour auto-expiring sessions, ensuring that communication channels are temporary and purpose-driven rather than permanent.

Anti-Spam Protection: A robust message rate-limiting system allows scanners to send a maximum of 3 messages before the owner replies, preventing spam and harassment while still enabling meaningful communication.

Push Notification Alerts: Instant push notifications alert vehicle owners the moment someone scans their QR and sends a message, ensuring timely awareness and response even when the app is in the background.

Owner-Controlled Blocking: Vehicle owners have complete control over their communication channels, with the ability to block specific users from future contact through their vehicle QR.

Secure Backend Infrastructure: Data transmission uses encrypted HTTPS protocols, communication is sessionized with UUID-based identifiers, and the MongoDB database ensures data integrity and privacy compliance.

Together, these integrated systems establish an accessible, private, and efficient vehicle communication ecosystem that eliminates the need for unsafe workarounds while empowering both vehicle owners and the public.

---

## Chapter 4
## Literature Survey

---

## CHAPTER 4
## LITERATURE SURVEY

Key findings on QR code-based identification systems, vehicle management platforms, and real-time communication architectures were incorporated to shape the technical architecture and feature set of Q Yaar [1].

Guidelines and best practices for building cross-platform mobile applications using React Native and Expo were followed, including UI design principles, lifecycle handling, navigation patterns, and native module integration to develop a responsive and performant mobile client app [2].

The Express.js framework's features for setting up RESTful APIs, middleware integration, routing mechanisms, and request/response handling formed the basis of the Q Yaar backend service that manages QR registration, vehicle data, chat sessions, and notification delivery [3].

The MongoDB document model, data organization, query language, and schema design principles were referred to when designing persistent storage for QR codes, vehicle data, chat sessions, messages, and user notifications [4].

Socket.io's real-time bidirectional communication capabilities, room-based messaging architecture, and event-driven patterns were studied to implement the real-time chat feature between vehicle owners and scanners with typing indicators and instant message delivery [5].

ParkEasy and similar smart parking applications were surveyed for their approach to vehicle identification and owner communication. These platforms highlighted the importance of QR-based identification over traditional number plate recognition for cost-effectiveness and reliability. The survey revealed that existing parking solutions focus primarily on slot booking rather than owner-to-public communication, confirming the unique positioning of Q Yaar in addressing the vehicle communication gap. Key takeaways included the need for privacy-first design, minimal friction in the scanning process, and automated session management to prevent abuse [6].

---

## Chapter 5
## Software Requirements Specifications

---

## CHAPTER 5
## SOFTWARE REQUIREMENT SPECIFICATION

### FUNCTIONAL REQUIREMENTS

**Table 5.1: Functional Requirements Table**

| Requirement ID | Description | Priority |
|---------------|-------------|----------|
| FR-1 | The system must allow vehicle owners to register by scanning a QR code from their purchased QR package. | High |
| FR-2 | Users should be able to login securely using their registered mobile number. | High |
| FR-3 | Vehicle owners must be able to enter and manage their vehicle details (number, model, color, fuel type, owner name). | High |
| FR-4 | Any registered user should be able to scan a vehicle's QR code to view limited vehicle details. | High |
| FR-5 | Scanners must be able to send notification alerts to vehicle owners through the platform. | High |
| FR-6 | Users must be able to initiate real-time chat sessions with vehicle owners after scanning their QR code. | High |
| FR-7 | System should enforce anti-spam limits: scanners can send max 3 messages before owner replies. | High |
| FR-8 | Chat sessions must auto-expire after 24 hours to ensure temporary, purpose-driven communication. | High |
| FR-9 | Vehicle owners should be able to block specific users from contacting them via their QR. | Medium |
| FR-10 | Push notifications must be delivered to vehicle owners when their QR is scanned and messaged. | High |
| FR-11 | Admins must be able to generate, manage, and monitor QR codes through the admin dashboard. | Medium |

### NON-FUNCTIONAL REQUIREMENTS

**Table 5.2: Non-Functional Requirements Table**

| Requirement ID | Description |
|---------------|-------------|
| NFR-1 | System response time for QR scan and vehicle lookup should be under 2 seconds. |
| NFR-2 | Real-time chat message delivery latency should be under 500ms via Socket.io. |
| NFR-3 | User personal data (mobile numbers) must never be exposed to scanners or third parties. |
| NFR-4 | System availability should be 99.5% uptime with Render cloud hosting. |
| NFR-5 | The platform should support at least 500 concurrent WebSocket connections. |
| NFR-6 | The mobile app should be compatible with Android 10+ and iOS 14+ devices. |
| NFR-7 | Codebase should follow modular architecture for easy maintenance and feature additions. |
| NFR-8 | All API endpoints must be rate-limited to prevent DDoS and brute-force attacks. |
| NFR-9 | Proper error handling with user-friendly error messages across all screens. |
| NFR-10 | MongoDB data should be backed up regularly through MongoDB Atlas automated backups. |

---
