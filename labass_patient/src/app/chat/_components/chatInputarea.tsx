"use client";
import React, { useState, useRef } from "react";

interface StickyMessageInputProps {
  onSendMessage: (messageText: string, file?: File) => void;
}

const StickyMessageInput: React.FC<StickyMessageInputProps> = ({
  onSendMessage,
}) => {
  const [inputFocused, setInputFocused] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined); // State for file input
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = () => {
    setInputFocused(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSend = () => {
    if (message.trim() !== "" || selectedFile) {
      // If a file is selected, the file will be sent instead of the message
      onSendMessage(message, selectedFile);
      setMessage(""); // Clear the input field after sending the message
      setSelectedFile(undefined); // Clear the file input after sending
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || undefined);

    // Update the input field to show the file name
    if (file) {
      setMessage(file.name); // Show the file name in the input field
    } else {
      setMessage(""); // Clear the input field if no file is selected
    }
  };

  const handleRemoveAttachment = () => {
    setSelectedFile(undefined);
    setMessage(""); // Clear the message input if attachment is removed
  };

  return (
    <div className="sticky bottom-0 bg-white p-4 flex items-center border-t">
      {/* Plus Button */}
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

      {/* Mic Button */}
      <button className="p-2 mx-2">
        <svg
          className="w-6 h-6 text-gray-500"
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

      {/* Message or Attachment Display */}
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
        readOnly={!!selectedFile} // Make input read-only if a file is selected
      />

      {selectedFile && (
        <button
          className="ml-2 p-2 text-red-500"
          onClick={handleRemoveAttachment}
        >
          Remove
        </button>
      )}

      {/* Send Button */}
      <button
        className={`p-2 ${inputFocused ? "text-green-500" : "text-gray-500"}`}
        onClick={handleSend}
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
    </div>
  );
};

export default StickyMessageInput;
