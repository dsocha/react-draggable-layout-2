import Styles from './DraggableLayout.styles';
import React, { useEffect, useState } from 'react';
import Draggable from './Draggable';

const DraggableLayout = ({ defaultComponents, columns, mainColumnIndex, isDarkMode, onChange, hiddenIds = [] }) => {
  const [columnsComponents, setColumnsComponents] = useState(null);
  const [draggingElement, setDraggingElement] = useState(false);
  const [localComponents, setLocalComponents] = useState(defaultComponents);

  useEffect(() => {
    const result = [];
    for (let i = 0; i < columns; i++) {
      const id = `draggable-layout-column-${i}`;
      result.push(
        <div id={id} key={id} className={i.toString() === mainColumnIndex?.toString() ? 'draggable-layout-column-master draggable-layout-column' : 'draggable-layout-column-regular draggable-layout-column'}>
          {getComponentsForColumn(i)}
          {getLastElementInColumn()}
        </div>
      );
    }
    setColumnsComponents(result);
    setLocalComponents([...defaultComponents]);
  }, [columns, mainColumnIndex, defaultComponents]);

  useEffect(() => {
    if (onChange) onChange(localComponents);
    handleHiddenIdsChange();
  }, [localComponents]);

  useEffect(() => {
    handleHiddenIdsChange();
  }, [hiddenIds]);

  const handleHiddenIdsChange = () => {
    if (!hiddenIds) return;
    const allNodes = document.getElementsByClassName('draggable-layout-droppable');
    if (!allNodes) return;
    for (let i = 0; i < allNodes.length; i++) {
      const node = allNodes[i];
      if (!node) continue;
      if (node.classList.contains('draggable-layout-last-element')) continue;
      const { id: componentId } = node;
      if (!componentId) continue;
      node.style.display = hiddenIds.includes(componentId) ? 'none' : null;
    }
  };

  const handleGlobalMouseMove = async (e) => {
    if (!draggingElement) return;
    const { clientX, clientY } = e;
    const elements = document.elementsFromPoint(clientX, clientY);

    // <determine mouse over element>
    const mouseOverElement = elements.find((e) => e.classList.contains('draggable-layout-droppable') && e.id !== draggingElement.id);
    if (!mouseOverElement) return;
    const rect = mouseOverElement.getBoundingClientRect();
    const mouseOverBottomElement = clientY - rect.y > rect.height / 2;
    // </determine mouse over element>

    // <remove placeholder from old position>
    const placeholder = document.getElementById('draggable-layout-placeholder');
    if (placeholder) {
      const placeholderParent = placeholder.parentElement;
      if (placeholderParent) placeholderParent.removeChild(placeholder);
    }
    // </remove placeholder from old position>

    // <insert placeholder in a new position>
    const mouseOverElementParent = mouseOverElement.parentElement;
    const isLastElement = mouseOverElement.className?.includes('draggable-layout-last-element') ? true : false;
    const newPlaceholder = getPlaceHolder(draggingElement.height, draggingElement.borderRadius);
    if (!isLastElement && mouseOverBottomElement) {
      mouseOverElementParent.insertBefore(newPlaceholder, mouseOverElement.nextSibling);
    } else {
      mouseOverElementParent.insertBefore(newPlaceholder, mouseOverElement);
    }
    // </insert placeholder in a new position>
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
    placeholder.classList.add('draggable-layout-placeholder');
    placeholder.classList.add('draggable-layout-blinking');
    placeholder.style.position = 'relative';
    placeholder.style.width = '100%';
    placeholder.style.height = height;
    placeholder.style.borderRadius = borderRadius;
    placeholder.style.backgroundColor = isDarkMode ? '#ffffff44' : '#00000011';
    return placeholder;
    // </create placeholder element>
  };

  const getLastElementInColumn = () => <div className='draggable-layout-droppable draggable-layout-last-element' style={{ flex: 'auto', height: '100px', width: '100%' }}></div>;

  const handleOnDragEnd = async (e) => {
    // <move dragging element and remove placeholder>
    const placeholder = document.getElementById('draggable-layout-placeholder');
    if (!placeholder) return;
    const placeholderParent = placeholder.parentElement;
    if (!placeholderParent) return;
    placeholderParent.insertBefore(document.getElementById(e.id), placeholder);
    placeholderParent.removeChild(placeholder);
    // </move dragging element and remove placeholder>
    setDraggingElement(null);
    updateLocalComponents();
  };

  const updateLocalComponents = () => {
    // console.log('updateLocalComponents()');
    const result = [];
    const columnElements = document.getElementsByClassName('draggable-layout-column');
    for (let i = 0; i < columnElements.length; i++) {
      const columnElement = columnElements[i];
      const columnId = parseInt(columnElement.id.replace('draggable-layout-column-', ''));
      if (!columnElement) continue;
      const { childNodes } = columnElement;
      if (!childNodes) continue;
      for (const childNode of childNodes) {
        if (childNode.classList.contains('draggable-layout-last-element')) continue;
        const { id: componentId } = childNode;
        let component = localComponents.find((c) => c.id === componentId);
        if (component) result.push({ ...component, col: columnId });
      }
    }
    setLocalComponents([...result]);
  };

  const getComponentsForColumn = (col) => {
    const result = [];
    const c = defaultComponents.filter((c) => c.col.toString() === col.toString());
    for (let i = 0; i < c.length; i++) {
      const id = c[i].id ?? self.crypto.randomUUID();
      result.push(
        <Draggable key={id} id={id} onDragStart={handleOnDragStart} onDragEnd={handleOnDragEnd}>
          {c[i].component}
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
