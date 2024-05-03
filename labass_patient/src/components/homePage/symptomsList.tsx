// src/components/HorizontalItemList.tsx
import React from "react";
import ListItem from "./symptomsListItem";
import { Item } from "../../app/types"; // Assuming you have defined types separately

interface Props {
  items: Item[];
}

const HorizontalItemList: React.FC<Props> = ({ items }) => {
  return (
    <div className="flex flex-nowrap overflow-x-auto px-4 py-4 gap-4 mx-4 p-2">
      {items.map((item) => (
        <ListItem
          key={item.id}
          title={item.title}
          description={item.description}
          imageUrl={item.imageUrl}
        />
      ))}
    </div>
  );
};

export default HorizontalItemList;
