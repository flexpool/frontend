import styled from 'styled-components/macro';

// use with parent position:relative
export const OverlayWithin = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.8);
  z-index: 50;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 1rem;
  text-align: center;
  backdrop-filter: blur(3px);
  &.dark {
    background: rgba(0, 0, 0, 0.8);
  }
  &.indigo {
    background: $color-primary;
    text-align: center;
    & *,
    & {
      color: white;
    }
  }
`;
