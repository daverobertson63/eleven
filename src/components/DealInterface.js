import React from 'react';

const DealInterface = ({ onDealClick, onTargetClick, onUndoClick, onResetClick, foundationsDisabled, disabledStatuses, undoDisabled }) => {

    return (
    <div style={{marginBottom: "16px"}}className="interface">
      <div className="foundation-buttons">
        <button style={{width:"100%"}} onClick={() => { onDealClick(0) }} disabled={foundationsDisabled}>Deal</button>
      </div>


      <div className="restart-reset-buttonss">
        <button style={{width:"50%"}} onClick={onUndoClick} disabled={undoDisabled}>Undo</button>
        <button style={{width:"50%"}} onClick={onResetClick}>Restart</button>
      </div>
    </div>
  );
}

export default DealInterface;
