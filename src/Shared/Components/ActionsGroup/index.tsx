import React from 'react'
import DropdownButton from 'react-bootstrap/DropdownButton'
import DropdownItem from 'react-bootstrap/DropdownItem'
import { ActionsGroupProps } from './types'

export const ActionsGroup = ({
  currentId,
  dropdownBtnTitle,
  actions,
}: ActionsGroupProps) => {
  return (
    <DropdownButton
      title={dropdownBtnTitle}
      key={currentId}
      variant="outline-primary"
    >
      {actions.map(
        (action, index) =>
          action.actionPermission && (
            <DropdownItem
              className="item"
              key={index}
              onClick={() => action.actionOnClick(currentId)}
            >
              {action.actionTitle}
            </DropdownItem>
          )
      )}
    </DropdownButton>
  )
}
