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
    //console.log('onMouseDown(), e:', e);

    const { pageX, pageY } = e;
    const { offsetHeight, offsetWidth, offsetLeft, offsetTop } = e.target;

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

    setIsDragging(true);
  };

  const onMouseUp = (e) => {
    // console.log('onMouseUp(), e:', e);
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
    setIsDragging(false);
  };

  return (
    <div style={isDragging ? { opacity: 0.9, position: 'absolute', width: width, height: height, left: left, top: top } : null} key={id} id={id} tabIndex={0} onMouseDown={onMouseDown} onMouseUp={onMouseUp} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
      {children}
    </div>
  );
};

export default Draggable;
