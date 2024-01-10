import Styles from './DraggableLayout.styles';
import React, { useEffect, useState } from 'react';
import Draggable from './Draggable';

const DraggableLayout = ({ components, columns, mainColumnIndex }) => {
  const [columnsComponents, setColumnsComponents] = useState(null);
  const [draggingElement, setDraggingElement] = useState(false);

  useEffect(() => {
    const result = [];
    for (let i = 0; i < columns; i++) {
      const id = self.crypto.randomUUID();
      result.push(
        <div className={i.toString() === mainColumnIndex?.toString() ? 'draggable-layout-column-master' : 'draggable-layout-column-regular'} key={id} id={id}>
          {getComponentsForColumn(i)}
          {getLastElementInColumn()}
        </div>
      );
    }

    setColumnsComponents(result);
  }, [columns, mainColumnIndex]);

  // useEffect(() => {
  //   // console.log('columnsComponents', columnsComponents);
  // }, [columnsComponents]);

  const handleGlobalMouseMove = async (e) => {
    if (!draggingElement) return;
    const { clientX, clientY } = e;
    const elements = document.elementsFromPoint(clientX, clientY);

    // <determine mouse over element>
    const mouseOverElement = elements.find((e) => e.classList.contains('draggable-layout-droppable') && e.id !== draggingElement.id);
    if (!mouseOverElement) return;
    const rect = mouseOverElement.getBoundingClientRect();
    const mouseOverBottomElement = clientY - rect.y > rect.height / 2;
    console.log('dragging over', 'id:', mouseOverElement.id, 'bottom:', mouseOverBottomElement);
    // </determine mouse over element>

    // <remove placeholder from old position>
    const placeholder = document.getElementById('draggable-layout-placeholder');
    if (placeholder) {
      const placeholderParent = placeholder.parentElement;
      if (placeholderParent) placeholderParent.removeChild(placeholder);
    }
    // </remove placeholder from old position>

    // <insert placeholder in new position>
    const mouseOverElementParent = mouseOverElement.parentElement;
    const isLastElement = mouseOverElement.className?.includes('draggable-layout-last-element') ? true : false;

    const newPlaceholder = getPlaceHolder(draggingElement.height, draggingElement.borderRadius);
    if (!isLastElement && mouseOverBottomElement) {
      mouseOverElementParent.insertBefore(newPlaceholder, mouseOverElement.nextSibling);
    } else {
      mouseOverElementParent.insertBefore(newPlaceholder, mouseOverElement);
    }
    // </insert placeholder in new position>
  };

  const handleOnDragStart = async (e) => {
    // <insert placeholder>
    const element = document.getElementById(e.id);
    const elementParent = document.getElementById(e.id).parentElement;
    const placeholder = getPlaceHolder(e.height, e.borderRadius);
    elementParent.insertBefore(placeholder, element);
    setDraggingElement(e);
    // </insert placeholder>
  };

  const getPlaceHolder = (height, borderRadius) => {
    // <create placeholder element>
    let placeholder = document.createElement('div');
    placeholder.id = 'draggable-layout-placeholder';
    placeholder.classList.add('draggable-layout-blinking');
    placeholder.style.position = 'relative';
    placeholder.style.width = '100%';
    placeholder.style.height = height;
    placeholder.style.borderRadius = borderRadius;
    placeholder.style.backgroundColor = '#88888833';
    return placeholder;
    // </create placeholder element>
  };

  const getLastElementInColumn = () => <div className='draggable-layout-droppable draggable-layout-last-element' isLastElement={true} style={{ flex: 'auto', height: '100px', width: '100%' }}></div>;

  const handleOnDragEnd = async (e) => {
    // <remove placeholder>
    const placeholder = document.getElementById('draggable-layout-placeholder');
    if (!placeholder) return;
    const placeholderParent = placeholder.parentElement;
    if (!placeholderParent) return;
    placeholderParent.insertBefore(document.getElementById(e.id), placeholder);
    placeholderParent.removeChild(placeholder);
    // </remove placeholder>
    setDraggingElement(null);
  };

  const getComponentsForColumn = (col) => {
    const result = [];
    const c = components.filter((c) => c.col.toString() === col.toString()).map((c) => c.component);
    for (let i = 0; i < c.length; i++) {
      const id = self.crypto.randomUUID();
      result.push(
        <Draggable key={id} id={id} draggable={true} onDragStart={handleOnDragStart} onDragEnd={handleOnDragEnd}>
          {c[i]}
        </Draggable>
      );
    }
    return result;
  };

  return (
    <Styles>
      <div id='draggable-layout-container' className='draggable-layout-container' onMouseMove={handleGlobalMouseMove}>
        {columnsComponents}
      </div>
    </Styles>
  );
};

export default DraggableLayout;
