"use client";
import React, { useState, useRef } from "react";
import axios from "axios";

interface StickyMessageInputProps {
  onSendMessage: (messageText: string, fileMessage?: any) => void; // Handle both text and file messages
  consultationId: number; // Ensure consultationId is passed down
}

const StickyMessageInput: React.FC<StickyMessageInputProps> = ({
  onSendMessage,
  consultationId,
}) => {
  const [inputFocused, setInputFocused] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // State for file input
  const [isModalOpen, setIsModalOpen] = useState(false); // State to show or hide modal
  const [isUploading, setIsUploading] = useState(false); // State to show spinner
  const [isRecording, setIsRecording] = useState(false); // State for voice recording
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null); // Store recorded audio blob
  const [recordingMessage, setRecordingMessage] = useState(""); // Visual recording indication

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]); // To store audio chunks while recording
  const inputRef = useRef<HTMLInputElement>(null);
  const token = localStorage.getItem("labass_token");
  const userId = localStorage.getItem("labass_userId");

  const handleFocus = () => {
    setInputFocused(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Handle file selection (e.g., image, document)
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file); // Store the selected file
      setIsModalOpen(true); // Open the modal when a file is selected
    }
  };

  const handleSendFile = async () => {
    if (selectedFile) {
      setIsUploading(true); // Show spinner while uploading

      // Handle file upload logic here
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append(
        "senderId",
        String(Number(localStorage.getItem("labass_userId")))
      ); // Use localStorage for senderId
      formData.append("consultationId", String(Number(consultationId))); // Use localStorage for consultationId

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/upload-consultation-attatchment`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("labass_token")}`, // JWT token
            },
          }
        );

        // Pass the response to the parent component to update chat
        onSendMessage(message, response.data.chat);

        // Clear file and close modal
        setSelectedFile(null);
        setIsModalOpen(false);
        setIsUploading(false); // Hide spinner after upload
      } catch (error) {
        console.error("File upload failed:", error);
        setIsUploading(false); // Hide spinner on error
      }
    }
  };

  // Handle voice recording start
  // Handle voice recording start
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data); // Collect audio chunks
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingMessage("Recording..."); // UI feedback
    } catch (error) {
      console.error("Voice recording failed:", error);
      setRecordingMessage("Recording failed. Please try again.");
    }
  };

  // Handle voice recording stop and upload
  const stopRecording = async () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      mediaRecorderRef.current.onstop = async () => {
        // Create the Blob from the audio chunks
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });

        if (audioBlob) {
          setIsUploading(true); // Show spinner while uploading

          const formData = new FormData();
          formData.append("file", audioBlob, "voice_note.webm");
          formData.append("senderId", String(Number(userId)));
          formData.append("consultationId", String(consultationId));

          try {
            console.log(
              "API URL:",
              `${process.env.NEXT_PUBLIC_API_URL}/upload-consultation-attachment`
            );
            const response = await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}/upload-consultation-attachment`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                  Authorization: `Bearer ${token}`, // JWT token
                },
              }
            );

            // Send the voice note to the parent
            onSendMessage("", response.data.chat);
            setIsUploading(false); // Hide spinner
          } catch (error) {
            console.error("Voice note upload failed: ", error ? error : error);
            setIsUploading(false); // Hide spinner on error
          }
        }
      };
    }
  };

  const handleCancelFile = () => {
    setSelectedFile(null); // Clear the selected file
    setIsModalOpen(false); // Close the modal without sending
  };

  return (
    <div className="sticky bottom-0 bg-white p-4 flex items-center border-t">
      {/* Plus Button for File Upload */}
      <button className="p-2">
        <input
          type="file"
          onChange={handleFileChange}
          className="hidden"
          id="file-input"
        />
        <label htmlFor="file-input">
          <svg
            className="w-6 h-6 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            ></path>
          </svg>
        </label>
      </button>

      {/* Mic Button for Voice Recording */}
      <button
        className="p-2 mx-2"
        onMouseDown={startRecording} // Start recording on mouse down
        onMouseUp={stopRecording} // Stop recording on mouse up
      >
        <svg
          className={`w-6 h-6 ${
            isRecording ? "text-red-500" : "text-gray-500"
          }`} // Change color while recording
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 10V12C19 13.8565 18.2625 15.637 16.9497 16.9497C15.637 18.2625 13.8565 19 12 19M12 19C10.1435 19 8.36301 18.2625 7.05025 16.9497C5.7375 15.637 5 13.8565 5 12V10M12 19V23M8 23H16M12 1C11.2044 1 10.4413 1.31607 9.87868 1.87868C9.31607 2.44129 9 3.20435 9 4V12C9 12.7956 9.31607 13.5587 9.87868 14.1213C10.4413 14.6839 11.2044 15 12 15C12.7956 15 13.5587 14.6839 14.1213 14.1213C14.6839 13.5587 15 12.7956 15 12V4C15 3.20435 14.6839 2.44129 14.1213 1.87868C13.5587 1.31607 12.7956 1 12 1Z" />
        </svg>
      </button>

      {/* Message Input */}
      <input
        ref={inputRef}
        type="text"
        dir="rtl"
        placeholder="اكتب رسالة..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-grow p-2 border rounded-full outline-none text-sm"
        onFocus={handleFocus}
        onBlur={() => setInputFocused(false)}
      />

      {/* Send Button for Text Messages */}
      <button
        className={`p-2 ${inputFocused ? "text-green-500" : "text-gray-500"}`}
        onClick={() => onSendMessage(message, null)} // Send text message
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path
            d="M2.5 12.5L21.5 3.5L14.5 12.5L21.5 21.5L2.5 12.5Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Modal to display the selected attachment */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg max-w-lg w-full">
            <h2 className="text-md text-right font-bold mb-2">إضافة مرفقات</h2>

            {/* Preview the attachment */}
            {selectedFile?.type.startsWith("image/") ? (
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Selected Attachment"
                className="w-full h-auto mb-4"
              />
            ) : (
              <p className="text-sm mb-4">
                Selected File: {selectedFile?.name}
              </p>
            )}

            <div className="flex justify-end space-x-4">
              {/* Cancel Button */}
              <button
                className="bg-red-500 text-white text-xs px-4 py-2 rounded"
                onClick={handleCancelFile}
              >
                إلغاء
              </button>

              {/* Send Button */}
              <button
                className="bg-custom-green text-white text-xs px-4 py-2 rounded"
                onClick={handleSendFile} // Trigger the file upload logic
              >
                {isUploading ? <div className="spinner"></div> : "إرسال"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StickyMessageInput;
