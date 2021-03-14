import React from "react";
import { ActionsDropdownProps } from "./types";


export const ActionsDropdown = ({ currentCustomerId,openCustomerId, title, actions ,blocked, onDropDownClick}: ActionsDropdownProps) => {

  return (
    <div className="position-relative">
        
      <button
        className="btn clickable-action"
        onClick={onDropDownClick}
      >
        {title}
      </button>
      {openCustomerId === currentCustomerId && (
        <div className="actions-list">
          {actions.map(
            (action, index) =>
              action.actionPermission && (
                <button
                  key={index}
                  className="btn item rounded-0"
                  onClick={(event)=>action.actionOnClick(event,currentCustomerId, blocked)}
                >
                  {action.actionTitle(blocked)}
                </button>
              )
          )}
        </div>
      )}
    </div>
  );
};
