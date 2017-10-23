import React from 'react';

const Card = ({ card, onFocus, autofocus }) => {
  const imagePath = "cards/" + card + ".png";
  if (onFocus) {
    return <img tabIndex="0" src={imagePath} onFocus={onFocus} ref={input => input && autofocus && input.focus()}/>
  } else {
    return <img src={imagePath}/>
  }
};

export default Card;
