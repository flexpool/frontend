import { useTranslation } from 'react-i18next';
import { Img } from 'src/components/Img';
import { Content } from 'src/components/layout/Content';
import { Spacer } from 'src/components/layout/Spacer';
import styled from 'styled-components/macro';
const Wrapper = styled.div`
  background: var(--bg-primary);
  border-top: 1px solid var(--border-color);
`;
const Title = styled.h2`
  text-align: center;
  margin-bottom: 3rem;
`;

const Image = styled(Img)`
  height: 150px;
`;

const ItemsContainer = styled.div`
  display: flex;
  display: grid;
  margin-top: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  * {
    text-align: center;
  }
  p {
    color: var(--text-secondary);
  }
`;

export const WhyFlexpool = () => {
  const { t } = useTranslation('home');
  return (
    <Wrapper>
      <Content padding>
        <Spacer size="xl" />
        <Title>Why Flexpool</Title>
        <ItemsContainer>
          <Item>
            <Image
              height="150"
              width="185"
              src="/illustrations/moon.svg"
              alt={t('why_section.item_1.title')}
            />
            <h3>{t('why_section.item_1.title')}</h3>
            <p>{t('why_section.item_1.description')}</p>
          </Item>
          <Item>
            <Image
              height="150"
              width="242"
              src="/illustrations/horseride.svg"
              alt={t('why_section.item_2.title')}
            />
            <h3>{t('why_section.item_2.title')}</h3>
            <p>{t('why_section.item_2.description')}</p>
          </Item>
        </ItemsContainer>
        <Spacer size="xl" />
      </Content>
    </Wrapper>
  );
};
