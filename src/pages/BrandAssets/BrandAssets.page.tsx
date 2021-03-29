import React from 'react';
import { Page } from 'src/components/layout/Page';
import copy from 'copy-to-clipboard';
import { Content } from 'src/components/layout/Content';
import { Button } from 'src/components/Button';
import styled from 'styled-components';
import { LinkOut } from 'src/components/LinkOut';
import { Spacer } from 'src/components/layout/Spacer';

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
  const [justCopied, setJustCopied] = React.useState(false);
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
  return (
    <Page>
      <Content md paddingLg>
        <h1>Our Brand Name</h1>
        <p>
          Our brand name is <b>Flexpool.io</b>. Words "Flex" and "pool" combined
          together with one capital F and the .io ending.
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
        <h1>Colors</h1>
        <ColorContainer>
          <Color colorCode="#0069ff" colorName="Accent Color" />
          <Color colorCode="#1633ff" colorName="Blue Color" />
          <Color colorCode="#15cd72" colorName="Green Color" />
          <Color colorCode="#edb431" colorName="Yellow Color" />
          <Color colorCode="#ed4f32" colorName="Red Color" />
        </ColorContainer>
        <h1>Typography</h1>
        <p>
          We use <a href="https://fonts.google.com/specimen/Inter">Inter</a>{' '}
          font across our website.
        </p>
        <h1>Branding Guidelines</h1>
        <p>
          By using our Branding Assets, you must follow our branding guidelines:
          <ul style={{ marginLeft: '30px', marginTop: '15px' }}>
            <li>
              You are now allowed to alter the logo. This includes shape and
              color changes.
            </li>
            <li style={{ marginTop: '5px' }}>
              You are not allowed to use Flexpool.io Brand to imply a
              relationship and/or an affiliation with any other business unless
              we have announced the partnership. Example: "... in partnership
              with Flexpool.io."
            </li>
            <li style={{ marginTop: '5px' }}>
              You are not allowed to use the Flexpool.io Branding in illegal and
              promotional context.
            </li>
          </ul>
        </p>
        <div className="splitter" />
        <h1>Downloads</h1>
        <p>
          We have collected a package containing all types of Flexpool.io logos
          for both Ligth and Dark themes.
        </p>
        <Logos>
          <LogoContainer>
            <img
              src="https://static.flexpool.io/assets/brand/logo.svg"
              alt="Flexpool Logo"
            />
          </LogoContainer>
          <LogoContainer>
            <img
              src="https://static.flexpool.io/assets/brand/icon.svg"
              alt="Flexpool Icon"
            />
          </LogoContainer>
          <LogoContainerDark>
            <img
              src="https://static.flexpool.io/assets/brand/logo-white.svg"
              alt="Flexpool Logo (White)"
            />
          </LogoContainerDark>
          <LogoContainerDark>
            <img
              src="https://static.flexpool.io/assets/brand/icon-white.svg"
              alt="Flexpool Icon (White)"
            />
          </LogoContainerDark>
        </Logos>
        <Spacer />
        <div>
          <Button
            variant="primary"
            block
            as={LinkOut}
            href="http://static.flexpool.io/dl/Flexpool_Brand.zip"
          >
            Download the Branding Pack
          </Button>
        </div>
        <div className="splitter" />
        <h1>Legal Notices</h1>
        <p>
          By using our Branding Assets, you agree with the Branding Guidelines
          and our <a href="https://flexpool.io/legal/FP-TO.pdf">Terms</a>. If
          you need to get assistance about the usage of the Flexpool.io
          branding, you can contact us at{' '}
          <a href="mailto:hq@flexpool.io">hq@flexpool.io</a>.
        </p>
      </Content>
    </Page>
  );
};
