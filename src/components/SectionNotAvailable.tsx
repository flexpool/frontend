import styled from 'styled-components';
import { Img } from './Img';

const Wrapper = styled.div`
  margin-top: 100px;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const Image = styled(Img)`
  height: 240px;
`;

const Title = styled.div`
  margin-top: 40px;
  font-size: 1.5rem;
  font-weight: 700;
`;

const Desc = styled.div`
  margin-top: 0.5rem;
  color: var(--text-secondary);
`;

export const SectionNotAvailable: React.FC<{
  imageURL: string;
  imageAlt?: string;
  description: string;
  title: string;
}> = ({ imageURL, imageAlt = 'not available', title, description }) => (
  <Wrapper>
    <div className="image">
      <Image src={imageURL} alt={imageAlt} />
    </div>
    <Title>{title}</Title>
    <Desc>{description}</Desc>
  </Wrapper>
);
