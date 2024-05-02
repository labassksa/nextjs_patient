// src/components/ListItem.tsx
import Image from "next/image";
import React from "react";

interface ListItemProps {
  title: string;
  description: string;
  imageUrl: string;
}

const ListItem: React.FC<ListItemProps> = ({
  title,
  description,
  imageUrl,
}) => {
  return (
    <div className="bg-white p-4 shadow-md rounded-lg">
      <div className="relative w-full h-32 mb-2">
        <Image
          src={imageUrl}
          alt={title}
          layout="fill"
          objectFit="cover"
          className="rounded-lg"
        />
      </div>
      <h3 className="text-sm font-bold text-black" dir="rtl">{title}</h3>
      <p className="text-sm text-gray-500" dir="rtl">{description}</p>
    </div>
  );
};

export default ListItem;
