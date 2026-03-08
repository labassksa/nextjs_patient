# Backend Push Notifications Implementation Guide

## Overview

This document provides complete implementation instructions for the backend team to add push notification support to the Labass API. The frontend has been fully implemented and is ready to integrate with these backend endpoints.

**Frontend is ready and waiting for:**
- `/push-tokens` endpoints (POST, GET, PUT, DELETE)
- NotificationService to send push notifications on events
- Firebase Admin SDK and APNs Web Push configuration

---

## Prerequisites

### Required Services

1. **Firebase Project**
   - Create Firebase project at https://console.firebase.google.com
   - Enable Cloud Messaging
   - Download service account JSON key
   - Note: Frontend already has Firebase client SDK configured

2. **Apple Developer Account** (for Safari iOS support)
   - Paid Apple Developer Program membership
   - Website Push ID created
   - APNs .p8 auth key generated

### Required npm Packages

```bash
npm install firebase-admin apn
```

---

## Database Schema

### Table: `push_tokens`

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

### Prisma Schema (if using Prisma)

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

## API Endpoints

### 1. Create/Update Push Token

**Endpoint:** `POST /push-tokens`

**Request Body:**
```json
{
  "userId": 123,
  "token": "fcm_token_or_apns_device_token",
  "provider": "fcm",
  "browser": "Chrome",
  "platform": "Windows",
  "role": "patient"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 123,
    "token": "fcm_token_or_apns_device_token",
    "provider": "fcm",
    "browser": "Chrome",
    "platform": "Windows",
    "role": "patient",
    "enabled": true,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z",
    "lastUsedAt": null
  }
}
```

**Implementation:**
- Use **UPSERT** logic: If token exists, update metadata; if new, create new record
- Validate all required fields
- Require JWT authentication
- Associate token with authenticated user

---

### 2. Get User's Push Tokens

**Endpoint:** `GET /push-tokens/user/:userId`

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "userId": 123,
    "token": "fcm_token_1",
    "provider": "fcm",
    "browser": "Chrome",
    "platform": "Windows",
    "role": "patient",
    "enabled": true,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z",
    "lastUsedAt": "2025-01-01T12:00:00.000Z"
  },
  {
    "id": 2,
    "userId": 123,
    "token": "apns_device_token_1",
    "provider": "apns",
    "browser": "Safari",
    "platform": "iOS",
    "role": "patient",
    "enabled": true,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z",
    "lastUsedAt": null
  }
]
```

**Implementation:**
- Filter by `enabled = true`
- Require JWT authentication
- Verify requesting user is the owner or has admin role

---

### 3. Update Push Token

**Endpoint:** `PUT /push-tokens/:token`

**Request Body:**
```json
{
  "enabled": false
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 123,
    "token": "fcm_token_1",
    "provider": "fcm",
    "browser": "Chrome",
    "platform": "Windows",
    "role": "patient",
    "enabled": false,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T12:00:00.000Z",
    "lastUsedAt": "2025-01-01T12:00:00.000Z"
  }
}
```

**Implementation:**
- Update `updatedAt` timestamp automatically
- Require JWT authentication
- Verify token belongs to authenticated user

---

### 4. Delete Push Token

**Endpoint:** `DELETE /push-tokens/:token`

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Token deleted successfully"
}
```

**Implementation:**
- Permanently delete token from database
- Require JWT authentication
- Verify token belongs to authenticated user

---

## Firebase Admin SDK Setup

### File: `config/firebase.admin.ts`

```typescript
import admin from 'firebase-admin';
import path from 'path';

// Path to service account key (downloaded from Firebase Console)
const serviceAccount = require(path.resolve(__dirname, '../../firebase-service-account.json'));

// Initialize Firebase Admin SDK (only once)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// Export messaging instance
export const messaging = admin.messaging();
export default admin;
```

### Firebase Service Account Setup

1. Go to Firebase Console → Project Settings → Service Accounts
2. Click "Generate New Private Key"
3. Download JSON file
4. Save as `firebase-service-account.json` in backend root
5. **Add to `.gitignore`** (DO NOT commit to version control)

---

## APNs Web Push Setup

### File: `config/apns.config.ts`

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

// Create APNs provider
const apnsProvider = new apn.Provider(apnsOptions);

export default apnsProvider;
```

### APNs Auth Key Setup

1. Go to Apple Developer Portal → Certificates, Identifiers & Profiles → Keys
2. Click "+" to create new key
3. Enable "Apple Push Notifications service (APNs)"
4. Download `.p8` file
5. Save as `apns-auth-key.p8` in backend root
6. Note the **Key ID** and **Team ID**
7. **Add to `.gitignore`**

### Environment Variables

```env
# APNs Configuration
APNS_KEY_ID=ABC123XYZ
APNS_TEAM_ID=XYZ987ABC
APNS_WEB_PUSH_ID=web.sa.labass.patient

# Frontend URL (for notification click routing)
FRONTEND_URL=https://patient.labass.sa
```

---

## NotificationService Implementation

### File: `services/NotificationService.ts`

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
      console.log(`[NotificationService] Sending notification to user ${userId}:`, payload.type);

      // Fetch user's active push tokens
      const tokens = await prisma.pushToken.findMany({
        where: {
          userId,
          enabled: true,
        },
      });

      if (tokens.length === 0) {
        console.log(`[NotificationService] No active push tokens for user ${userId}`);
        return;
      }

      console.log(`[NotificationService] Found ${tokens.length} active tokens`);

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

          console.log(`[NotificationService] Notification sent to token ${tokenRecord.id}`);
        } catch (error: any) {
          console.error(`[NotificationService] Failed to send to token ${tokenRecord.id}:`, error.message);

          // Handle invalid/expired tokens
          if (this.isInvalidTokenError(error)) {
            console.log(`[NotificationService] Disabling invalid token ${tokenRecord.id}`);
            await prisma.pushToken.update({
              where: { id: tokenRecord.id },
              data: { enabled: false },
            });
          }
        }
      });

      await Promise.allSettled(promises);
      console.log(`[NotificationService] Completed sending to ${tokens.length} devices`);
    } catch (error) {
      console.error('[NotificationService] Error in sendNotification:', error);
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
        timestamp: new Date().toISOString(),
        ...payload.data,
      },
      android: {
        priority: (payload.urgent ? 'high' : 'normal') as 'high' | 'normal',
        notification: {
          channelId: this.getChannelId(payload.type),
          priority: (payload.urgent ? 'max' : 'default') as any,
          sound: payload.type === NotificationType.INCOMING_CALL ? 'call_ringtone' : 'default',
        },
      },
      webpush: {
        notification: {
          icon: '/icons/icon-192x192.png',
          badge: '/icons/icon-72x72.png',
          tag: payload.type,
          requireInteraction: payload.type === NotificationType.INCOMING_CALL,
          dir: 'rtl',
          lang: 'ar',
        },
        fcmOptions: {
          link: this.getNotificationUrl(payload),
        },
      },
    };

    await fcmMessaging.send(message as any);
    console.log('[NotificationService] FCM notification sent successfully');
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
        timestamp: new Date().toISOString(),
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
      console.error('[NotificationService] APNs notification failed:', error.response?.reason);
      throw new Error(error.response?.reason || 'APNs send failed');
    }

    console.log('[NotificationService] APNs notification sent successfully');
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
        error.code === code ||
        error.message?.includes(code) ||
        error.response?.reason === code
    );
  }
}

export default new NotificationService();
```

---

## Event Integration Points

### 1. NEW_MESSAGE Notification

**Location:** Socket.io message handler

```typescript
import NotificationService, { NotificationType } from '../services/NotificationService';

// In your Socket.io message handler
socket.on('sendMessage', async (messageData) => {
  // ... existing message handling logic ...

  // Get recipient user ID (patient or doctor, opposite of sender)
  const recipientId = getRecipientUserId(messageData.consultationId, messageData.senderId);

  if (recipientId) {
    // Send push notification
    await NotificationService.sendNotification(recipientId, {
      type: NotificationType.NEW_MESSAGE,
      title: 'رسالة جديدة',
      body: 'لديك رسالة جديدة في الاستشارة',
      consultationId: messageData.consultationId,
      data: {
        senderId: messageData.senderId.toString(),
      },
    });
  }
});

// Helper function to get recipient user ID
function getRecipientUserId(consultationId: number, senderId: number): number | null {
  // Query consultation to get patient and doctor user IDs
  // Return the one that is NOT the sender
  // Implementation depends on your database structure
}
```

---

### 2. NEW_CONSULTATION Notification

**Location:** Consultation creation endpoint

```typescript
import NotificationService, { NotificationType } from '../services/NotificationService';

export const createConsultation = async (req: Request, res: Response) => {
  // ... existing consultation creation logic ...

  const newConsultation = await prisma.consultation.create({
    data: consultationData,
  });

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

### 3. INCOMING_CALL Notification

**Location:** Socket.io video call handler

```typescript
import NotificationService, { NotificationType } from '../services/NotificationService';

socket.on('videoCallStarted', async (callData) => {
  // ... existing call handling logic ...

  // Emit socket event to notify online users (existing)
  io.to(`consultation_${callData.consultationId}`).emit('videoCallStarted', callData);

  // Send push notification to offline/background users (NEW)
  const recipientId = getRecipientUserId(callData.consultationId, callData.callerId);

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

### 4. MISSED_CALL Notification

**Location:** Call timeout handler

```typescript
import NotificationService, { NotificationType } from '../services/NotificationService';

// After 60 seconds of no answer
setTimeout(async () => {
  if (!callAnswered) {
    // Send missed call notification to caller
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

## Privacy & Security Guidelines

### CRITICAL: No PHI in Notifications

**NEVER include in notification payloads:**
- ❌ Patient names
- ❌ Medical conditions
- ❌ Prescriptions
- ❌ Test results
- ❌ Appointment details
- ❌ Doctor names (except in incoming call)
- ❌ Message content

**ONLY include:**
- ✅ Generic titles ("رسالة جديدة")
- ✅ Generic bodies ("لديك إشعار جديد")
- ✅ Consultation IDs (routing only)
- ✅ Notification type enums
- ✅ Timestamps

**Full content is loaded AFTER:**
1. User clicks notification
2. App opens
3. Authentication verified
4. Secure HTTPS request
5. Content displayed in app

---

## Testing

### Local Development Testing

1. **Test FCM (Chrome/Firefox)**
   ```bash
   # Send test notification via NotificationService
   await NotificationService.sendNotification(userId, {
     type: NotificationType.NEW_MESSAGE,
     title: 'Test Message',
     body: 'This is a test notification',
     consultationId: 1,
   });
   ```

2. **Test APNs (Safari)**
   - Requires real iPhone (simulator doesn't support push)
   - Must be on production or staging domain (not localhost)
   - Test on Safari iOS 16.4+

### Monitoring & Logging

```typescript
// Add logging to track notification delivery

console.log('[NotificationService] Notification sent:', {
  userId,
  type: payload.type,
  tokenCount: tokens.length,
  timestamp: new Date().toISOString(),
});

// Track failures
console.error('[NotificationService] Notification failed:', {
  userId,
  type: payload.type,
  error: error.message,
  tokenId: tokenRecord.id,
});
```

---

## Deployment Checklist

### Required Files

- [ ] `firebase-service-account.json` (Firebase Admin)
- [ ] `apns-auth-key.p8` (APNs auth key)
- [ ] Both files in `.gitignore`
- [ ] Environment variables configured
- [ ] Database schema migrated

### Environment Variables

```env
# Firebase (no env vars needed, uses service account JSON)

# APNs
APNS_KEY_ID=ABC123XYZ
APNS_TEAM_ID=XYZ987ABC
APNS_WEB_PUSH_ID=web.sa.labass.patient

# Frontend
FRONTEND_URL=https://patient.labass.sa

# Node Environment
NODE_ENV=production
```

### Database Migration

```bash
# If using Prisma
npx prisma migrate dev --name add_push_tokens

# If using raw SQL
psql -U username -d database_name -f migrations/add_push_tokens.sql
```

### API Endpoint Testing

```bash
# Test token creation
curl -X POST https://api.labass.sa/api_labass/push-tokens \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 123,
    "token": "test_token_123",
    "provider": "fcm",
    "browser": "Chrome",
    "platform": "Windows",
    "role": "patient"
  }'

# Test token retrieval
curl https://api.labass.sa/api_labass/push-tokens/user/123 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Troubleshooting

### FCM Issues

**Error:** "messaging/invalid-registration-token"
- **Cause:** Token is invalid or expired
- **Solution:** NotificationService will automatically disable the token

**Error:** "messaging/server-unavailable"
- **Cause:** Firebase servers are down
- **Solution:** Implement retry logic with exponential backoff

### APNs Issues

**Error:** "BadDeviceToken"
- **Cause:** Device token is invalid or app was uninstalled
- **Solution:** NotificationService will automatically disable the token

**Error:** "Forbidden"
- **Cause:** Invalid auth key or Website Push ID
- **Solution:** Verify APNS_KEY_ID, APNS_TEAM_ID, and .p8 file

---

## Support & Maintenance

### Regular Tasks

1. **Clean up expired tokens (weekly cron job)**
   ```typescript
   // Delete tokens that haven't been used in 90 days
   await prisma.pushToken.deleteMany({
     where: {
       lastUsedAt: {
         lt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
       },
     },
   });
   ```

2. **Monitor delivery rates**
   - Track successful vs failed deliveries
   - Alert if failure rate > 10%

3. **Update APNs certificates**
   - .p8 auth keys don't expire, but if using certificates, renew annually

---

## Summary

**What Backend Team Needs to Do:**

1. ✅ Create `push_tokens` table in database
2. ✅ Implement 4 API endpoints (POST, GET, PUT, DELETE)
3. ✅ Set up Firebase Admin SDK
4. ✅ Set up APNs Web Push
5. ✅ Create NotificationService
6. ✅ Integrate notifications into 4 event points:
   - New message received
   - New consultation created
   - Video call started
   - Call missed
7. ✅ Deploy with environment variables
8. ✅ Test on staging before production

**Frontend is Ready:**
- All client-side code implemented
- Waiting for backend API endpoints
- Will automatically start working once backend is deployed

**Questions?**
Contact frontend team for coordination on API contracts and testing.
