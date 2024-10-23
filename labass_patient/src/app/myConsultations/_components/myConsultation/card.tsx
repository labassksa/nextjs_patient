import React from "react";
import { useRouter } from "next/navigation";
import {
  Consultation,
  ConsultationStatus,
} from "../../../../models/consultation";
import { NewspaperSharp } from "@mui/icons-material";
import { ChatBubbleOvalLeftIcon } from "@heroicons/react/24/solid";
import { translateGender } from "../../../../utils/translateGender";
import { translateStatus } from "../../../../utils/translateStatus";

interface ConsultationCardProps {
  consultation: Consultation;
  onSelect: (id: number) => void;
}

const ConsultationCard: React.FC<ConsultationCardProps> = ({
  consultation,
  onSelect,
}) => {
  const router = useRouter();

  const handleSelect = () => onSelect(consultation.id);

  const formattedDateTime = new Date(consultation.createdAt).toLocaleString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }
  );

  // Determine the button label, class, and icon based on consultation status
  let buttonLabel = "";
  let buttonClass = "";
  let icon = null;
  let redirectUrl = "";

  if (consultation.status === ConsultationStatus.Paid) {
    buttonLabel = "اختر المريض";
    buttonClass = "bg-custom-green text-xs";
    redirectUrl = `/patientSelection?consultationId=${consultation.id}`;
  } else if (consultation.status === ConsultationStatus.Open) {
    buttonLabel = "مراسلة";
    buttonClass = "bg-custom-green text-xs";
    icon = <ChatBubbleOvalLeftIcon className="text-white w-4" />;
    redirectUrl = `/patientSelection?consultationId=${consultation.id}`;
  } else if (consultation.status === ConsultationStatus.Closed) {
    buttonLabel = "مكتملة";
    buttonClass = "bg-blue-500";
    icon = <ChatBubbleOvalLeftIcon className="text-white w-4" />;
  } else if (consultation.status === ConsultationStatus.Failed) {
    buttonLabel = "ملغاة";
    buttonClass = "bg-red-500";
    icon = <ChatBubbleOvalLeftIcon className="text-white w-6" />;
  }

  const handleButtonClick = () => {
    if (redirectUrl) {
      router.push(redirectUrl);
    }
  };

  const handlePrescriptionClick = () => {
    if (consultation.prescription?.pdfURL) {
      window.open(consultation.prescription.pdfURL, "_blank");
    }
  };

  return (
    <div
      onClick={handleSelect}
      className="flex p-2 m-2 rounded-lg border shadow border-gray-300 bg-white"
    >
      <div className="w-full flex flex-col justify-between" dir="rtl">
        {/* Doctor Info Section */}
        <div className="border-b border-gray-200 pb-2 mb-2">
          <div className="flex justify-between mb-2">
            <div>
              <h3 className="font-bold text-xs text-black" dir="rtl">
                {consultation.doctor?.user.firstName &&
                consultation.doctor?.user.lastName ? (
                  <p>{`د: ${consultation.doctor.user.firstName} ${consultation.doctor.user.lastName}`}</p>
                ) : (
                  <p>بانتظار انضمام الدكتور</p>
                )}
              </h3>
            </div>
            <p
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                consultation.status === ConsultationStatus.Open
                  ? "bg-green-100 text-green-700"
                  : consultation.status === ConsultationStatus.Paid
                  ? "bg-blue-100 text-blue-700"
                  : consultation.status === ConsultationStatus.Closed
                  ? "bg-gray-200 text-gray-700"
                  : "bg-orange-100 text-orange-700"
              }`}
            >
              {translateStatus(consultation.status)}
            </p>
          </div>
        </div>

        {/* Patient Info Section */}
        <div className="mb-2">
          {consultation.patient?.user.firstName &&
            consultation.patient?.user.lastName && (
              <p className="text-sm text-gray-700">{`المريض: ${consultation.patient.user.firstName} ${consultation.patient.user.lastName}`}</p>
            )}
          {consultation.patient?.user.dateOfBirth && (
            <div className="text-gray-500 text-xs">
              <p>{consultation.patient.user.dateOfBirth}</p>
              <p>{translateGender(consultation.patient.user.gender)}</p>
            </div>
          )}
        </div>

        {/* Consultation Info Section */}
        <div className="mb-2">
          <div className="text-gray-500 text-xs mb-1">
            <span>رقم الاستشارة: {consultation.id}</span>
          </div>
          <div className="text-gray-500 text-xs">{formattedDateTime}</div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col items-center justify-center mt-4 space-y-2">
          {consultation.prescription && (
            <button
              className="flex items-center border border-gray-300 rounded-lg p-3 bg-blue-100 hover:bg-blue-200 text-blue-600 font-semibold text-xs transition duration-300 ease-in-out"
              onClick={handlePrescriptionClick}
            >
              <NewspaperSharp className="text-blue-600 mr-2 text-base" /> الوصفة
              الطبية
            </button>
          )}

          {buttonLabel && (
            <button
              className={`flex items-center justify-center w-full p-2 ${buttonClass} text-sm text-white font-bold rounded-lg`}
              onClick={handleButtonClick}
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
