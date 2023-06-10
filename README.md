# react-useDragDrop

Simple drag and drop hook

[DEMO](https://roychen3.github.io/react-useDragDrop/)

## Getting Started

```bash
npm run start
```

## Installation

node v16.14.2

## Usage

### Row event

```jsx
import { useDragDrop } from "../hook/useDragDrop";

const List = () => {
  const { drag, dragDropData } = useDragDrop({ data });

  return (
    <ul>
      {dragDropData.map((item, index) => (
        <li
          key={item.id}
          data-drag-drop-index={index}
          onMouseDown={drag}
          onTouchStart={drag}
        >
            <span>{item.id}</span>
            <span>{item.userId}</span>
            <span data-drag-drop-draggable="false">{item.title}</span>
        </li>
      ))}
    </ul>
  );
};
```

### Button of Row event

```jsx
import { useDragDrop } from "../hook/useDragDrop";

const Table = () => {
  const { drag, dragDropData } = useDragDrop({ data });

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
              data-drag-drop-index={index}
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
```

## License

[LICENSE](LICENSE)