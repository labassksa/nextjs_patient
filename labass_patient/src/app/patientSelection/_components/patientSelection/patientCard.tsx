import React from "react";
import User from "../../../../models/user";
import { Person } from "@mui/icons-material";

interface PatientCardProps {
  patient: User;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const PatientCard: React.FC<PatientCardProps> = ({
  patient,
  isSelected,
  onSelect,
}) => {
  return (
    <div
      onClick={() => onSelect(patient.nationalId)}
      className={`p-4 rounded-lg w-24 h-28 text-center cursor-pointer transition-colors duration-200 ${
        isSelected
          ? "bg-custom-green text-white"
          : "bg-white text-black border-2 hover:bg-gray-100"
      }`}
    >
      <div className="flex flex-col items-center text-xs">
        {/* Icon representing the patient */}
        <div
          className={`p-2 rounded-full ${
            isSelected ? "bg-white" : "bg-gray-200"
          }`}
        >
          <Person className={isSelected ? "text-custom-green" : "text-black"} />
        </div>

        {/* Display the first name and last name on top of each other */}
        <div className="mt-2">
          <div className="font-medium truncate w-full">{patient.firstName}</div>
          <div className="font-medium truncate w-full">{patient.lastName}</div>
        </div>
      </div>
    </div>
  );
};

export default PatientCard;
