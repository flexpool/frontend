import React from 'react';

function GuideList({ listItems }) {
  if (typeof listItems === 'string') return <></>;

  return (
    <ul>
      {listItems.map((item) => (
        <li key={item.text} dangerouslySetInnerHTML={{ __html: item.text }} />
      ))}
    </ul>
  );
}

export default GuideList;
