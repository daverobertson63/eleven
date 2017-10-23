import React from 'react';

const Status = ({ deckSize, victory }) => {
  let message;
  if (victory) {
    message = "VICTORY";
  } else if (!deckSize) {
    message = "GAME OVER";
  } else {
    message = deckSize + " cards remaining";
  }
  return <div className="status">{message}</div>;
}

export default Status;
