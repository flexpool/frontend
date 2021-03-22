import styled from 'styled-components/macro';

const gap = '1rem';

const FGBase = styled.div`
  & > *:not(:last-child) {
    margin-bottom: ${gap};
  }
`;

export const FieldGroup = {
  H: styled(FGBase)`
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    grid-gap: ${gap};
    & > * {
      margin: 0 !important;
    }
    align-items: center;
    ${(p: { center?: boolean }) => (p.center ? `align-items: center` : '')};
  `,
  V: FGBase,
};
