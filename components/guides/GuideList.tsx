import React from 'react';
import { Trans } from 'next-i18next';
import { LinkOut } from '@/components/LinkOut';

function GuideList({ listItems }) {
  if (typeof listItems === 'string') return <></>;

  return (
    <ul>
      {listItems.map((item) => (
        <li key={item.text}>
          <Trans
            components={{
              a: <a href="" target="__blank" />,
              guilink: (
                <LinkOut
                  href="https://www.flexpool.io/get-started/xch/XCH-GUI/"
                  target="__blank"
                />
              ),
              clilink: (
                <LinkOut
                  href="https://www.flexpool.io/get-started/xch/XCH-CLI/"
                  target="__blank"
                />
              ),
            }}
          >
            {item.text}
          </Trans>
        </li>
      ))}
    </ul>
  );
}

export default GuideList;
