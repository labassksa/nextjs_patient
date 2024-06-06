// components/PatientCard.tsx
import React from "react";
import User from "../../models/user";
import { Person, Person2Rounded } from "@mui/icons-material";

interface PatientCardProps {
  patient: User;
  isSelected: boolean;
  onSelect: (id: string) => void; // Assuming you use nationalId as a unique identifier
}

const PatientCard: React.FC<PatientCardProps> = ({
  patient,
  isSelected,
  onSelect,
}) => {
  const fullName = `${patient.firstName} ${patient.lastName}`;

  return (
    <div
      onClick={() => onSelect(patient.nationalId)}
      className={`p-4 rounded-lg w-24 h-28 text-center  ${
        isSelected
          ? "bg-custom-green text-sm text-white "
          : "text-black outline-gray-200 border-2"
      }`}
    >
      <div className="flex flex-col items-center text-sm">
        <div
          className={`p-2 rounded-full ${
            isSelected ? "bg-custom-green" : "bg-white"
          }`}
        >
          <Person />
        </div>
        <h2 className="font-medium">{fullName}</h2>
      </div>
    </div>
  );
};

export default PatientCard;
