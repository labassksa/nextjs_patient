"use client";
import '@livekit/components-styles';
import React, { useState } from 'react';
import {
  LiveKitRoom,
  RoomAudioRenderer,
  StartAudio,
  VideoConference,
  useConnectionState,
  useRemoteParticipants,
} from '@livekit/components-react';
import { ConnectionState, DisconnectReason } from 'livekit-client';

interface VideoRoomProps {
  token: string;
  onDisconnect: (reason?: DisconnectReason) => void;
  onConnected?: () => void;
  onError?: (message: string) => void;
}

const VideoRoom: React.FC<VideoRoomProps> = ({ token, onDisconnect, onConnected, onError }) => {
  const [roomError, setRoomError] = useState<string | null>(null);

  const reportError = (message: string) => {
    setRoomError(message);
    onError?.(message);
  };

  return (
    <div className="fixed inset-0 bg-white z-50">
      <style jsx global>{`
        :root {
          --safe-area-inset-bottom: env(safe-area-inset-bottom, 0px);
        }

        /* Light theme overrides for LiveKit */
        [data-lk-theme="default"] {
          --lk-bg: #ffffff !important;
          --lk-bg2: #f5f5f5 !important;
          --lk-bg3: #ebebeb !important;
          --lk-bg4: #e0e0e0 !important;
          --lk-bg5: #d5d5d5 !important;
          --lk-fg: #111111 !important;
          --lk-fg2: #222222 !important;
          --lk-fg3: #333333 !important;
          --lk-fg4: #444444 !important;
          --lk-fg5: #555555 !important;
          --lk-border-color: rgba(0, 0, 0, 0.1) !important;
          --lk-control-fg: #111111 !important;
          --lk-control-bg: #f0f0f0 !important;
          --lk-control-hover-bg: #e0e0e0 !important;
          --lk-control-active-bg: #d0d0d0 !important;
          --lk-control-active-hover-bg: #c0c0c0 !important;
          --lk-box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.1) !important;
          --lk-drop-shadow: rgba(0, 0, 0, 0.1) 0px 0px 24px !important;
        }

        .lk-room-container {
          background-color: #ffffff !important;
        }

        .lk-control-bar {
          display: flex !important;
          visibility: visible !important;
          opacity: 1 !important;
          position: fixed !important;
          bottom: 0 !important;
          left: 0 !important;
          right: 0 !important;
          z-index: 9999 !important;
          background-color: #ffffff !important;
          border-top: 1px solid #e0e0e0 !important;
          padding: 12px !important;
          padding-bottom: calc(12px + var(--safe-area-inset-bottom)) !important;
          pointer-events: auto !important;
          -webkit-transform: translate3d(0, 0, 0) !important;
          transform: translate3d(0, 0, 0) !important;
        }

        .lk-video-conference {
          display: flex !important;
          flex-direction: column !important;
          position: relative !important;
          height: 100vh !important;
          height: -webkit-fill-available !important;
          min-height: 100vh !important;
          width: 100vw !important;
          overflow: hidden !important;
          background-color: #ffffff !important;
        }

        .lk-video-conference:hover .lk-control-bar,
        .lk-video-conference .lk-control-bar {
          opacity: 1 !important;
          visibility: visible !important;
          display: flex !important;
        }

        @media (max-width: 768px) {
          .lk-control-bar {
            padding: 16px 8px !important;
            padding-bottom: calc(16px + var(--safe-area-inset-bottom)) !important;
            gap: 8px !important;
            justify-content: center !important;
          }

          .lk-control-bar button {
            min-width: 48px !important;
            min-height: 48px !important;
            width: 48px !important;
            height: 48px !important;
            flex-shrink: 0 !important;
            touch-action: manipulation !important;
            -webkit-tap-highlight-color: transparent !important;
          }

          .lk-button {
            pointer-events: auto !important;
            cursor: pointer !important;
          }
        }

        @supports (-webkit-touch-callout: none) {
          .lk-control-bar {
            position: fixed !important;
            padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px)) !important;
          }

          .lk-video-conference {
            height: 100vh !important;
            height: -webkit-fill-available !important;
          }
        }
      `}</style>
      <LiveKitRoom
        token={token}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
        connect={true}
        audio={true}
        video={true}
        onConnected={() => {
          setRoomError(null);
          onConnected?.();
        }}
        onDisconnected={onDisconnect}
        onError={(error) => reportError(error.message || 'تعذر الاتصال بالمكالمة')}
        onMediaDeviceFailure={(_, kind) =>
          reportError(
            kind === 'audioinput'
              ? 'تعذر الوصول إلى الميكروفون. تحقق من إذن المتصفح.'
              : 'تعذر الوصول إلى الكاميرا. تحقق من إذن المتصفح.',
          )
        }
        style={{ height: '100vh', width: '100vw' }}
      >
        <VideoConference />
        <RoomAudioRenderer />
        <CallStatus />
        <StartAudio label="اضغط لتشغيل صوت المكالمة" />
        {roomError && (
          <div className="fixed inset-x-4 top-16 z-[10000] mx-auto max-w-lg rounded-xl bg-red-600 px-4 py-3 text-center text-sm text-white shadow-lg" dir="rtl">
            {roomError}
          </div>
        )}
      </LiveKitRoom>
    </div>
  );
};

const CallStatus = () => {
  const connectionState = useConnectionState();
  const remoteParticipants = useRemoteParticipants();

  const message = connectionState === ConnectionState.Reconnecting
    ? 'جاري استعادة الاتصال…'
    : connectionState === ConnectionState.Connected && remoteParticipants.length === 0
      ? 'بانتظار انضمام الطرف الآخر…'
      : null;

  if (!message) return null;

  return (
    <div className="fixed top-4 left-1/2 z-[10000] -translate-x-1/2 rounded-full bg-gray-900/85 px-4 py-2 text-sm text-white shadow-lg">
      {message}
    </div>
  );
};

export default VideoRoom;
