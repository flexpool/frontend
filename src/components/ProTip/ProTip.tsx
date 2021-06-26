import { RiLightbulbFlashLine } from 'react-icons/ri';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
const ProTipContainer = styled.div`
  font-size: 1.1rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
  line-height: 2rem;
  display: flex;
  justify-content: center;
  @media screen and (max-width: 768px) {
    display: block;
  }
`;
const ProTipIconContainer = styled.div`
  color: var(--text-secondary);
  margin-right: 0.5rem;
  font-weight: 600;
  @media screen and (max-width: 540px) {
    width: 100%:
  }
`;
const LightBulbIcon = styled(RiLightbulbFlashLine)`
  position: relative;
  line-height: 2rem;
  font-size: 1.1rem;
  top: 1px;
`;
export const ProTip: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { t } = useTranslation('common');
  return (
    <ProTipContainer>
      <ProTipIconContainer>
        <LightBulbIcon></LightBulbIcon> {t('proTip')}!
      </ProTipIconContainer>
      {children}
    </ProTipContainer>
  );
};
