import React from "react";

import { LtsIcon } from "../../Components";
import { ProfileActionsProps } from "./types";


export const ProfileActions = ({ actions }: ProfileActionsProps) => {
  return (
    <div className="d-flex justify-content-end" style={{ width: "65%" }}>
      {actions.map((action, index) => {
        const { title, permission, onActionClick } = action;
        return (
          permission && (
            <span
              key={index}
              style={{
                cursor: "pointer",
                borderRight: "2px solid #2b3390",
                padding: '0px 8px',
                margin: '10px 0'
              }}
              onClick={onActionClick}
            >
              {action.icon && <LtsIcon name={action.icon} />}
              <span style={{ margin: "auto 8px" }}>{title}</span>
            </span>
          )
        );
      })}
    </div>
  );
};
