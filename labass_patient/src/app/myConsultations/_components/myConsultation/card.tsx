import React from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import {
  Consultation,
  ConsultationStatus,
} from "../../../../models/consultation";
import {
  Person2Outlined,
  Person2Rounded,
  NewspaperSharp,
} from "@mui/icons-material";
import { ChatBubbleOvalLeftIcon } from "@heroicons/react/24/solid";

interface ConsultationCardProps {
  consultation: Consultation;
  onSelect: (id: number) => void;
}

const ConsultationCard: React.FC<ConsultationCardProps> = ({
  consultation,
  onSelect,
}) => {
  const router = useRouter(); // Initialize useRouter

  const handleSelect = () => onSelect(consultation.id);

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
  const translateGender = (gender: string) => {
    switch (gender) {
      case "male":
        return "ذكر";
      case "female":
        return "أنثى";
      default:
        return gender; // Return as is if no match found
    }
  };
  // Determine the button label, class, and icon based on consultation status
  let buttonLabel = "";
  let buttonClass = "";
  let icon = null;
  let redirectUrl = "";

  if (
    consultation.status === ConsultationStatus.Paid &&
    consultation.patient.user.firstName
  ) {
    buttonLabel = "مراسلة";
    buttonClass = "bg-custom-green text-xs ";
    icon = <ChatBubbleOvalLeftIcon className="text-white w-4" />;
    redirectUrl = "/chat"; // URL for the chat page
  } else if (consultation.status === ConsultationStatus.Paid) {
    buttonLabel = "أكمل معلوماتك";
    buttonClass = "bg-custom-green text-xs"; // Add a new class for the "أكمل معلوماتك" button if needed
    redirectUrl = "/fillpersonalInfo"; // URL for the fillPersonalInfo page
  } else {
    switch (consultation.status) {
      case ConsultationStatus.Open:
        buttonLabel = "مراسلة";
        buttonClass = "bg-custom-green text-xs";
        icon = <ChatBubbleOvalLeftIcon className="text-white w-4" />;
        redirectUrl = "/chat";
        break;
      case ConsultationStatus.Closed:
        buttonLabel = "Completed";
        buttonClass = "bg-blue-500";
        icon = <ChatBubbleOvalLeftIcon className="text-white w-4" />;
        break;
      case ConsultationStatus.Failed:
        buttonLabel = "Cancelled";
        buttonClass = "bg-red-500";
        icon = <ChatBubbleOvalLeftIcon className="text-white w-6" />;
        break;
      default:
        buttonLabel = "";
        buttonClass = "";
        icon = null;
    }
  }

  const handleButtonClick = () => {
    if (redirectUrl) {
      router.push(redirectUrl); // Navigate to the appropriate page
    }
  };

  const handlePrescriptionClick = () => {
    if (consultation.prescription?.pdfURL) {
      window.open(consultation.prescription.pdfURL, "_blank"); // Open the prescription PDF in a new tab
    }
  };

  return (
    <div
      onClick={handleSelect}
      className="flex p-2 m-2 rounded-lg border shadow border-gray-300 bg-white"
    >
      <div className="w-full flex flex-col justify-between" dir="rtl">
        <div className="flex flex-row justify-between mb-2">
          <div className="flex flex-row">
            <Person2Rounded className="text-gray-400" />
            <h3 className="font-bold text-sm text-black" dir="rtl">
              {consultation.doctor && (
                <p>{`د: ${consultation.doctor.user.firstName} ${consultation.doctor.user.lastName}`}</p>
              )}
            </h3>
          </div>
          <p className="bg-green-100 p-2 text-black rounded-3xl text-xs font-medium">
            {consultation.status}
          </p>
        </div>
        {consultation.patient && (
          <p>{`المريض: ${consultation.patient.user.firstName} ${consultation.patient.user.lastName}`}</p>
        )}
        {consultation.patient && (
          <div className="text-gray-500 text-sm flex flex-col">
            <p>{consultation.patient.user.dateOfBirth}</p>
            <p>{translateGender(consultation.patient.user.gender)}</p>
          </div>
        )}

        <div className="flex">
          <p className="text-gray-500 text-xs">Date: {formattedDateTime}</p>
        </div>
        <div className="flex flex-col items-center justify-center mt-4 space-y-2">
          {/* Prescription button appears above other buttons */}
          {consultation.prescription && (
            <button
              className="flex items-center border border-gray-300 rounded-lg p-3 bg-blue-100 hover:bg-blue-200 text-blue-600 font-semibold text-sm transition duration-300 ease-in-out"
              onClick={handlePrescriptionClick} // Open the prescription PDF
            >
              <NewspaperSharp className="text-blue-600 mr-2 text-base" />{" "}
              {/* Adjusted size and color */}
              <span className="text-gray-800 text-xs">الوصفة الطبية</span>{" "}
              {/* Adjusted text color and size */}
            </button>
          )}

          {/* The button for other actions */}
          {buttonLabel && (
            <button
              className={`flex items-center justify-center w-full p-2 ${buttonClass} text-sm text-white font-bold rounded-lg`}
              onClick={handleButtonClick} // Use handleButtonClick for navigation
            >
              <span className="ml-2">{buttonLabel}</span>
              {icon}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsultationCard;
