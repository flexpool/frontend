import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import styled from 'styled-components';
import { Helmet } from 'react-helmet-async';
import { FaLink } from 'react-icons/fa';
import { useOpenState } from '../src/hooks/useOpenState';
import { useAsyncState } from '../src/hooks/useAsyncState';

// Components
import { Content } from '../src/components/layout/Content';
import { Page } from '../src/components/layout/Page';
import { CopyButton } from '../src/components/CopyButton';
import { FaqDocs } from '../src/docs/docs.utils';

type FaqDataSection = {
  name: string;
  contents: {
    name: string;
    key: string;
    md: {
      attributes: {
        title: string;
      };
      html: string;
      react: React.FC;
    };
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
  return (
    <>
      <FSection>
        <h2>{t(name)}</h2>
        {contents.map((item) => (
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
  // const asyncState = useAsyncState<FaqDocs>();
  const { i18n } = useTranslation();

  // React.useEffect(() => {
  //   asyncState.start(
  //     import(`../src/docs/@faq/${i18n.language}`)
  //       .then((r) => {
  //         console.log(r.default);
  //         return r.default;
  //       })
  //       .catch(() => import(`../src/docs/@faq/en-US`).then((r) => r.default))
  //   );
  //   // eslint-disable-next-line
  // }, [i18n.language]);

  return (
    <Page>
      {/* <Helmet>
        <title>FAQ</title>
      </Helmet> */}
      <Content paddingLg>
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

export async function getStaticProps({ locale }) {
  const loadFaq = faqStructure.map((section) => ({
    name: section.sectionName,
    contents: section.contents.map((item) => ({
      name: item,
      /**
       * "questions-about-flexpool/how-to-join.md"
       * => "how-to-join"
       */
      key: item.split('/')[1].replace('.md', ''),
      md: require(`src/docs/${locale}/faq/${item}`) as {
        attributes: { title: string };
        react: React.FC;
      },
    })),
  }));

  console.log(loadFaq[0].contents);
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'cookie-consent'])),
      faq: loadFaq,
    },
  };
}
