import React from 'react';

function Card  ( {card, onFocus, autofocus, onClick} ) {

  const imagePath = "cards/" + card + ".png";
  if (onFocus) {
    return <img tabIndex="0" src={imagePath} onFocus={onFocus} ref={input => input && autofocus && input.focus()} onClick={onClick}/>
  } else {
    return <img src={imagePath}/>
  }
}

export default Card;
