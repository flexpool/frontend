// import Tippy from '@tippyjs/react';
// import copy from 'copy-to-clipboard';
import { Button } from 'src/components/Button';
import { Card } from 'src/components/layout/Card';
import { ApiPoolCoin } from 'src/types/PoolCoin.types';
import styled from 'styled-components/macro';
import { MinerSettingsModal } from '../Settings/MinerSettings.modal';

// function CopyButton(props) {
//   const [justCopied, setJustCopied] = useState(false);
//   return (
//     <Tippy
//       content={
//         <div style={{ padding: '5px' }}>
//           {justCopied ? 'Copied!' : 'Copy wallet address'}
//         </div>
//       }
//       delay={0}
//       animation="shift-away"
//       theme="light"
//       interactive={true}
//     >
//       <div
//         className="copy-button"
//         onClick={() => {
//           copy(props.address);
//           setJustCopied(true);
//         }}
//         onMouseLeave={() => setTimeout(() => setJustCopied(false), 200)}
//       >
//         {justCopied ? <HiCheck /> : <HiOutlineClipboardCopy />}
//       </div>
//     </Tippy>
//   );
// }

const Wrap = styled(Card)`
  display: flex;
  justify-content: space-between;
`;

const AddressContainer = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 1;
  width: 1px;
  flex-grow: 1;
  img {
    width: 40px;
  }
`;

const Address = styled.span`
  margin-left: 15px;
  font-weight: 500;
  font-size: 1.5rem;
  cursor: pointer;
  overflow: hidden;
  margin-right: 2rem;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex-shrink: 1;
  width: 1px;
  flex-grow: 1;

  &:hover {
    color: $accent-color;
  }
`;

export const AccountHeader: React.FC<{
  coin?: ApiPoolCoin;
  address: string;
}> = ({ coin, address }) => {
  return (
    <Wrap paddingShort>
      <AddressContainer>
        {coin && (
          <img
            src={`https://static.flexpool.io/assets/coinLogos/small/${coin.ticker}.png`}
            alt={`${coin.name} logo`}
          />
        )}
        <Address>{address}</Address>
        {/* <CopyButton address={props.address} asd/> */}
      </AddressContainer>
      <MinerSettingsModal />
    </Wrap>
  );
};
