import React from "react";

import { useDragDrop } from "../hook/useDragDrop";
import data from "./data.json";

const List = () => {
  const { drag, drop, dragDropData } = useDragDrop({ data });

  return (
    <ul>
      {dragDropData.map((item, index) => (
        <li
          key={item.id}
          drag-drop-index={index}
          onMouseUp={drop}
          onTouchEnd={drop}
          onMouseDown={drag}
          onTouchStart={drag}
        >
            <span>{item.id}</span>
            <span>{item.userId}</span>
            <span drag-drop-draggable="false">{item.title}</span>
        </li>
      ))}
    </ul>
  );
};

List.propTypes = {};

export default List;
