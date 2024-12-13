import React from "react";

interface LabPatientCardProps {
  patientName: string;
  date: string;
  packageType: string;
  additionalInfo?: string; // New prop for extra information
  onSelect: () => void;
}

const LabPatientCard: React.FC<LabPatientCardProps> = ({
  patientName,
  date,
  packageType,
  additionalInfo,
  onSelect,
}) => {
  return (
    <div
      onClick={onSelect}
      className="flex flex-col p-4 m-4 rounded-lg border shadow border-gray-300 bg-white cursor-pointer"
      dir="rtl"
    >
      <div className="border-b border-gray-200 pb-2 mb-4">
        <h3 className="font-bold text-sm text-black">{`المريض: ${patientName}`}</h3>
      </div>
      <div className="text-gray-500 text-xs mb-4">
        <p>{`تاريخ تسجيل المريض: ${date}`}</p>
        {additionalInfo && <p>{additionalInfo}</p>}
      </div>
    </div>
  );
};

export default LabPatientCard;
