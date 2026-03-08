# Push Notifications Setup Guide
## Labass Patient Portal - Production Deployment

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Firebase Setup](#firebase-setup)
3. [Service Worker Configuration](#service-worker-configuration)
4. [Environment Variables](#environment-variables)
5. [Asset Preparation](#asset-preparation)
6. [Testing](#testing)
7. [Safari iOS Setup (Optional)](#safari-ios-setup-optional)
8. [Production Deployment](#production-deployment)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Accounts & Access

- [x] Google account (for Firebase)
- [ ] Apple Developer account ($99/year - **only if enabling Safari iOS support**)
- [x] Access to production server/hosting environment
- [x] Access to domain DNS settings (for Safari iOS)

### Browser Requirements

**Supported Browsers:**
- ✅ Chrome 42+ (Desktop & Android)
- ✅ Firefox 44+ (Desktop & Android)
- ✅ Edge 17+ (Desktop)
- ✅ Safari 16.4+ (iOS only, requires additional setup)
- ✅ Opera 37+

**Not Supported:**
- ❌ Internet Explorer (any version)
- ❌ Safari on macOS (uses FCM instead)
- ❌ Safari iOS < 16.4

---

## Firebase Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project" (or select existing project)
3. Enter project name: **"Labass Notifications"**
4. (Optional) Enable Google Analytics
5. Click "Create project"
6. Wait for project creation to complete

### Step 2: Add Web App to Firebase

1. In Firebase Console, click the **Web icon** `</>` to add a web app
2. Register app:
   - App nickname: **"Labass Patient Portal"**
   - ✅ Check "Also set up Firebase Hosting" (optional)
   - Click "Register app"

3. Copy the Firebase configuration:
   ```javascript
   const firebaseConfig = {
     apiKey: "your-api-key-here",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "your-sender-id",
     appId: "your-app-id"
   };
   ```
4. **Save these values** - you'll need them in the next steps

### Step 3: Enable Cloud Messaging

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Click the **Cloud Messaging** tab
3. Under "Web Push certificates":
   - Click **"Generate key pair"**
   - Copy the generated key (starts with `B...`)
   - This is your **VAPID key**

### Step 4: Download Service Account (Backend)

1. In Firebase Console, go to **Project Settings** > **Service Accounts**
2. Click **"Generate new private key"**
3. Download the JSON file
4. **Share this file with backend team** (DO NOT commit to Git)
5. Backend will use this for sending push notifications

---

## Service Worker Configuration

### Update `public/firebase-messaging-sw.js`

Open the file and replace placeholders with your Firebase config values:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",                    // Replace FIREBASE_API_KEY_PLACEHOLDER
  authDomain: "YOUR_ACTUAL_AUTH_DOMAIN",            // Replace FIREBASE_AUTH_DOMAIN_PLACEHOLDER
  projectId: "YOUR_ACTUAL_PROJECT_ID",              // Replace FIREBASE_PROJECT_ID_PLACEHOLDER
  storageBucket: "YOUR_ACTUAL_STORAGE_BUCKET",      // Replace FIREBASE_STORAGE_BUCKET_PLACEHOLDER
  messagingSenderId: "YOUR_ACTUAL_SENDER_ID",       // Replace FIREBASE_MESSAGING_SENDER_ID_PLACEHOLDER
  appId: "YOUR_ACTUAL_APP_ID"                       // Replace FIREBASE_APP_ID_PLACEHOLDER
};
```

**Example:**
```javascript
const firebaseConfig = {
  apiKey: "your-firebase-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

**⚠️ Important:** These values are public and will be visible in the service worker. This is normal and expected for Firebase client SDK.

---

## Environment Variables

### Step 1: Create `.env.local`

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Open `.env.local` and fill in Firebase values:

   ```env
   # Firebase Configuration (from Step 2 above)
   NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

   # VAPID Key (from Step 3 above)
   NEXT_PUBLIC_FIREBASE_VAPID_KEY=your-vapid-key

   # Safari Web Push ID (leave as default for now)
   NEXT_PUBLIC_SAFARI_WEB_PUSH_ID=web.sa.labass.patient
   ```

3. **DO NOT commit `.env.local`** to Git (already in `.gitignore`)

### Step 2: Set Production Environment Variables

Set these variables in your hosting environment:

**Vercel:**
```bash
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
# Enter value when prompted
# Repeat for all NEXT_PUBLIC_* variables
```

**Other Platforms:**
- Set via dashboard (Netlify, AWS Amplify, etc.)
- Or via CLI/configuration files

---

## Asset Preparation

### 1. Notification Icons

**Required Files:**
- `public/icons/icon-72x72.png`
- `public/icons/icon-96x96.png`
- `public/icons/icon-128x128.png`
- `public/icons/icon-144x144.png`
- `public/icons/icon-152x152.png`
- `public/icons/icon-192x192.png`
- `public/icons/icon-384x384.png`
- `public/icons/icon-512x512.png`

**How to Generate:**

1. Get Labass logo (vector or high-res PNG, minimum 512x512)
2. Use [RealFaviconGenerator](https://realfavicongenerator.net/):
   - Upload logo
   - Select "Progressive Web App" preset
   - Download generated icons
   - Extract to `public/icons/`

3. Or use ImageMagick (command line):
   ```bash
   cd public/icons
   convert ~/logo.png -resize 72x72 icon-72x72.png
   convert ~/logo.png -resize 96x96 icon-96x96.png
   convert ~/logo.png -resize 128x128 icon-128x128.png
   convert ~/logo.png -resize 144x144 icon-144x144.png
   convert ~/logo.png -resize 152x152 icon-152x152.png
   convert ~/logo.png -resize 192x192 icon-192x192.png
   convert ~/logo.png -resize 384x384 icon-384x384.png
   convert ~/logo.png -resize 512x512 icon-512x512.png
   ```

### 2. Ringtone Audio

**Required File:**
- `public/sounds/ringtone.mp3`

**Specifications:**
- Format: MP3
- Duration: 3-5 seconds (will loop)
- Bitrate: 128 kbps
- Sample Rate: 44.1 kHz
- File size: <100 KB

**Where to Get:**
- Commission custom ringtone (recommended)
- Download from royalty-free library:
  - [Freesound.org](https://freesound.org/)
  - [Zapsplat](https://www.zapsplat.com/)
  - [Mixkit](https://mixkit.co/free-sound-effects/)

**Test:** Play `public/sounds/ringtone.mp3` in browser to verify it sounds good

---

## Testing

### Local Testing (Development)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open in browser:** http://localhost:3000

4. **Test notification permission:**
   - Login to the app
   - Wait 3 seconds
   - You should see browser permission prompt
   - Click "Allow"
   - Check browser console for "Push notification registration successful"

5. **Verify service worker:**
   - Open DevTools > Application tab > Service Workers
   - You should see `/firebase-messaging-sw.js` registered
   - Status should be "activated and running"

6. **Check token generation:**
   - Open DevTools > Console
   - Look for `[usePushNotifications] FCM token generated successfully`
   - Token should be saved to backend (check Network tab)

### Browser Testing Matrix

Test on each browser:

| Browser | Desktop | Mobile | Notes |
|---------|---------|--------|-------|
| Chrome | ✅ | ✅ (Android) | Primary test browser |
| Firefox | ✅ | ✅ (Android) | Test FCM |
| Edge | ✅ | - | Test on Windows |
| Safari | ✅ | ✅ (iOS 16.4+) | Requires APNs setup |

### Testing Checklist

- [ ] Permission request appears after login
- [ ] Permission can be granted
- [ ] Push token generated (check console)
- [ ] Token saved to backend (check Network tab)
- [ ] Service worker registered successfully
- [ ] Foreground notifications work
- [ ] Background notifications work (close app, send test notification)
- [ ] Notification click opens correct page
- [ ] Incoming call shows full-screen UI
- [ ] Ringtone plays for incoming calls
- [ ] Answer/Decline buttons work

### Manual Test Notification

**Using Backend API:**
```bash
curl -X POST https://api.labass.sa/api_labass/test-notification \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 123,
    "type": "NEW_MESSAGE",
    "title": "رسالة تجريبية",
    "body": "هذا إشعار تجريبي",
    "consultationId": 1
  }'
```

---

## Safari iOS Setup (Optional)

Safari iOS requires additional setup with Apple Developer account.

### Prerequisites

- Apple Developer Program membership ($99/year)
- Access to Apple Developer Portal
- Domain ownership verification

### Step 1: Create Website Push ID

1. Go to [Apple Developer Portal](https://developer.apple.com/account/)
2. Navigate to: **Certificates, Identifiers & Profiles** > **Identifiers**
3. Click **"+"** to create new identifier
4. Select **"Website Push IDs"**, click Continue
5. Description: **"Labass Patient Push Notifications"**
6. Identifier: **`web.sa.labass.patient`**
7. Click Continue, then Register

### Step 2: Generate APNs Auth Key

1. In Apple Developer Portal, go to **Keys**
2. Click **"+"** to create new key
3. Key Name: **"Labass APNs Key"**
4. ✅ Check **"Apple Push Notifications service (APNs)"**
5. Click Continue, then Register
6. **Download the `.p8` file** (only available once!)
7. **Note the Key ID and Team ID** (shown on the page)

### Step 3: Share with Backend Team

Send to backend team:
- `.p8` auth key file
- Key ID (e.g., `ABC123XYZ`)
- Team ID (e.g., `XYZ987ABC`)
- Website Push ID (`web.sa.labass.patient`)

Backend will configure these in their environment variables.

### Step 4: Domain Association File

**File already created:** `public/.well-known/apple-app-site-association`

**Verify it's accessible:**
```bash
curl https://patient.labass.sa/.well-known/apple-app-site-association
```

Should return:
```json
{
  "webcredentials": {
    "apps": ["web.sa.labass.patient"]
  }
}
```

### Step 5: Test on Safari iOS

1. Open Safari on iPhone (iOS 16.4+)
2. Navigate to https://patient.labass.sa
3. Login
4. Permission prompt should appear
5. Grant permission
6. Device token should be generated and saved

---

## Production Deployment

### Pre-Deployment Checklist

- [ ] Firebase project created and configured
- [ ] Service worker updated with Firebase config
- [ ] Environment variables set in hosting platform
- [ ] Notification icons generated and placed
- [ ] Ringtone audio file added
- [ ] `.env.local` created locally (NOT committed)
- [ ] Tested locally on all browsers
- [ ] Backend API endpoints ready
- [ ] Backend has Firebase service account JSON
- [ ] (Optional) Safari APNs configured

### Deployment Steps

1. **Update Firebase config in service worker:**
   ```bash
   # Verify firebase-messaging-sw.js has production values
   grep "apiKey" public/firebase-messaging-sw.js
   ```

2. **Build production bundle:**
   ```bash
   npm run build
   ```

3. **Test production build locally:**
   ```bash
   npm run start
   # Open http://localhost:3000 and test
   ```

4. **Deploy to production:**
   ```bash
   # For Vercel
   vercel --prod

   # Or your deployment command
   npm run deploy
   ```

5. **Verify manifest is accessible:**
   ```bash
   curl https://patient.labass.sa/manifest.json
   ```

6. **Verify service worker is accessible:**
   ```bash
   curl https://patient.labass.sa/firebase-messaging-sw.js
   ```

7. **Test on production domain:**
   - Open https://patient.labass.sa
   - Login
   - Grant permission
   - Verify token generation
   - Send test notification from backend

### Post-Deployment Verification

- [ ] HTTPS enabled (required for push notifications)
- [ ] Manifest.json accessible
- [ ] Service worker registered
- [ ] Permission request works
- [ ] Token generation works
- [ ] Backend can send notifications
- [ ] Notifications appear correctly
- [ ] Notification clicks navigate correctly
- [ ] Incoming call UI appears
- [ ] Ringtone plays

---

## Troubleshooting

### Issue: "Firebase messaging not supported"

**Cause:** Browser doesn't support push notifications or not on HTTPS

**Solution:**
- Ensure you're on HTTPS (or localhost for development)
- Check browser version (Chrome 42+, Firefox 44+)
- Try in incognito/private mode

### Issue: "VAPID key not configured"

**Cause:** Missing or incorrect VAPID key in environment variables

**Solution:**
- Verify `NEXT_PUBLIC_FIREBASE_VAPID_KEY` is set in `.env.local`
- Regenerate VAPID key in Firebase Console if needed
- Restart development server after changing .env

### Issue: Service worker not registering

**Cause:** Service worker file not found or has errors

**Solution:**
```bash
# Check if file exists
ls public/firebase-messaging-sw.js

# Check for syntax errors
node -c public/firebase-messaging-sw.js

# Clear browser cache and service workers
# DevTools > Application > Service Workers > Unregister
```

### Issue: Notifications not appearing

**Cause:** Permission denied, backend not sending, or token not saved

**Solution:**
1. Check permission status:
   ```javascript
   console.log(Notification.permission); // Should be "granted"
   ```
2. Check if token was saved to backend (Network tab)
3. Verify backend is sending notifications
4. Check browser notification settings
5. Try in different browser

### Issue: Safari iOS not working

**Cause:** Website Push ID not configured or iOS < 16.4

**Solution:**
- Verify iOS version is 16.4 or higher
- Check Website Push ID in Apple Developer Portal
- Ensure backend has APNs auth key configured
- Verify `.well-known/apple-app-site-association` is accessible
- Test on real device (not simulator)

### Issue: Ringtone not playing

**Cause:** Audio file missing or incorrect format

**Solution:**
- Verify `public/sounds/ringtone.mp3` exists
- Test audio file in browser directly
- Check file format is MP3
- Verify audio permissions in browser settings

### Issue: "Token already exists" error

**Cause:** User has registered from multiple devices

**Solution:**
- This is normal and expected
- Backend uses UPSERT logic to update existing token
- No action needed

---

## Monitoring & Maintenance

### Regular Tasks

**Weekly:**
- Monitor notification delivery rates
- Check for failed tokens (backend logs)
- Review user permission grant rates

**Monthly:**
- Clean up expired tokens (backend cron job)
- Review Firebase usage quota
- Update documentation with any changes

**Annually:**
- Renew Apple Developer account (if using Safari push)
- Review Firebase pricing tier
- Audit notification content for privacy compliance

### Metrics to Track

- **Permission grant rate:** % of users who allow notifications
- **Token generation success rate:** % of successful token generations
- **Notification delivery rate:** % of notifications delivered successfully
- **Click-through rate:** % of notifications that users click
- **Call answer rate:** % of video calls answered via notification

### Analytics

Add tracking to understand notification effectiveness:

```typescript
// Track permission grant
if (Notification.permission === 'granted') {
  analytics.track('notification_permission_granted');
}

// Track notification click
window.addEventListener('notificationclick', () => {
  analytics.track('notification_clicked', { type: payload.type });
});
```

---

## Security Best Practices

### Do's

- ✅ Use environment variables for all config
- ✅ Enable HTTPS for all pages
- ✅ Keep Firebase service account JSON secure (backend only)
- ✅ Use latest Firebase SDK versions
- ✅ Validate all user input
- ✅ Follow HIPAA/privacy guidelines (no PHI in notifications)

### Don'ts

- ❌ Never commit `.env.local` or Firebase service account JSON
- ❌ Never include PHI in notification payloads
- ❌ Never use `http://` for push notifications
- ❌ Never share VAPID key publicly (but it's okay if visible in service worker)
- ❌ Never use same Firebase project for multiple environments (dev/prod)

---

## Support

### Documentation

- **Implementation Plan:** `.claude/plans/push-notifications-plan.md`
- **Backend Guide:** `BACKEND_PUSH_NOTIFICATIONS_GUIDE.md`
- **Environment Template:** `.env.local.example`
- **Asset READMEs:**
  - `public/icons/README.md`
  - `public/sounds/README.md`

### External Resources

- [Firebase Cloud Messaging Docs](https://firebase.google.com/docs/cloud-messaging)
- [Web Push Notifications Guide](https://web.dev/push-notifications-overview/)
- [Safari Web Push Docs](https://developer.apple.com/notifications/safari-push-notifications/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

### Getting Help

1. Check this guide first
2. Review troubleshooting section
3. Check browser console for errors
4. Verify backend is running and configured
5. Test in different browser
6. Contact development team with:
   - Browser and version
   - Steps to reproduce
   - Console errors
   - Network tab screenshots

---

## Summary

**Minimum Required Steps:**

1. ✅ Create Firebase project
2. ✅ Get Firebase config and VAPID key
3. ✅ Update service worker with config
4. ✅ Set environment variables
5. ✅ Generate notification icons
6. ✅ Add ringtone audio
7. ✅ Deploy to HTTPS domain
8. ✅ Coordinate with backend team

**Optional (for Safari iOS):**

9. Create Apple Website Push ID
10. Generate APNs auth key
11. Configure backend with APNs credentials
12. Test on real iPhone

**You're Done! 🎉**

Users will now receive push notifications for:
- 💬 New messages
- 📋 New consultations
- 📞 Incoming video calls
- ❌ Missed calls

Even when the app is closed or in the background!
