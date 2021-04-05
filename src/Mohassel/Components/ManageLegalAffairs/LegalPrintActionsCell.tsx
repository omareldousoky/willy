import React, { FunctionComponent } from 'react'
import { useHistory } from 'react-router-dom'

import ability from '../../config/ability'
import local from '../../../Shared/Assets/ar.json'
import Can from '../../config/Can'

const LegalPrintActionsCell: FunctionComponent<{
  data: any
  isOpen: boolean
  onClick: () => void
}> = ({ data, isOpen, onClick }) => {
  const history = useHistory()

  return (
    <div className="position-relative">
      <button className="btn clickable-action" onClick={onClick}>
        {local.actions}
      </button>
      {isOpen && (
        <div className="actions-list">
          {/* // TODO: Change on click */}
          {(ability.can('updateCustomer', 'customer') ||
            ability.can('updateNationalId', 'customer')) && (
            <button
              className="btn item rounded-0"
              onClick={() => {
                history.push('/customers/edit-customer', {
                  id: data._id,
                })
              }}
            >
              {local.editCustomer}
            </button>
          )}
          <Can I="getCustomer" a="customer">
            <button
              className="btn item rounded-0"
              onClick={() => {
                history.push('/customers/view-customer', {
                  id: data._id,
                })
              }}
            >
              {local.viewCustomer}
            </button>
          </Can>
          <Can I="newClearance" a="application">
            <button
              className="btn item rounded-0"
              onClick={() => {
                history.push('/customers/create-clearance', {
                  id: data._id,
                })
              }}
            >
              {local.createClearance}
            </button>
          </Can>
        </div>
      )}
    </div>
  )
}

export default LegalPrintActionsCell
