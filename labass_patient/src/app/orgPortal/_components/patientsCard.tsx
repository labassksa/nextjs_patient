import React from "react";
import { format } from "date-fns";
import { MdMailOutline } from "react-icons/md";
import { FaUserMd } from "react-icons/fa";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { MdFileDownload } from "react-icons/md";
import { OrganizationTypes } from "../_types/organizationTypes";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  const formatDate = (date: string | null) => {
    if (!date) return t("notAvailable");
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
        <h3 className="font-bold text-lg text-black">{`${t("consultationNumber")}: ${id}`}</h3>
        <span className={`px-3 py-1 rounded-full text-sm ${
          status === "Closed" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
        }`}>
          {status === "Closed" ? t("completed") : t("active")}
        </span>
      </div>

      {/* Patient Information */}
      <div className="mb-4">
        <h4 className="font-semibold text-700 mb-2">{t("patientInfo")}</h4>
        <div className="text-sm text-gray-600">
          <p className="mb-1">{`${t("name")}: ${patient.firstName||''} ${patient.lastName||''}`}</p>
          <p>{t("phoneNumber")}: <span dir="ltr">{patient.phoneNumber}</span></p>
        </div>
      </div>

      {/* Doctor Information */}
      <div className="mb-4">
        <h4 className="font-semibold text-700 mb-2">{t("doctorInfo")}</h4>
        <div className="text-sm text-gray-600">
          <p className="mb-1">{`${t("name")}: ${doctor.firstName||''} ${doctor.lastName||''}`}</p>
          <p>{t("phoneNumber")}: <span dir="ltr">{doctor.phoneNumber}</span></p>
        </div>
      </div>

      {/* Marketer Information */}
      <div className="mb-4">
        <h4 className="font-semibold text-700 mb-2">
           {orgType === OrganizationTypes.Pharmacy
            ? t("pharmacistInfo")
            : t("labEmployeeInfo")}
        </h4>
        <div className="text-sm text-gray-600">
          <p className="mb-1">{`${t("name")}: ${marketer.firstName||''} ${marketer.lastName||''}`}</p>
          <p>{t("phoneNumber")}: <span dir="ltr">{marketer.phoneNumber}</span></p>
        </div>
      </div>

      {/* Prescription PDF Section */}
      {prescriptionPDFUrl ? (
        <div className="mb-4 border-t border-gray-200 pt-3">
          <a
            href={prescriptionPDFUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <MdFileDownload className="text-xl" />
            <span className="text-sm">{t("downloadPrescription")}</span>
          </a>
        </div>
      ) : (
        <div className="mb-4 border-t border-gray-200 pt-3">
          <div className="flex items-center gap-2 text-red-700 px-4 py-2 rounded-lg transition-colors">
            <span className="text-sm">{t("noPrescription")}</span>
          </div>
        </div>
      )}

      {/* Dates Section */}
      <div className="text-xs text-gray-500 border-t border-gray-200 pt-3">
        <p className="mb-1 flex items-center gap-2">
          <MdMailOutline className="text-gray-600 text-base" />
          {`${t("consultationSentAt")}: ${formatDate(createdAt)}`}
        </p>
        <p className="mb-1 flex items-center gap-2">
          <FaUserMd className="text-gray-600 text-base" />
          {`${t("doctorJoinedAt")}: ${formatDate(doctorJoinedAT)}`}
        </p>
        {closedAt && (
          <p className="flex items-center gap-2">
            <IoMdCheckmarkCircle className="text-green-600 text-base" />
            {`${t("consultationCompletedAt")}: ${formatDate(closedAt)}`}
          </p>
        )}
      </div>
    </div>
  );
};

export default LabPatientCard;
