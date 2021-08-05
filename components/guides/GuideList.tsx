import React from 'react'

function GuideList({ listItems }) {
  console.log(listItems);
  if (typeof listItems === 'string') return <></>

  return (
    <ul>
      {listItems.map((item) => (
        <li key={item.text}>{item.text}</li>
      ))}
    </ul>
  )
}

export default GuideList
