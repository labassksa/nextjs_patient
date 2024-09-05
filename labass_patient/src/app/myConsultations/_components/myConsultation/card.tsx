import React from "react";
import { Consultation } from "../../../../models/consultation";
import {
  Person2Outlined,
  Person2Rounded,
  NewspaperSharp,
  ChatBubble,
} from "@mui/icons-material";
import {
  ChatBubbleLeftEllipsisIcon,
  ChatBubbleLeftRightIcon,
  ChatBubbleOvalLeftIcon,
} from "@heroicons/react/24/solid";

interface ConsultationCardProps {
  consultation: Consultation;
  onSelect: (id: number) => void;
  onChatClick: (id: number) => void;
}

const ConsultationCard: React.FC<ConsultationCardProps> = ({
  consultation,
  onSelect,
  onChatClick,
}) => {
  const handleSelect = () => onSelect(consultation.id);
  const handleChatClick = () => onChatClick(consultation.id);

  // Parse and format the createdAt date and time
  const formattedDateTime = new Date(consultation.createdAt).toLocaleString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // Use 12-hour clock (AM/PM)
    }
  );

  return (
    <div
      onClick={handleSelect}
      className="flex p-2 m-2 rounded-lg border shadow border-gray-300 bg-white"
    >
      <div className="w-full flex flex-col justify-between" dir="rtl">
        <div className="flex flex-row justify-between mb-2">
          <div className="flex flex-row">
            <Person2Rounded className="text-gray-400" />
            <h3 className="font-bold text-md text-black" dir="rtl">
              {`د. ${consultation.patient.user.firstName || ""} ${
                consultation.id
              }`}
            </h3>
          </div>
          <p className="bg-orange-100 p-2 text-black rounded-3xl text-xs font-medium">
            Status: {consultation.status}
          </p>
        </div>
        {consultation.doctor && (
          <p>{`Doctor: ${consultation.doctor.user.firstName} ${consultation.doctor.user.lastName}`}</p>
        )}
        <div className="flex">
          <p className="text-gray-500 text-sm">Date: {formattedDateTime}</p>
        </div>
        <div className="flex flex-col items-center justify-center mt-4 space-y-2">
          {consultation.status === "PendingPayment" && (
            <button
              className="flex items-center justify-center w-full p-2 bg-custom-green text-sm text-white font-bold rounded-lg"
              onClick={handleChatClick}
            >
              <span className="ml-2">مراسله</span>
              <ChatBubbleOvalLeftIcon className="text-white w-4" />
            </button>
          )}
          {consultation.status === "Completed" && (
            <button
              className="flex items-center justify-center w-full p-2 bg-blue-500 text-sm text-white font-bold rounded-lg"
              onClick={handleChatClick}
            >
              <ChatBubbleOvalLeftIcon className="text-white w-4" />
              <span className="ml-2">Completed</span>
            </button>
          )}
          {consultation.status === "Cancelled" && (
            <button
              className="flex items-center justify-center w-full p-2 bg-red-500 text-sm text-white font-bold rounded-lg"
              onClick={handleChatClick}
            >
              <ChatBubbleOvalLeftIcon className="text-white w-6" />
              <span className="ml-2">Cancelled</span>
            </button>
          )}
        </div>
        <div
          className="flex flex-row flex-wrap justify-start gap-2 mt-4 text-sm"
          dir="rtl"
        >
          {consultation.hasPrescription && (
            <button
              className="flex items-center border border-gray-300 rounded-lg p-2"
              onClick={() => onSelect(consultation.id)}
            >
              <NewspaperSharp className="text-gray-400 mr-2" />
              <span className="text-gray-700">الوصفة الطبية</span>
            </button>
          )}
          {consultation.hasSOAP && (
            <button
              className="flex items-center border border-gray-300 rounded-lg p-2"
              onClick={() => onSelect(consultation.id)}
            >
              <Person2Outlined className="text-gray-400 mr-2" />
              <span className="text-gray-700">SOAP Available</span>
            </button>
          )}
          {consultation.hasSickLeave && (
            <button
              className="flex items-center border border-gray-300 rounded-lg p-2"
              onClick={() => onSelect(consultation.id)}
            >
              <Person2Outlined className="text-gray-400 mr-2" />
              <span className="text-gray-700">Sick Leave Available</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsultationCard;
