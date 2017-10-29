import React from 'react';

const Interface = ({ onFoundationClick, onTargetClick, onUndoClick, onResetClick, foundationsDisabled, disabledStatuses, undoDisabled }) => {

    return (
    <div style={{marginBottom: "16px"}}className="interface">
      <div className="foundation-buttons">
        <button style={{width:"25%"}} onClick={() => { onFoundationClick(0) }} disabled={foundationsDisabled}>Tableau 1</button>
        <button style={{width:"25%"}} onClick={() => { onFoundationClick(1) }} disabled={foundationsDisabled}>Tableau 2</button>
        <button style={{width:"25%"}} onClick={() => { onFoundationClick(2) }} disabled={foundationsDisabled}>Tableau 3</button>
        <button style={{width:"25%"}} onClick={() => { onFoundationClick(3) }} disabled={foundationsDisabled}>Tableau 4</button>
      </div>

      <div className="target-buttons">
        <button style={{width:"25%"}} onClick={() => { onTargetClick(0) }} disabled={disabledStatuses[0]}>Foundation 1</button>
        <button style={{width:"25%"}} onClick={() => { onTargetClick(1) }} disabled={disabledStatuses[1]}>Foundation 2</button>
        <button style={{width:"25%"}} onClick={() => { onTargetClick(2) }} disabled={disabledStatuses[2]}>Foundation 3</button>
        <button style={{width:"25%"}} onClick={() => { onTargetClick(3) }} disabled={disabledStatuses[3]}>Foundation 4</button>
      </div>

      <div className="restart-reset-buttonss">
        <button style={{width:"50%"}} onClick={onUndoClick} disabled={undoDisabled}>Undo</button>
        <button style={{width:"50%"}} onClick={onResetClick}>Restart</button>
      </div>
    </div>
  );
}

export default Interface;
