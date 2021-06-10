import React from 'react'
import local from '../../../../Shared/Assets/ar.json'
import { LegalHistoryResponse } from '../../../../Shared/Services/interfaces'
import { timeToArabicDate } from '../../../../Shared/Services/utils'
import Orientation from '../../Common/orientation'
import './legalHistory.scss'

interface Props {
  data: LegalHistoryResponse
}
const LegalHistory = (props: Props) => {
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
        {props.data?.history?.map(
          (log, index) => {
            return (
              // history return
              <React.Fragment key={index}>
                <table title="customer-basic" className="m-5">
                  <div className="row-nowrap mt-1 mb-1">
                    <p className="blue-box mx-3 pt-2">{index + 1}</p>
                    <p className="mt-2">{local.creationDate}</p>
                    <p className="box">
                      {log.created?.at
                        ? timeToArabicDate(log.created.at, true)
                        : ' '}
                    </p>
                  </div>
                  <tbody>
                    <tr>
                      <th className="w-25">{local.customerName}</th>
                      <td>{log.customerName}</td>
                    </tr>
                    <tr>
                      <th className="w-25">{local.customerCode}</th>
                      <td> {log.customerKey} </td>
                    </tr>
                    <tr>
                      <th className="w-25">{local.nationalId}</th>{' '}
                      <td>{log.nationalId}</td>
                    </tr>
                    <tr>
                      <th className="w-25">{local.customerType}</th>
                      <td>{local[log.customerType]}</td>
                    </tr>
                    <tr>
                      <th className="w-25">{local.loanCode}</th>
                      <td>{log.loanKey}</td>
                    </tr>
                    <tr>
                      <th className="w-25">{local.court}</th>
                      <td>{log.court}</td>
                    </tr>
                    <tr>
                      <th className="w-25">{local.finalVerdict}</th>
                      <td>{log.finalVerdict}</td>
                    </tr>
                    <tr>
                      <th className="w-25">{local.finalVerdictDate}</th>
                      <td>
                        {log.finalVerdictDate
                          ? timeToArabicDate(log.finalVerdictDate, false)
                          : ''}
                      </td>
                    </tr>
                    <tr>
                      <th className="w-25">{local.judgementStatus}</th>
                      <td>{local[log.status]}</td>
                    </tr>
                    <tr>
                      <th className="w-25">{local.statusNumber}</th>
                      <td>{log.statusNumber}</td>
                    </tr>
                    <tr>
                      <th className="w-25">{local.caseNumber}</th>
                      <td>{log.caseNumber}</td>
                    </tr>
                    <tr>
                      <th className="w-25">{local.caseStatus} </th>
                      <td>{log.caseStatus}</td>
                    </tr>
                    <tr>
                      <th className="w-25">{local.caseStatusSummary}</th>
                      <td>{log.caseStatusSummary}</td>
                    </tr>
                    <tr>
                      <th className="w-25">{local.statementOfClaim}</th>
                      <td>{log.statementOfClaim}</td>
                    </tr>
                    <tr>
                      <th className="w-25">{local.misdemeanorAppealNumber}</th>
                      <td>{log.misdemeanorAppealNumber}</td>
                    </tr>
                    <tr>
                      <th className="w-25">{local.finalConfinementNumber}</th>
                      <td>{log.finalConfinementNumber}</td>
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
                      <td>
                        {log.firstCourtSession?.date
                          ? timeToArabicDate(log.firstCourtSession?.date, false)
                          : ''}
                      </td>
                      <td>{log.firstCourtSession?.decision}</td>
                      <td>{log.firstCourtSession?.confinementNumber}</td>
                    </tr>
                    <tr>
                      <th>{local.oppositionSession}</th>
                      <td>
                        {log.oppositionSession?.date
                          ? timeToArabicDate(log.oppositionSession?.date, false)
                          : ''}
                      </td>
                      <td>{log.oppositionSession?.decision}</td>
                      <td>{log.oppositionSession?.confinementNumber}</td>
                    </tr>
                    <tr>
                      <th>{local.oppositionAppealSession}</th>
                      <td>
                        {log.oppositionAppealSession?.date
                          ? timeToArabicDate(
                              log.oppositionAppealSession?.date,
                              false
                            )
                          : ''}
                      </td>
                      <td>{log.oppositionAppealSession?.decision}</td>
                      <td>{log.oppositionAppealSession?.confinementNumber}</td>
                    </tr>
                    <tr>
                      <th>{local.misdemeanorAppealSession}</th>
                      <td>
                        {log.misdemeanorAppealSession?.date
                          ? timeToArabicDate(
                              log.misdemeanorAppealSession?.date,
                              false
                            )
                          : ' '}
                      </td>
                      <td>{log.misdemeanorAppealSession?.decision}</td>
                      <td>{log.misdemeanorAppealSession?.confinementNumber}</td>
                    </tr>
                  </tbody>
                </table>

                <table title="managers-reviews">
                  <thead className="font-weight-bold">
                    <tr>
                      <th>{local.reviewStatus}</th>
                      <th>{local.username}</th>
                      <th>{local.reviewDate}</th>
                      <th>{local.comments}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th>{local.branchManagerReview}</th>
                      <td>{log.branchManagerReview?.userName}</td>
                      <td>
                        {log.branchManagerReview?.at
                          ? timeToArabicDate(log.branchManagerReview?.at, true)
                          : ''}
                      </td>
                      <td>{log.branchManagerReview?.notes}</td>
                    </tr>
                    <tr>
                      <th>{local.areaManagerReview}</th>
                      <td>{log.areaManagerReview?.userName}</td>
                      <td>
                        {log.areaManagerReview?.at
                          ? timeToArabicDate(log.areaManagerReview?.at, true)
                          : ''}
                      </td>
                      <td>{log.areaManagerReview?.notes}</td>
                    </tr>
                    <tr>
                      <th>{local.areaSupervisorReview}</th>
                      <td>{log.areaSupervisorReview?.userName}</td>
                      <td>
                        {log.areaSupervisorReview?.at
                          ? timeToArabicDate(log.areaSupervisorReview?.at, true)
                          : ''}
                      </td>
                      <td>{log.areaSupervisorReview?.notes}</td>
                    </tr>
                    <tr>
                      <th>{local.financialManagerReview}</th>
                      <td>{log.financialManagerReview?.userName}</td>
                      <td>
                        {log.financialManagerReview?.at
                          ? timeToArabicDate(
                              log.financialManagerReview?.at,
                              true
                            )
                          : ''}
                      </td>
                      <td>{log.financialManagerReview?.notes}</td>
                    </tr>
                  </tbody>
                </table>
              </React.Fragment>
            )
          } // history map end
        )}
      </div>
    </div>
  )
}

export default LegalHistory
