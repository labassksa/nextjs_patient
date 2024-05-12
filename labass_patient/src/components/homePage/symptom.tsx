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
    <div className="bg-white flex flex-col rounded-xl p-2">
      {/* Utilize Tailwind's responsive utilities to adjust height on different screens */}
      <div className="md:h-full lg:h-full p-2 md:p-12 lg:p-16">
        <div className="px-12 py-2">
          <Image
            src={imageUrl}
            alt={title}
            layout="responsive"
            width={1} // Since aspect ratio is 1:1, width and height are the same
            height={1}
            objectFit="contain"
            className="rounded-lg"
          />
        </div>
      </div>
      <div className="">
        <h3
          className="text-lg md:text-lg lg:text-xl font-bold text-black"
          dir="rtl"
        >
          {title}
        </h3>
        <p className="text-sm md:text-md lg:text-lg text-gray-500" dir="rtl">
          {description}
        </p>
      </div>
    </div>
  );
};

export default ListItem;
