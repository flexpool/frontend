import styled from 'styled-components/macro';

export const Hero = styled.div`
  min-height: 40vh;
  padding-top: 4rem;
  padding-bottom: 4rem;
  background: var(--primary);
  display: flex;
  flex-direction: column;
  justify-content: center;

  --text-primary: white;

  h1 {
    font-size: 3rem;
  }

  position: relative;
`;

export const WorldMap = styled.img`
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 1;
  opacity: 0.3;
`;
