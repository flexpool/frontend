import styled from 'styled-components';
import { HeroBlue } from 'src/components/layout/Hero/HeroBlue';
import { Page } from 'src/components/layout/Page';

export const Hero = styled(HeroBlue)`
  min-height: 40vh;
  padding-top: 10rem;
  padding-bottom: 10rem;
  position: relative;
  @media screen and (max-width: 800px) {
    margin-bottom: 0;
    padding-bottom: 3rem;
  }
`;

export const SearchWrapper = styled.div`
  max-width: 600px;
  width: 100%;
  margin-top: 2rem;
  border-radius: 5px;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.3);
`;

export const PageContainer = styled(Page)`
  background: var(--bg-secondary);
`;
