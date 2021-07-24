import { useEffect } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import styled from 'styled-components';
import { useRouter } from 'next/router';
import { partnersData } from '../src/pages/Partners/partnersData';

import { Img } from '../src/components/Img';
import { Card } from '../src/components/layout/Card';
import { Content } from '../src/components/layout/Content';
import { Page } from '../src/components/layout/Page';
import { Spacer } from '../src/components/layout/Spacer';
import { LinkOut } from '../src/components/LinkOut';

const LogoImg = styled(Img)`
  height: 50px;
`;

const ItemGrid = styled.div`
  display: grid;
  margin-top: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(280px, 400px));
  gap: 1rem;
  width: 100%;
`;

const Item = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem;
  h2 {
    margin-top: 1rem;
  }
  & * {
    pointer-events: none;
  }
  &:hover {
    box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.05);
    text-decoration: none;
  }
`;

export const PartnersPage = () => {
  const router = useRouter();
  useEffect(() => {
    if (partnersData.length < 1) {
      router.push('/');
    }
  }, [router]);
  return (
    <Page>
      {/* <Helmet>
        <title>Partners</title>
      </Helmet> */}
      <Content md paddingLg>
        <h1>Partners</h1>
        <Spacer />
        <ItemGrid>
          {partnersData.map((item) => (
            <Item key={item.title} as={LinkOut} href={item.url}>
              <LogoImg src={item.logoSrc} alt={`${item.title} Logo`} />
              <h2>{item.title}</h2>
              <p>{item.description}</p>
            </Item>
          ))}
        </ItemGrid>
      </Content>
    </Page>
  );
};

export default PartnersPage;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'cookie-consent'])),
    },
  };
}
