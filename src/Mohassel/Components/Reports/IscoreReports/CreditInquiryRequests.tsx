import React, { useState } from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'

import Swal from 'sweetalert2'
import dayjs from 'dayjs'
import local from '../../../../Shared/Assets/ar.json'
import { LtsIcon } from '../../../../Shared/Components'
import { Loader } from '../../../../Shared/Components/Loader'

import Can from '../../../config/Can'

import {
  downloadFile,
  getErrorMessage,
} from '../../../../Shared/Services/utils'
import {
  getCreditInquiryExcel,
  postCreditInquiryExcel,
} from '../../../Services/APIs/Reports/creditInquiryRequests'
import ReportsModal from '../../../../Shared/Components/ReportsModal/reportsModal'

interface Report {
  key: string
  local: string
  inputs: string[]
  permission: string
  handlePdfPrint?: (values: any) => void
  handleExcel: {
    post: (values) => any
    get: (id) => any
  }
}

const CreditInquiryRequests = () => {
  const reports: Report[] = [
    {
      key: 'creditInquiryRequests',
      local: `${local.creditInquiryRequestsReport} ${local.individualAndGroup}`,
      inputs: ['branch', 'dateFromTo', 'creditInquiryStatus'],
      permission: 'generateIscoreReport',
      handleExcel: {
        post: postCreditInquiryExcel,
        get: getCreditInquiryExcel,
      },
    },
  ]

  const [selectedReport, setSelectedReport] = useState<Report | null>(null)

  const [loading, setLoading] = useState(false)

  const handleSubmit = (values) => {
    selectedReport?.handlePdfPrint && selectedReport.handlePdfPrint(values)
  }

  const getExcelPoll = async (id, pollStart) => {
    const pollInstant = new Date().valueOf()

    if (pollInstant - pollStart < 300000) {
      const file = await selectedReport?.handleExcel.get(id)
      if (file.status === 'success') {
        if (['created', 'failed'].includes(file.body.status)) {
          if (file.body.status === 'created')
            downloadFile(file.body.presignedUrl)
          if (file.body.status === 'failed') Swal.fire('error', local.failed)
          setSelectedReport(null)
        } else {
          setTimeout(() => getExcelPoll(id, pollStart), 10000)
        }
      }
    } else {
      Swal.fire('error', 'TimeOut')
    }

    setLoading(false)
  }

  const getExcel = async (values) => {
    setLoading(true)
    setSelectedReport(null)

    const { fromDate, toDate, branches, creditInquiryStatus } = values
    const startDate = dayjs(fromDate).startOf('day').valueOf()
    const endDate = dayjs(toDate).endOf('day').valueOf()

    const excelRequestModel = {
      startDate,
      endDate,
      branch: branches?._id,
      status: creditInquiryStatus,
    }

    const res = await selectedReport?.handleExcel.post(excelRequestModel)

    if (res.status === 'success') {
      if (Object.keys(res.body).length === 0) {
        setLoading(false)
        Swal.fire('error', local.noResults)
      } else {
        const pollStart = new Date().valueOf()

        getExcelPoll(res.body.fileId, pollStart)
      }
    } else {
      setLoading(false)

      Swal.fire('Error !', getErrorMessage(res?.error?.error), 'error')
    }
  }

  return (
    <>
      <Card style={{ margin: '20px 50px' }} className="print-none">
        <Loader type="fullscreen" open={loading} />
        <Card.Body style={{ padding: 15 }}>
          <div className="custom-card-header">
            <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>
              {local.creditInquiryRequestsReport}
            </Card.Title>
          </div>
          {reports?.map((report, index) => {
            return (
              <Can I={report.permission} a="report" key={index}>
                <Card>
                  <Card.Body>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '0px 20px',
                        fontWeight: 'bold',
                        alignItems: 'center',
                      }}
                    >
                      <div style={{ display: 'flex' }}>
                        <span style={{ marginLeft: 40 }}>#{index + 1}</span>
                        <span style={{ marginLeft: 40 }}>{report.local}</span>
                      </div>
                      <Can I="generateIscoreReport" a="report">
                        <Button
                          type="button"
                          variant="default"
                          onClick={() => setSelectedReport(report)}
                          title="download"
                        >
                          <LtsIcon
                            name="download"
                            size="40px"
                            color="#7dc356"
                          />
                        </Button>
                      </Can>
                    </div>
                  </Card.Body>
                </Card>
              </Can>
            )
          })}
        </Card.Body>
      </Card>
      {!!selectedReport && (
        <ReportsModal
          pdf={selectedReport}
          show={!!selectedReport}
          hideModal={() => setSelectedReport(null)}
          submit={(values) => handleSubmit(values)}
          getExcel={(values) => getExcel(values)}
        />
      )}
    </>
  )
}

export default CreditInquiryRequests
