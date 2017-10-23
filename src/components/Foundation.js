import React from 'react';
import Card from './Card';

const Foundation = ({ cards, onFocus, autofocus }) => {
  const listStyle = {
    listStyleType: "none",
    paddingLeft: "0",
    minHeight: "40px",
    paddingBottom: "160px"
  };
  if (cards.length === 0) {
    listStyle["border"] = "1px solid lightgray";
    listStyle["borderRadius"] = "5px";
  }
  const listElementStyle = {
    height: "40px",
  };
  const divStyle = {
    display: "inline-block",
    width: "200px",
    verticalAlign: "top",
  };

  const cardComponents = cards.map((card, cardNum) => {
    if (cardNum === cards.length - 1) {
      return <li style={listElementStyle} key={cardNum}><Card card={card.f} onFocus={onFocus} autofocus={autofocus}/></li>;
    } else {
      return <li style={listElementStyle} key={cardNum}><Card card={card.f}/></li>;
    }
  });

  return (
    <div style={divStyle}>
      <div style={{width: "138px", margin: "0 auto"}}>
          <ul style={listStyle}>
              {cardComponents}
          </ul>
      </div>
    </div>
  );
}

export default Foundation;
