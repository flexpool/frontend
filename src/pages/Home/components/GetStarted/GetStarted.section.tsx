import { StartButton, Wrapper, Split } from './components';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Content } from 'src/components/layout/Content';
import { Ws } from 'src/components/Typo/Typo';

export const GetStartedSection = () => {
  const { t } = useTranslation('home');
  return (
    <Wrapper>
      <Content>
        <Split>
          <h2>{t('get_started_section.title')}</h2>
          <StartButton as={Link} to="/get-started" size="lg">
            <Ws>{t('get_started_section.cta')}</Ws>
          </StartButton>
        </Split>
      </Content>
    </Wrapper>
  );
};
