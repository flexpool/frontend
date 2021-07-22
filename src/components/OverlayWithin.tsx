import styled from 'styled-components';

// use with parent position:relative
export const OverlayWithin = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 500;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 1rem;
  text-align: center;
  backdrop-filter: blur(6px);
  border-radius: 5px;
  overflow: hidden;
`;

export const OverlayWithinOpacity = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--bg-primary);
  opacity: 0.5;
`;

export const OverlayWithinContent = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--bg-primary);
  display: flex;
  flex-direction: column;
  padding: 2rem;
  justify-content: center;
  align-items: center;
`;
