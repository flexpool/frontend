import { useState } from 'react';
import { NextSeo } from 'next-seo';
import { Trans, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import styled from 'styled-components';
import copy from 'copy-to-clipboard';

import { Page } from '../src/components/layout/Page';
import { Content } from '../src/components/layout/Content';
import { Button } from '../src/components/Button';
import { LinkOut } from '../src/components/LinkOut';
import { Spacer } from '../src/components/layout/Spacer';
import { Img } from '../src/components/Img';

const ColorContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  & > * {
    margin: 1rem;
  }
`;
const ColorButton = styled.button`
  width: 120px;
  height: 70px;
  border-radius: 5px;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  font-size: 20px;
  cursor: pointer;
  border: none;
  outline: none;
`;

const ColorDesc = styled.div`
  text-align: center;
  margin-top: 0.5rem;
`;
const Logos = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-gap: 1rem;
  gap: 1rem;
`;
const LogoContainer = styled.div`
  padding: 3rem;
  background: white;
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  img {
    height: 50px;
  }
`;

const LogoContainerDark = styled(LogoContainer)`
  background: black;
`;

const Color: React.FC<{ colorCode: string; colorName: string }> = ({
  colorCode,
  colorName,
}) => {
  const [justCopied, setJustCopied] = useState(false);
  return (
    <div className="color-wrapper">
      <ColorButton
        style={{ backgroundColor: colorCode }}
        onClick={() => {
          copy(colorCode);
          setJustCopied(true);
        }}
        onMouseLeave={() => setJustCopied(false)}
      >
        {justCopied ? 'Copied' : colorCode}
      </ColorButton>
      <ColorDesc>{colorName}</ColorDesc>
    </div>
  );
};

export const BrandAssetsPage = () => {
  const { t } = useTranslation('brand-assets');
  return (
    <Page>
      <NextSeo title={t('head_title')} />

      <Content md paddingLg>
        <h2>{t('brand_name.title')}</h2>
        <p>
          <Trans
            i18nKey="brand_name.description"
            components={{ b: <b /> }}
            ns="brand-assets"
          />
        </p>
        {/* <div style={{ marginTop: "30px" }}>
      <BrandNameExample correct={true} example={"Flexpool"} />
      <BrandNameExample correct={true} example={"Flexpool.io"} />
    </div>
    <div style={{ marginTop: "30px" }}>
      <BrandNameExample correct={false} example={"FlexPool"} />
      <BrandNameExample correct={false} example={"Flex pool"} />
      <BrandNameExample correct={false} example={"flexpool"} />
    </div> */}
        <h2>{t('colors.title')}</h2>
        <ColorContainer>
          <Color colorCode="#0069ff" colorName={t('colors.accent')} />
          <Color colorCode="#1633ff" colorName={t('colors.blue')} />
          <Color colorCode="#15cd72" colorName={t('colors.green')} />
          <Color colorCode="#edb431" colorName={t('colors.yellow')} />
          <Color colorCode="#ed4f32" colorName={t('colors.red')} />
        </ColorContainer>
        <h2>{t('typo.title')}</h2>
        <p>
          <Trans
            i18nKey="typo.description"
            ns="brand-assets"
            values={{
              fontName: 'Inter',
            }}
            components={{
              font: <LinkOut href="https://fonts.google.com/specimen/Inter" />,
            }}
          />
        </p>
        <h2>{t('guidelines.title')}</h2>
        <p>{t('guidelines.description')}</p>
        <ul>
          <li>{t('guidelines.item_one')}</li>
          <li>{t('guidelines.item_two')}</li>
          <li>{t('guidelines.item_three')}</li>
        </ul>
        <div className="splitter" />
        <h2>{t('downloads.title')}</h2>
        <p>{t('downloads.description')}</p>
        <Logos>
          <LogoContainer>
            <Img
              src="https://static.flexpool.io/assets/brand/light.svg"
              alt="Flexpool Logo"
            />
          </LogoContainer>
          <LogoContainer>
            <Img
              src="https://static.flexpool.io/assets/brand/icon.svg"
              alt="Flexpool Icon"
            />
          </LogoContainer>
          <LogoContainerDark>
            <Img
              src="https://static.flexpool.io/assets/brand/dark.svg"
              alt="Flexpool Logo (Dark)"
            />
          </LogoContainerDark>
          <LogoContainerDark>
            <Img
              src="https://static.flexpool.io/assets/brand/icon.svg"
              alt="Flexpool Icon"
            />
          </LogoContainerDark>
        </Logos>
        <Spacer />
        <div>
          <Button
            variant="primary"
            shape="block"
            as={LinkOut}
            href="http://static.flexpool.io/dl/Flexpool_Brand.zip"
          >
            {t('downloads.cta')}
          </Button>
        </div>
        <div className="splitter" />
        <h2>{t('legal.title')}</h2>
        <p>
          <Trans
            i18nKey="legal.description"
            ns="brand-assets"
            values={{
              email: 'hq@flexpool.io',
            }}
            components={{
              terms: (
                <LinkOut href="https://static.flexpool.io/legal/terms.pdf" />
              ),
              email: <LinkOut href="mailto:hq@flexpool.io" />,
            }}
          />
        </p>
      </Content>
    </Page>
  );
};

export default BrandAssetsPage;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
        'brand-assets',
        'cookie-consent',
      ])),
    },
  };
}
