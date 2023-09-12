import { Img } from '@/components/Img';
import { getCoinIconUrl } from '@/utils/staticImage.utils';
import React from 'react';
import styled from 'styled-components';
import { Badge } from '@/components/Badge';
import { Checkbox } from '@/components/Form/Checkbox';
import { useTranslation } from 'next-i18next';

const BTCImg = styled(Img)`
  margin-right: 10px;
`;

const StyledOption = styled.div`
  display: inline-block;
  border: 1px solid var(--border-color);
  width: 360px;
  border-radius: 5px;
  cursor: pointer;
  overflow: hidden;

  &:hover {
    outline-offset: 1px;
    outline: 2px solid var(--primary-shadow);
  }

  &[data-active='true'] {
    border: 1px solid var(--primary);
  }
`;

const OptionHeader = styled.div`
  padding: 14px 12px;
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 16px;
  color: var(--text-primary);

  &[data-active='true'] {
    background-color: #0069ff20;
  }
`;

const OptionBody = styled.div`
  border-top: 1px solid var(--border-color);
  background-color: var(--bg-secondary);
  padding: 14px 12px;
  font-size: 14px;
  color: var(--text-secondary);

  &[data-active='true'] {
    border-top: 1px solid var(--primary);
  }
`;

interface MineBTCBoxProps {
  onClick?: (checked: boolean) => void;
  checked: boolean;
}

const NOOP = () => {};

export const MineBTCBox: React.FC<MineBTCBoxProps> = ({
  onClick = NOOP,
  checked,
}) => {
  const { t } = useTranslation('get-started');

  const active = checked ? 'true' : 'false';

  return (
    <StyledOption
      data-active={active}
      onClick={(e) => {
        e.preventDefault();
        onClick(!checked);
      }}
    >
      <OptionHeader data-active={active}>
        <BTCImg src={getCoinIconUrl('btc')} alt={`btc logo`} height={24} />
        {t('auto_swap.btc.title')} <Badge variant="success">New</Badge>
        <div
          style={{
            marginLeft: 'auto',
          }}
        />
        <Checkbox
          value={checked ? 'true' : undefined}
          onClick={() => {
            onClick(!checked);
          }}
        />
      </OptionHeader>
      <OptionBody data-active={active}>
        {t('auto_swap.btc.desc')}
        <br />
        <br />
        <span
          style={{
            fontSize: 12,
          }}
        >
          {t('auto_swap.btc.fee')}{' '}
          <a
            onClick={(e) => {
              e.stopPropagation();

              window.location.href =
                'https://static.flexpool.io/legal/terms.pdf';
            }}
            href={'https://static.flexpool.io/legal/terms.pdf'}
          >
            {t('auto_swap.terms')}
          </a>
        </span>
      </OptionBody>
    </StyledOption>
  );
};
