import React from 'react';
import Card from './Card';

const NextCard = ({ cardObj, onFocus, autofocus }) => {
  if (!cardObj) {
    return (
      <div></div>
    );
  }

  return <Card card={cardObj.f} onFocus={onFocus} autofocus={autofocus}/>;
};

export default NextCard;
