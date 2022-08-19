import { useTranslation } from 'next-i18next';
import styled from 'styled-components';

import Warning from '@/assets/warning-icon.svg';
import { Content } from '@/components/layout/Content';
import { InfoBox } from '@/components/InfoBox';

const TopBannerContainer = styled.div`
  & h3 {
    font-size: 1.1rem;
  }
`;

const MediaContainer = styled.div`
  display: flex;
  align-items: center;

  & > svg {
    width: 50px;
  }
`;

const BannerText = styled.div`
  margin-left: 1rem;
  flex-grow: 1;

  & > p {
    margin-top: 0.5rem;
  }
`;

export const AddressNotFoundInfoBox = () => {
  const { t } = useTranslation('dashboard');

  return (
    <Content style={{ marginTop: '1rem' }}>
      <TopBannerContainer>
        <InfoBox variant="warning">
          <MediaContainer>
            <Warning />
            <BannerText>
              <h3>{t('warning_header')}</h3>
              <p>{t('warning_description')}</p>
            </BannerText>
          </MediaContainer>
        </InfoBox>
      </TopBannerContainer>
    </Content>
  );
};

export default AddressNotFoundInfoBox;
