"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "../../../components/common/header";
import ChatMainContents from "../../chat/_components/chatMainContent";
import StickyMessageInput from "../../chat/_components/chatInputarea"; // Import StickyMessageInput
import useSocket from "../../../socket.io/socket.io.initialization";
import { getConsultationById } from "../_controllers/getConsultationById";
import { ConsultationStatus } from "@/models/consultation";

interface Message {
  id?: string;
  message: string;
  senderId: number;
  consultationId: number;
  isSent: boolean;
  read: boolean;
  attachmentUrl?: string;
  attachmentType?: string;
  recordedTime?: number;
}

const ChatPage: React.FC = () => {
  const [status, setStatus] = useState("");
  const [doctorInfo, setDoctorInfo] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const messageEndRef = useRef<HTMLDivElement>(null);
  const consultationId = params.consultationId;
  const websocketURL = process.env.NEXT_PUBLIC_WEBSOCKET_URL || "";
  const token = localStorage.getItem("labass_token");
  const userId =
    typeof window !== "undefined" ? localStorage.getItem("labass_userId") : "";

  const statusClass = `inline-block px-3 py-1 rounded-full text-xs font-medium ${
    status === ConsultationStatus.Open
      ? "bg-green-100 text-green-700 mb-1"
      : status === ConsultationStatus.Paid
      ? "bg-blue-100 text-blue-700 mb-1"
      : status === ConsultationStatus.Closed
      ? "bg-red-100 text-red-700 mb-1"
      : "bg-gray-200 text-gray-700 mb-1"
  }`;

  useEffect(() => {
    const fetchConsultation = async () => {
      if (!consultationId) return;

      const consultation = await getConsultationById(Number(consultationId));

      if (consultation && consultation.status) {
        setStatus(consultation.status); // Set the status code directly
        // No need to translate here
        if (consultation.doctor && consultation.doctor.user) {
          setDoctorInfo(consultation.doctor);
        } else {
          setDoctorInfo(null);
        }
      }
    };

    fetchConsultation();
  }, [consultationId]);

  useEffect(() => {
    if (!token || !userId || !consultationId) {
      router.push("/login");
    }
  }, [token, userId, consultationId, router]);

  const { socket, isConnected } = useSocket(websocketURL, token || "");
  const getStatusDisplay = (statusCode: string) => {
    switch (statusCode) {
      case ConsultationStatus.Paid:
        return "مدفوعة";
      case ConsultationStatus.Open:
        return "مفتوحة";
      case ConsultationStatus.Closed:
        return "مغلقة";
      default:
        return "getStatusDisplay"; // Default case for unknown statuses
    }
  };

  useEffect(() => {
    if (!socket || !userId || !consultationId) return;

    socket.emit("joinRoom", { room: `${consultationId}` });

    socket.emit(
      "loadMessages",
      { consultationId },
      (loadedMessages: Message[]) => {
        setMessages(loadedMessages);
        setLoading(false);
      }
    );

    const handleReceiveMessage = (newMessage: Message) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      if (newMessage.senderId !== Number(userId)) {
        socket.emit("messageReceived", { messageId: newMessage.id });
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);

    // Listen for the message status (read status) update
    const handleMessageStatus = ({
      messageId,
      read,
    }: {
      messageId: string;
      read: boolean;
    }) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === messageId ? { ...msg, read } : msg
        )
      );
    };
    socket.on("messageStatus", handleMessageStatus);

    // New listener for consultation status updates
    const handleConsultationStatus = (status: ConsultationStatus): string => {
      let newStatus = "";

      switch (status) {
        case ConsultationStatus.Paid:
          newStatus = ConsultationStatus.Paid;
          break;
        case ConsultationStatus.Open:
          newStatus = ConsultationStatus.Open;
          break;
        case ConsultationStatus.Closed:
          newStatus = ConsultationStatus.Closed;
          break;
        case ConsultationStatus.PendingPayment:
          newStatus = ConsultationStatus.PendingPayment;
          break;
        case ConsultationStatus.Failed:
          newStatus = ConsultationStatus.Failed;
          break;
        default:
          newStatus = "ملغاة"; // Fallback for unknown or canceled statuses
          break;
      }

      return newStatus;
    };

    // Listening to the consultationStatus event
    socket.on("consultationStatus", (data) => {
      // Handle consultation status update
      const newStatus = handleConsultationStatus(data.status);
      setStatus(newStatus);
    });

    // New listener for doctor info updates
    socket.on("doctorInfo", (data) => {
      setDoctorInfo(data.doctorInfo); // Assuming doctorInfo is structured correctly in your state
    });
    // Listener for uploaded attachments

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("consultationStatus"); // Clean up the consultation status listener
      socket.off("doctorInfo"); // Clean up the doctor info listener
      socket.off("messageStatus", handleMessageStatus); // Cleanup messageStatus listener
    };
  }, [socket, userId, consultationId]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = (messageText: string, fileMessage?: any) => {
    if (!isConnected || !socket || !userId) {
      console.error(
        "Socket is not connected or userId is missing. Message cannot be sent."
      );
      return;
    }
    if (fileMessage) {
      const newFileMessage = {
        message: "",
        senderId: Number(userId),
        consultationId: Number(consultationId),
        isSent: true,
        read: false,
        attachmentUrl: fileMessage.attachmentUrl,
        attachmentType: fileMessage.attachmentType,
        recordedTime: fileMessage.recordedTime,
      };

      setMessages((prevMessages) => [...prevMessages, newFileMessage]);
      // Emit the sendMessage event with file information
      socket.emit(
        "sendMessage",
        {
          room: `${consultationId}`,
          message: "", // No text for file message
          consultationId: Number(consultationId),
          senderId: Number(userId),
          attachmentUrl: fileMessage.attachmentUrl,
          attachmentType: fileMessage.attachmentType,
          recordedTime: fileMessage.recordedTime,
        },
        (response: { messageId: string }) => {
          // Update message with the correct messageId once confirmed by the backend
          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg === newFileMessage
                ? { ...msg, id: response.messageId, isSent: true }
                : msg
            )
          );
        }
      );
    } else {
      const newMessage: Message = {
        message: messageText,
        senderId: Number(userId),
        consultationId: Number(consultationId),
        isSent: false,
        read: false,
      };

      setMessages((prevMessages) => [...prevMessages, newMessage]);

      socket.emit(
        "sendMessage",
        {
          room: `${consultationId}`,
          message: messageText,
          consultationId: Number(consultationId),
          senderId: Number(userId),
        },
        (response: { messageId: string }) => {
          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg === newMessage
                ? { ...msg, id: response.messageId, isSent: true }
                : msg
            )
          );
        }
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center bg-gray-200 h-screen">
        <div
          className="spinner border-t-transparent border-gray-500 animate-spin inline-block w-8 h-8 border-4 rounded-full"
          role="status"
        ></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Fixed header */}
      <div className="sticky top-0 w-full bg-white z-50">
        <Header title="استشارة فورية" showBackButton={true} />
        <div className="text-black mb-0 mt-16 px-4 text-right w-full">
          <h2 className={`${statusClass}`}>
            حالة الاستشارة:{getStatusDisplay(status)}{" "}
          </h2>
          {doctorInfo ? (
            <div className="p-0 text-right mb-0">
              <h3 className="text-sm font-bold mb-0">{`${doctorInfo.user.firstName} ${doctorInfo.user.lastName} :د`}</h3>
              <p className="text-xs text-gray-600 mb-0">{` ${doctorInfo.specialty} :التخصص`}</p>
              <p className="text-xs text-gray-600">{` ${doctorInfo.medicalLicenseNumber} :رقم الترخيص الطبي`}</p>
            </div>
          ) : (
            <div className="p-0 text-gray-500 text-right text-sm mb-0">
              بانتظار انضمام الدكتور
            </div>
          )}
        </div>
      </div>

      {/* ChatMainContents is scrollable */}
      <div className="flex-grow overflow-y-auto">
        <ChatMainContents
          consultationId={Number(consultationId)}
          messages={messages}
        />
        <div ref={messageEndRef} />
      </div>

      {/* StickyMessageInput is fixed at the bottom */}
      <div className="shrink-0 fixed bottom-0 w-full bg-white">
        <StickyMessageInput
          onSendMessage={handleSendMessage}
          consultationId={Number(consultationId)}
          isConsultationOpenOrPaid={
            status === ConsultationStatus.Open ||
            status === ConsultationStatus.Paid
          }
        />
      </div>
    </div>
  );
};

export default ChatPage;
