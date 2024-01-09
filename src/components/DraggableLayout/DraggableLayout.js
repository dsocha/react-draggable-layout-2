import Styles from './DraggableLayout.styles';
import React, { useEffect, useState } from 'react';
import Draggable from './Draggable';

const DraggableLayout = ({ components, columns, mainColumnIndex }) => {
  const [columnsComponents, setColumnsComponents] = useState(null);

  useEffect(() => {
    let key = 0;
    const result = [];
    for (let i = 0; i < columns; i++) {
      const id = self.crypto.randomUUID();
      result.push(
        <div className={i.toString() === mainColumnIndex?.toString() ? 'draggable-layout-column-master' : 'draggable-layout-column-regular'} key={id} id={id}>
          {getComponentsForColumn(i)}
        </div>
      );
    }

    setColumnsComponents(result);
  }, [columns, mainColumnIndex]);

  useEffect(() => {
    console.log('columnsComponents', columnsComponents);
  }, [columnsComponents]);

  const getComponentsForColumn = (col) => {
    const result = [];
    const c = components.filter((c) => c.col.toString() === col.toString()).map((c) => c.component);
    for (let i = 0; i < c.length; i++) {
      const id = self.crypto.randomUUID();
      result.push(
        <Draggable key={id} id={id} draggable={true}>
          {c[i]}
        </Draggable>
      );
    }
    return result;
  };

  return (
    <Styles>
      <div id='draggable-layout-container' className='draggable-layout-container'>
        {columnsComponents}
      </div>
    </Styles>
  );
};

export default DraggableLayout;
