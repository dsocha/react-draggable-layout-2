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

    // Use getBoundingClientRect to get viewport-relative position
    const rect = targetComponentElement.getBoundingClientRect();
    const { borderRadius } = window.getComputedStyle(targetComponentElement);

    setHeight(rect.height);
    setWidth(rect.width);

    // Calculate the offset between mouse position and element's top-left corner
    // Using clientX/clientY and rect (both viewport-relative) for consistency with position:fixed
    const offsetX = clientX - rect.left - extraOffsetX;
    const offsetY = clientY - rect.top;

    console.log('Mouse click offset:', { offsetX, offsetY, rectTop: rect.top, rectLeft: rect.left, clientX, clientY });

    setCalculatedOffsetLeft(offsetX);
    setCalculatedOffsetTop(offsetY);
    setLeft(clientX - offsetX);
    setTop(clientY - offsetY);

    if (onDragStart) onDragStart({ id, height: `${rect.height}px`, width: `${rect.width}px`, borderRadius });
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
    const { clientX, clientY } = e;
    // Use clientX/clientY directly since position:fixed is viewport-relative
    setLeft(clientX - calculatedOffsetLeft);
    setTop(clientY - calculatedOffsetTop);
  };

  const onMouseLeave = (e) => {
    if (!enabled) return;
    if (!isDragging) return;
    if (onDragEnd) onDragEnd({ id });
    setIsDragging(false);
  };

  if (hidden) return <div key={id} id={id} tabIndex={0} className={enabled ? 'draggable-layout-droppable' : null} />;

  return (
    <div style={isDragging ? { zIndex: 99999, transform: 'scale(1.02)', opacity: 0.9, position: 'fixed', width: width, height: height, left: left, top: top } : null} key={id} id={id} tabIndex={0} className={`${enabled ? 'draggable-layout-droppable' : null} draggable-layout-droppable-visible`} onMouseDown={onMouseDown} onMouseUp={onMouseUp} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
      <div>{children}</div>
    </div>
  );
};

export default Draggable;
