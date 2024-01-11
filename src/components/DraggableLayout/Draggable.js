import React, { useState } from 'react';

const Draggable = ({ id, children, onDragStart, onDragEnd, draggable }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0);
  const [calclulatedOffsetLeft, setCalclulatedOffsetLeft] = useState(0);
  const [calclulatedOffsetTop, setCalclulatedOffsetTop] = useState(0);

  const onMouseDown = (e) => {
    // console.log('onMouseDown(), e:', e.target);
    if (e.button !== 0) return;
    if (!draggable) return;

    // <get handle to the target component element>
    const { clientX, clientY } = e;
    const elements = document.elementsFromPoint(clientX, clientY);
    if (!elements) return;
    const element = elements.find((e) => e.id === id);
    if (!element) return;
    const targetComponentElement = element.children[0];
    // </get handle to the target component element>

    // <prepare params>
    const { offsetHeight, offsetWidth, offsetLeft, offsetTop } = targetComponentElement;
    const { borderRadius } = window.getComputedStyle(targetComponentElement);
    // </prepare params>

    // <set size>
    setHeight(offsetHeight);
    setWidth(offsetWidth);
    // </set size>

    // <set dragging position>
    const col = clientX - offsetLeft;
    const cot = clientY - offsetTop;
    setCalclulatedOffsetLeft(col);
    setCalclulatedOffsetTop(cot);
    setLeft(clientX - col);
    setTop(clientY - cot);
    // </set dragging position>

    if (onDragStart) onDragStart({ id, height: `${offsetHeight}px`, width: `${offsetWidth}px`, borderRadius });
    setIsDragging(true);
  };

  const onMouseUp = (e) => {
    // console.log('onMouseUp(), e:', e);
    if (e.button !== 0) return;
    if (!isDragging) return;
    if (onDragEnd) onDragEnd({ id });
    setIsDragging(false);
  };

  const onMouseMove = (e) => {
    if (!isDragging) return;
    const { clientX, clientY } = e;
    setLeft(clientX - calclulatedOffsetLeft);
    setTop(clientY - calclulatedOffsetTop);
  };

  const onMouseLeave = (e) => {
    //console.log('onMouseLeave(), e:', e);
    if (e.button !== 0) return;
    if (!isDragging) return;
    if (onDragEnd) onDragEnd({ id });
    setIsDragging(false);
  };

  return (
    <div style={isDragging ? { zIndex: 99999, transform: 'scale(1.02)', opacity: 0.9, position: 'absolute', width: width, height: height, left: left, top: top } : null} key={id} id={id} tabIndex={0} className='draggable-layout-droppable' onMouseDown={onMouseDown} onMouseUp={onMouseUp} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
      {children}
    </div>
  );
};

export default Draggable;
