import React from 'react';
import Card from './Card';

function NextCard ({ cardObj, onFocus, autofocus, onClick })  {

    console.log("In nextcard");
  console.log(cardObj);
    console.log(onClick);

  if (!cardObj) {
    return (
      <div></div>
    );
  }

  //var card1 = <Card card={cardObj.f} onFocus={onFocus} autofocus={autofocus} onClick={onclick}/>;

    return <Card card={cardObj.f} onFocus={onFocus} autofocus={autofocus} onClick={onClick}/>;
};

export default NextCard;
