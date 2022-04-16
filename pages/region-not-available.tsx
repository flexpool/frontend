import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Page } from '../src/components/layout/Page';
import { Content } from '../src/components/layout/Content';

export const RegionNotAvailable = () => {
  return (
    <Page>
      <Content md paddingLg>
        <h1>Flexpool.io has halted all service to Russia</h1>
        <p style={{ marginTop: '30px' }}>
          As announced today on Telegram, Discord, Reddit, Facebook, and
          Twitter, Flexpool has halted service to Russian IP addresses.
          <br />
          <br />
          We will be automatically paying out all unpaid balances that can be
          paid out (if your unpaid balance is below the gas price range, you
          cannot be paid out). This will be done automatically in the near
          future as soon as we can process the payouts, but please allow a
          couple of days for the payouts to be done.
          <br />
          <br />
          If you need a payout sooner, please contact us in the messenger below
          or via support@flexpool.io with following:
          <br />
          <br />
          Mining address and coin (ETH, ETC, XCH):
          <br />
          Gas price limit (ETH mainnet,if you want to change it):
          <br />
          <br />
          We will process the change as soon as possible.
          <br />
          <br />
          Support is not able to discuss the decision, make exceptions to it, or
          suggest VPN or other options. If you wish to discuss the topic, the
          channels mentioned above would be the place to do so.
          <br />
          <br />
          Thank you for your understanding, and we hope to welcome you back when
          conditions permit.
        </p>

        <h1>Flexpool.io прекратил обслуживание России</h1>

        <p style={{ marginTop: '30px' }}>
          Как было объявлено сегодня в Telegram, Discord, Reddit, Facebook и
          Twitter, компания Flexpool прекратила обслуживание российских
          IP-адресов.
          <br />
          <br />
          Мы будем автоматически выплачивать все неоплаченные остатки, которые
          могут быть выплачены (если ваш неоплаченный остаток ниже диапазона цен
          на газ, вы не можете быть выплачены). Это будет сделано автоматически
          в ближайшем будущем, как только мы сможем обработать выплаты, но,
          пожалуйста, оставьте пару дней для выплат.
          <br />
          <br />
          Если вам нужна выплата раньше, пожалуйста, свяжитесь с нами в
          мессенджере ниже или через support@flexpool.io, указав следующее:
          <br />
          <br />
          Адрес майнинга и монета (ETH, ETC, XCH):
          <br />
          Предельная цена газа (ETH mainnet, если вы хотите ее изменить):
          <br />
          <br />
          Мы обработаем изменения как можно скорее.
          <br />
          <br />
          Служба поддержки не может обсуждать решение, делать исключения из него
          или предложить VPN или другие варианты. Если вы хотите обсудить эту
          тему, то каналы, упомянутые выше, будут подходящим местом для этого.
          <br />
          <br />
          Спасибо за ваше понимание, и мы надеемся принять вас снова, когда
          позволят условия.
        </p>
      </Content>
    </Page>
  );
};

export default RegionNotAvailable;

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
