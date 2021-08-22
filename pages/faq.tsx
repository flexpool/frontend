import React, { useState } from 'react';
import _ from 'lodash';
import { NextSeo } from 'next-seo';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import styled from 'styled-components';
import {HeaderStat } from '@/components/layout/StatHeader';
import { useActiveCoinTicker } from '@/rdx/localSettings/localSettings.hooks';
import { Content } from '../src/components/layout/Content';
import { Page } from '../src/components/layout/Page';
import { CopyButton } from '../src/components/CopyButton';
import { FaLink } from 'react-icons/fa';

type FaqMarkdown = {
  attributes: { title: string, coin?: string };
  html: string;
  react: React.FC;
}

type FaqDataSection = {
  name: string;
  contents: {
    name: string;
    key: string;
    md: FaqMarkdown
  }[];
};

const SectionItem = styled.div`
  margin-top: -1px;
  border: 1px solid var(--border-color);
`;
const SectionItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const SectionTitle = styled.h3`
  font-size: 1.125rem;
  cursor: pointer;
  padding: 1rem 1.25rem;
  flex-grow: 1;
  &:hover {
    color: var(--primary);
  }
`;
const CopyWrapper = styled.div`
  padding-right: 0.75rem;
  padding-left: 1rem;
  margin-top: 0;
`;
const SectionContent = styled.div`
  padding: 1.25rem;
  padding-top: 0;
`;

const FSection = styled.div`
  margin-bottom: 5rem;
  margin-top: 1rem;
`;

const FaqQuestion: React.FC<{ data: FaqDataSection['contents'][0] }> = ({
  data: {
    key,
    md: {
      react: Comp,
      attributes: { title },
      html,
    },
  },
}) => {
  const [openQuestion, setOpenQuestion] = useState(false);

  return (
    <SectionItem>
      <SectionItemHeader>
        <SectionTitle id={key} onClick={() => setOpenQuestion(!openQuestion)}>
          <span>{title}</span>
        </SectionTitle>
        <CopyWrapper>
          <CopyButton
            icon={<FaLink />}
            description="Copy link"
            text={`${
              typeof window !== 'undefined'
                ? window.location.href.split('#')[0]
                : ''
            }#${key}`}
          />
        </CopyWrapper>
      </SectionItemHeader>
      {openQuestion && (
        <SectionContent dangerouslySetInnerHTML={{ __html: html }} />
      )}
    </SectionItem>
  );
};

const FaqSection: React.FC<FaqDataSection> = ({ name, contents }) => {
  const { t } = useTranslation('common');
  const selectedCoinTicker = useActiveCoinTicker();

  return (
    <>
      <FSection>
        <h2>{t(name)}</h2>
        {contents.filter((item) => {
          const markdownCoinAttribute = item.md.attributes.coin;
          return !markdownCoinAttribute || markdownCoinAttribute === selectedCoinTicker
        }).map((item) => (
          <FaqQuestion key={item.key} data={item} />
        ))}
      </FSection>
    </>
  );
};

const FaqContent = styled.div`
  p + table {
    margin-top: 1rem;
  }

  table + p {
    margin-top: 1rem;
  }

  table td {
    line-height: 1.4;
    font-weight: 400;
  }

  p {
    max-width: 100%;
  }

  h2 {
    margin-bottom: 1rem;
  }
  h3 {
    font-size: 1.125rem;
  }
  h4 {
    font-size: 1.25rem;
  }
`;

function FAQPage({ faq }) {
  const { i18n, t: seoT } = useTranslation('seo');

  return (
    <Page>
      <NextSeo
        title={seoT('title.faq')}
        description={seoT('website_description.faq')}
        openGraph={{
          title: seoT('title.faq'),
          description: seoT('website_description.faq'),
          locale: i18n.language,
        }}
        additionalMetaTags={[
          {
            property: 'keywords',
            content: seoT('keywords.faq'),
          },
        ]}
      />
      <HeaderStat>
        <h1>FAQ</h1>
      </HeaderStat>
      <Content >
        <FaqContent>
          {(faq || []).map((item) => (
            <FaqSection key={item.name} {...item} />
          ))}
        </FaqContent>
      </Content>
    </Page>
  );
}

export default FAQPage;

import { faqStructure } from '../src/docs/index';

const loadFaqMarkdown = (locale: string, item: string): FaqMarkdown | {} => {
  const isTranslationAvailable = !_.isError(
    _.attempt(() => require(`src/docs/${locale}/faq/${item}`))
  );

  if (isTranslationAvailable) return require(`src/docs/${locale}/faq/${item}`);
  const isEnglishAvailable = !_.isError(
    _.attempt(() => require(`src/docs/en-US/faq/${item}`))
  );

  if (isEnglishAvailable) return require(`src/docs/en-US/faq/${item}`);
  return {};
};

export async function getStaticProps({ locale }) {
  const loadFaq = faqStructure.map((section) => {
    return {
      name: section.sectionName,
      contents: section.contents
        .map((item) => {
          const markdown = loadFaqMarkdown(locale, item);
          if (_.isEmpty(markdown))
            console.log(`\x1b[91mERROR:\x1b[39m ${item} not found`);

          return {
            name: item,
            /**
             * "questions-about-flexpool/how-to-join.md"
             * => "how-to-join"
             */
            key: item.split('/')[1].replace('.md', ''),
            md: markdown,
          };
        })
        .filter((item) => !_.isEmpty(item.md)),
    };
  });

  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
        'cookie-consent',
        'seo',
      ])),
      faq: loadFaq,
    },
  };
}
