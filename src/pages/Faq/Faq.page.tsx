import React from 'react';
import { Content } from 'src/components/layout/Content';
import styled from 'styled-components';
import FAQIndex from '../../docs/faq/index.json';

type FAQSection = {
  sectionName: string;
  contents: string[];
};

const SectionItem = styled.div`
  margin-top: 2rem;
`;

const FaqSection: React.FC<FAQSection> = ({ sectionName, contents }) => {
  const ct = contents.map((item) => ({
    name: item,
    md: require(`src/docs/faq/${item}`) as {
      attributes: { title: string };
      react: React.FC;
    },
  }));
  console.log(ct);
  return (
    <div>
      <h2>{sectionName}</h2>
      {ct.map(({ name, md: { react: Comp, attributes: { title } } }) => (
        <SectionItem key={name}>
          <h3>{title}</h3>
          <Comp />
        </SectionItem>
      ))}
    </div>
  );
};

export const FaqPage = () => {
  return (
    <>
      <Content padding>
        {FAQIndex.map((item) => (
          <FaqSection key={item.sectionName} {...item} />
        ))}
      </Content>
    </>
  );
};
