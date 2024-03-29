import React from 'react';

import { useDragDrop } from '../hook/useDragDrop';
import data from './data.json';

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

Table.propTypes = {};

export default Table;
