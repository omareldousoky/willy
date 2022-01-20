import React from 'react'

import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'

import local from '../../Assets/ar.json'
import { getIscoreReportStatus, timeToArabicDate } from '../../Services/utils'

import { LtsIcon } from '../LtsIcon'

import { ReportsListProps } from './types'

export const ReportsList = ({
  list,
  onClickDownload,
  iscoreType,
  disabledProp,
}: ReportsListProps) => {
  return (
    <>
      {list?.length > 0 ? (
        list.map((listItem, index) => (
          <Card key={index} className="mx-0">
            <Card.Body>
              <div className="d-flex justify-content-between font-weight-bold">
                <div className="d-flex">
                  <span className="mr-5 text-secondary">#{index + 1}</span>
                  {listItem.created?.at && (
                    <span className="mr-5 d-flex flex-start flex-column">
                      <span>{local.loanAppCreationDate}</span>
                      {timeToArabicDate(listItem.created.at, true)}
                    </span>
                  )}
                  <span
                    className={`mr-5  text-${
                      listItem.status === 'created'
                        ? 'success'
                        : listItem.status === 'queued' ||
                          listItem.status === 'processing'
                        ? 'warning'
                        : 'danger'
                    } `}
                  >
                    {getIscoreReportStatus(listItem.status)}
                  </span>
                  {listItem.fileName && (
                    <span className="mr-5">{listItem.fileName}</span>
                  )}
                  {listItem.status === 'created' && (
                    <span className="mr-5 d-flex flex-start flex-column">
                      <span>{local.creationDate}</span>
                      {timeToArabicDate(
                        listItem.fileGeneratedAt || listItem.generatedAt,
                        true
                      )}
                    </span>
                  )}
                  {iscoreType && (
                    <span className="mr-5 d-flex flex-start flex-column">
                      <span>{local.transactionType}</span>
                      {local[listItem.type]}
                    </span>
                  )}
                </div>
                {onClickDownload && listItem.status === 'created' && (
                  <Button
                    disabled={false || disabledProp}
                    type="button"
                    variant="default"
                    onClick={() => onClickDownload(listItem._id)}
                    title="download"
                  >
                    <LtsIcon name="download" color="#7dc356" size="40px" />
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>
        ))
      ) : (
        <div className="d-flex align-items-center justify-content-center">
          {local.noResults}
        </div>
      )}
    </>
  )
}
