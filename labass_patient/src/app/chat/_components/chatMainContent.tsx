"use client";
import React, { useEffect } from "react";
import StickyMessageInput from "./chatInputarea";

interface Message {
  message?: string; // Text message (optional if an attachment exists)
  senderId: number;
  consultationId: number;
  isSent: boolean;
  read: boolean;
  attachmentUrl?: string; // URL for the attachment (image or file)
  attachmentType?: string; // Type of attachment (e.g., "images", "pdf", etc.)
}

interface ChatMainContentsProps {
  consultationId: number;
  showActions: boolean;
  messages: Message[];
  handleSendMessage: (messageText: string, fileMessage?: any) => void;
}

const ChatMainContents: React.FC<ChatMainContentsProps> = ({
  consultationId,
  showActions,
  messages,
  handleSendMessage,
}) => {
  useEffect(() => {
    console.log("Consultation ID:", consultationId);
  }, [consultationId]);

  // Retrieve the current userId from localStorage
  const userId =
    typeof window !== "undefined"
      ? localStorage.getItem("labass_userId")
      : null;

  return (
    <div className="flex flex-col h-full bg-gray-100 text-black relative">
      <div
        className="flex-grow overflow-y-auto p-4 bg-gray-100 text-xs mt-0"
        dir="rtl"
      >
        {messages.map((message, index) => (
          <div
            key={index} // Use index as key if no unique ID is provided
            dir="rtl"
            className={`mb-2 p-2 rounded-lg max-w-xs ${
              message.senderId === Number(userId)
                ? "bg-custom-background"
                : "bg-white"
            }`}
          >
            {/* Check if the message contains an attachment */}
            {message.attachmentUrl ? (
              message.attachmentType === "images" ? (
                <img
                  src={message.attachmentUrl}
                  alt="attachment"
                  className="w-full h-auto mb-2 rounded"
                />
              ) : (
                <a
                  href={message.attachmentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  View Attachment
                </a>
              )
            ) : (
              <p>{message.message}</p> // If there's no attachment, show the text message
            )}

            {/* Only show checkmarks for the sender */}
            {message.senderId === Number(userId) && (
              <div className="text-right">
                {message.isSent && (
                  <svg
                    className={`w-4 h-4 mt-1 ${
                      message.read ? "text-green-600" : "text-gray-500"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      {showActions && <StickyMessageInput onSendMessage={handleSendMessage} />}
    </div>
  );
};

export default ChatMainContents;
