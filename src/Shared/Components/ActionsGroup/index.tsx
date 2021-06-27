import React from 'react'
import { ActionsGroupProps } from './types'

export const ActionsGroup = ({ currentId, actions }: ActionsGroupProps) => {
  return (
    <div className="actions-list" key={currentId}>
      {actions.map(
        (action, index) =>
          action.actionPermission && (
            <div
              key={index}
              className="item"
              onClick={() => action.actionOnClick(currentId)}
            >
              {action.actionTitle}
            </div>
          )
      )}
    </div>
  )
}
