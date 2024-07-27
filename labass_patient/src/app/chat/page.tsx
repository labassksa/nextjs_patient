"use client";
import React, { useState, useEffect } from "react";
import Header from "../../components/common/header";
import ChatMainContents from "./_components/chatMainContent";
import useSocket from "../../socket.io/socket.io.initialization";

interface Message {
  id: number;
  message: string;
  senderId: number;
  consultationId: number;
  isSent: boolean;
  read: boolean;
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { socket, isConnected } = useSocket("http://localhost:4000");

  const consultationId = 3; // Fixed consultationId for simplicity and testing
  const userId = 2; // Example userId for patient, adjust as needed

  useEffect(() => {
    if (!socket) return;

    console.log("Socket initialized:", socket);

    // Join the room
    socket.emit("joinRoom", { room: `${consultationId}` });

    const handleReceiveMessage = (newMessage: Message) => {
      console.log("Received message:", newMessage);

      setMessages((prevMessages) => {
        if (newMessage.senderId === userId) {
          // Replace the existing message with the new one if it was sent by the current user
          return prevMessages.map((msg) =>
            msg.id === newMessage.id ? newMessage : msg
          );
        } else {
          // Add the new message to the state if it was not sent by the current user and does not already exist
          const existingMessageIndex = prevMessages.findIndex((msg) => msg.id === newMessage.id);
          if (existingMessageIndex === -1) {
            return [...prevMessages, newMessage];
          } else {
            return prevMessages;
          }
        }
      });

      // Emit messageReceived only if the senderId is different from userId
      if (newMessage.senderId !== userId) {
        socket.emit("messageReceived", { messageId: newMessage.id });
      }
    };

    const handleMessageStatus = ({
      messageId,
      read,
    }: {
      messageId: number;
      read: boolean;
    }) => {
      console.log(`Message ${messageId} status updated to read: ${read}`);
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === messageId ? { ...msg, read: read } : msg
        )
      );
    };

    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("messageStatus", handleMessageStatus);

    return () => {
      console.log("Cleaning up socket listeners");
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("messageStatus", handleMessageStatus);
    };
  }, [socket]);

  const handleSendMessage = (messageText: string) => {
    if (!isConnected || !socket) {
      console.error("Socket is not connected. Message cannot be sent.");
      return;
    }

    const newMessage: Message = {
      id: messages.length + 1,
      message: messageText,
      senderId: userId,
      consultationId: consultationId,
      isSent: false,
      read: false,
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    console.log("Emitting sendMessage event with data:", {
      room: `${consultationId}`,
      message: messageText,
      consultationId: consultationId,
      senderId: userId,
    });

    socket.emit(
      "sendMessage",
      {
        room: `${consultationId}`,
        message: messageText,
        consultationId: consultationId,
        senderId: userId,
      },
      (response: { messageId: number }) => {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === newMessage.id ? { ...msg, id: response.messageId, isSent: true } : msg
          )
        );
      }
    );
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <Header title="استشارة فورية" showBackButton={true} />
      <ChatMainContents
        consultationId={consultationId}
        showActions={true}
        messages={messages}
        handleSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default ChatPage;
