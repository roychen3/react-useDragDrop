import React from "react";
import PropTypes from "prop-types";

import { useDragDrop } from "../hook/useDragDrop";
import data from "./data.json";

const List = () => {
  const { drag, drop, move, dragDropData } = useDragDrop({ data });

  return (
    <ul>
      {dragDropData.map((item, index) => (
        <li
          key={item.id}
          drag-drop-index={index}
          onMouseMove={move}
          onTouchMove={move}
          onMouseUp={drop}
          onTouchEnd={drop}
          onMouseDown={drag}
          onTouchStart={drag}
        >
          <span>{item.id}</span>
          <span>{item.userId}</span>
          <span>{item.title}</span>
        </li>
      ))}
    </ul>
  );
};

List.propTypes = {};

export default List;
