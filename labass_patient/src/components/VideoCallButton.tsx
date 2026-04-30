"use client";
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { VideoCameraIcon } from '@heroicons/react/24/outline';
import { useVideoCall } from '../hooks/useVideoCall';
import VideoRoom from './VideoRoom';

interface VideoCallButtonProps {
  consultationId: number;
  userId: string;
  socket?: any;
  isConsultationOpen: boolean;
}

const VideoCallButton: React.FC<VideoCallButtonProps> = ({
  consultationId,
  userId,
  socket,
  isConsultationOpen,
}) => {
  const [livekitToken, setLivekitToken] = useState<string>('');
  const [incomingCall, setIncomingCall] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  const {
    callState,
    room,
    setupRoom,
    endCall,
    toggleAudio,
    toggleVideo,
  } = useVideoCall({ consultationId, userId, socket });

  useEffect(() => {
    if (!socket) return;

    const handleVideoCallStarted = (data: any) => {
      if (data.initiatedBy !== 'patient') {
        setIncomingCall(true);
      }
    };

    const handleVideoCallEnded = () => {
      setIncomingCall(false);
      setLivekitToken('');
    };

    socket.on('videoCallStarted', handleVideoCallStarted);
    socket.on('videoCallEnded', handleVideoCallEnded);

    return () => {
      socket.off('videoCallStarted', handleVideoCallStarted);
      socket.off('videoCallEnded', handleVideoCallEnded);
    };
  }, [socket]);

  const fetchLivekitToken = async (): Promise<string> => {
    const authToken = localStorage.getItem("labass_token");
    if (!authToken) throw new Error("Authentication token not found");

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/get-token`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: `patient_${userId}`,
        roomName: `consultation_${consultationId}`,
      }),
    });

    if (!response.ok) throw new Error(`Failed to get token: ${response.statusText}`);
    const data = await response.json();
    return data.token;
  };

  const handleStartCall = async () => {
    try {
      setIsStarting(true);
      const token = await fetchLivekitToken();
      setupRoom(); // create room + attach event listeners (no connect yet)
      setLivekitToken(token); // triggers re-render → VideoRoom mounts → LiveKitRoom connects
    } catch (error) {
      console.error('Failed to start video call:', error);
      alert(`فشل في بدء المكالمة المرئية: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
    } finally {
      setIsStarting(false);
    }
  };

  const handleEndCall = async () => {
    await endCall();
    setLivekitToken('');
    setIncomingCall(false);
  };

  const handleJoinCall = async () => {
    setIncomingCall(false);
    await handleStartCall();
  };

  if (!isConsultationOpen) return null;

  // Incoming call notification
  if (incomingCall && !livekitToken) {
    return (
      <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-blue-100 border border-blue-400 text-blue-700 px-6 py-4 rounded-lg shadow-lg z-40">
        <div className="flex items-center space-x-4" dir="rtl">
          <VideoCameraIcon className="h-6 w-6" />
          <div>
            <p className="font-medium">مكالمة مرئية واردة</p>
            <p className="text-sm">الطبيب يبدأ مكالمة مرئية</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleJoinCall}
              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700"
            >
              انضمام
            </button>
            <button
              onClick={() => setIncomingCall(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-600"
            >
              رفض
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active call — render VideoRoom via portal
  if (livekitToken && room) {
    return typeof document !== 'undefined' ? createPortal(
      <VideoRoom
        room={room}
        token={livekitToken}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL!}
        onDisconnect={handleEndCall}
        isConnecting={callState.isConnecting}
      />,
      document.body
    ) : null;
  }

  // Start call button
  return (
    <div className="p-4">
      <button
        onClick={handleStartCall}
        disabled={isStarting}
        className={`w-full ${isStarting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white text-sm py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center space-x-2`}
        dir="rtl"
      >
        {isStarting ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>جاري الاتصال...</span>
          </>
        ) : (
          <>
            <VideoCameraIcon className="h-5 w-5" />
            <span>بدء مكالمة مرئية</span>
          </>
        )}
      </button>

      {callState.error && (
        <p className="text-red-600 text-xs mt-2 text-right" dir="rtl">{callState.error}</p>
      )}
    </div>
  );
};

export default VideoCallButton;
