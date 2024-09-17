import React, { useState } from 'react';

const Draggable = ({ id, children, onDragStart, onDragEnd, hidden, ignoredClassList, ignoredClassPrefixList, enabled, rootComponentId, extraOffsetX }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0);
  const [calculatedOffsetLeft, setCalculatedOffsetLeft] = useState(0);
  const [calculatedOffsetTop, setCalculatedOffsetTop] = useState(0);

  const onMouseDown = (e) => {
    if (!enabled) return;
    if (e.button !== 0) return;

    let currentElement = e.target;

    while (currentElement && currentElement !== e.currentTarget) {
      // console.log('onMouseDown', currentElement.classList);

      // <excludes>
      if (currentElement.classList.contains('draggable-layout-exclude')) return;
      if (Array.isArray(ignoredClassList) && ignoredClassList.some((c) => currentElement.classList.contains(c))) return;
      if (Array.isArray(ignoredClassPrefixList) && ignoredClassPrefixList.some((c) => currentElement.classList.value.startsWith(c))) return;
      // </excludes>

      currentElement = currentElement.parentElement;
    }

    const { clientX, clientY, pageX, pageY } = e;

    // console.log('aaaa 1', clientX, clientY, pageY, screenY);

    const elements = document.elementsFromPoint(clientX, clientY);
    if (!elements) return;
    const element = elements.find((e) => e.id === id);
    if (!element) return;
    const targetComponentElement = element.children[0];

    const { offsetHeight, offsetWidth, offsetLeft, offsetTop } = targetComponentElement;
    const { borderRadius } = window.getComputedStyle(targetComponentElement);

    setHeight(offsetHeight);
    setWidth(offsetWidth);

    let scrollTop = 0;
    if (rootComponentId) {
      const root = document.getElementById(rootComponentId);
      if (root?.scrollTop) scrollTop = root.scrollTop;
    }

    const col = pageX - offsetLeft - extraOffsetX;
    const cot = pageY - offsetTop + scrollTop;

    //console.log('aaaa 2', col, pageX, offsetLeft, extraOffsetX);

    setCalculatedOffsetLeft(col);
    setCalculatedOffsetTop(cot);
    setLeft(pageX - col);
    setTop(pageY - cot);

    if (onDragStart) onDragStart({ id, height: `${offsetHeight}px`, width: `${offsetWidth}px`, borderRadius });
    setIsDragging(true);
  };

  const onMouseUp = (e) => {
    if (!enabled) return;
    if (e.button !== 0) return;
    if (!isDragging) return;
    if (onDragEnd) onDragEnd({ id });
    setIsDragging(false);
  };

  const onMouseMove = (e) => {
    if (!enabled) return;
    if (!isDragging) return;
    const { clientX, clientY, movementX, movementY } = e;
    setLeft(movementX + clientX - calculatedOffsetLeft);
    setTop(movementY + clientY - calculatedOffsetTop);
  };

  if (hidden) return <div key={id} id={id} tabIndex={0} className='draggable-layout-droppable' />;

  return (
    <div style={isDragging ? { zIndex: 99999, transform: 'scale(1.02)', opacity: 0.9, position: 'fixed', width: width, height: height, left: left, top: top } : null} key={id} id={id} tabIndex={0} className={`${enabled && 'draggable-layout-droppable'} draggable-layout-droppable-visible`} onMouseDown={onMouseDown} onMouseUp={onMouseUp} onMouseMove={onMouseMove}>
      <div>{children}</div>
    </div>
  );
};

export default Draggable;
