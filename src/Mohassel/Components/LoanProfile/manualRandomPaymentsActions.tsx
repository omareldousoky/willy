import React from 'react'
import * as local from '../../../Shared/Assets/ar.json'
import { LtsIcon } from '../../../Shared/Components'
import {
  timeToDateyyymmdd,
  getRandomPaymentByKey,
} from '../../../Shared/Services/utils'
import Can from '../../config/Can'

const ManualRandomPaymentsActions = (props) => {
  return (
    <>
      {props.pendingActions.map((pendingAction, index) => {
        return (
          <div key={index} className="warning-container">
            <LtsIcon name="warning" color="#edb600" />
            <h6>{local.manualRandomPaymentNeedsInspection}</h6>
            <div className="info">
              <span className="text-muted">{local.gender}</span>
              <span>
                {getRandomPaymentByKey(pendingAction.transactions[0].action)}
              </span>
            </div>
            <div className="info">
              <span className="text-muted">{local.truthDate}</span>
              <span>
                {timeToDateyyymmdd(pendingAction.transactions[0].truthDate)}
              </span>
            </div>
            <div className="info">
              <span className="text-muted">{local.dueDate}</span>
              <span>
                {timeToDateyyymmdd(pendingAction.transactions[0].actualDate)}
              </span>
            </div>
            <div className="info">
              <span className="text-muted">{local.amount}</span>
              <span>{pendingAction.transactions[0].transactionAmount}</span>
            </div>
            <div className="info">
              <span className="text-muted">{local.receiptNumber}</span>
              <span>{pendingAction.receiptNumber}</span>
            </div>
            <Can I="payInstallment" a="application">
              <div
                style={{ color: '#000', cursor: 'pointer' }}
                data-qc="editManualPayment"
                onClick={() => props.editManualPayment(pendingAction._id)}
              >
                <LtsIcon name="edit" style={{ marginLeft: 5 }} />
                {local.edit}
              </div>
            </Can>
            <Can I="payInstallment" a="application">
              <div
                className="cancel"
                data-qc="rejectManualPayment"
                onClick={() => {
                  props.rejectManualPayment(pendingAction._id)
                }}
              >
                {local.cancel}
              </div>
            </Can>
            <Can I="approvePendingAction" a="application">
              <div
                className="submit"
                data-qc="approveManualPayment"
                onClick={() => {
                  props.approveManualPayment(pendingAction._id)
                }}
              >
                {local.submit}
              </div>
            </Can>
          </div>
        )
      })}
    </>
  )
}

export default ManualRandomPaymentsActions
