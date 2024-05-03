// src/components/InsuranceDropdown.tsx
import React, { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

interface InsuranceDropdownProps {
  onChange: (value: string) => void;
}

const InsuranceDropdown: React.FC<InsuranceDropdownProps> = ({ onChange }) => {
  const [selectedInsurance, setSelectedInsurance] = useState<string>("");

  const insuranceCompanies = [
    { id: "malaz", name: "ملاذ" },
    { id: "cooperative", name: "التعاونية" },
    { id: "rajhiTakaful", name: "تكافل الراجحي" },
    { id: "bupa", name: "بوبا" },
    { id: "medgulf", name: "ميدغلف" },
  ];

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    setSelectedInsurance(value);
    onChange(value);
  };

  return (
    <div className="bg-white p-4 my-2 rounded-lg shadow mx-4">
      <label
        htmlFor="insurance-dropdown"
        className="block text-sm font-medium text-right text-gray-700"
      >
        الرجاء تحديد شركة التأمين
      </label>
      <div className="mt-1 relative">
        <select
          id="insurance-dropdown"
          value={selectedInsurance}
          onChange={handleSelectChange}
          className="block w-full border pr-8 py-2 text-right text-base border-gray-300 focus:outline-none sm:text-sm rounded-md appearance-none bg-white text-black "
          style={{
            direction: "rtl",
          }}
        >
          <option disabled value="">
            اختر شركة التأمين
          </option>
          {insuranceCompanies.map((company) => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-gray-700 pl-6">
          <ChevronDownIcon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};

export default InsuranceDropdown;
