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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Listen for incoming video call events
    // This event is emitted by the socket.io connection in the chat page

    const handleVideoCallStarted = (event: CustomEvent<IncomingCall>) => {
      console.log('[IncomingCallNotification] Incoming call received:', event.detail);
      setIncomingCall(event.detail);

      // Play ringtone
      if (audioRef.current) {
        audioRef.current.loop = true;
        audioRef.current.play().catch((error) => {
          console.error('[IncomingCallNotification] Error playing ringtone:', error);
        });
      }

      // Auto-dismiss after 60 seconds if not answered
      timeoutRef.current = setTimeout(() => {
        handleDecline();
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
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
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
    router.push(`/chat/${incomingCall?.consultationId}`);
  };

  const handleDecline = () => {
    console.log('[IncomingCallNotification] Call declined');
    stopRingtone();
    clearAutoTimeout();

    // Emit videoCallEnded event to notify the caller
    if (incomingCall) {
      const event = new CustomEvent('decline-video-call', {
        detail: {
          consultationId: incomingCall.consultationId,
          reason: 'declined',
        },
      });
      window.dispatchEvent(event);
    }

    setIncomingCall(null);
  };

  if (!incomingCall) {
    return (
      <>
        {/* Hidden audio element for ringtone */}
        <audio ref={audioRef} src="/sounds/ringtone.mp3" preload="auto" />
      </>
    );
  }

  return (
    <>
      {/* Hidden audio element for ringtone */}
      <audio ref={audioRef} src="/sounds/ringtone.mp3" preload="auto" />

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
            {incomingCall.callerName.charAt(0)}
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
              onClick={handleDecline}
              startIcon={<PhoneDisabledIcon />}
              sx={{
                paddingX: 4,
                paddingY: 1.5,
                fontSize: '1.1rem',
                borderRadius: 3,
                minWidth: 140,
              }}
            >
              رفض
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
