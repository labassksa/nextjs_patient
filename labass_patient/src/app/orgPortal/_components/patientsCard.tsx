import React from "react";
import { format } from "date-fns";
import { MdMailOutline } from "react-icons/md";
import { FaUserMd } from "react-icons/fa";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { MdFileDownload } from "react-icons/md";
import { OrganizationTypes } from "../_types/organizationTypes";

export interface LabPatientCardProps {
  id: number;
  status: string;
  createdAt: string;
  doctorJoinedAT: string | null;
  patientJoinedAT: string | null;
  paidAT: string | null;
  closedAt: string | null;
  prescriptionPDFUrl: string | null;
  orgType: OrganizationTypes | "";
  patient: {
    id: number;
    phoneNumber: string;
    firstName: string;
    lastName: string;
  };
  doctor: {
    phoneNumber: string;
    firstName: string;
    lastName: string;
  };
  marketer: {
    phoneNumber: string;
    firstName: string;
    lastName: string;
  };
  onSelect: () => void;
}

const LabPatientCard: React.FC<LabPatientCardProps> = ({
  id,
  status,
  createdAt,
  doctorJoinedAT,
  closedAt,
  patient,
  doctor,
  marketer,
  prescriptionPDFUrl,
  orgType,
  onSelect,
}) => {
  const formatDate = (date: string | null) => {
    if (!date) return "غير متوفر";
    return format(new Date(date), "yyyy-MM-dd HH:mm");
  };

  return (
    <div
      onClick={onSelect}
      className="flex flex-col p-6 m-4 rounded-lg border shadow-md border-gray-300 bg-white cursor-pointer hover:shadow-lg transition-shadow"
      dir="rtl"
    >
      {/* Header with ID and Status */}
      <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
        <h3 className="font-bold text-lg text-black">{"رقم الاستشارة: " + id}</h3>
        <span className={`px-3 py-1 rounded-full text-sm ${
          status === "Closed" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
        }`}>
          {status === "Closed" ? "مكتملة" : "نشط"}
        </span>
      </div>

      {/* Patient Information */}
      <div className="mb-4">
        <h4 className="font-semibold text-700 mb-2">معلومات المريض</h4>
        <div className="text-sm text-gray-600">
          <p className="mb-1">{`الاسم: ${patient.firstName} ${patient.lastName}`}</p>
          <p>رقم الجوال: <span dir="ltr">{patient.phoneNumber}</span></p>
        </div>
      </div>

      {/* Doctor Information */}
      <div className="mb-4">
        <h4 className="font-semibold text-700 mb-2">معلومات الطبيب</h4>
        <div className="text-sm text-gray-600">
          <p className="mb-1">{`الاسم: ${doctor.firstName} ${doctor.lastName}`}</p>
          <p>رقم الجوال: <span dir="ltr">{doctor.phoneNumber}</span></p>
          </div>
      </div>

      {/* Marketer Information */}
      <div className="mb-4">
        <h4 className="font-semibold text-700 mb-2">معلومات {orgType === OrganizationTypes.Pharmacy?
        'الصيدلي' : 'موظف المختبر'}</h4>
        <div className="text-sm text-gray-600">
          <p className="mb-1">{`الاسم: ${marketer.firstName} ${marketer.lastName}`}</p>
            <p>رقم الجوال: <span dir="ltr">{marketer.phoneNumber}</span></p>
        </div>
      </div>

      {/* Prescription PDF Section */}
      {prescriptionPDFUrl? (
        <div className="mb-4 border-t border-gray-200 pt-3">
          <a
            href={prescriptionPDFUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <MdFileDownload className="text-xl" />
            <span className="text-sm">تحميل الوصفة الطبية</span>
          </a>
        </div>
      ):
      (
        <div className="mb-4 border-t border-gray-200 pt-3">
          <div className="flex items-center gap-2 text-red-700 px-4 py-2 rounded-lg transition-colors">
          <span className="text-sm">لم يتم صرف وصفة طبية</span>
          </div>
      </div>
      )}

      {/* Dates Section */}
      <div className="text-xs text-gray-500 border-t border-gray-200 pt-3">
        <p className="mb-1 flex items-center gap-2">
          <MdMailOutline className="text-gray-600 text-base" />
          {`وقت ارسال الاستشارة: ${formatDate(createdAt)}`}
        </p>
        <p className="mb-1 flex items-center gap-2">
          <FaUserMd className="text-gray-600 text-base" />
          {`وقت دخول الطبيب: ${formatDate(doctorJoinedAT)}`}
        </p>
        {closedAt && (
          <p className="flex items-center gap-2">
            <IoMdCheckmarkCircle className="text-green-600 text-base" />
            {`وقت اكتمال الاستشارة: ${formatDate(closedAt)}`}
          </p>
        )}
      </div>
    </div>
  );
};

export default LabPatientCard;
