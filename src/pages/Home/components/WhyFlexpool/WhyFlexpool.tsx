import { Wrapper, Title, Image, ItemsContainer, Item } from './components';
import { useTranslation } from 'react-i18next';
import { Content } from 'src/components/layout/Content';
import { Spacer } from 'src/components/layout/Spacer';

export const WhyFlexpool = () => {
  const { t } = useTranslation('home');
  return (
    <Wrapper>
      <Content padding>
        <Spacer size="xl" />
        <Title>{t('why_section.title')}</Title>
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
