"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Header from "../../../components/common/header";
import ChatMainContents from "../../chat/_components/chatMainContent";
import StickyMessageInput from "../../chat/_components/chatInputarea";
import useSocket from "../../../socket.io/socket.io.initialization";
import { getConsultationById } from "../_controllers/getConsultationById";
import { ConsultationStatus, Consultation } from "../../../models/consultation";
import { getMagicLink } from "../_controllers/getMAgicLink";
import { requestFollowUp } from "../../myConsultations/_controllers/myConsultations";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

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
  const [isConsultationLoaded, setIsConsultationLoaded] = useState(false);
  const [hasValidConsultation, setHasValidConsultation] = useState(false);
  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [followUpLoading, setFollowUpLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const router = useRouter();
  const params = useParams();
  const messageEndRef = useRef<HTMLDivElement>(null);
  const consultationId = Number(params.consultationId);
  const websocketURL = process.env.NEXT_PUBLIC_WEBSOCKET_URL || "";
  const searchParams = useSearchParams();
  let tokenUUID = searchParams.get("tokenUUID");
  const userId =
    typeof window !== "undefined" ? localStorage.getItem("labass_userId") : "";

  if (!tokenUUID && typeof window !== "undefined") {
    tokenUUID = localStorage.getItem("labass_tokenUUID") || "";
  }
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
    const handleMagicLinkFlow = async () => {
      if (tokenUUID) {
        try {
          console.log("  Using magic link flow.");
          const response = await getMagicLink(
            tokenUUID,
            Number(consultationId)
          );

          console.log("Magic link response:", response);
          const { tokenJWT, consultation } = response;

          // Save tokenJWT and user ID to localStorage
          localStorage.setItem("labass_token", tokenJWT);
          localStorage.setItem("labass_userId", consultation.patient.user.id);

          // Set consultation status and doctor info
          setStatus(consultation.status);
          setDoctorInfo(consultation.doctor || null);
          setHasValidConsultation(true);
          setIsConsultationLoaded(true);
        } catch (error) {
          console.error("Error during magic link validation:", error || error);
          alert(error || "An error occurred while processing the magic link.");
          router.push("/login");
        }
      } else {
        console.log("Checking for normal flow token.");
        const tokenJWT = localStorage.getItem("labass_token");
        const userId = localStorage.getItem("labass_userId");

        if (!tokenJWT || !userId) {
          console.warn(
            "Missing tokenJWT or userId in localStorage. Redirecting to login."
          );
          router.push("/login");
          return;
        }

        console.log(
          "Token found in localStorage. Proceeding with normal flow."
        );
        setIsConsultationLoaded(true);
      }
    };

    handleMagicLinkFlow();
  }, [tokenUUID, consultationId, router]);

  useEffect(() => {
    const fetchConsultation = async () => {
      if (!consultationId || !isConsultationLoaded) {
        console.warn("Cannot fetch consultation without a valid token.");
        return;
      }

      console.log("Fetching consultation details for ID:", consultationId);
      const consultationData = await getConsultationById(Number(consultationId));

      if (consultationData && consultationData.status) {
        setStatus(consultationData.status);
        setConsultation(consultationData);
        console.log("Consultation status:", consultationData.status);
        console.log("Full consultation data:", consultationData);
        console.log("canSendFollowUp flag:", consultationData.canSendFollowUp);
        console.log("isFollowUp flag:", consultationData.isFollowUp);
        if (consultationData.doctor && consultationData.doctor.user) {
          setDoctorInfo(consultationData.doctor);
          console.log("Doctor info set:", consultationData.doctor);
        } else {
          setDoctorInfo(null);
          console.log("No doctor info available.");
        }
        setHasValidConsultation(true);
        setLoading(false);
      } else {
        console.warn("Failed to fetch consultation. Redirecting to login.");
        router.push("/login");
      }
    };

    if (consultationId && isConsultationLoaded) {
      fetchConsultation();
    }
  }, [consultationId, isConsultationLoaded, router]);

  console.log("TokenUUID after fallback check:", tokenUUID);
  console.log("Initial userId:", userId);
  console.log("Consultation ID:", consultationId);

  console.log("WebSocket URL:", websocketURL);

  const { socket, isConnected } = useSocket(websocketURL, tokenUUID || "");

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

  const handleFollowUpRequest = async () => {
    setFollowUpLoading(true);
    try {
      await requestFollowUp(consultationId);
      setShowSuccessModal(true);
    } catch (error: any) {
      alert(error.message || "حدث خطأ أثناء إرسال طلب الاستشارة المتابعة.");
      console.error("Error requesting follow-up:", error);
    } finally {
      setFollowUpLoading(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    // Optionally refresh the consultation
    window.location.reload();
  };

  if (loading || !hasValidConsultation) {
    console.log("Loading consultation page...");
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
      <div className="sticky top-0 w-full bg-white z-50">
        <Header title="استشارة فورية" showBackButton={true} />
        <div className="text-black mb-0 mt-16 px-4 text-right w-full">
          <h2
            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
              status === ConsultationStatus.Open
                ? "bg-green-100 text-green-700 mb-1"
                : status === ConsultationStatus.Paid
                ? "bg-blue-100 text-blue-700 mb-1"
                : status === ConsultationStatus.Closed
                ? "bg-red-100 text-red-700 mb-1"
                : "bg-gray-200 text-gray-700 mb-1"
            }`}
          >
            حالة الاستشارة:
            {getStatusDisplay(status)}
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

      <div className="flex-grow overflow-y-auto" style={{ paddingBottom: consultation?.canSendFollowUp ? '120px' : '0px' }}>
        <ChatMainContents
          consultationId={Number(consultationId)}
          messages={messages}
        />
        <div ref={messageEndRef} />
      </div>

      {/* Follow-up Button */}
      {consultation?.canSendFollowUp && (
        <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40">
          <button
            className="w-full py-3 text-sm font-semibold text-white bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none"
            onClick={handleFollowUpRequest}
            disabled={followUpLoading}
          >
            {followUpLoading ? "جاري الإرسال..." : "طلب استشارة"}
          </button>
        </div>
      )}

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

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 mx-4 max-w-sm w-full">
            <div className="text-center">
              <CheckCircleIcon className="text-green-500 w-24 h-24 mx-auto mb-4" />
              <p className="text-lg font-semibold text-black mb-2">تم الإرسال بنجاح</p>
              <p className="text-gray-600 text-sm mb-6" dir="rtl">
                انقر على الرابط المرسل الى رقم جوالك للتواصل مع الطبيب
              </p>
              
              <button
                onClick={handleSuccessModalClose}
                className="p-3 w-full text-sm font-bold bg-green-500 text-white rounded-lg hover:bg-green-600"
                dir="rtl"
              >
                موافق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
