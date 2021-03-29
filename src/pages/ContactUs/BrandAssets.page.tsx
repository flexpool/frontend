import React from 'react';
import { Page } from 'src/components/layout/Page';
import copy from 'copy-to-clipboard';
import { Content } from 'src/components/layout/Content';
import { Button } from 'src/components/Button';
import styled from 'styled-components';
import { LinkOut } from 'src/components/LinkOut';
import { Spacer } from 'src/components/layout/Spacer';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export const ContactUsPage = () => {
  return (
    <Page>
      <Helmet>
        <title>Contact</title>
      </Helmet>
      <Content md paddingLg>
        <h1>Contact Flexpool</h1>
        <p style={{ marginTop: '30px' }}>
          To contact us, please, use{' '}
          <a href="mailto:hq@flexpool.io">hq@flexpool.io</a>. Note that we do
          not provide support by this email address. For getting support, please
          visit <Link to="/support">Support</Link>.
        </p>
      </Content>
    </Page>
  );
};
