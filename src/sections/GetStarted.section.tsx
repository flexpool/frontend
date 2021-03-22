import { Button } from 'src/components/Button';
import { Content } from 'src/components/layout/Content';
import styled from 'styled-components/macro';

const Wrapper = styled.section`
  background: var(--primary);
  color: var(--text-on-bg);
`;

const Split = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 3rem;
  padding-bottom: 3rem;
`;

export const GetStartedSection = () => {
  return (
    <Wrapper>
      <Content>
        <Split>
          <h2>Ready to get started?</h2>
          <Button size="lg">Start Mining</Button>
        </Split>
      </Content>
    </Wrapper>
  );
};
