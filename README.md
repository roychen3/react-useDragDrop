# Getting Started with Create React App

### node v16.14.2

### `npm install`

### `npm start`

<br>
<br>
<br>

# Usage

```jsx
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
          <span>{item.title}</span>
        </li>
      ))}
    </ul>
  );
};

List.propTypes = {};

export default List;
```

or

```jsx
import React from "react";

import { useDragDrop } from "../hook/useDragDrop";
import data from "./data.json";

const Table = () => {
  const { drag, drop, dragDropData } = useDragDrop({ data });

  return (
    <div className="tableContainer">
      <table>
        <thead>
          <tr>
            <th>id</th>
            <th>userId</th>
            <th>title</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {dragDropData.map((item, index) => (
            <tr
              key={item.id}
              drag-drop-index={index}
              onMouseUp={drop}
              onTouchEnd={drop}
            >
              <td>{item.id}</td>
              <td>{item.userId}</td>
              <td>{item.title}</td>
              <td>
                <button type="button" onMouseDown={drag} onTouchStart={drag}>
                  =
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

Table.propTypes = {};

export default Table;

```
