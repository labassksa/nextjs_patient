# Push Notification Sounds

## Required Audio Files

This directory should contain audio files used for push notifications.

### Files Required

- **`ringtone.mp3`** - Incoming video call ringtone

### Audio Requirements

**File:** `ringtone.mp3`
**Purpose:** Plays when user receives an incoming video call notification
**Duration:** 3-5 seconds (will loop automatically)
**Format:** MP3 (maximum browser compatibility)
**Bitrate:** 128 kbps recommended
**Sample Rate:** 44.1 kHz
**Channels:** Mono or Stereo

### Audio Characteristics

**Ideal Ringtone Properties:**
- ✅ Pleasant and professional tone
- ✅ Not too loud or jarring
- ✅ Loops seamlessly (no abrupt start/end)
- ✅ Culturally appropriate for Saudi Arabia
- ✅ Easily recognizable as a call
- ✅ Small file size (<100 KB)

### Sourcing Ringtones

**Option 1: Custom Audio**
- Commission custom ringtone matching Labass brand
- Work with audio designer to create unique sound
- Ensure copyright ownership

**Option 2: Royalty-Free Libraries**
- https://freesound.org/ (CC0 licensed sounds)
- https://www.zapsplat.com/ (Free for commercial use)
- https://mixkit.co/free-sound-effects/ (Free license)

**Option 3: Generate Programmatically**
- Use audio generation tools like Audacity
- Create simple tone sequence
- Export as MP3

### Example: Converting Audio Files

If you have a ringtone in another format (WAV, OGG, etc.), convert to MP3:

```bash
# Using ffmpeg
ffmpeg -i ringtone.wav -b:a 128k -ar 44100 ringtone.mp3

# Trim to 3 seconds
ffmpeg -i ringtone.mp3 -t 3 -c copy ringtone-trimmed.mp3

# Normalize volume
ffmpeg -i ringtone.mp3 -af "volume=1.5" ringtone-louder.mp3
```

### Testing

After adding `ringtone.mp3`:
1. Place file in this directory
2. Test in IncomingCallNotification component
3. Verify audio plays on all browsers (Chrome, Safari, Firefox)
4. Verify audio loops correctly
5. Test volume levels on different devices

### Usage in Code

The ringtone is referenced in:
- `src/components/IncomingCallNotification.tsx`
- `public/firebase-messaging-sw.js` (service worker)

```typescript
<audio ref={audioRef} src="/sounds/ringtone.mp3" preload="auto" />
```

### Fallback

If no ringtone is provided:
- Component will attempt to play audio but fail silently
- No error will be shown to user
- Visual notification will still appear
- For production: **ringtone is highly recommended**

### Current Status

⚠️ **Ringtone not yet added** - Audio element exists but file is missing

**Action Required:**
1. Source or create ringtone audio file
2. Convert to MP3 format if needed
3. Place as `ringtone.mp3` in this directory
4. Test audio playback on all target devices
5. Verify looping behavior

---

**Note:** The incoming call notification will work without audio, but user experience is significantly better with a ringtone. Prioritize adding this before production deployment.

### Accessibility

Consider:
- Volume should be audible but not startling
- Provide user settings to disable sound (future enhancement)
- Respect system "Do Not Disturb" settings
- Comply with quiet hours if implementing time-based logic
