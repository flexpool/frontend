import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import { NextSeo } from 'next-seo';
import { Page } from '../src/components/layout/Page';
import { Content } from '../src/components/layout/Content';
import { Spacer } from '@/components/layout/Spacer';

export const Announcement = () => {
  return (
    <Page>
      <NextSeo title="The Merge Announcement" />
      <Content md paddingLg>
        <h1>Announcement: Flexpool.io Upcoming Merge and Withdrawals</h1>
        <p style={{ marginTop: '30px' }}>
          The Merge has been confirmed for September 15. With The Merge coming
          up, we strongly advise that all miners set their payouts to the lowest
          amount (0.01 ETH on mainnet, 0.005 on Polygon) to ensure that a large
          number of funds are not left on the pool. Post-Merge, we will continue
          to payout as usual; however, the network may be congested or unstable
          depending on how The Merge goes. Due to a large number of payouts, it
          takes us a few hourly cycles at low gas to complete most payouts.
          Polygon payouts will continue to run Post-Merge. Our support staff
          will be able to help you if you cannot edit your settings to enable a
          payout. Don&apos;t hesitate to contact them by following the
          instructions on{' '}
          <a href="https://www.flexpool.io/support">
            https://www.flexpool.io/support
          </a>
          . You can also ask about merging balances if you can provide digital
          signatures.
          <br />
          <br />
          Due to the number of inquiries, our support staff may be delayed in
          getting back to you after The Merge. Please include all relevant
          details in your first message, including your wallet address, issue,
          and requested settings if you request settings changes. At the time of
          writing this, the network gas price is at 20 GWei ($0.60), but we
          expect that there will be a spike before and after The Merge; if you
          want to be paid out promptly, we suggest setting your gas limit higher
          than 50 Gwei. We will hold unpaid balances for a minimum of 3 months
          after Ethereum mining stops. Please change your settings to initiate a
          withdrawal before then.
          <br />
          <br />
          If you intend to keep mining, we will be glad to see you on our
          Ethereum Classic (ETC) pool! We do have other coins and projects in
          development that we intend to reveal shortly; these announcements may
          come before The Merge. We thank all our loyal miners for their
          business and hope you continue sticking with Flexpool.io for ETC,
          Chia, and other future projects. Good things must end; it was an
          incredible journey mining Ethereum with all of you! We hope that the
          end of this journey leads to the start of a new adventure.
          <br />
          <br />
          If you are switching to ETC after Ethereum mining ends, please
          consider doing it a few days in advance to ensure uninterrupted
          operations
          <span style={{ textAlign: 'right', display: 'block' }}>
            - Flexpool.io Team
          </span>
        </p>
        <Spacer />

        <div>
          <a
            href="https://blog.ethereum.org/2022/08/24/mainnet-merge-announcement/"
            target="_blank"
            rel="noreferrer"
          >
            View Ethereum Official Merge Announcement
          </a>
        </div>

        <Spacer size="sm" />

        <Link href="/the-merge-countdown" passHref>
          <a>View The Merge Countdown</a>
        </Link>
      </Content>
    </Page>
  );
};

export default Announcement;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
        'contact-us',
        'cookie-consent',
        'seo',
      ])),
    },
  };
}
