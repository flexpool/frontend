import { Link } from 'react-router-dom';
import { Button } from 'src/components/Button';
import { Content } from 'src/components/layout/Content';
import { Ws } from 'src/components/Typo/Typo';
import styled from 'styled-components/macro';

const StartButton = styled(Button)`
  color: var(--primary);
`;

const Wrapper = styled.section`
  background: var(--primary);
  color: var(--text-on-bg);
  --text-primary: white;
`;

const Split = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 3rem;
  padding-bottom: 3rem;
  @media screen and (max-width: 768px) {
    flex-direction: column;
    & > *:not(:first-child) {
      margin-top: 1rem;
    }
  }
`;

export const GetStartedSection = () => {
  return (
    <Wrapper>
      <Content>
        <Split>
          <h2>Ready to get started?</h2>
          <StartButton as={Link} to="/get-started" size="lg">
            <Ws>Start Mining</Ws>
          </StartButton>
        </Split>
      </Content>
    </Wrapper>
  );
};
