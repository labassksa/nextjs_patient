import React from "react";

// src/components/UserDetails.tsx

interface UserDetailsProps {
  name: string;
  nationality: string;
  nationalId: string;
  dateOfBirth: string; // You can also use Date type if you prefer
}

const UserDetails: React.FC<UserDetailsProps> = ({
  name,
  nationality,
  nationalId,
  dateOfBirth,
}) => {
  return (
    <div className="bg-gray-200  p-4 my-2 mx-4 rounded-lg">
      <div className="flex justify-between items-center ">
        <div>
          <p className="text-sm text-gray-600 ">الاسم</p>
          <p className="font-medium text-gray-700">{name}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">الجنسية</p>
          <p className="font-medium text-gray-700">{nationality}</p>
        </div>
      </div>
      <div className="flex justify-between items-center mt-4">
        <div>
          <p className="text-sm text-gray-600">رقم الهوية</p>
          <p className="font-medium text-gray-700">{nationalId}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">تاريخ الميلاد</p>
          <p className="font-medium text-gray-700">{dateOfBirth}</p>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
