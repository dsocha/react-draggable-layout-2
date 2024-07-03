import React, { useState } from 'react';

const Draggable = ({ id, children, onDragStart, onDragEnd, hidden }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0);
  const [calculatedOffsetLeft, setCalculatedOffsetLeft] = useState(0);
  const [calculatedOffsetTop, setCalculatedOffsetTop] = useState(0);

  const onMouseDown = (e) => {
    if (e.button !== 0) return;

    let currentElement = e.target;
    while (currentElement && currentElement !== e.currentTarget) {
      if (currentElement.classList.contains('draggable-layout-exclude')) {
        return;
      }
      currentElement = currentElement.parentElement;
    }

    const { clientX, clientY } = e;
    const elements = document.elementsFromPoint(clientX, clientY);
    if (!elements) return;
    const element = elements.find((e) => e.id === id);
    if (!element) return;
    const targetComponentElement = element.children[0];

    const { offsetHeight, offsetWidth, offsetLeft, offsetTop } = targetComponentElement;
    const { borderRadius } = window.getComputedStyle(targetComponentElement);

    setHeight(offsetHeight);
    setWidth(offsetWidth);

    const col = clientX - offsetLeft;
    const cot = clientY - offsetTop;
    setCalculatedOffsetLeft(col);
    setCalculatedOffsetTop(cot);
    setLeft(clientX - col);
    setTop(clientY - cot);

    if (onDragStart) onDragStart({ id, height: `${offsetHeight}px`, width: `${offsetWidth}px`, borderRadius });
    setIsDragging(true);
  };

  const onMouseUp = (e) => {
    if (e.button !== 0) return;
    if (!isDragging) return;
    if (onDragEnd) onDragEnd({ id });
    setIsDragging(false);
  };

  const onMouseMove = (e) => {
    if (!isDragging) return;
    const { clientX, clientY, movementX, movementY } = e;
    setLeft(movementX + clientX - calculatedOffsetLeft);
    setTop(movementY + clientY - calculatedOffsetTop);
  };

  if (hidden) return <div key={id} id={id} tabIndex={0} className='draggable-layout-droppable' />;

  return (
    <div
      style={isDragging ? { zIndex: 99999, transform: 'scale(1.02)', opacity: 0.9, position: 'absolute', width: width, height: height, left: left, top: top } : null}
      key={id}
      id={id}
      tabIndex={0}
      className='draggable-layout-droppable draggable-layout-droppable-visible'
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
    >
      <div>{children}</div>
    </div>
  );
};

export default Draggable;