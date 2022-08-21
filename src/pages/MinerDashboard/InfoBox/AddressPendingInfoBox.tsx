import { useTranslation } from 'next-i18next';
import styled from 'styled-components';
import { RiLoader2Line } from 'react-icons/ri';

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

export const AddressPendingInfoBox = () => {
  const { t } = useTranslation('dashboard');

  return (
    <Content style={{ marginTop: '1rem' }}>
      <TopBannerContainer>
        <InfoBox variant="primary">
          <MediaContainer>
            <RiLoader2Line
              style={{
                width: 36,
                height: 36,
              }}
            />
            <BannerText>
              <h3>{t('pending_header')}</h3>
              <p>{t('pending_description')}</p>
            </BannerText>
          </MediaContainer>
        </InfoBox>
      </TopBannerContainer>
    </Content>
  );
};

export default AddressPendingInfoBox;
