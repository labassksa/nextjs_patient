"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "../../../components/common/header";
import ChatMainContents from "../../chat/_components/chatMainContent";
import useSocket from "../../../socket.io/socket.io.initialization";
import { getConsultationById } from "../_controllers/getConsultationById";
import axios from "axios";

interface Message {
  id?: string;
  message: string;
  senderId: number;
  consultationId: number;
  isSent: boolean;
  read: boolean;
}

const ChatPage: React.FC = () => {
  const [status, setStatus] = useState("");
  const [doctorInfo, setDoctorInfo] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const messageEndRef = useRef<HTMLDivElement>(null);
  const websocketURL = process.env.NEXT_PUBLIC_WEBSOCKET_URL || "";
  const consultationId = params.consultationId;

  const token =
    typeof window !== "undefined" ? localStorage.getItem("labass_token") : null;
  const userId =
    typeof window !== "undefined"
      ? localStorage.getItem("labass_userId")
      : null;

  const statusClass = `inline-block px-3 py-1 rounded-full text-xs font-medium ${
    status === "مفتوحة"
      ? "bg-green-100 text-green-700 mb-2"
      : status === "مدفوعة"
      ? "bg-blue-100 text-blue-700"
      : "bg-gray-200 text-gray-700"
  }`;

  useEffect(() => {
    const fetchConsultation = async () => {
      if (!consultationId) return;

      const consultation = await getConsultationById(Number(consultationId));

      if (consultation && consultation.status) {
        setStatus(
          consultation.status === "Paid"
            ? "مدفوعة"
            : consultation.status === "Open"
            ? "مفتوحة"
            : consultation.status
        );

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

    const handleConsultationStatusChange = (data: { status: string }) => {
      setStatus(data.status === "Open" ? "مفتوحة" : data.status);
    };

    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("messageStatus", handleMessageStatus);
    socket.on("consultationStatus", handleConsultationStatusChange);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("messageStatus", handleMessageStatus);
      socket.off("consultationStatus", handleConsultationStatusChange);
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
      };

      setMessages((prevMessages) => [...prevMessages, newFileMessage]);
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
    <div className="flex flex-col h-screen bg-white">
      {/* Fixed header */}
      <div className="fixed top-0 w-full bg-white z-50">
        <Header title="استشارة فورية" showBackButton={true} />
        <div className="text-black mt-16 mb-0 px-4 text-right w-full">
          <h2 className={`${statusClass} mb-1`}>حالة الاستشارة: {status}</h2>
          {doctorInfo ? (
            <div className="p-0 text-right">
              <h3 className="text-sm font-bold mb-0">{`${doctorInfo.user.firstName} ${doctorInfo.user.lastName} :د`}</h3>
              <p className="text-xs text-gray-600 mb-0">{` ${doctorInfo.specialty} :التخصص`}</p>
              <p className="text-xs text-gray-600 mb-2">{` ${doctorInfo.medicalLicenseNumber} :رقم الترخيص الطبي`}</p>
            </div>
          ) : (
            <div className="p-0 text-gray-500 text-right text-sm mb-0">
              بانتظار انضمام الدكتور
            </div>
          )}
        </div>
      </div>

      {/* Chat container */}
      <div className="flex-grow w-full overflow-hidden pt-32">
        {consultationId && (
          <div className="w-full h-full">
            <ChatMainContents
              consultationId={Number(consultationId)}
              showActions={true}
              messages={messages}
              handleSendMessage={handleSendMessage}
            />
            <div ref={messageEndRef} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
