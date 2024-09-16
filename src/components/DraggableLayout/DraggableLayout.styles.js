import styled from 'styled-components';

const Styles = styled.div`
  min-height: 100%;
  width: 100%;

  div.draggable-layout-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 100%;
    overflow: auto;
    gap: 4px;
  }

  div.draggable-layout-column-regular {
    display: flex;
    flex-direction: column;
    flex: 1;
    width: 100%;
    padding: 8px;
    max-width: 100% !important;
    overflow-x: hidden !important;
  }

  div.draggable-layout-column-master {
    display: flex;
    flex-direction: column;
    flex: 2;
    width: 100%;
    padding: 8px;
  }

  div.draggable-layout-droppable-visible {
    margin-bottom: 16px;
  }

  .draggable-layout-blinking {
    animation: draggable-layout-blinking-anim 0.4s linear infinite;
  }

  @keyframes draggable-layout-blinking-anim {
    50% {
      opacity: 0.7;
    }
  }

  div.draggable-layout-swinging {
    animation: draggable-layout-swinging-anim 0.5s linear infinite;
  }

  @keyframes draggable-layout-swinging-anim {
    0% {
      transform: rotate(-0.4deg);
    }
    50% {
      transform: rotate(0.4deg);
    }
  }

  @media screen and (max-width: 1023px) {
    div.draggable-layout-container {
      display: flex;
      flex-direction: column;
    }

    div.draggable-layout-last-element {
      flex: auto;
      width: 100%;
      height: 5px;
    }
  }

  @media screen and (min-width: 1024px) {
    div.draggable-layout-container {
      display: flex;
      flex-direction: row;
    }

    div.draggable-layout-last-element {
      flex: auto;
      width: 100%;
      height: 100px;
    }
  }
`;

export default Styles;
