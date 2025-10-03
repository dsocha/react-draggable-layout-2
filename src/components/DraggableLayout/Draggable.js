import React, { useState, useEffect, useRef } from 'react';

const Draggable = ({ id, children, onDragStart, onDragEnd, hidden, ignoredClassList, ignoredClassPrefixList, enabled, rootComponentId, extraOffsetX }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0);
  const [calculatedOffsetLeft, setCalculatedOffsetLeft] = useState(0);
  const [calculatedOffsetTop, setCalculatedOffsetTop] = useState(0);

  // Use refs to access latest values in event handlers
  const offsetLeftRef = useRef(0);
  const offsetTopRef = useRef(0);
  const isDraggingRef = useRef(false);

  // Document-level mouse move handler
  const handleDocumentMouseMove = (e) => {
    if (!enabled || !isDraggingRef.current) return;
    e.preventDefault();
    const { clientX, clientY } = e;
    setLeft(clientX - offsetLeftRef.current);
    setTop(clientY - offsetTopRef.current);
  };

  // Document-level mouse up handler
  const handleDocumentMouseUp = (e) => {
    if (!enabled || !isDraggingRef.current) return;
    if (e.button !== 0) return;

    e.preventDefault();
    isDraggingRef.current = false;
    setIsDragging(false);

    if (onDragEnd) onDragEnd({ id });

    // Remove listeners
    document.removeEventListener('mousemove', handleDocumentMouseMove);
    document.removeEventListener('mouseup', handleDocumentMouseUp);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleDocumentMouseMove);
      document.removeEventListener('mouseup', handleDocumentMouseUp);
    };
  }, []);

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
    offsetLeftRef.current = offsetX;
    offsetTopRef.current = offsetY;

    setLeft(clientX - offsetX);
    setTop(clientY - offsetY);

    if (onDragStart) onDragStart({ id, height: `${rect.height}px`, width: `${rect.width}px`, borderRadius });

    isDraggingRef.current = true;
    setIsDragging(true);

    // Attach document-level event listeners
    document.addEventListener('mousemove', handleDocumentMouseMove, { passive: false });
    document.addEventListener('mouseup', handleDocumentMouseUp);
  };

  const onMouseUp = (e) => {
    // Fallback handler for mouse up on element (main handler is handleDocumentMouseUp)
    if (!enabled) return;
    if (e.button !== 0) return;
    if (!isDraggingRef.current) return;

    e.preventDefault();
    isDraggingRef.current = false;
    setIsDragging(false);

    if (onDragEnd) onDragEnd({ id });

    document.removeEventListener('mousemove', handleDocumentMouseMove);
    document.removeEventListener('mouseup', handleDocumentMouseUp);
  };

  const onMouseMove = (e) => {
    // Local handler kept for compatibility, main work done by handleDocumentMouseMove
    if (!enabled) return;
    if (!isDraggingRef.current) return;
    e.preventDefault();
    const { clientX, clientY } = e;
    setLeft(clientX - offsetLeftRef.current);
    setTop(clientY - offsetTopRef.current);
  };

  const onMouseLeave = (e) => {
    // Removed drag end on mouse leave - dragging continues via document listeners
  };

  if (hidden) return <div key={id} id={id} tabIndex={0} className={enabled ? 'draggable-layout-droppable' : null} />;

  const draggingStyle = isDragging
    ? {
        zIndex: 99999,
        transform: 'scale(1.02)',
        opacity: 0.9,
        position: 'fixed',
        width: width,
        height: height,
        left: left,
        top: top,
        cursor: 'grabbing',
        pointerEvents: 'none', // Prevent interference from child elements
        userSelect: 'none', // Prevent text selection during drag
      }
    : null;

  return (
    <div style={draggingStyle} key={id} id={id} tabIndex={0} className={`${enabled ? 'draggable-layout-droppable' : null} draggable-layout-droppable-visible`} onMouseDown={onMouseDown} onMouseUp={onMouseUp} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
      <div>{children}</div>
    </div>
  );
};

export default Draggable;
