import React from 'react';
import { Trans } from 'next-i18next';

function GuideList({ listItems }) {
  if (typeof listItems === 'string') return <></>;

  return (
    <ul>
      {listItems.map((item) => (
        <li key={item.text}>
          <Trans
            components={{
              a: <a />,
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
