/*

  This will build out the foundation of the deck


 */

import React from 'react';
import Card from './Card';

const Foundation = ({ cards, onFocus, autofocus, ondealclick}) => {

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
    height: "5px",
  };
  const divStyle = {
    display: "inline-block",
    width: "200px",
    verticalAlign: "top",
  };


  const cardComponents = cards.map((card, cardNum) => {


    if (cardNum === cards.length - 1) {

      // If this card is on the top stack - it will have autofocus
      return <li style={listElementStyle} key={cardNum}><Card card={card.f} onFocus={onFocus} autofocus={autofocus} onClick={ondealclick}/></li>;

    } else {


      // If this is below the card  - it wont have any focus - so under cards dont have focus
      return <li style={listElementStyle} key={cardNum}><Card card={card.f}  /></li>;
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
