"use client";

import { VideoCameraIcon } from '@heroicons/react/24/outline';
import { DisconnectReason } from 'livekit-client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  beginCallAttempt,
  CallEventData,
  createCallId,
  finishCallAttempt,
  isCallEventForActiveCall,
  isCallEventForConsultation,
} from '@/utils/videoCall';
import VideoRoom from './VideoRoom';

interface VideoCallButtonProps {
  consultationId: number;
  userId: string;
  socket?: any;
  isConsultationOpen: boolean;
}

type CallDirection = 'incoming' | 'outgoing';

const VideoCallButton: React.FC<VideoCallButtonProps> = ({
  consultationId,
  userId,
  socket,
  isConsultationOpen,
}) => {
  const [token, setToken] = useState('');
  const [isCallActive, setIsCallActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [incomingCall, setIncomingCall] = useState<CallEventData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const connectingRef = useRef(false);
  const activeCallIdRef = useRef<string | null>(null);
  const callDirectionRef = useRef<CallDirection>('outgoing');
  const roomMountedRef = useRef(false);
  const suppressDisconnectSignalRef = useRef(false);
  const endSignalSentRef = useRef(false);
  const autoAnswerHandledRef = useRef(false);

  const resetCall = () => {
    setIncomingCall(null);
    setIsCallActive(false);
    setToken('');
    setIsConnecting(false);
    roomMountedRef.current = false;
    finishCallAttempt(connectingRef);
  };

  const emitEndOnce = (reason: 'ended' | 'declined') => {
    if (!socket || endSignalSentRef.current) return;
    endSignalSentRef.current = true;
    socket.emit('videoCallEnded', {
      room: `${consultationId}`,
      consultationId,
      callId: activeCallIdRef.current,
      endedBy: 'patient',
      reason,
      timestamp: new Date().toISOString(),
    });
  };

  useEffect(() => {
    if (!socket) return;

    const handleVideoCallStarted = (data: CallEventData & { initiatedBy?: string }) => {
      if (data.initiatedBy === 'patient') return;
      if (!isCallEventForConsultation(data, consultationId)) return;
      if (roomMountedRef.current || connectingRef.current) return;

      activeCallIdRef.current = data.callId ?? null;
      endSignalSentRef.current = false;
      setError(null);
      setIncomingCall(data);
    };

    const handleVideoCallEnded = (data: CallEventData) => {
      if (!isCallEventForActiveCall(data, consultationId, activeCallIdRef.current)) return;

      suppressDisconnectSignalRef.current = roomMountedRef.current;
      resetCall();
      activeCallIdRef.current = null;
    };

    socket.on('videoCallStarted', handleVideoCallStarted);
    socket.on('videoCallEnded', handleVideoCallEnded);

    return () => {
      socket.off('videoCallStarted', handleVideoCallStarted);
      socket.off('videoCallEnded', handleVideoCallEnded);
    };
  }, [socket, consultationId]);

  const fetchTokenAndJoin = useCallback(async (direction: CallDirection) => {
    if (!beginCallAttempt(connectingRef)) return;

    callDirectionRef.current = direction;
    if (direction === 'outgoing') {
      activeCallIdRef.current = createCallId();
      endSignalSentRef.current = false;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const authToken = localStorage.getItem('labass_token');
      if (!authToken) throw new Error('رمز المصادقة غير موجود');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/get-token`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: `patient_${userId}`,
          roomName: `consultation_${consultationId}`,
        }),
      });

      if (!response.ok) {
        throw new Error(`فشل في الحصول على رمز الاتصال: ${response.statusText}`);
      }

      const data = await response.json();
      if (!data.token) throw new Error('لم يتم استلام رمز الاتصال');

      setIncomingCall(null);
      setToken(data.token);
      roomMountedRef.current = true;
      setIsCallActive(true);
    } catch (caughtError) {
      activeCallIdRef.current = direction === 'outgoing' ? null : activeCallIdRef.current;
      setError(caughtError instanceof Error ? caughtError.message : 'فشل في بدء المكالمة');
    } finally {
      setIsConnecting(false);
      finishCallAttempt(connectingRef);
    }
  }, [consultationId, userId]);

  useEffect(() => {
    if (!isConsultationOpen || autoAnswerHandledRef.current || typeof window === 'undefined') return;

    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('autoAnswer') !== 'true') return;

    autoAnswerHandledRef.current = true;
    searchParams.delete('autoAnswer');
    const query = searchParams.toString();
    window.history.replaceState(null, '', `${window.location.pathname}${query ? `?${query}` : ''}`);
    void fetchTokenAndJoin('incoming');
  }, [fetchTokenAndJoin, isConsultationOpen]);

  const handleConnected = () => {
    if (!socket) return;

    const eventName = callDirectionRef.current === 'outgoing'
      ? 'videoCallStarted'
      : 'videoCallJoined';

    socket.emit(eventName, {
      room: `${consultationId}`,
      consultationId,
      callId: activeCallIdRef.current,
      initiatedBy: 'patient',
      userId,
      timestamp: new Date().toISOString(),
    });
  };

  const handleDisconnected = (reason?: DisconnectReason) => {
    if (suppressDisconnectSignalRef.current) {
      suppressDisconnectSignalRef.current = false;
      return;
    }

    if (reason === DisconnectReason.DUPLICATE_IDENTITY) {
      setError('تم فتح المكالمة من نافذة أو جهاز آخر.');
    } else {
      emitEndOnce('ended');
      if (reason && reason !== DisconnectReason.CLIENT_INITIATED) {
        setError('انقطع اتصال المكالمة. يمكنك المحاولة مرة أخرى.');
      }
    }

    resetCall();
    activeCallIdRef.current = null;
  };

  const handleDecline = () => {
    emitEndOnce('declined');
    resetCall();
    activeCallIdRef.current = null;
  };

  if (!isConsultationOpen) return null;

  if (isCallActive && token) {
    return typeof document !== 'undefined'
      ? createPortal(
          <VideoRoom
            token={token}
            onDisconnect={handleDisconnected}
            onConnected={handleConnected}
            onError={setError}
          />,
          document.body,
        )
      : null;
  }

  if (incomingCall) {
    return (
      <div className="fixed inset-x-4 top-20 z-40 mx-auto max-w-md rounded-2xl border border-blue-200 bg-white p-5 text-right shadow-2xl" dir="rtl">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-blue-100 p-3 text-blue-700">
            <VideoCameraIcon className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900">مكالمة مرئية واردة</p>
            <p className="mt-1 text-sm text-gray-600">الطبيب يدعوك للانضمام إلى المكالمة</p>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            onClick={() => fetchTokenAndJoin('incoming')}
            disabled={isConnecting}
            className="rounded-lg bg-green-600 px-4 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-green-400"
          >
            {isConnecting ? 'جاري الانضمام…' : 'انضمام'}
          </button>
          <button
            onClick={handleDecline}
            disabled={isConnecting}
            className="rounded-lg bg-gray-100 px-4 py-3 text-sm font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            رفض
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <button
        onClick={() => fetchTokenAndJoin('outgoing')}
        disabled={isConnecting}
        className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          isConnecting ? 'cursor-not-allowed bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
        }`}
        dir="rtl"
      >
        {isConnecting ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white" />
            <span>جاري الاتصال…</span>
          </>
        ) : (
          <>
            <VideoCameraIcon className="h-5 w-5" />
            <span>بدء مكالمة مرئية</span>
          </>
        )}
      </button>

      {error && <p className="mt-2 text-right text-xs text-red-600" dir="rtl">{error}</p>}
    </div>
  );
};

export default VideoCallButton;
