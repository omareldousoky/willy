import React from 'react'
import { timeToDateyyymmdd } from "../../../Shared/Services/utils";
import * as local from '../../../Shared/Assets/ar.json';
import Can from '../../config/Can';
import './managerHierarchy.scss'
export const GroupsApproval = (props) => {
    return (
        <div className={'approval-container'}> 
              <div className="warning-container">
                <img alt="warning" src={require('../../Assets/warning-yellow-circle.svg')} style={{ marginLeft: 20 }} />
                <h6>{local.transactionNeedsInspection}</h6>
                <div className="info">
                    <span className="text-muted">{local.transactionType}</span>
                    <span> {local.levelsOfSupervision}</span>
                </div>
                <div className="info">
                    <span className="text-muted">{local.branch}</span>
                    <span>{props.branchName }</span>
                </div>
                <div className="info">
                    <span className="text-muted">{local.branchCode}</span>
                    <span>{props.branchCode}</span>
                </div>
                <div className="info">
                    <span className="text-muted">{local.createdAt}</span>
                    <span>{timeToDateyyymmdd(props.startDate)}</span>
                </div>
                <Can I='approveGroupLeadersHierarchy' a='branch'>
                    <div className="submit" data-qc="approveManualPayment" onClick={props.approveOfficersGroup}>{local.submit}</div>
                </Can>
            </div>
        </div>
    )
}
