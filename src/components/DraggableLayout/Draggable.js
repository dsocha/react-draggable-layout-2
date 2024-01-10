import React, { useState } from 'react';

const Draggable = ({ id, children, onDragStart, onDragEnd }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0);
  const [calclulatedOffsetLeft, setCalclulatedOffsetLeft] = useState(0);
  const [calclulatedOffsetTop, setCalclulatedOffsetTop] = useState(0);

  const onMouseDown = (e) => {
    //console.log('onMouseDown(), e:', e);

    const { pageX, pageY } = e;
    const { offsetHeight, offsetWidth, offsetLeft, offsetTop } = e.target;
    const { borderRadius } = window.getComputedStyle(e.target);

    // <set size>
    setHeight(offsetHeight);
    setWidth(offsetWidth);
    // </set size>

    // <set dragging position>
    const col = pageX - offsetLeft;
    const cot = pageY - offsetTop;
    setCalclulatedOffsetLeft(col);
    setCalclulatedOffsetTop(cot);
    setLeft(pageX - col);
    setTop(pageY - cot);
    // </set dragging position>

    if (onDragStart) onDragStart({ id, height: `${offsetHeight}px`, width: `${offsetWidth}px`, borderRadius });
    setIsDragging(true);
  };

  const onMouseUp = (e) => {
    // console.log('onMouseUp(), e:', e);
    if (!isDragging) return;
    if (onDragEnd) onDragEnd({ id });
    setIsDragging(false);
  };

  const onMouseMove = (e) => {
    if (!isDragging) return;
    const { pageX, pageY } = e;
    setLeft(pageX - calclulatedOffsetLeft);
    setTop(pageY - calclulatedOffsetTop);
  };

  const onMouseLeave = (e) => {
    // console.log('onMouseLeave(), e:', e);
    if (!isDragging) return;
    if (onDragEnd) onDragEnd({ id });
    setIsDragging(false);
  };

  return (
    <div style={isDragging ? { zIndex: 99999, opacity: 0.9, position: 'absolute', width: width, height: height, left: left, top: top } : null} key={id} id={id} tabIndex={0} onMouseDown={onMouseDown} onMouseUp={onMouseUp} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
      {children}
    </div>
  );
};

export default Draggable;
