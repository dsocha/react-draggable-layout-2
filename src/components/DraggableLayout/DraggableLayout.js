import Styles from './DraggableLayout.styles';
import React, { useEffect, useState } from 'react';
import Draggable from './Draggable';

const DraggableLayout = ({ components, columns, mainColumnIndex }) => {
  const [columnsComponents, setColumnsComponents] = useState(null);
  const [draggingElementId, setDraggingElementId] = useState(false);

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

  // useEffect(() => {
  //   // console.log('columnsComponents', columnsComponents);
  // }, [columnsComponents]);

  const handleGlobalMouseMove = (e) => {
    if (!draggingElementId) return;
    const { pageX, pageY } = e;
    const elements = document.elementsFromPoint(pageX, pageY);
    const draggableElement = elements.find((e) => e.classList.contains('draggable-layout-draggable') && e.id !== draggingElementId);
    console.log('elements:', draggableElement);
  };

  const handleOnDragStart = async (e) => {
    // console.log('handleOnDragStart(), e:', e);
    const element = document.getElementById(e.id);
    const elementParent = document.getElementById(e.id).parentElement;
    const placeholder = getPlaceHolder(e.height, e.borderRadius);
    elementParent.insertBefore(placeholder, element);
    setDraggingElementId(e.id);
  };

  const getPlaceHolder = (height, borderRadius) => {
    // console.log('getPlaceHolder()', height);
    let placeholder = document.createElement('div');
    placeholder.id = 'draggable-layout-placeholder';
    placeholder.style.position = 'relative';
    placeholder.style.width = '100%';
    placeholder.style.height = height;
    placeholder.style.borderRadius = borderRadius;
    placeholder.style.backgroundColor = '#88888888';
    placeholder.onmouseenter = (e) => {
      console.log('placeholder.onmouseenter(), e:', e);
      placeholder.style.backgroundColor = '#bb888844';
    };
    placeholder.onmouseleave = (e) => {
      console.log('placeholder.onmouseleave(), e:', e);
      placeholder.style.backgroundColor = '#11888888';
    };
    return placeholder;
  };

  const handleOnDragEnd = async (e) => {
    //console.log('handleOnDragEnd(), e:', e);
    const elementParent = document.getElementById(e.id).parentNode;
    const placeholder = document.getElementById('draggable-layout-placeholder');
    elementParent.removeChild(placeholder);
    setDraggingElementId(null);
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
