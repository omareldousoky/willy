import React from 'react'
import local from '../../../../Shared/Assets/ar.json'
import Orientation from '../../../../Shared/Components/Common/orientation'
import './legalHistory.scss'
import { LegalHistoryProps } from '../types'
import DataRow from '../../../../Shared/Components/pdfTemplates/pdfTemplateCommon/dataRow'

export const LegalHistory = (props: LegalHistoryProps) => {
  return (
    <div className="legal-history">
      <Orientation size="landscape" />
      <div className="w-100 text-dark">
        <div className="header-wrapper">
          <span className="logo-print" role="img" />
          <p className="m-0">
            ترخيص ممارسه نشاط التمويل متناهي الصغر رقم (2) لسنه 2015
          </p>
        </div>
        {props.data?.history?.map((log, index) => {
          return (
            <React.Fragment key={index}>
              <table title="customer-basic" className="m-5">
                <div className="row-nowrap mt-1 mb-1">
                  <p className="blue-box mx-3 pt-2">{index + 1}</p>
                  <p className="mt-2">{local.creationDate}</p>
                  <p className="box">
                    <DataRow value={log.created?.at} isFullDate type="date" />
                  </p>
                </div>
                <tbody>
                  <tr>
                    <th className="w-25">{local.customerName}</th>
                    <DataRow value={log.customerName} type="string" />
                  </tr>
                  <tr>
                    <th className="w-25">{local.customerCode}</th>
                    <DataRow value={log.customerKey} type="string" />
                  </tr>
                  <tr>
                    <th className="w-25">{local.nationalId}</th>{' '}
                    <DataRow value={log.nationalId} type="string" />
                  </tr>
                  <tr>
                    <th className="w-25">{local.customerType}</th>
                    <DataRow value={local[log.customerType]} type="string" />
                  </tr>
                  <tr>
                    <th className="w-25">{local.loanCode}</th>
                    <DataRow value={log.loanKey} type="string" />
                  </tr>
                  <tr>
                    <th className="w-25">{local.court}</th>
                    <DataRow value={log.court} type="string" />
                  </tr>
                  <tr>
                    <th className="w-25">{local.finalVerdict}</th>
                    <DataRow value={log.finalVerdict} type="string" />
                  </tr>
                  <tr>
                    <th className="w-25">{local.finalVerdictDate}</th>
                    <DataRow value={log.finalVerdictDate} type="date" />
                  </tr>
                  <tr>
                    <th className="w-25">{local.judgementStatus}</th>
                    <DataRow value={local[log.status]} type="string" />
                  </tr>
                  <tr>
                    <th className="w-25">{local.statusNumber}</th>
                    <DataRow value={log.statusNumber} type="string" />
                  </tr>
                  <tr>
                    <th className="w-25">{local.caseNumber}</th>
                    <DataRow value={log.caseNumber} type="string" />
                  </tr>
                  <tr>
                    <th className="w-25">{local.caseStatus} </th>
                    <DataRow value={log.caseStatus} type="string" />
                  </tr>
                  <tr>
                    <th className="w-25">{local.caseStatusSummary}</th>
                    <DataRow value={log.caseStatusSummary} type="string" />
                  </tr>
                  <tr>
                    <th className="w-25">{local.statementOfClaim}</th>
                    <DataRow value={log.statementOfClaim} type="string" />
                  </tr>
                  <tr>
                    <th className="w-25">{local.misdemeanorAppealNumber}</th>
                    <DataRow
                      value={log.misdemeanorAppealNumber}
                      type="string"
                    />
                  </tr>
                  <tr>
                    <th className="w-25">{local.finalConfinementNumber}</th>
                    <DataRow value={log.finalConfinementNumber} type="string" />
                  </tr>
                </tbody>
              </table>
              <table title="sessions">
                <thead className="font-weight-bold">
                  <tr>
                    <th>{local.courtSessionType}</th>
                    <th>{local.courtSessionDate}</th>
                    <th>{local.theDecision}</th>
                    <th>{local.confinementNumber}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>{local.firstCourtSession}</th>
                    <DataRow value={log.firstCourtSession?.date} type="date" />
                    <DataRow
                      value={log.firstCourtSession?.decision}
                      type="string"
                    />
                    <DataRow
                      value={log.firstCourtSession?.confinementNumber}
                      type="string"
                    />
                  </tr>
                  <tr>
                    <th>{local.oppositionSession}</th>
                    <DataRow value={log.oppositionSession?.date} type="date" />
                    <DataRow
                      value={log.oppositionSession?.decision}
                      type="string"
                    />
                    <DataRow
                      value={log.oppositionSession?.confinementNumber}
                      type="string"
                    />
                  </tr>
                  <tr>
                    <th>{local.oppositionAppealSession}</th>
                    <DataRow
                      value={log.oppositionAppealSession?.date}
                      type="date"
                    />
                    <DataRow
                      value={log.oppositionAppealSession?.decision}
                      type="string"
                    />
                    <DataRow
                      value={log.oppositionAppealSession?.confinementNumber}
                      type="string"
                    />
                  </tr>
                  <tr>
                    <th>{local.misdemeanorAppealSession}</th>
                    <DataRow
                      value={log.misdemeanorAppealSession?.date}
                      type="date"
                    />
                    <DataRow
                      value={log.misdemeanorAppealSession?.decision}
                      type="string"
                    />
                    <DataRow
                      value={log.misdemeanorAppealSession?.confinementNumber}
                      type="string"
                    />
                  </tr>
                </tbody>
              </table>
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
