import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Consultation,
  ConsultationStatus,
} from "../../../../models/consultation";
import { translateGender } from "../../../../utils/translateGender";
import { translateStatus } from "../../../../utils/translateStatus";
import { fetchInvoiceLink } from "../../_controllers/invoiceController";
import { requestFollowUp } from "../../_controllers/myConsultations";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface ConsultationCardProps {
  consultation: Consultation;
  onSelect: (id: number) => void;
}

const ConsultationCard: React.FC<ConsultationCardProps> = ({
  consultation,
  onSelect,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [followUpLoading, setFollowUpLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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

  let buttonLabel = "";
  let redirectUrl = "";

  if (consultation.status === ConsultationStatus.Paid) {
    buttonLabel = "اختر المريض";
    redirectUrl = `/patientSelection?consultationId=${consultation.id}`;
  } else if (consultation.status === ConsultationStatus.Open) {
    buttonLabel = "مراسلة";
    redirectUrl = `/patientSelection?consultationId=${consultation.id}`;
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

  const handleInvoiceClick = async () => {
    setLoading(true); // Start loading
    try {
      const invoiceLink = await fetchInvoiceLink(consultation.id);

      if (invoiceLink) {
        console.log("Opening Invoice Link:", invoiceLink); // Debugging

        // Try using window.open
        const newTab = window.open(invoiceLink, "_blank");

        // Fallback: If window.open fails, use a clickable anchor
        if (!newTab || newTab.closed || typeof newTab.closed === "undefined") {
          const a = document.createElement("a");
          a.href = invoiceLink;
          a.target = "_blank";
          a.rel = "noopener noreferrer";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
      } else {
        alert("لم يتم العثور على رابط الفاتورة.");
      }
    } catch (error) {
      alert("حدث خطأ أثناء جلب الفاتورة. حاول مرة أخرى لاحقًا.");
      console.error("Error fetching invoice link:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleSickLeaveClick = () => {
    if (consultation.sickLeave?.pdfURL) {
      window.open(consultation.sickLeave.pdfURL, "_blank");
    } else {
      alert("إجازة المرض غير متوفرة حاليًا.");
    }
  };

  const handleSoapClick = () => {
    if (consultation.soap?.pdfURL) {
      window.open(consultation.soap.pdfURL, "_blank");
    } else {
      alert("ملاحظات SOAP غير متوفرة حاليًا.");
    }
  };

  const handleFollowUpRequest = async () => {
    setFollowUpLoading(true);
    try {
      await requestFollowUp(consultation.id);
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
    // Optionally refresh the consultations list
    window.location.reload();
  };

  return (
    <div
      onClick={handleSelect}
      className="flex flex-col p-4 m-4 rounded-lg border shadow border-gray-300 bg-white relative"
    >
      <div className="w-full" dir="rtl">
        {/* Doctor Info Section */}
        <div className="border-b border-gray-200 pb-2 mb-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-black">
                {consultation.doctor?.user.firstName &&
                consultation.doctor?.user.lastName
                  ? `د: ${consultation.doctor.user.firstName} ${consultation.doctor.user.lastName}`
                  : "بانتظار انضمام الدكتور"}
              </h3>
              {consultation.isFollowUp && (
                <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                  followUp
                </span>
              )}
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
        <div className="mb-4">
          {consultation.patient?.user.firstName &&
            consultation.patient?.user.lastName && (
              <p className="text-sm text-gray-700">{`المريض: ${consultation.patient.user.firstName} ${consultation.patient.user.lastName}`}</p>
            )}
          {consultation.patient?.user.dateOfBirth && (
            <p className="text-gray-500 text-xs">
              {consultation.patient.user.dateOfBirth} -{" "}
              {translateGender(consultation.patient.user.gender)}
            </p>
          )}
        </div>

        {/* Consultation Info Section */}
        <div className="mb-4 text-gray-500 text-xs">
          <p>رقم الاستشارة: {consultation.id}</p>
          <p>{formattedDateTime}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap text-xs items-center justify-start gap-4 mt-4">
          {consultation.prescription && (
            <button
              className="px-4 py-2 font-semibold text-white bg-green-500 rounded hover:bg-green-600 focus:outline-none"
              onClick={handlePrescriptionClick}
            >
              الوصفة الطبية
            </button>
          )}
          <button
            className="px-4 py-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none"
            onClick={handleInvoiceClick}
            disabled={loading} // Disable button while loading
          >
            {loading ? "جاري التحميل..." : "الفاتورة"}
          </button>
          {consultation.sickLeave && (
            <button
              className="px-4 py-2 font-semibold text-white bg-yellow-500 rounded hover:bg-yellow-600 focus:outline-none"
              onClick={handleSickLeaveClick}
            >
              الإجازة المرضية
            </button>
          )}
          {consultation.soap && (
            <button
              className="px-4 py-2 font-semibold text-white bg-purple-500 rounded hover:bg-purple-600 focus:outline-none"
              onClick={handleSoapClick}
            >
              التقرير الطبي
            </button>
          )}
          {buttonLabel && (
            <button
              className="px-4 py-2 text-sm font-semibold text-white bg-gray-500 rounded hover:bg-gray-600 focus:outline-none"
              onClick={handleButtonClick}
            >
              {buttonLabel}
            </button>
          )}
        </div>
      </div>
      
      {/* Follow-up Button - Bottom of Card, Full Width */}
      {consultation.canSendFollowUp && (
        <button
          className="absolute bottom-0 left-0 right-0 py-3 text-sm font-semibold text-white bg-green-500 rounded-b-lg hover:bg-green-600 focus:outline-none"
          onClick={handleFollowUpRequest}
          disabled={followUpLoading}
          style={{ marginBottom: 0 }}
        >
          {followUpLoading ? "جاري الإرسال..." : "طلب استشارة"}
        </button>
      )}
      
      {/* Add bottom padding when follow-up button is present */}
      {consultation.canSendFollowUp && <div className="h-12"></div>}
      
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

export default ConsultationCard;
