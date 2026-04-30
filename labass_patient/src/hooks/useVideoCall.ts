import { useState, useCallback, useRef } from 'react';
import { Room, ConnectionState, RoomEvent } from 'livekit-client';

interface UseVideoCallProps {
  consultationId: number;
  userId: string;
  socket?: any;
}

interface VideoCallState {
  isInCall: boolean;
  isConnecting: boolean;
  connectionState: ConnectionState;
  error: string | null;
  participants: number;
}

export const useVideoCall = ({ consultationId, userId, socket }: UseVideoCallProps) => {
  const [callState, setCallState] = useState<VideoCallState>({
    isInCall: false,
    isConnecting: false,
    connectionState: ConnectionState.Disconnected,
    error: null,
    participants: 0,
  });

  const roomRef = useRef<Room | null>(null);

  // Sets up the Room object and event listeners — does NOT connect.
  // Connection is delegated to LiveKitRoom (in VideoRoom.tsx).
  const setupRoom = useCallback((): Room => {
    const room = new Room();
    roomRef.current = room;

    room.on(RoomEvent.Connected, () => {
      setCallState(prev => ({
        ...prev,
        isInCall: true,
        isConnecting: false,
        connectionState: ConnectionState.Connected,
      }));

      if (socket) {
        socket.emit("videoCallStarted", {
          room: `${consultationId}`,
          initiatedBy: "patient",
          timestamp: new Date(),
        });
        socket.emit("videoCallJoined", {
          room: `${consultationId}`,
          userId: userId,
          timestamp: new Date(),
        });
      }
    });

    room.on(RoomEvent.Disconnected, () => {
      setCallState(prev => ({
        ...prev,
        isInCall: false,
        isConnecting: false,
        connectionState: ConnectionState.Disconnected,
      }));
    });

    room.on(RoomEvent.ParticipantConnected, () => {
      setCallState(prev => ({
        ...prev,
        participants: room.remoteParticipants.size + 1,
      }));
    });

    room.on(RoomEvent.ParticipantDisconnected, () => {
      setCallState(prev => ({
        ...prev,
        participants: room.remoteParticipants.size + 1,
      }));
    });

    room.on(RoomEvent.Reconnecting, () => {
      setCallState(prev => ({ ...prev, connectionState: ConnectionState.Reconnecting }));
    });

    return room;
  }, [consultationId, userId, socket]);

  const endCall = useCallback(async () => {
    try {
      if (roomRef.current) {
        await roomRef.current.disconnect();
        roomRef.current = null;
      }

      setCallState(prev => ({
        ...prev,
        isInCall: false,
        isConnecting: false,
        connectionState: ConnectionState.Disconnected,
        participants: 0,
      }));

      if (socket) {
        socket.emit("videoCallEnded", {
          room: `${consultationId}`,
          endedBy: "patient",
          timestamp: new Date(),
        });
      }
    } catch (error) {
      console.error('Failed to end video call:', error);
    }
  }, [consultationId, socket]);

  const toggleAudio = useCallback(async () => {
    if (roomRef.current?.localParticipant) {
      const enabled = roomRef.current.localParticipant.isMicrophoneEnabled;
      await roomRef.current.localParticipant.setMicrophoneEnabled(!enabled);
    }
  }, []);

  const toggleVideo = useCallback(async () => {
    if (roomRef.current?.localParticipant) {
      const enabled = roomRef.current.localParticipant.isCameraEnabled;
      await roomRef.current.localParticipant.setCameraEnabled(!enabled);
    }
  }, []);

  return {
    callState,
    room: roomRef.current,
    setupRoom,
    endCall,
    toggleAudio,
    toggleVideo,
  };
};
