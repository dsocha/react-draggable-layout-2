import styled from 'styled-components';

const Styles = styled.div`
  height: 100%;
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
    gap: 12px;
    padding: 8px;
  }

  div.draggable-layout-column-master {
    display: flex;
    flex-direction: column;
    flex: 2;
    width: 100%;
    gap: 12px;
    padding: 8px;
  }

  .draggable-layout-blinking {
    animation: draggable-layout-blinking-anim 0.4s linear infinite;
  }

  @keyframes draggable-layout-blinking-anim {
    50% {
      opacity: 0.7;
    }
  }

  @media screen and (max-width: 1023px) {
    div.draggable-layout-container {
      display: flex;
      flex-direction: column;
    }
  }

  @media screen and (min-width: 1024px) {
    div.draggable-layout-container {
      display: flex;
      flex-direction: row;
    }
  }
`;

export default Styles;
