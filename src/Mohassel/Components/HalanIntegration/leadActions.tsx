import React from 'react'
import local from 'Shared/Assets/ar.json'
import ability from 'Shared/config/ability'
import { Action } from 'Shared/Models/common'
import { useHistory } from 'react-router-dom'
import { ActionsGroup } from 'Shared/Components/ActionsGroup'

export const LeadActions = ({
  data,
  changeLeadState,
  setSelectedLead,
  setViewRejectionModal,
}) => {
  const history = useHistory()
  const getLeadActions = (lead): Action[] => {
    return [
      {
        actionTitle: local.rejectApplication,
        actionPermission:
          (lead.status === 'in-review' || lead.status === 'submitted') &&
          ability.can('reviewLead', 'halanuser'),
        actionOnClick: () => {
          changeLeadState(
            lead.phoneNumber,
            lead.status,
            lead.inReviewStatus,
            'rejected',
            ''
          )
        },
      },
      {
        actionTitle: local.acceptApplication,
        actionPermission:
          (lead.status === 'in-review' || lead.status === 'submitted') &&
          ability.can('reviewLead', 'halanuser'),
        actionOnClick: () => {
          changeLeadState(
            lead.phoneNumber,
            lead.status,
            lead.inReviewStatus,
            'approved',
            ''
          )
        },
      },
      {
        actionTitle: local.viewCustomerLead,
        actionPermission: ability.can('leadInReviewStatus', 'halanuser'),
        actionOnClick: () => {
          history.push('/halan-integration/leads/view-lead', {
            leadDetails: lead,
          })
        },
      },
      {
        actionTitle: local.viewRejectionReason,
        actionPermission:
          lead.status === 'rejected' && ability.can('reviewLead', 'halanuser'),
        actionOnClick: () => {
          setSelectedLead(lead)
          setViewRejectionModal(true)
        },
      },
      {
        actionTitle: local.editLead,
        actionPermission:
          lead.status !== 'rejected' &&
          ability.can('leadInReviewStatus', 'halanuser'),
        actionOnClick: () =>
          history.push('/halan-integration/leads/edit-lead', {
            leadDetails: lead,
          }),
      },
    ]
  }
  return (
    <div className="position-relative">
      <ActionsGroup
        dropdownBtnTitle={local.actions}
        currentId={data.uuid}
        actions={getLeadActions(data)}
      />
    </div>
  )
}
