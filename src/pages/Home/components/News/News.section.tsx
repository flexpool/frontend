import {
  ItemWrapper,
  Category,
  Title,
  Action,
  Wrapper,
  WrapperInner,
} from './components';
import Link from 'next/link';
import React from 'react';
import { Content } from 'src/components/layout/Content';
import { useTranslation } from 'react-i18next';

const HomeNewsItem: React.FC<{
  to?: string;
  href?: string;
  category: React.ReactNode;
  title: React.ReactNode;
  action: React.ReactNode;
}> = ({ to, href, category, title, action }) => {
  const innerContent = (
    <>
      <div>
        <Category>{category}</Category>
        <Title>{title}</Title>
      </div>
      <Action>{action}</Action>
    </>
  );
  return to ? (
    <ItemWrapper as={Link} href={to} className="home-news-item">
      {innerContent}
    </ItemWrapper>
  ) : (
    <ItemWrapper href={href} target="_blank" rel="noreferrer noopener">
      {innerContent}
    </ItemWrapper>
  );
};

export const NewsSection = () => {
  const { t } = useTranslation('home');
  return (
    <Wrapper>
      <Content style={{ position: 'relative' }}>
        <WrapperInner>
          <HomeNewsItem
            category={t('news_section.join_us.pre_title')}
            title={t('news_section.join_us.title')}
            action={t('news_section.join_us.cta')}
            href="/get-started"
          />
          <HomeNewsItem
            category={t('news_section.learn.pre_title')}
            title={t('news_section.learn.title')}
            action={t('news_section.learn.cta')}
            href="https://medium.com/flexpool/"
          />
          <HomeNewsItem
            category={t('news_section.support.pre_title')}
            title={t('news_section.support.title')}
            action={t('news_section.support.cta')}
            href="/support"
          />
        </WrapperInner>
      </Content>
    </Wrapper>
  );
};
