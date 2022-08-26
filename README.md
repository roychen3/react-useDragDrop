# Getting Started with Create React App

### `npm install`

### `npm start`

<br>
<br>
<br>

### DEMO
https://roychen3.github.io/react-useDragDrop/

<br>

### node v16.14.2

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
          <div
            style={{
              display: 'inline-flex',
              gap: '1rem',
            }}
            drag-drop-draggable="false"
          >
            <span>{item.id}</span>
            <span>{item.userId}</span>
            <span>{item.title}</span>
          </div>
        </li>
      ))}
    </ul>
  );
};

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

export default Table;
```
