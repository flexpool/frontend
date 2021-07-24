import { StartButton, Wrapper, Split } from './components';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { Content } from 'src/components/layout/Content';
import { Ws } from 'src/components/Typo/Typo';

export const GetStartedSection = () => {
  const { t } = useTranslation('home');
  return (
    <Wrapper>
      <Content>
        <Split>
          <h2>{t('get_started_section.title')}</h2>
          <Link href="/get-started" passHref>
            <StartButton size="lg">
              <Ws>{t('get_started_section.cta')}</Ws>
            </StartButton>
          </Link>
        </Split>
      </Content>
    </Wrapper>
  );
};
