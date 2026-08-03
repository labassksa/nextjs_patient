/**
 * IncomingCallNotification Component
 * Shows a full-screen notification when receiving an incoming video call
 * Listens to Socket.io 'videoCallStarted' event
 */

'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogTitle, Avatar, Button } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import PhoneDisabledIcon from '@mui/icons-material/PhoneDisabled';

interface IncomingCall {
  consultationId: number;
  callerId: number;
  callerName: string;
  callerAvatar?: string;
}

export function IncomingCallNotification() {
  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
  const router = useRouter();
  const audioContextRef = useRef<AudioContext | null>(null);
  const ringtoneTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const ringtoneRequestedRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Listen for incoming video call events
    // This event is emitted by the socket.io connection in the chat page

    const handleVideoCallStarted = (event: CustomEvent<IncomingCall>) => {
      console.log('[IncomingCallNotification] Incoming call received:', event.detail);
      setIncomingCall(event.detail);

      startRingtone();

      // Auto-dismiss after 60 seconds if not answered
      clearAutoTimeout();
      timeoutRef.current = setTimeout(() => {
        setIncomingCall(null);
        stopRingtone();
      }, 60000); // 60 seconds
    };

    const handleVideoCallEnded = () => {
      console.log('[IncomingCallNotification] Call ended');
      setIncomingCall(null);
      stopRingtone();
      clearAutoTimeout();
    };

    // Listen for Socket.io events via custom events
    // The chat page will dispatch these custom events when it receives socket.io events
    window.addEventListener('video-call-started', handleVideoCallStarted as EventListener);
    window.addEventListener('video-call-ended', handleVideoCallEnded);

    // Also listen for push notification events
    window.addEventListener(
      'push-notification-incoming-call',
      handleVideoCallStarted as EventListener
    );

    return () => {
      window.removeEventListener('video-call-started', handleVideoCallStarted as EventListener);
      window.removeEventListener('video-call-ended', handleVideoCallEnded);
      window.removeEventListener(
        'push-notification-incoming-call',
        handleVideoCallStarted as EventListener
      );
      stopRingtone();
      clearAutoTimeout();
    };
  }, []);

  const stopRingtone = () => {
    ringtoneRequestedRef.current = false;
    if (ringtoneTimerRef.current) {
      clearInterval(ringtoneTimerRef.current);
      ringtoneTimerRef.current = null;
    }
  };

  const startRingtone = () => {
    if (ringtoneTimerRef.current || typeof window === 'undefined') return;

    const AudioContextConstructor = window.AudioContext
      || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextConstructor) return;

    const context = audioContextRef.current ?? new AudioContextConstructor();
    audioContextRef.current = context;
    ringtoneRequestedRef.current = true;

    const playTone = () => {
      if (!ringtoneRequestedRef.current) return;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.frequency.value = 720;
      gain.gain.setValueAtTime(0.12, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.35);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.35);
    };

    void context.resume().then(() => {
      if (!ringtoneRequestedRef.current) return;
      playTone();
      ringtoneTimerRef.current = setInterval(playTone, 1600);
    }).catch(() => {
      // Browsers may block foreground audio until the next user interaction.
    });
  };

  const clearAutoTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleAnswer = () => {
    console.log('[IncomingCallNotification] Call answered');
    stopRingtone();
    clearAutoTimeout();
    setIncomingCall(null);

    // Navigate to chat page with the consultation
    router.push(`/chat/${incomingCall?.consultationId}?autoAnswer=true`);
  };

  const handleDismiss = () => {
    stopRingtone();
    clearAutoTimeout();
    setIncomingCall(null);
  };

  if (!incomingCall) {
    return null;
  }

  return (
    <>
      {/* Incoming call dialog */}
      <Dialog
        open={true}
        maxWidth="sm"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 4,
            padding: 2,
          },
        }}
        disableEscapeKeyDown
      >
        <DialogContent className="text-center p-8">
          {/* Caller avatar */}
          <Avatar
            src={incomingCall.callerAvatar}
            alt={incomingCall.callerName}
            sx={{
              width: 120,
              height: 120,
              margin: '0 auto 24px',
              border: '4px solid #4F46E5',
              fontSize: '3rem',
            }}
          >
            {incomingCall.callerName?.charAt(0) || 'ل'}
          </Avatar>

          {/* Dialog title */}
          <DialogTitle
            className="text-2xl font-bold mb-2 p-0"
            sx={{ fontSize: '1.75rem', fontWeight: 700 }}
          >
            مكالمة مرئية واردة
          </DialogTitle>

          {/* Caller name */}
          <p className="text-xl mb-8 text-gray-700" style={{ fontSize: '1.25rem' }}>
            {incomingCall.callerName}
          </p>

          {/* Action buttons */}
          <div className="flex gap-6 justify-center mt-8">
            {/* Decline button */}
            <Button
              variant="contained"
              color="error"
              size="large"
              onClick={handleDismiss}
              startIcon={<PhoneDisabledIcon />}
              sx={{
                paddingX: 4,
                paddingY: 1.5,
                fontSize: '1.1rem',
                borderRadius: 3,
                minWidth: 140,
              }}
            >
              إغلاق
            </Button>

            {/* Answer button */}
            <Button
              variant="contained"
              color="success"
              size="large"
              onClick={handleAnswer}
              startIcon={<PhoneIcon />}
              sx={{
                paddingX: 4,
                paddingY: 1.5,
                fontSize: '1.1rem',
                borderRadius: 3,
                minWidth: 140,
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%, 100%': {
                    boxShadow: '0 0 0 0 rgba(76, 175, 80, 0.7)',
                  },
                  '50%': {
                    boxShadow: '0 0 0 10px rgba(76, 175, 80, 0)',
                  },
                },
              }}
            >
              رد
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
