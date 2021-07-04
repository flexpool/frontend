import styled from 'styled-components';

export const StatItemGrid = styled.div`
display: grid;
grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
gap: 1rem;
width: 100%;
`;

export const StatGrid = styled.div`
display: grid;
grid-template-columns: 1fr 1fr;
gap: 1rem;
`;

export const AverageTooltipItem = styled.div`
  display: flex;
  justify-content: space-between;
  line-height: 1.4;
  strong {
    margin-left: 1rem;
  }
`;