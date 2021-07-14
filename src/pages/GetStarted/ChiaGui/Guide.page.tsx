import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Page } from 'src/components/layout/Page';
import { Spacer } from 'src/components/layout/Spacer';
import { MineableCoinHardware, mineableCoins } from '../mineableCoinList';
import { Redirect, useHistory, useLocation, useRouteMatch } from 'react-router';
import qs from 'query-string';
import { PingTestSection } from '../ChiaShared/PingTest.section';
import merge from 'lodash.merge';
import styled, { css, keyframes } from 'styled-components';
import { FaHome, FaPlus, FaWallet } from 'react-icons/fa';
import { FiHardDrive, FiLifeBuoy } from 'react-icons/fi';
import { RiPlantLine } from 'react-icons/ri';
import { BiMerge } from 'react-icons/bi';
import { ChiaGuiButton } from './Button';
import { Highlight } from 'src/components/Typo/Typo';
import { ChiaGuiInput } from './Input';
import { ChiaGuiLink } from './Link';
import { FarmerOptionSelector } from '../ChiaShared/FarmerOptionSelector';

export const ChiaGuiGuidePage: React.FC = () => {
  const {
    params: { ticker },
  } = useRouteMatch<{
    ticker?: string;
  }>();

  const { t } = useTranslation('get-started');
  const { replace: historyReplace } = useHistory();
  const { search } = useLocation();

  const mineableCoin = React.useMemo(() => {
    return mineableCoins.find((item) => item.ticker === ticker);
  }, [ticker]);

  const jsonHw = t(`detail_${ticker}.hardware`, {
    returnObjects: true,
  }) as MineableCoinHardware[];

  const mineableCoinConfig = React.useMemo(() => {
    const mergedHw = merge(mineableCoin?.hardware, jsonHw);
    return mergedHw.find((item) => item.key === 'XCH-GUI');
  }, [jsonHw, mineableCoin?.hardware]);

  if (!mineableCoin || !mineableCoinConfig) {
    return <Redirect to="/get-started" />;
  }

  const { primaryServer = 'POOL_URL', farmerOption = 'new-farmer' } = qs.parse(
    search
  );

  const setSelectedFarmerOption = (s: string) => {
    historyReplace({
      search: qs.stringify({
        ...qs.parse(search),
        farmerOption: s,
      }),
    });
  };

  return (
    <Page>
      <h1>{t('detail_xch.title_gui')}</h1>
      <PingTestSection data={mineableCoin.regions} />
      <Spacer size="xl" />
      <FarmerOptionSelector
        selectedFarmerOption={farmerOption as string}
        setSelectedFarmerOption={(s: string) => {
          setSelectedFarmerOption(s);
        }}
      />
      {farmerOption !== 'already-farmer' ? (
        <>
          <h2>
            <Highlight>#1</Highlight>{' '}
            {t('detail_xch.plotnft_create.title_join')}
          </h2>
          <p>{t('detail_xch.plotnft_create.desc_one')}</p>
          <Spacer />
          <p>{t('detail_xch.plotnft_create.desc_two')}</p>
          <Spacer />
          <p>{t('detail_xch.plotnft_create.create_gui_action')}</p>
          <ChiaGuiMenu
            selectedMenu={'Pool'}
            menuContent={<AddNewPlotNFTChiaGuiMenuContent />}
            highlightMenu={true}
          />
          <Spacer size="xl" />
          <p>{t('detail_xch.plotnft_create.create_gui_action_two')}</p>
          <ChiaGuiMenu
            selectedMenu={'Pool'}
            menuContent={
              <AddNewPlotNFTDetailChiaGuiMenuContent
                selectedServer={`https://${primaryServer}`}
              />
            }
          />
        </>
      ) : (
        <>
          <h2>
            <Highlight>#1</Highlight> {t('detail_xch.plotnft_join.title')}
          </h2>
          <p>
            <Trans
              ns="get-started"
              i18nKey="detail_xch.plotnft_join.desc_one"
              components={{
                b: <b />,
              }}
            />
          </p>
          <Spacer />
          <p>{t('detail_xch.plotnft_join.assign_gui_action')}</p>
          <ChiaGuiMenu
            selectedMenu={'Pool'}
            menuContent={
              <PoolSwitchChiaGuiMenuContent
                selectedServer={'https://previous-pool.com'}
              />
            }
          />
          <Spacer size="xl" />
          <p>{t('detail_xch.plotnft_join.assign_gui_action_two')}</p>
          <ChiaGuiMenu
            selectedMenu={'Pool'}
            menuContent={
              <AddNewPlotNFTDetailChiaGuiMenuContent
                selectedServer={`https://${primaryServer}`}
                changePool={true}
              />
            }
          />
        </>
      )}

      <Spacer size="xl" />
      <h2>
        <Highlight>#2</Highlight>{' '}
        {t('detail_xch.gather_payout_address_gui.title')}
      </h2>
      <p>{t('detail_xch.gather_payout_address_gui.desc')}</p>
      <Spacer />
      <ChiaGuiMenu
        selectedMenu={'Pool'}
        menuContent={
          <PayoutAddressChiaGuiMenuContent
            selectedServer={`https://${primaryServer}`}
          />
        }
      />
      <Spacer size="xl" />
      <h2>
        <Highlight>#3</Highlight> {t('detail_xch.monitor_farm.title')}
      </h2>
      <p>{t('detail_xch.monitor_farm.desc_gui')}</p>
      <Spacer size="xl" />
    </Page>
  );
};

const ChiaGuiMenuStep = styled.div`
  background-color: var(--bg-secondary);
  margin-top: 30px;
  min-width: 500px;

  &:first-child {
    margin-top: 0px;
  }
`;

const ChiaGuiMenuContent = styled.div`
  margin-top: 5px;
  padding: 10px 7.5%;
  max-width: 700px;
  color: var(--text-secondary);
  p {
    color: var(--text-secondary);
    font-size: 12.5px;
  }
`;

const ChiaGuiMenuStepNumber = styled.div`
  background-color: var(--bg-primary);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 35px;
  width: 35px;
`;

const ChiaGuiMenuStepHeaderWrapper = styled.div`
  height: 50px;
  display: flex;
  align-items: center;
  padding: 20px 10px;
  border-bottom: 1px solid var(--border-color);
`;

const ChiaGuiMenuStepHeaderText = styled.div`
  margin-left: 15px;
  font-weight: 600;
`;

type ChiaGuiMenuStepHeaderProps = {
  stepNumber: number;
  text: string;
};

const ChiaGuiMenuStepHeader = (props: ChiaGuiMenuStepHeaderProps) => {
  const { stepNumber, text } = props;

  return (
    <ChiaGuiMenuStepHeaderWrapper>
      <ChiaGuiMenuStepNumber>{stepNumber}</ChiaGuiMenuStepNumber>
      <ChiaGuiMenuStepHeaderText>{text}</ChiaGuiMenuStepHeaderText>
    </ChiaGuiMenuStepHeaderWrapper>
  );
};

const ConnectToPoolInputWrapper = styled.div`
  align-items: center;
  display: flex;
`;

const ConnectToPoolInputLabel = styled.div`
  display: flex;
  margin-right: 10px;
  color: var(--text-primary);
`;

const PlotNFTCreateButtonWrapper = styled.div`
  margin-top: 30px;
  display: flex;
`;

type AddNewPlotNFTDetailChiaGuiMenuContentProps = {
  selectedServer: string;
  changePool?: boolean;
};

const AddNewPlotNFTDetailChiaGuiMenuContent = (
  props: AddNewPlotNFTDetailChiaGuiMenuContentProps
) => {
  const { selectedServer, changePool } = props;

  return (
    <>
      <ChiaGuiMenuStep>
        <ChiaGuiMenuStepHeader
          stepNumber={1}
          text={
            !changePool
              ? 'Want to Join a Pool? Create a Plot NFT'
              : 'Change Pool'
          }
        />
        <ChiaGuiMenuContent>
          {!changePool && (
            <p>
              Join a pool and get consistent XCH farming rewards. The average
              returns are the same, but it is much less volatile. Assign plots
              to a plot NFT. You can easily switch pools without having to
              re-plot.
            </p>
          )}
          <ConnectToPoolInputWrapper>
            <ConnectToPoolInputLabel>Connect to pool:</ConnectToPoolInputLabel>
            <ChiaGuiInput value={selectedServer} copyEnabled={true} />
          </ConnectToPoolInputWrapper>
          <ConnectToPoolInputWrapper>
            <ConnectToPoolInputLabel>Fee: </ConnectToPoolInputLabel>
            <ChiaGuiInput value={'0'} />
          </ConnectToPoolInputWrapper>
        </ChiaGuiMenuContent>
      </ChiaGuiMenuStep>
      <ChiaGuiMenuStep>
        <ChiaGuiMenuStepHeader stepNumber={2} text={'Verify Pool Details'} />
        <ChiaGuiMenuContent>
          <h3>Flexpool.io</h3>
          <ChiaGuiLink>{selectedServer}</ChiaGuiLink>
          <p>The Most Advanced Mining Pool</p>
        </ChiaGuiMenuContent>
      </ChiaGuiMenuStep>
      <PlotNFTCreateButtonWrapper>
        <ChiaGuiButton glowing={true}>
          {!changePool ? 'Create' : 'Change'}
        </ChiaGuiButton>
      </PlotNFTCreateButtonWrapper>
    </>
  );
};

const ChiaGuiNFTDetailsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 550px;
  width: 100%;
  background: var(--bg-secondary);
  padding: 20px;
  border-radius: 5px;

  p {
    font-size: 12.5px;
  }
`;

const ChiaGuiNFTDetailsHeader = styled.div`
  display: flex;
  flex-direction: column;
`;

type ChiaPlotNFTDetailItemsProps = {
  items: { [key: string]: string };
};

const ChiaPlotNFTDetailsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
`;

const ChiaPlotNFTDetailItemWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ChiaPlotNFTDetailItemLabel = styled.p`
  color: var(--text-secondary);
  font-weight: 600;
`;

const ChiaPlotNFTDetailItems = (props: ChiaPlotNFTDetailItemsProps) => {
  const { items } = props;

  var elements: Array<React.ReactNode> = [];

  for (const key in items) {
    elements.push(
      <ChiaPlotNFTDetailItemWrapper>
        <ChiaPlotNFTDetailItemLabel>{key}</ChiaPlotNFTDetailItemLabel>
        <p>{items[key]}</p>
      </ChiaPlotNFTDetailItemWrapper>
    );
  }

  return <ChiaPlotNFTDetailsWrapper>{elements}</ChiaPlotNFTDetailsWrapper>;
};

const ChiaPlotNFTCredentialWrapperGlowAnimation = keyframes`
  0% {
    background-color: var(--bg-secondary);
  }

  50% {
    background-color: var(--border-color);
  }

  100% {
    background-color: var(--bg-secondary);
  }
`;

const ChiaPlotNFTCredentialsWrapper = styled.div`
  margin-top: 10px;
`;

type ChiaPlotNFTCredentialWrapperProps = {
  glowing?: boolean;
};

const ChiaPlotNFTCredentialWrapper = styled.div<ChiaPlotNFTCredentialWrapperProps>`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  padding: 5px;
  border-radius: 5px;

  ${(props) =>
    props.glowing &&
    css`
      animation: ${ChiaPlotNFTCredentialWrapperGlowAnimation} 1s linear infinite;
    `}
`;

type ChiaPlotNFTCredentialProps = {
  label: string;
  value: string;
  glowing?: boolean;
};

const ChiaPlotNFTCredential = (props: ChiaPlotNFTCredentialProps) => {
  const { label, value, glowing } = props;

  return (
    <ChiaPlotNFTCredentialWrapper glowing={glowing === true}>
      <ChiaPlotNFTDetailItemLabel>{label}</ChiaPlotNFTDetailItemLabel>
      <p>{value}</p>
    </ChiaPlotNFTCredentialWrapper>
  );
};

const ChiaGuiPlotNFTDetailChangePoolButtonWrapper = styled.div`
  margin-top: 20px;

  button {
    width: 100%;
  }
`;

type ChiaGuiNFTDetailsProps = {
  selectedServer: string;
  glowingPayoutAddress?: boolean;
  switchButtonAvailable?: boolean;
};

const ChiaGuiNFTDetails = (props: ChiaGuiNFTDetailsProps) => {
  const { selectedServer, glowingPayoutAddress, switchButtonAvailable } = props;

  return (
    <ChiaGuiNFTDetailsWrapper>
      <ChiaGuiNFTDetailsHeader>
        <h4>Example PlotNFT</h4>
        <p>
          Pool: <ChiaGuiLink>{selectedServer}</ChiaGuiLink>
        </p>
      </ChiaGuiNFTDetailsHeader>
      <ChiaPlotNFTDetailItems
        items={{
          Status: 'Pooling',
          'Number of Plots': '1337',
          'Current Difficulty': '1',
          'Current Points Balance': '9,999',
          'Points Found Since Start': '2,482',
          'Points Found in Last 24 hours': '12,873',
          'Points Successful in Last 24 hours': '99.8%',
        }}
      />
      <ChiaPlotNFTCredentialsWrapper>
        <ChiaPlotNFTCredential
          label={'Launcher ID'}
          value={
            '0xf874b591d216ca37eb02c537b3e944302b7d5c3c36fb2a6a706112e3d77e59ea'
          }
        />
        <ChiaPlotNFTCredential
          label={'Payout Address'}
          value={
            'xch1s5495j75swjzszdc6c4eecafxcu5t0n4qulm6fews8d97yr535hq08pcz5'
          }
          glowing={glowingPayoutAddress === true}
        />
      </ChiaPlotNFTCredentialsWrapper>

      {switchButtonAvailable && (
        <ChiaGuiPlotNFTDetailChangePoolButtonWrapper>
          <ChiaGuiButton glowing={true}>Change Pool</ChiaGuiButton>
        </ChiaGuiPlotNFTDetailChangePoolButtonWrapper>
      )}
    </ChiaGuiNFTDetailsWrapper>
  );
};

type PayoutAddressChiaGuiMenuContentProps = {
  selectedServer: string;
};

const PayoutAddressChiaGuiMenuContent = (
  props: PayoutAddressChiaGuiMenuContentProps
) => {
  const { selectedServer } = props;

  return (
    <ChiaGuiNFTDetails
      selectedServer={selectedServer}
      glowingPayoutAddress={true}
    />
  );
};

const PoolSwitchChiaGuiMenuContent = (
  props: PayoutAddressChiaGuiMenuContentProps
) => {
  const { selectedServer } = props;

  return (
    <ChiaGuiNFTDetails
      selectedServer={selectedServer}
      switchButtonAvailable={true}
    />
  );
};

const AddNewPlotNFTButtonWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
`;

const AddNewPlotNFTChiaGuiMenuContent = () => {
  return (
    <AddNewPlotNFTButtonWrapper>
      <ChiaGuiButton glowing={true}>
        <FaPlus />
        Add New PlotNFT
      </ChiaGuiButton>
    </AddNewPlotNFTButtonWrapper>
  );
};

const ChiaGuiMenuContainer = styled.div`
  user-select: none;
  display: grid;
  grid-template-columns: 1fr 10fr;
  grid-template-rows: 1fr;
  border: 5px solid var(--border-color);
  border-radius: 5px;
  min-height: 500px;
  background: var(--bg-secondary);
  overflow-x: auto;
  overflow-y: hidden;
`;

const ChiaGuiMenuSidebarWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-right: 2.5px solid var(--border-color);
`;

const ChiaGuiMenuSidebarLogoSection = styled.div`
  width: 100%;
  border-bottom: 2.5px solid var(--border-color);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;

  img {
    height: 20px;
  }
`;

const ChiaGuiSidebarItemsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 60px;
`;

type ChiaGuiSidebarItemsProps = {
  items: { [key: string]: React.ReactNode };
  selectedItem: string | false;
};

const ChiaGuiSidebarItems = (props: ChiaGuiSidebarItemsProps) => {
  const { items, selectedItem } = props;

  const listItems: Array<React.ReactNode> = [];

  for (const key in items) {
    listItems.push(
      <ChiaGuiSidebarItem
        label={key}
        icon={items[key]}
        selected={selectedItem === key}
      />
    );
  }

  return <ChiaGuiSidebarItemsWrapper>{listItems}</ChiaGuiSidebarItemsWrapper>;
};

type ChiaGuiSidebarItemWrapperProps = {
  selected: boolean;
};

const ChiaGuiSidebarItemWrapperGlowAnimation = keyframes`
  0% {
    background-color: var(--bg-secondary);
  }

  50% {
    background-color: var(--border-color);
  }

  100% {
    background-color: var(--bg-secondary);
  }
`;

const ChiaGuiSidebarItemWrapper = styled.div<ChiaGuiSidebarItemWrapperProps>`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0px;
  color: var(--text-secondary);

  ${(props) =>
    props.selected &&
    css`
      color: var(--text-primary);
      animation: ${ChiaGuiSidebarItemWrapperGlowAnimation} 1s linear infinite;
    `}

  svg {
    width: 22.5px;
    height: 22.5px;
  }
`;

const ChiaGuiSidebarItemLabel = styled.div`
  margin-top: 7.5px;
  font-size: 12.5px;
`;

type ChiaGuiSidebarItemProps = {
  label: string;
  icon: React.ReactNode;
  selected: boolean;
};

const ChiaGuiSidebarItem = (props: ChiaGuiSidebarItemProps) => {
  const { label, icon, selected } = props;

  return (
    <ChiaGuiSidebarItemWrapper selected={selected}>
      {icon}
      <ChiaGuiSidebarItemLabel>{label}</ChiaGuiSidebarItemLabel>
    </ChiaGuiSidebarItemWrapper>
  );
};

const ChiaGuiMainContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
`;

const ChiaGuiMainContentHeader = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  padding-left: 20px;
  height: 60px;
  border-bottom: 2.5px solid var(--border-color);
  font-weight: 700;
  background: var(--bg-secondary);
`;

type ChiaGuiMainContentProps = {
  name: string;
  content: React.ReactNode;
};

const ChiaGuiMainContentMenuWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px 40px;
`;

const ChiaGuiMainContent = (props: ChiaGuiMainContentProps) => {
  const { name, content } = props;

  return (
    <ChiaGuiMainContentWrapper>
      <ChiaGuiMainContentHeader>{name}</ChiaGuiMainContentHeader>
      <ChiaGuiMainContentMenuWrapper>{content}</ChiaGuiMainContentMenuWrapper>
    </ChiaGuiMainContentWrapper>
  );
};

type ChiaGuiMenuProps = {
  selectedMenu: string;
  menuContent: React.ReactNode;
  highlightMenu?: boolean;
};

const ChiaGuiMenu = (props: ChiaGuiMenuProps) => {
  const { selectedMenu, menuContent, highlightMenu } = props;

  return (
    <ChiaGuiMenuContainer>
      <ChiaGuiMenuSidebarWrapper>
        <ChiaGuiMenuSidebarLogoSection>
          <img
            src="https://static.flexpool.io/logos/chia.svg"
            alt="chia logo"
          />
        </ChiaGuiMenuSidebarLogoSection>
        <ChiaGuiSidebarItems
          items={{
            'Full Node': <FaHome />,
            Wallets: <FaWallet />,
            Plots: <FiHardDrive />,
            Farm: <RiPlantLine />,
            Pool: <BiMerge />,
            Keys: <FiLifeBuoy />,
          }}
          selectedItem={(highlightMenu as boolean) && selectedMenu}
        />
      </ChiaGuiMenuSidebarWrapper>
      <ChiaGuiMainContent name={selectedMenu} content={menuContent} />
    </ChiaGuiMenuContainer>
  );
};
