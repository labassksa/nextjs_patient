// src/components/HorizontalItemList.tsx
import React from "react";
import ListItem from "./symptom";
import { Item } from "../../app/types/items"; // Assuming you have defined types separately

interface Props {
  items: Item[];
}

const HorizontalItemList: React.FC<Props> = ({ items }) => {
  return (
    <div className="flex flex-nowrap overflow-x-auto  gap-4 p-2 w-full">
      {items.map((item) => (
        <div className="w-1/2 shrink-0 md:w-1/3" key={item.id}> {/* Added wrapper with w-1/2 and shrink-0 */}
        <ListItem
          title={item.title}
          description={item.description}
          imageUrl={item.imageUrl}
        />
      </div>
      ))}
    </div>
  );
};

export default HorizontalItemList;
