# Cross-Browser Web Push Notifications Implementation Plan

## Executive Summary

This document outlines the complete implementation plan for adding browser push notifications to the Labass Patient Portal, with full support for Safari iOS, Chrome, Firefox, Edge, and Android browsers.

**Current State:**
- Real-time messaging via Socket.io ✓
- LiveKit video calls ✓
- JWT authentication ✓
- **NO push notifications ✗**

**Target State:**
- Full push notification support for all major browsers
- Safari iOS support via APNs Web Push
- Background notifications when app is closed
- Notification types: Messages, Consultations, Video Calls

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (React)                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐      ┌──────────────┐     ┌────────────────┐ │
│  │  Browser     │      │   Service    │     │  Notification  │ │
│  │  Detection   │─────▶│   Worker     │────▶│  Permission    │ │
│  │  (Safari?)   │      │   (sw.js)    │     │   Request      │ │
│  └──────────────┘      └──────────────┘     └────────────────┘ │
│         │                     │                      │          │
│         ▼                     ▼                      ▼          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         usePushNotifications Hook                        │  │
│  │  - Register service worker                               │  │
│  │  - Generate FCM token (Chrome/Firefox/Edge)              │  │
│  │  - Generate Safari deviceToken (APNs)                    │  │
│  │  - Send token to backend                                 │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                  │
└──────────────────────────────┼──────────────────────────────────┘
                               │
                               │ POST /api/push-tokens
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Node.js)                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              PushToken Database Table                    │  │
│  │  Fields: id, userId, token, provider, browser, platform  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                  │
│                              ▼                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │          Unified NotificationService                     │  │
│  │                                                          │  │
│  │  async sendNotification(userId, payload) {               │  │
│  │    1. Fetch user's push tokens from DB                   │  │
│  │    2. Route to correct provider:                         │  │
│  │       - FCM: sendFCMNotification()                       │  │
│  │       - APNs: sendAPNsWebPush()                          │  │
│  │    3. Handle delivery status                             │  │
│  │  }                                                       │  │
│  └──────────────────────────────────────────────────────────┘  │
│           │                              │                      │
│           ▼                              ▼                      │
│  ┌─────────────────┐          ┌────────────────────┐           │
│  │   FCM Sender    │          │   APNs Web Push    │           │
│  │  (Firebase SDK) │          │   (.p8 auth key)   │           │
│  └─────────────────┘          └────────────────────┘           │
│           │                              │                      │
└───────────┼──────────────────────────────┼──────────────────────┘
            │                              │
            ▼                              ▼
    ┌──────────────┐            ┌──────────────────┐
    │ Firebase FCM │            │  Apple APNs      │
    │   Servers    │            │   Servers        │
    └──────────────┘            └──────────────────┘
            │                              │
            └──────────────┬───────────────┘
                           ▼
                   ┌───────────────┐
                   │ User Devices  │
                   │ (Notification)│
                   └───────────────┘
```

---

## Phase 1: Frontend Infrastructure Setup

### 1.1 Create PWA Manifest (`public/manifest.json`)

**Purpose:** Enable Progressive Web App features and notification icons

**File Structure:**
```json
{
  "name": "Labass Patient Portal",
  "short_name": "Labass",
  "description": "Healthcare consultation and video call platform",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#4F46E5",
  "orientation": "portrait",
  "dir": "rtl",
  "lang": "ar",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable any"
    }
  ],
  "gcm_sender_id": "103953800507"
}
```

**Next.js Integration:**
Update `src/app/layout.tsx` to include manifest link:
```tsx
<link rel="manifest" href="/manifest.json" />
```

**Icon Assets Required:**
- Create icons directory: `public/icons/`
- Generate icons at sizes: 72, 96, 128, 144, 152, 192, 384, 512 pixels
- Use Labass brand logo/colors

---

### 1.2 Create Service Worker (`public/firebase-messaging-sw.js`)

**Purpose:** Handle background notifications when app is closed

**File Location:** `public/firebase-messaging-sw.js`

**Key Features:**
- Firebase Cloud Messaging initialization
- Background message handler
- Notification click handler
- Background sync for offline messages

**Implementation Structure:**
```javascript
// Import Firebase scripts
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "labass-notifications.firebaseapp.com",
  projectId: "labass-notifications",
  storageBucket: "labass-notifications.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Background message handler
messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    tag: payload.data.type,
    data: payload.data,
    requireInteraction: payload.data.type === 'INCOMING_CALL',
    actions: generateActions(payload.data.type)
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const urlToOpen = getUrlForNotificationType(event.notification.data);

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Focus existing window or open new
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

function generateActions(type) {
  if (type === 'INCOMING_CALL') {
    return [
      { action: 'answer', title: 'رد' },
      { action: 'decline', title: 'رفض' }
    ];
  }
  return [];
}

function getUrlForNotificationType(data) {
  switch (data.type) {
    case 'NEW_MESSAGE':
    case 'INCOMING_CALL':
      return `/chat/${data.consultationId}`;
    case 'NEW_CONSULTATION':
      return `/myConsultations`;
    case 'MISSED_CALL':
      return `/chat/${data.consultationId}`;
    default:
      return '/';
  }
}
```

---

### 1.3 Browser Detection Utility

**File:** `src/utils/browserDetection.ts`

**Purpose:** Detect Safari vs non-Safari for correct push token generation

```typescript
export interface BrowserInfo {
  name: string;
  version: string;
  isSafari: boolean;
  isIOS: boolean;
  platform: string;
  supportsPush: boolean;
  pushProvider: 'fcm' | 'apns' | 'none';
}

export function detectBrowser(): BrowserInfo {
  const userAgent = navigator.userAgent;
  const platform = navigator.platform;

  // Safari detection
  const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent);

  // iOS detection
  const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;

  // Detailed browser detection
  let browserName = 'Unknown';
  let browserVersion = 'Unknown';

  if (isSafari) {
    browserName = 'Safari';
    const match = userAgent.match(/Version\/(\d+\.\d+)/);
    browserVersion = match ? match[1] : 'Unknown';
  } else if (/Chrome/.test(userAgent)) {
    browserName = 'Chrome';
    const match = userAgent.match(/Chrome\/(\d+\.\d+)/);
    browserVersion = match ? match[1] : 'Unknown';
  } else if (/Firefox/.test(userAgent)) {
    browserName = 'Firefox';
    const match = userAgent.match(/Firefox\/(\d+\.\d+)/);
    browserVersion = match ? match[1] : 'Unknown';
  } else if (/Edg/.test(userAgent)) {
    browserName = 'Edge';
    const match = userAgent.match(/Edg\/(\d+\.\d+)/);
    browserVersion = match ? match[1] : 'Unknown';
  }

  // Check push support
  const supportsPush = 'Notification' in window &&
                       ('serviceWorker' in navigator ||
                        (isSafari && 'safari' in window && 'pushNotification' in (window as any).safari));

  // Determine provider
  let pushProvider: 'fcm' | 'apns' | 'none' = 'none';
  if (supportsPush) {
    pushProvider = isSafari ? 'apns' : 'fcm';
  }

  return {
    name: browserName,
    version: browserVersion,
    isSafari,
    isIOS,
    platform,
    supportsPush,
    pushProvider
  };
}

export function canUsePushNotifications(): boolean {
  const browser = detectBrowser();
  return browser.supportsPush;
}

export function getPushProvider(): 'fcm' | 'apns' | 'none' {
  const browser = detectBrowser();
  return browser.pushProvider;
}
```

---

## Phase 2: Push Token Management

### 2.1 Firebase Configuration

**File:** `src/config/firebase.config.ts`

```typescript
import { initializeApp, getApps } from 'firebase/app';
import { getMessaging, isSupported } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Messaging (only on client-side)
let messaging: any = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      messaging = getMessaging(app);
    }
  });
}

export { app, messaging };
```

**Environment Variables Required:**
```env
# .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_VAPID_KEY=

# Safari APNs
NEXT_PUBLIC_SAFARI_WEB_PUSH_ID=web.sa.labass.patient
```

---

### 2.2 Push Notification Hook

**File:** `src/hooks/usePushNotifications.ts`

**Purpose:** Central hook for managing push notification registration and token management

```typescript
import { useEffect, useState, useCallback } from 'react';
import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from '@/config/firebase.config';
import { detectBrowser, getPushProvider } from '@/utils/browserDetection';
import { savePushToken, updatePushToken } from '@/controllers/pushNotificationController';

export interface PushNotificationState {
  supported: boolean;
  permission: NotificationPermission;
  token: string | null;
  error: string | null;
  loading: boolean;
}

export interface PushNotificationHookReturn extends PushNotificationState {
  requestPermission: () => Promise<void>;
  unsubscribe: () => Promise<void>;
}

export function usePushNotifications(): PushNotificationHookReturn {
  const [state, setState] = useState<PushNotificationState>({
    supported: false,
    permission: 'default',
    token: null,
    error: null,
    loading: true,
  });

  const browserInfo = detectBrowser();
  const provider = getPushProvider();

  // Check initial support
  useEffect(() => {
    const checkSupport = async () => {
      setState((prev) => ({
        ...prev,
        supported: browserInfo.supportsPush,
        permission: 'Notification' in window ? Notification.permission : 'denied',
        loading: false,
      }));
    };

    checkSupport();
  }, [browserInfo.supportsPush]);

  // Generate FCM token (Chrome, Firefox, Edge, Android)
  const generateFCMToken = useCallback(async () => {
    if (!messaging) {
      throw new Error('Firebase messaging not initialized');
    }

    try {
      // Register service worker
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      console.log('Service Worker registered:', registration);

      // Get FCM token
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        serviceWorkerRegistration: registration,
      });

      return token;
    } catch (error) {
      console.error('Error generating FCM token:', error);
      throw error;
    }
  }, []);

  // Generate Safari APNs token
  const generateSafariToken = useCallback(async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!('safari' in window) || !(window as any).safari.pushNotification) {
        reject(new Error('Safari push notifications not supported'));
        return;
      }

      const pushId = process.env.NEXT_PUBLIC_SAFARI_WEB_PUSH_ID || 'web.sa.labass.patient';
      const webServiceURL = `${process.env.NEXT_PUBLIC_API_URL}/safari-push`;

      // Check permission state
      const permissionData = (window as any).safari.pushNotification.permission(pushId);

      if (permissionData.permission === 'default') {
        // Request permission
        (window as any).safari.pushNotification.requestPermission(
          webServiceURL,
          pushId,
          { userId: localStorage.getItem('labass_userId') },
          (permission: any) => {
            if (permission.permission === 'granted') {
              resolve(permission.deviceToken);
            } else {
              reject(new Error('Safari push permission denied'));
            }
          }
        );
      } else if (permissionData.permission === 'granted') {
        resolve(permissionData.deviceToken);
      } else {
        reject(new Error('Safari push permission denied'));
      }
    });
  }, []);

  // Request permission and register
  const requestPermission = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      // Request notification permission
      const permission = await Notification.requestPermission();

      if (permission !== 'granted') {
        setState((prev) => ({
          ...prev,
          permission,
          loading: false,
          error: 'Notification permission denied',
        }));
        return;
      }

      // Generate token based on browser
      let token: string;
      if (provider === 'fcm') {
        token = await generateFCMToken();
      } else if (provider === 'apns') {
        token = await generateSafariToken();
      } else {
        throw new Error('Push notifications not supported');
      }

      // Save token to backend
      const userId = localStorage.getItem('labass_userId');
      if (userId) {
        await savePushToken({
          userId: parseInt(userId),
          token,
          provider,
          browser: browserInfo.name,
          platform: browserInfo.platform,
          role: 'patient',
        });
      }

      setState({
        supported: true,
        permission: 'granted',
        token,
        error: null,
        loading: false,
      });

      // Set up foreground message listener (FCM only)
      if (provider === 'fcm' && messaging) {
        onMessage(messaging, (payload) => {
          console.log('Foreground message received:', payload);

          // Show notification even when app is in foreground
          if (payload.notification) {
            new Notification(payload.notification.title || 'Labass', {
              body: payload.notification.body,
              icon: '/icons/icon-192x192.png',
              tag: payload.data?.type,
              data: payload.data,
            });
          }
        });
      }
    } catch (error: any) {
      console.error('Error requesting push permission:', error);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to register push notifications',
      }));
    }
  }, [provider, browserInfo, generateFCMToken, generateSafariToken]);

  // Unsubscribe from notifications
  const unsubscribe = useCallback(async () => {
    try {
      const userId = localStorage.getItem('labass_userId');
      if (userId && state.token) {
        // Delete token from backend
        await updatePushToken(state.token, { enabled: false });
      }

      setState({
        supported: browserInfo.supportsPush,
        permission: 'default',
        token: null,
        error: null,
        loading: false,
      });
    } catch (error) {
      console.error('Error unsubscribing from notifications:', error);
    }
  }, [state.token, browserInfo.supportsPush]);

  return {
    ...state,
    requestPermission,
    unsubscribe,
  };
}
```

---

### 2.3 Push Token API Controller

**File:** `src/controllers/pushNotificationController.ts`

```typescript
import axios from 'axios';

export interface PushTokenPayload {
  userId: number;
  token: string;
  provider: 'fcm' | 'apns';
  browser: string;
  platform: string;
  role: string;
}

export interface PushTokenUpdatePayload {
  enabled?: boolean;
  token?: string;
}

/**
 * Save push token to backend
 */
export const savePushToken = async (payload: PushTokenPayload): Promise<void> => {
  try {
    const authToken = localStorage.getItem('labass_token');

    await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/push-tokens`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Push token saved successfully');
  } catch (error: any) {
    console.error('Error saving push token:', error);
    throw new Error(error.response?.data?.message || 'Failed to save push token');
  }
};

/**
 * Update push token
 */
export const updatePushToken = async (
  token: string,
  updates: PushTokenUpdatePayload
): Promise<void> => {
  try {
    const authToken = localStorage.getItem('labass_token');

    await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/push-tokens/${token}`,
      updates,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Push token updated successfully');
  } catch (error: any) {
    console.error('Error updating push token:', error);
    throw new Error(error.response?.data?.message || 'Failed to update push token');
  }
};

/**
 * Get user's push tokens
 */
export const getUserPushTokens = async (userId: number): Promise<any[]> => {
  try {
    const authToken = localStorage.getItem('labass_token');

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/push-tokens/user/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('Error fetching push tokens:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch push tokens');
  }
};

/**
 * Delete push token
 */
export const deletePushToken = async (token: string): Promise<void> => {
  try {
    const authToken = localStorage.getItem('labass_token');

    await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/push-tokens/${token}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    console.log('Push token deleted successfully');
  } catch (error: any) {
    console.error('Error deleting push token:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete push token');
  }
};
```

---

### 2.4 Integration in Layout/Login

**Location:** `src/app/layout.tsx` or create a `PushNotificationProvider`

**Component:** `src/components/PushNotificationProvider.tsx`

```typescript
'use client';

import { useEffect } from 'react';
import { usePushNotifications } from '@/hooks/usePushNotifications';

export function PushNotificationProvider({ children }: { children: React.ReactNode }) {
  const { supported, permission, requestPermission } = usePushNotifications();

  useEffect(() => {
    // Auto-request permission after login (check if user is authenticated)
    const isAuthenticated = localStorage.getItem('labass_token');
    const hasRequestedPermission = localStorage.getItem('push_permission_requested');

    if (isAuthenticated && !hasRequestedPermission && supported && permission === 'default') {
      // Show permission prompt after a delay
      setTimeout(() => {
        requestPermission().then(() => {
          localStorage.setItem('push_permission_requested', 'true');
        });
      }, 3000); // Wait 3 seconds after login
    }
  }, [supported, permission, requestPermission]);

  return <>{children}</>;
}
```

**Usage in layout:**
```tsx
import { PushNotificationProvider } from '@/components/PushNotificationProvider';

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
        <PushNotificationProvider>
          {children}
        </PushNotificationProvider>
      </body>
    </html>
  );
}
```

---

## Phase 3: Backend Push Notification Service

### 3.1 Database Schema

**Table: `push_tokens`**

```sql
CREATE TABLE push_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  provider VARCHAR(10) NOT NULL CHECK (provider IN ('fcm', 'apns')),
  browser VARCHAR(50),
  platform VARCHAR(50),
  role VARCHAR(20) NOT NULL,
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_used_at TIMESTAMP,

  INDEX idx_user_id (user_id),
  INDEX idx_token (token),
  INDEX idx_enabled (enabled)
);
```

**Prisma Schema (if using Prisma):**
```prisma
model PushToken {
  id          Int      @id @default(autoincrement())
  userId      Int      @map("user_id")
  token       String   @unique
  provider    Provider
  browser     String?
  platform    String?
  role        String
  enabled     Boolean  @default(true)
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  lastUsedAt  DateTime? @map("last_used_at")

  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([token])
  @@index([enabled])
  @@map("push_tokens")
}

enum Provider {
  fcm
  apns
}
```

---

### 3.2 Backend API Routes

**File:** `backend/routes/pushTokenRoutes.ts` (adjust to your backend structure)

```typescript
import express from 'express';
import { authMiddleware } from '../middleware/auth';
import {
  createPushToken,
  updatePushToken,
  deletePushToken,
  getUserPushTokens,
} from '../controllers/pushTokenController';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Create/update push token
router.post('/push-tokens', createPushToken);

// Get user's push tokens
router.get('/push-tokens/user/:userId', getUserPushTokens);

// Update push token
router.put('/push-tokens/:token', updatePushToken);

// Delete push token
router.delete('/push-tokens/:token', deletePushToken);

export default router;
```

**Controller:** `backend/controllers/pushTokenController.ts`

```typescript
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createPushToken = async (req: Request, res: Response) => {
  try {
    const { userId, token, provider, browser, platform, role } = req.body;

    // Validate
    if (!userId || !token || !provider || !role) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Upsert: update if exists, create if not
    const pushToken = await prisma.pushToken.upsert({
      where: { token },
      update: {
        browser,
        platform,
        enabled: true,
        updatedAt: new Date(),
      },
      create: {
        userId,
        token,
        provider,
        browser,
        platform,
        role,
        enabled: true,
      },
    });

    res.status(201).json({ success: true, data: pushToken });
  } catch (error) {
    console.error('Error creating push token:', error);
    res.status(500).json({ message: 'Failed to save push token' });
  }
};

export const getUserPushTokens = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const tokens = await prisma.pushToken.findMany({
      where: {
        userId: parseInt(userId),
        enabled: true,
      },
    });

    res.status(200).json(tokens);
  } catch (error) {
    console.error('Error fetching push tokens:', error);
    res.status(500).json({ message: 'Failed to fetch push tokens' });
  }
};

export const updatePushToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const updates = req.body;

    const pushToken = await prisma.pushToken.update({
      where: { token },
      data: {
        ...updates,
        updatedAt: new Date(),
      },
    });

    res.status(200).json({ success: true, data: pushToken });
  } catch (error) {
    console.error('Error updating push token:', error);
    res.status(500).json({ message: 'Failed to update push token' });
  }
};

export const deletePushToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    await prisma.pushToken.delete({
      where: { token },
    });

    res.status(200).json({ success: true, message: 'Token deleted' });
  } catch (error) {
    console.error('Error deleting push token:', error);
    res.status(500).json({ message: 'Failed to delete push token' });
  }
};
```

---

### 3.3 Firebase Admin SDK Setup

**File:** `backend/config/firebase.admin.ts`

```typescript
import admin from 'firebase-admin';
import path from 'path';

// Initialize Firebase Admin SDK
const serviceAccount = require(path.resolve(__dirname, '../../firebase-service-account.json'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const messaging = admin.messaging();
export default admin;
```

**Service Account Key:**
- Download from Firebase Console: Project Settings → Service Accounts → Generate New Private Key
- Save as `backend/firebase-service-account.json`
- Add to `.gitignore`

---

### 3.4 APNs Web Push Setup

**File:** `backend/config/apns.config.ts`

```typescript
import apn from 'apn';
import path from 'path';
import fs from 'fs';

// APNs configuration
const apnsOptions: apn.ProviderOptions = {
  token: {
    key: fs.readFileSync(path.resolve(__dirname, '../../apns-auth-key.p8'), 'utf8'),
    keyId: process.env.APNS_KEY_ID || '',
    teamId: process.env.APNS_TEAM_ID || '',
  },
  production: process.env.NODE_ENV === 'production',
};

const apnsProvider = new apn.Provider(apnsOptions);

export default apnsProvider;
```

**APNs Auth Key (.p8):**
- Generate in Apple Developer Portal: Certificates, Identifiers & Profiles → Keys → Create Key
- Download `.p8` file
- Save as `backend/apns-auth-key.p8`
- Add to `.gitignore`

**Environment Variables:**
```env
APNS_KEY_ID=ABC123XYZ
APNS_TEAM_ID=XYZ987ABC
APNS_WEB_PUSH_ID=web.sa.labass.patient
```

---

### 3.5 Unified Notification Service

**File:** `backend/services/NotificationService.ts`

```typescript
import { PrismaClient } from '@prisma/client';
import { messaging as fcmMessaging } from '../config/firebase.admin';
import apnsProvider from '../config/apns.config';
import apn from 'apn';

const prisma = new PrismaClient();

export enum NotificationType {
  NEW_MESSAGE = 'NEW_MESSAGE',
  NEW_CONSULTATION = 'NEW_CONSULTATION',
  INCOMING_CALL = 'INCOMING_CALL',
  MISSED_CALL = 'MISSED_CALL',
}

export interface NotificationPayload {
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, string>;
  consultationId?: number;
  callerId?: number;
  urgent?: boolean;
}

class NotificationService {
  /**
   * Send notification to user across all their devices
   */
  async sendNotification(userId: number, payload: NotificationPayload): Promise<void> {
    try {
      // Fetch user's active push tokens
      const tokens = await prisma.pushToken.findMany({
        where: {
          userId,
          enabled: true,
        },
      });

      if (tokens.length === 0) {
        console.log(`No active push tokens for user ${userId}`);
        return;
      }

      // Send to each device
      const promises = tokens.map(async (tokenRecord) => {
        try {
          if (tokenRecord.provider === 'fcm') {
            await this.sendFCMNotification(tokenRecord.token, payload);
          } else if (tokenRecord.provider === 'apns') {
            await this.sendAPNsNotification(tokenRecord.token, payload);
          }

          // Update last used timestamp
          await prisma.pushToken.update({
            where: { id: tokenRecord.id },
            data: { lastUsedAt: new Date() },
          });
        } catch (error: any) {
          console.error(`Failed to send to token ${tokenRecord.id}:`, error);

          // Handle invalid/expired tokens
          if (this.isInvalidTokenError(error)) {
            await prisma.pushToken.update({
              where: { id: tokenRecord.id },
              data: { enabled: false },
            });
          }
        }
      });

      await Promise.allSettled(promises);
      console.log(`Sent notifications to ${tokens.length} devices for user ${userId}`);
    } catch (error) {
      console.error('Error in sendNotification:', error);
      throw error;
    }
  }

  /**
   * Send FCM notification (Chrome, Firefox, Edge, Android)
   */
  private async sendFCMNotification(token: string, payload: NotificationPayload): Promise<void> {
    const message = {
      token,
      notification: {
        title: payload.title,
        body: payload.body,
      },
      data: {
        type: payload.type,
        consultationId: payload.consultationId?.toString() || '',
        callerId: payload.callerId?.toString() || '',
        ...payload.data,
      },
      android: {
        priority: payload.urgent ? 'high' : 'normal',
        notification: {
          channelId: this.getChannelId(payload.type),
          priority: payload.urgent ? 'max' : 'default',
          sound: payload.type === NotificationType.INCOMING_CALL ? 'call_ringtone' : 'default',
        },
      },
      webpush: {
        notification: {
          icon: '/icons/icon-192x192.png',
          badge: '/icons/badge-72x72.png',
          tag: payload.type,
          requireInteraction: payload.type === NotificationType.INCOMING_CALL,
        },
        fcmOptions: {
          link: this.getNotificationUrl(payload),
        },
      },
    };

    await fcmMessaging.send(message as any);
    console.log('FCM notification sent successfully');
  }

  /**
   * Send APNs Web Push notification (Safari iOS)
   */
  private async sendAPNsNotification(token: string, payload: NotificationPayload): Promise<void> {
    const notification = new apn.Notification({
      alert: {
        title: payload.title,
        body: payload.body,
      },
      topic: process.env.APNS_WEB_PUSH_ID || 'web.sa.labass.patient',
      payload: {
        type: payload.type,
        consultationId: payload.consultationId,
        callerId: payload.callerId,
        ...payload.data,
      },
      sound: payload.type === NotificationType.INCOMING_CALL ? 'default' : undefined,
      badge: 1,
      urlArgs: [this.getNotificationUrl(payload)],
    });

    // Set expiry to 1 hour
    notification.expiry = Math.floor(Date.now() / 1000) + 3600;

    // High priority for calls
    if (payload.type === NotificationType.INCOMING_CALL) {
      notification.priority = 10;
    }

    const result = await apnsProvider.send(notification, token);

    if (result.failed.length > 0) {
      const error = result.failed[0];
      console.error('APNs notification failed:', error);
      throw new Error(error.response?.reason || 'APNs send failed');
    }

    console.log('APNs notification sent successfully');
  }

  /**
   * Get Android notification channel ID
   */
  private getChannelId(type: NotificationType): string {
    switch (type) {
      case NotificationType.INCOMING_CALL:
        return 'incoming_calls';
      case NotificationType.NEW_MESSAGE:
        return 'messages';
      case NotificationType.NEW_CONSULTATION:
        return 'consultations';
      case NotificationType.MISSED_CALL:
        return 'missed_calls';
      default:
        return 'default';
    }
  }

  /**
   * Get URL to open when notification is clicked
   */
  private getNotificationUrl(payload: NotificationPayload): string {
    const baseUrl = process.env.FRONTEND_URL || 'https://patient.labass.sa';

    switch (payload.type) {
      case NotificationType.NEW_MESSAGE:
      case NotificationType.INCOMING_CALL:
      case NotificationType.MISSED_CALL:
        return `${baseUrl}/chat/${payload.consultationId}`;
      case NotificationType.NEW_CONSULTATION:
        return `${baseUrl}/myConsultations`;
      default:
        return baseUrl;
    }
  }

  /**
   * Check if error is due to invalid/expired token
   */
  private isInvalidTokenError(error: any): boolean {
    const invalidTokenCodes = [
      'messaging/invalid-registration-token',
      'messaging/registration-token-not-registered',
      'BadDeviceToken',
      'Unregistered',
    ];

    return invalidTokenCodes.some(
      (code) =>
        error.code === code || error.message?.includes(code) || error.response?.reason === code
    );
  }
}

export default new NotificationService();
```

---

## Phase 4: Notification Types Implementation

### 4.1 NEW_MESSAGE Notification

**Integration Point:** Socket.io message handler on backend

**File:** `backend/socket/messageHandler.ts`

```typescript
import NotificationService, { NotificationType } from '../services/NotificationService';

socket.on('sendMessage', async (messageData) => {
  // ... existing message handling logic ...

  // Send push notification to recipient
  const recipientId = getRecipientId(messageData.consultationId, messageData.senderId);

  if (recipientId) {
    await NotificationService.sendNotification(recipientId, {
      type: NotificationType.NEW_MESSAGE,
      title: 'رسالة جديدة',
      body: messageData.message.substring(0, 100), // First 100 chars
      consultationId: messageData.consultationId,
      data: {
        senderId: messageData.senderId.toString(),
      },
    });
  }
});
```

---

### 4.2 NEW_CONSULTATION Notification

**Integration Point:** Consultation creation endpoint

**File:** `backend/controllers/consultationController.ts`

```typescript
import NotificationService, { NotificationType } from '../services/NotificationService';

export const createConsultation = async (req: Request, res: Response) => {
  // ... existing consultation creation logic ...

  // Send notification to patient
  await NotificationService.sendNotification(patientId, {
    type: NotificationType.NEW_CONSULTATION,
    title: 'استشارة جديدة',
    body: 'تم إنشاء استشارة جديدة لك',
    consultationId: newConsultation.id,
  });

  res.status(201).json({ success: true, data: newConsultation });
};
```

---

### 4.3 INCOMING_CALL Notification

**Integration Point:** Socket.io video call event

**File:** `backend/socket/videoCallHandler.ts`

```typescript
import NotificationService, { NotificationType } from '../services/NotificationService';

socket.on('videoCallStarted', async (callData) => {
  // ... existing call handling logic ...

  // Emit socket event (existing)
  io.to(`consultation_${callData.consultationId}`).emit('videoCallStarted', callData);

  // Send push notification (NEW)
  const recipientId = getRecipientId(callData.consultationId, callData.callerId);

  if (recipientId) {
    await NotificationService.sendNotification(recipientId, {
      type: NotificationType.INCOMING_CALL,
      title: 'مكالمة مرئية واردة',
      body: `${callData.callerName} يتصل بك`,
      consultationId: callData.consultationId,
      callerId: callData.callerId,
      urgent: true,
    });
  }
});
```

---

### 4.4 MISSED_CALL Notification

**Integration Point:** Call timeout handler

```typescript
import NotificationService, { NotificationType } from '../services/NotificationService';

// After 60 seconds of no answer
setTimeout(async () => {
  if (!callAnswered) {
    await NotificationService.sendNotification(callerId, {
      type: NotificationType.MISSED_CALL,
      title: 'مكالمة فائتة',
      body: 'لم يتم الرد على مكالمتك',
      consultationId: consultationId,
    });
  }
}, 60000);
```

---

## Phase 5: LiveKit Video Call Integration

### 5.1 Frontend: Incoming Call Notification UI

**Component:** `src/components/IncomingCallNotification.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';
import { socket } from '@/socket.io/socket.io.initialization';
import { useRouter } from 'next/navigation';
import { Button, Dialog, DialogContent, DialogTitle, Avatar } from '@mui/material';

interface IncomingCall {
  consultationId: number;
  callerId: number;
  callerName: string;
  callerAvatar?: string;
}

export function IncomingCallNotification() {
  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Listen for incoming calls
    socket.on('videoCallStarted', (data: IncomingCall) => {
      setIncomingCall(data);

      // Play ringtone
      const audio = new Audio('/sounds/ringtone.mp3');
      audio.loop = true;
      audio.play();

      // Auto-dismiss after 60 seconds
      setTimeout(() => {
        audio.pause();
        setIncomingCall(null);
      }, 60000);
    });

    socket.on('videoCallEnded', () => {
      setIncomingCall(null);
    });

    return () => {
      socket.off('videoCallStarted');
      socket.off('videoCallEnded');
    };
  }, []);

  const handleAnswer = () => {
    setIncomingCall(null);
    router.push(`/chat/${incomingCall?.consultationId}`);
  };

  const handleDecline = () => {
    socket.emit('videoCallEnded', {
      consultationId: incomingCall?.consultationId,
      reason: 'declined',
    });
    setIncomingCall(null);
  };

  if (!incomingCall) return null;

  return (
    <Dialog open={true} maxWidth="sm" fullWidth>
      <DialogContent className="text-center p-8">
        <Avatar
          src={incomingCall.callerAvatar}
          alt={incomingCall.callerName}
          sx={{ width: 100, height: 100, margin: '0 auto 16px' }}
        />
        <DialogTitle className="text-2xl font-bold mb-2">
          مكالمة مرئية واردة
        </DialogTitle>
        <p className="text-lg mb-6">{incomingCall.callerName}</p>
        <div className="flex gap-4 justify-center">
          <Button
            variant="contained"
            color="error"
            size="large"
            onClick={handleDecline}
            className="px-8"
          >
            رفض
          </Button>
          <Button
            variant="contained"
            color="success"
            size="large"
            onClick={handleAnswer}
            className="px-8"
          >
            رد
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

**Add to layout:**
```tsx
import { IncomingCallNotification } from '@/components/IncomingCallNotification';

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <PushNotificationProvider>
          <IncomingCallNotification />
          {children}
        </PushNotificationProvider>
      </body>
    </html>
  );
}
```

---

### 5.2 Service Worker: Notification Click Handler

**Update:** `public/firebase-messaging-sw.js`

```javascript
// Add notification action handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const data = event.notification.data;

  if (event.action === 'answer') {
    // Answer incoming call
    event.waitUntil(
      clients.openWindow(`/chat/${data.consultationId}?autoAnswer=true`)
    );
  } else if (event.action === 'decline') {
    // Decline call - notify backend
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/video-calls/decline`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ consultationId: data.consultationId }),
    });
  } else {
    // Default click - open chat
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then((clientList) => {
          const url = `/chat/${data.consultationId}`;

          for (const client of clientList) {
            if (client.url.includes(`/chat/${data.consultationId}`) && 'focus' in client) {
              return client.focus();
            }
          }

          if (clients.openWindow) {
            return clients.openWindow(url);
          }
        })
    );
  }
});
```

---

## Phase 6: Testing & Deployment

### 6.1 Testing Checklist

**FCM Testing (Chrome, Firefox, Edge, Android):**

- [ ] Request notification permission
- [ ] Generate FCM token successfully
- [ ] Token saved to backend
- [ ] NEW_MESSAGE notification received (foreground)
- [ ] NEW_MESSAGE notification received (background)
- [ ] NEW_CONSULTATION notification received
- [ ] INCOMING_CALL notification received with ringtone
- [ ] MISSED_CALL notification received
- [ ] Notification click opens correct page
- [ ] Multiple devices receive notifications
- [ ] Service worker updates properly

**APNs Testing (Safari iOS):**

- [ ] Safari push permission requested
- [ ] Device token generated
- [ ] Token saved to backend
- [ ] NEW_MESSAGE notification received
- [ ] NEW_CONSULTATION notification received
- [ ] INCOMING_CALL notification with sound
- [ ] Notification click opens app
- [ ] Works when app is closed
- [ ] Works in background tab

**General Testing:**

- [ ] Token refresh on app update
- [ ] Invalid token cleanup
- [ ] Multi-device synchronization
- [ ] Notification preferences
- [ ] Offline/online scenarios
- [ ] Token expiry handling

---

### 6.2 Environment Setup

**Frontend `.env.local`:**
```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_VAPID_KEY=

# Safari APNs
NEXT_PUBLIC_SAFARI_WEB_PUSH_ID=web.sa.labass.patient
```

**Backend `.env`:**
```env
# Firebase Admin
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json

# APNs
APNS_KEY_ID=
APNS_TEAM_ID=
APNS_WEB_PUSH_ID=web.sa.labass.patient
APNS_AUTH_KEY_PATH=./apns-auth-key.p8

# URLs
FRONTEND_URL=https://patient.labass.sa
```

---

### 6.3 Safari Web Push ID Setup

**Prerequisites:**
1. Apple Developer Account (paid)
2. Website Push ID certificate

**Steps:**

1. **Create Website Push ID:**
   - Go to: https://developer.apple.com/account/resources/identifiers/list/websitePushId
   - Click "+" to create new Website Push ID
   - Description: "Labass Patient Push Notifications"
   - Identifier: `web.sa.labass.patient`
   - Save

2. **Create Certificate:**
   - Select the Website Push ID
   - Click "Create Certificate"
   - Generate CSR (Certificate Signing Request) on Mac:
     ```bash
     openssl req -new -newkey rsa:2048 -nodes -keyout labass_push.key -out labass_push.csr
     ```
   - Upload CSR
   - Download certificate (`website_push.cer`)

3. **Convert to .p12:**
   ```bash
   openssl x509 -in website_push.cer -inform DER -out website_push.pem -outform PEM
   openssl pkcs12 -export -in website_push.pem -inkey labass_push.key -out website_push.p12
   ```

4. **Backend Configuration:**
   - Place `.p12` file in backend directory
   - Update APNs config to use certificate

---

### 6.4 Deployment Checklist

**Frontend Deployment:**

- [ ] Build Next.js app (`npm run build`)
- [ ] Verify service worker is in `public/` directory
- [ ] Verify manifest.json is in `public/` directory
- [ ] Verify notification icons in `public/icons/`
- [ ] Environment variables configured on hosting
- [ ] HTTPS enabled (required for push notifications)
- [ ] Test on production domain

**Backend Deployment:**

- [ ] Firebase Admin SDK initialized
- [ ] APNs certificates uploaded
- [ ] Database schema migrated
- [ ] Environment variables configured
- [ ] API endpoints secured with auth
- [ ] Logging enabled for debugging
- [ ] Error monitoring (Sentry) configured

**DNS Configuration:**

- [ ] Domain verified for Firebase
- [ ] Safari Web Push domain association:
   - Create file: `public/.well-known/apple-app-site-association`
   ```json
   {
     "webcredentials": {
       "apps": ["web.sa.labass.patient"]
     }
   }
   ```

---

## Security Considerations

### Authentication & Authorization

1. **Token Security:**
   - Push tokens stored with user association
   - Tokens encrypted at rest in database
   - Only authenticated users can register tokens
   - Verify user owns token before sending notifications

2. **API Security:**
   - All endpoints require JWT authentication
   - Rate limiting on token registration
   - Validate token format before storage
   - Prevent token enumeration attacks

3. **Notification Content:**
   - Don't send sensitive data in notification body
   - Use notification click to load full content
   - Sanitize all user-generated content
   - Respect user privacy preferences

### Best Practices

1. **Token Management:**
   - Implement token rotation
   - Clean up expired/invalid tokens
   - Handle token refresh gracefully
   - Support multiple devices per user

2. **Error Handling:**
   - Graceful degradation if push fails
   - Fallback to Socket.io for real-time
   - Log errors for debugging
   - User-friendly error messages

3. **Performance:**
   - Batch notifications when possible
   - Use background tasks for sending
   - Implement retry logic with exponential backoff
   - Monitor delivery rates

---

## Notification Delivery Flow Diagram

```
┌─────────────┐
│   Trigger   │  (New message, consultation, call)
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│  NotificationService.sendNotification│
└──────┬──────────────────────────────┘
       │
       ├─────────────────┬─────────────────┐
       ▼                 ▼                 ▼
┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│Fetch tokens │   │Socket.io    │   │Database     │
│from DB      │   │emit event   │   │log event    │
└──────┬──────┘   └─────────────┘   └─────────────┘
       │
       ├──────────┬──────────┐
       ▼          ▼          ▼
┌──────────┐ ┌─────────┐ ┌─────────┐
│FCM Token │ │FCM Token│ │APNs Token│
│(Chrome)  │ │(Android)│ │(Safari) │
└────┬─────┘ └────┬────┘ └────┬────┘
     │            │           │
     ▼            ▼           ▼
┌──────────────────────────────────┐
│     Firebase/APNs Servers        │
└────┬─────────────────────────┬───┘
     │                         │
     ▼                         ▼
┌─────────┐              ┌──────────┐
│Desktop  │              │Safari iOS│
│Browser  │              │  Device  │
└─────────┘              └──────────┘
     │                         │
     ├─────────────┬───────────┤
     ▼             ▼           ▼
┌──────────┐ ┌──────────┐ ┌──────────┐
│Foreground│ │Background│ │  Locked  │
│(in-app)  │ │(sw.js)   │ │ Screen   │
└──────────┘ └──────────┘ └──────────┘
```

---

## File Structure Summary

```
labass_patient/
├── public/
│   ├── manifest.json                          # PWA manifest
│   ├── firebase-messaging-sw.js               # Service worker
│   ├── icons/                                 # Notification icons
│   │   ├── icon-72x72.png
│   │   ├── icon-96x96.png
│   │   ├── icon-128x128.png
│   │   ├── icon-192x192.png
│   │   ├── icon-384x384.png
│   │   └── icon-512x512.png
│   ├── sounds/
│   │   └── ringtone.mp3                       # Call ringtone
│   └── .well-known/
│       └── apple-app-site-association         # Safari push association
├── src/
│   ├── config/
│   │   └── firebase.config.ts                 # Firebase initialization
│   ├── utils/
│   │   └── browserDetection.ts                # Browser detection
│   ├── hooks/
│   │   └── usePushNotifications.ts            # Push notification hook
│   ├── controllers/
│   │   └── pushNotificationController.ts      # API controller
│   ├── components/
│   │   ├── PushNotificationProvider.tsx       # Auto-permission request
│   │   └── IncomingCallNotification.tsx       # Incoming call UI
│   └── app/
│       └── layout.tsx                         # Updated with manifest link
└── .env.local                                 # Environment variables

backend/
├── config/
│   ├── firebase.admin.ts                      # Firebase Admin SDK
│   └── apns.config.ts                         # APNs configuration
├── services/
│   └── NotificationService.ts                 # Unified notification service
├── controllers/
│   └── pushTokenController.ts                 # Token CRUD operations
├── routes/
│   └── pushTokenRoutes.ts                     # API routes
├── socket/
│   ├── messageHandler.ts                      # Message notifications
│   └── videoCallHandler.ts                    # Call notifications
├── prisma/
│   └── schema.prisma                          # Database schema
├── firebase-service-account.json              # Firebase credentials (gitignored)
├── apns-auth-key.p8                           # APNs auth key (gitignored)
└── .env                                       # Environment variables
```

---

## Implementation Timeline Estimate

**Phase 1: Frontend Infrastructure (2-3 days)**
- Create manifest.json
- Implement service worker
- Browser detection utility

**Phase 2: Push Token Management (2-3 days)**
- Firebase configuration
- usePushNotifications hook
- API integration

**Phase 3: Backend Service (3-4 days)**
- Database schema
- API endpoints
- Firebase Admin SDK
- APNs configuration
- Notification service

**Phase 4: Notification Types (2-3 days)**
- Message notifications
- Consultation notifications
- Call notifications

**Phase 5: LiveKit Integration (2 days)**
- Socket.io integration
- Incoming call UI
- Notification handlers

**Phase 6: Testing & Deployment (3-4 days)**
- Multi-browser testing
- Safari iOS testing
- Production deployment
- Monitoring setup

**Total Estimated Time: 14-19 days**

---

## Success Metrics

1. **Delivery Rate:** >95% of notifications delivered
2. **Click-Through Rate:** >30% of notifications clicked
3. **Permission Grant Rate:** >60% of users grant permission
4. **Call Answer Rate:** >70% of calls answered via notification
5. **Token Validity:** >90% of tokens remain valid after 30 days

---

## Support & Maintenance

### Monitoring

- Track notification delivery success/failure rates
- Monitor token expiry and refresh
- Alert on APNs/FCM service outages
- Log user permission grant/deny rates

### Troubleshooting

**Common Issues:**

1. **Notifications not received:**
   - Check browser permission status
   - Verify token saved to backend
   - Check FCM/APNs credentials
   - Verify HTTPS enabled

2. **Safari notifications not working:**
   - Verify Website Push ID configured
   - Check certificate validity
   - Ensure domain association file present

3. **Service worker not updating:**
   - Force service worker update
   - Clear browser cache
   - Check for service worker errors

### Updates

- Monitor Firebase SDK updates
- Update APNs certificates before expiry (yearly)
- Test on new browser versions
- Update notification content based on user feedback

---

## Conclusion

This comprehensive plan provides a complete roadmap for implementing cross-browser push notifications with Safari iOS support. The architecture leverages Firebase Cloud Messaging for modern browsers and Apple APNs for Safari, ensuring maximum compatibility and reliability.

The implementation integrates seamlessly with your existing Socket.io messaging and LiveKit video call infrastructure, providing a robust multi-channel notification system.

**Next Steps:**
1. Review and approve this plan
2. Set up Firebase and APNs credentials
3. Begin Phase 1: Frontend Infrastructure
4. Implement phases sequentially
5. Test thoroughly on all target platforms
6. Deploy to production with monitoring

For questions or clarifications during implementation, refer to:
- Firebase Cloud Messaging docs: https://firebase.google.com/docs/cloud-messaging
- Apple Web Push docs: https://developer.apple.com/notifications/safari-push-notifications/
- Web Push Protocol: https://datatracker.ietf.org/doc/html/rfc8030
