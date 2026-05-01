"use client";
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { VideoCameraIcon } from '@heroicons/react/24/outline';
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
  const [token, setToken] = useState('');
  const [isCallActive, setIsCallActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [incomingCall, setIncomingCall] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!socket) return;

    const handleVideoCallStarted = (data: any) => {
      if (data.initiatedBy !== 'patient') {
        setIncomingCall(true);
      }
    };

    const handleVideoCallEnded = () => {
      setIncomingCall(false);
      setIsCallActive(false);
      setToken('');
    };

    socket.on('videoCallStarted', handleVideoCallStarted);
    socket.on('videoCallEnded', handleVideoCallEnded);

    return () => {
      socket.off('videoCallStarted', handleVideoCallStarted);
      socket.off('videoCallEnded', handleVideoCallEnded);
    };
  }, [socket]);

  const fetchTokenAndJoin = async () => {
    setIsConnecting(true);
    setError(null);
    try {
      const authToken = localStorage.getItem("labass_token");
      if (!authToken) throw new Error("رمز المصادقة غير موجود");

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

      if (!response.ok) throw new Error(`فشل في الحصول على رمز الاتصال: ${response.statusText}`);

      const data = await response.json();
      console.log('[VideoCall] Token received, joining room...');
      setToken(data.token);
      setIsCallActive(true);
    } catch (err) {
      console.error('[VideoCall] Failed to fetch token:', err);
      setError(err instanceof Error ? err.message : 'فشل في بدء المكالمة');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleConnected = () => {
    console.log('[VideoCall] Connected to LiveKit room');
    if (socket) {
      socket.emit("videoCallStarted", {
        room: `${consultationId}`,
        initiatedBy: "patient",
        timestamp: new Date(),
      });
      socket.emit("videoCallJoined", {
        room: `${consultationId}`,
        userId,
        timestamp: new Date(),
      });
    }
  };

  const handleEndCall = () => {
    console.log('[VideoCall] Call ended');
    setIsCallActive(false);
    setToken('');
    setIncomingCall(false);
    if (socket) {
      socket.emit("videoCallEnded", {
        room: `${consultationId}`,
        endedBy: "patient",
        timestamp: new Date(),
      });
    }
  };

  if (!isConsultationOpen) return null;

  if (isCallActive && token) {
    return typeof document !== 'undefined' ? createPortal(
      <VideoRoom
        token={token}
        onDisconnect={handleEndCall}
        onConnected={handleConnected}
      />,
      document.body
    ) : null;
  }

  if (incomingCall && !isCallActive) {
    return (
      <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-blue-100 border border-blue-400 text-blue-700 px-6 py-4 rounded-lg shadow-lg z-40">
        <div className="flex items-center space-x-4" dir="rtl">
          <VideoCameraIcon className="h-6 w-6" />
          <div>
            <p className="font-medium">مكالمة مرئية واردة</p>
            <p className="text-sm">الطبيب يبدأ مكالمة مرئية</p>
          </div>
          <div className="flex space-x-2">
            <button onClick={fetchTokenAndJoin} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700">
              انضمام
            </button>
            <button onClick={() => setIncomingCall(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-600">
              رفض
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <button
        onClick={fetchTokenAndJoin}
        disabled={isConnecting}
        className={`w-full ${isConnecting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white text-sm py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center space-x-2`}
        dir="rtl"
      >
        {isConnecting ? (
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

      {error && (
        <p className="text-red-600 text-xs mt-2 text-right" dir="rtl">{error}</p>
      )}
    </div>
  );
};

export default VideoCallButton;
