import React from 'react';
import Card from './Card';

const Target = ({ i, topCard }) => {
  const divStyle = {
    display: "inline-block",
    width: "200px",
  };
  return (
    <div style={divStyle}>
      <div style={{width: "140px", margin:"0 auto"}}>
        <div style={{height: "200px", border: "1px solid lightgray", borderRadius: "5px"}}>
          { topCard &&
            <Card card={topCard.f}/>
          }
        </div>
        <div style={{width: "80%", margin:"0 auto"}}>
          <TargetProgressTracker targetNum={i} topCard={topCard}/>
        </div>
      </div>
    </div>
  );
};

const TargetProgressTracker = ({targetNum, topCard }) => {
  const listStyle = {
    listStyleType: "none",
    paddingLeft: "0"
  };

  const listElementStyle = {
    display: "inline-block",
    width: "25%"
  };

  const faceCardValues = {1: 'A', 11: 'J', 12: 'Q', 0: 'K'};
  let topCardIndex = topCard ? null : -1;
  const targetValueListElements = [...Array(13).keys()].map((value, index) => {
    let targetValue = ((index + 1) * (targetNum + 1) % 13).toString();

    if (topCard && topCard.v.toString() === targetValue) {
      topCardIndex = index;
    }

    if (Object.keys(faceCardValues).includes(targetValue)) {
      targetValue = faceCardValues[targetValue];
    }

    let targetValueWithDecorator;
    if (null === topCardIndex || index === topCardIndex) {
      targetValueWithDecorator = <del>{targetValue}</del>;
    } else if (topCardIndex === index - 1) {
      targetValueWithDecorator = <strong>{targetValue}</strong>;
    } else {
      targetValueWithDecorator = targetValue;
    }
    return (
      <li key={index} style={listElementStyle}>
        {targetValueWithDecorator}
      </li>
    );
  });

  return (
    <ul style={listStyle}>{targetValueListElements}</ul>
  );
}

export default Target;
