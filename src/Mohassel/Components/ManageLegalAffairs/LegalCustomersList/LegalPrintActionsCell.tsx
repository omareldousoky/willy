import React, { FunctionComponent } from 'react'

import local from '../../../Shared/Assets/ar.json'

const LegalPrintActionsCell: FunctionComponent<{
  actions: any
  isOpen: boolean
  onClick: () => void
  onActionClick: (actionName: string) => void
}> = ({ actions, isOpen, onClick, onActionClick }) => {
  return (
    <div className="position-relative">
      <button className="btn clickable-action" onClick={onClick}>
        {local.actions}
      </button>
      {isOpen && (
        <div className="actions-list">
          {actions.map((action) => (
            <button
              key={action.name}
              className="btn item rounded-0"
              onClick={() => {
                onActionClick(action.name)
              }}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default LegalPrintActionsCell
