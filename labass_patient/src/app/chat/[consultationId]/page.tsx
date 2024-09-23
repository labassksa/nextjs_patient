"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "../../../components/common/header";
import ChatMainContents from "../../chat/_components/chatMainContent";
import useSocket from "../../../socket.io/socket.io.initialization";
import { getConsultationById } from "../_controllers/getConsultationById";
import { ConsultationStatus } from "../../../models/consultation";

interface Message {
  id?: string;
  message: string;
  senderId: number;
  consultationId: number;
  isSent: boolean;
  read: boolean;
}

const ChatPage: React.FC = () => {
  const [status, setStatus] = useState(""); // Initial status
  const [doctorInfo, setDoctorInfo] = useState<any>(null); // Doctor information
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true); // Loading state for messages
  const router = useRouter(); // Initialize router for redirection
  const params = useParams(); // Extract dynamic params from the URL
  // Use environment variable for the backend URL
  const websocketURL = process.env.NEXT_WEBSOCKET_URL || "";
  const consultationId = params.consultationId; // Retrieve consultationId from the URL

  // Retrieve JWT token and userId from localStorage
  const token =
    typeof window !== "undefined" ? localStorage.getItem("labass_token") : null;
  const userId =
    typeof window !== "undefined"
      ? localStorage.getItem("labass_userId")
      : null;

  // Apply appropriate style based on status
  const statusClass = `inline-block px-3 py-1 rounded-full text-xs font-medium ${
    status === "مفتوحة"
      ? "bg-green-100 text-green-700 mb-2"
      : status === "مدفوعة"
      ? "bg-blue-100 text-blue-700"
      : "bg-gray-200 text-gray-700"
  }`;

  // Fetch the consultation details (including status and doctor info)
  useEffect(() => {
    const fetchConsultation = async () => {
      if (!consultationId) return;

      const consultation = await getConsultationById(Number(consultationId));

      if (consultation && consultation.status) {
        // Map the status from the response to the Arabic status labels
        setStatus(
          consultation.status === "Paid"
            ? "مدفوعة"
            : consultation.status === "Open"
            ? "مفتوحة"
            : consultation.status
        );

        // Set doctor info if available
        if (consultation.doctor && consultation.doctor.user) {
          setDoctorInfo(consultation.doctor);
        } else {
          setDoctorInfo(null); // Set to null if doctor has not joined
        }
      }
    };

    fetchConsultation();
  }, [consultationId]);

  // Redirect to login if token or userId is missing
  useEffect(() => {
    if (!token || !userId || !consultationId) {
      router.push("/login");
    }
  }, [token, userId, consultationId, router]);

  // Initialize socket if token and userId exist
  const { socket, isConnected } = useSocket(websocketURL, token || "");

  useEffect(() => {
    if (!socket || !userId || !consultationId) return;

    // Join the room dynamically based on consultationId
    socket.emit("joinRoom", { room: `${consultationId}` });

    // Load previous messages from the server
    socket.emit(
      "loadMessages",
      { consultationId },
      (loadedMessages: Message[]) => {
        setMessages(loadedMessages);
        setLoading(false); // Stop loading once messages are fetched
      }
    );

    // Handle new messages received via socket
    const handleReceiveMessage = (newMessage: Message) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      // Emit acknowledgment to mark the message as read
      if (newMessage.senderId !== Number(userId)) {
        socket.emit("messageReceived", { messageId: newMessage.id });
      }
    };

    // Handle read status update for the patient’s sent messages
    const handleMessageStatus = ({
      messageId,
      read,
    }: {
      messageId: string;
      read: boolean;
    }) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === messageId ? { ...msg, read: read } : msg
        )
      );
    };

    // Handle consultationStatus event and update status
    const handleConsultationStatusChange = (data: { status: string }) => {
      setStatus(data.status === "Open" ? "مفتوحة" : data.status);
    };

    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("messageStatus", handleMessageStatus);
    socket.on("consultationStatus", handleConsultationStatusChange);

    // Cleanup: Remove socket listener when component unmounts
    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("messageStatus", handleMessageStatus);
      socket.off("consultationStatus", handleConsultationStatusChange);
    };
  }, [socket, userId, consultationId]);

  const handleSendMessage = (messageText: string) => {
    if (!isConnected || !socket || !userId) {
      console.error(
        "Socket is not connected or userId is missing. Message cannot be sent."
      );
      return;
    }

    // Prepare the message data to send without an ID
    const newMessage: Message = {
      message: messageText,
      senderId: Number(userId),
      consultationId: Number(consultationId),
      isSent: false,
      read: false,
    };

    // Optimistically add the message locally
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    // Send the message via socket
    socket.emit(
      "sendMessage",
      {
        room: `${consultationId}`,
        message: messageText,
        consultationId: Number(consultationId),
        senderId: Number(userId),
      },
      (response: { messageId: string }) => {
        // Update the message with the correct ID and mark as sent
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg === newMessage
              ? { ...msg, id: response.messageId, isSent: true }
              : msg
          )
        );
      }
    );
  };

  // Loading spinner to display while messages are being loaded
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div
          className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full"
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      <Header title="استشارة فورية" showBackButton={true} />
      {/* Add top padding to ensure content starts below the header */}
      <div className="text-black mt-16 mb-0 px-4 text-right">
        {" "}
        {/* Adjusted margin */}
        <h2 className={`${statusClass} mb-1`}>حالة الاستشارة: {status}</h2>{" "}
        {/* Reduced margin below the status */}
        {/* Doctor Information or Waiting Message */}
        {doctorInfo ? (
          <div className="p-0 text-right">
            {" "}
            {/* Removed padding */}
            <h3 className="text-sm font-bold mb-0">{`${doctorInfo.user.firstName} ${doctorInfo.user.lastName} :د`}</h3>{" "}
            {/* Removed margin */}
            <p className="text-xs text-gray-600 mb-0">{` ${doctorInfo.specialty} :التخصص`}</p>{" "}
            {/* Removed margin */}
            <p className="text-xs text-gray-600 mb-2">{` ${doctorInfo.medicalLicenseNumber} :رقم الترخيص الطبي`}</p>{" "}
            {/* Removed margin */}
          </div>
        ) : (
          <div className="p-0 text-gray-500 text-right text-sm mb-0">
            {" "}
            {/* Removed padding and margin */}
            بانتظار انضمام الدكتور
          </div>
        )}
      </div>

      {consultationId && (
        <ChatMainContents
          consultationId={Number(consultationId)}
          showActions={true}
          messages={messages}
          handleSendMessage={handleSendMessage}
        />
      )}
    </div>
  );
};

export default ChatPage;
