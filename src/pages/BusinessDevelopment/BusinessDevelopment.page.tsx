import { Page } from 'src/components/layout/Page';
import { Content } from 'src/components/layout/Content';
import { Helmet } from 'react-helmet-async';

export const BusinessDevelopmentPage = () => {
  return (
    <Page>
      <Helmet>
        <title>Contact</title>
      </Helmet>
      <Content md paddingLg>
        <h1>Business Development</h1>
        <h2>Get in touch!</h2>
        <p>
          We are open for discussions about your cooperation with our business.
          If you have a business proposition, or want to partner with us,
          please, reach us at <a href="mailto:hq@flexpool.io">hq@flexpool.io</a>
          .
        </p>
      </Content>
    </Page>
  );
};

export default BusinessDevelopmentPage;
