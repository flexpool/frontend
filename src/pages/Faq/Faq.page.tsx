import React from 'react';
import { Link } from 'react-router-dom';
import { Content } from 'src/components/layout/Content';
import styled from 'styled-components/macro';
import FAQIndex from '../../docs/faq/index.json';
import copy from 'copy-to-clipboard';
import { Page } from 'src/components/layout/Page';

type FaqDataSection = {
  name: string;
  contents: {
    name: string;
    key: string;
    md: {
      attributes: {
        title: string;
      };
      react: React.FC;
    };
  }[];
};

const ListLink = styled(Link)`
  display: block;
  line-height: 1.4;
  margin-bottom: 0.5rem;
`;

const ListSection = styled.div`
  margin-bottom: 2rem;

  h3 {
    font-weight: 700;
    text-transform: uppercase;
    font-size: 1rem;
  }
`;

const FaqUl: React.FC<FaqDataSection> = ({ name, contents }) => {
  return (
    <ListSection>
      <h3>{name}</h3>
      {contents.map(({ key, md: { attributes: { title } } }) => (
        <ListLink key={key} to={`#${key}`}>
          {title}
        </ListLink>
      ))}
    </ListSection>
  );
};

/**
 *
 *
 *  Content
 *
 *
 */

const SectionItem = styled.div`
  margin-top: 2rem;
`;

const CopyHash = styled.button`
  cursor: pointer;
  color: var(--primary);
  display: inline-block;
  margin-right: 0.3rem;
  outline: none;
  border: none;
  height: auto;
  padding: 0;
  background: none !important;
  font-weight: 700;
  font-size: inherit;
  &:hover {
    opacity: 0.6;
  }
  &:active {
    opacity: 1;
  }
`;

const FSection = styled.div`
  margin-bottom: 5rem;
`;
const FaqSection: React.FC<FaqDataSection> = ({ name, contents }) => {
  const handleCopyToClipboard = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const idCopy = (e.target as HTMLButtonElement).value;
      const urlCopy = `${window.location.href.split('#')[0]}#${idCopy}`;
      copy(urlCopy);
    },
    []
  );

  return (
    <>
      <FSection>
        <h2>{name}</h2>
        {contents.map(({ key, md: { react: Comp, attributes: { title } } }) => (
          <SectionItem key={key}>
            <h3 id={key}>
              <CopyHash value={key} onClick={handleCopyToClipboard}>
                #
              </CopyHash>
              {title}
            </h3>
            <Comp />
          </SectionItem>
        ))}
      </FSection>
    </>
  );
};

const Split = styled.div`
  & > *:not(:first-child) {
    margin-left: 2rem;
  }

  @media screen and (min-width: 920px) {
    width: 100%;
    display: flex;
  }
`;

const FaqList = styled.div`
  width: 260px;
  flex-grow: 0;
  flex-shrink: 0;
  display: none;
  @media screen and (min-width: 920px) {
    display: block;
  }
`;

const FaqContent = styled.div`
  @media screen and (min-width: 920px) {
    flex-shrink: 1;
    width: 1px;
    flex-grow: 1;
  }
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

  h3 {
    font-size: 1.35rem;
  }
  h4 {
    font-size: 1.25rem;
  }
`;

export const FaqPage = () => {
  const faqSections = FAQIndex.map((section) => ({
    name: section.sectionName,
    contents: section.contents.map((item) => ({
      name: item,
      /**
       * "questions-about-flexpool/how-to-join.md"
       * => "how-to-join"
       */
      key: item.split('/')[1].replace('.md', ''),
      md: require(`src/docs/faq/${item}`) as {
        attributes: { title: string };
        react: React.FC;
      },
    })),
  }));
  return (
    <Page>
      <Content padding>
        <Split>
          <FaqContent>
            {faqSections.map((item) => (
              <FaqSection key={item.name} {...item} />
            ))}
          </FaqContent>
          <FaqList>
            {faqSections.map((item) => (
              <FaqUl key={item.name} {...item} />
            ))}
          </FaqList>
        </Split>
      </Content>
    </Page>
  );
};
