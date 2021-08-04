import React, { useState } from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'

import local from '../../../../Shared/Assets/ar.json'
import { LtsIcon } from '../../../../Shared/Components'
import { Loader } from '../../../../Shared/Components/Loader'

import Can from '../../../config/Can'

import ReportsModal from '../reportsModal'
import Swal from 'sweetalert2'
import {
  downloadFile,
  getErrorMessage,
} from '../../../../Shared/Services/utils'

const CreditInquiryRequests = () => {
  const reports = [
    {
      key: 'monthlyReport',
      local: 'التقرير الشهري',
      inputs: [],
      permission: 'monthlyReport',
      handlePdfPrint: (values) => {
        console.log('Print PDF', { values })
      },
      handleExcel: {
        post: (values) => {
          console.log('Post EXCEL', { values })

          return {
            status: 'success',
            body: {
              fileId: '9909',
            },
            error: {
              error: 'Error XX',
            },
          }
        },
        get: (id) => {
          console.log('Get EXCEL', { id })

          return {
            status: 'success',
            body: {
              status: 'success',
              fileId: '9909',
              presignedUrl: '',
            },
            error: {
              error: 'Error XX',
            },
          }
        },
      },
    },
  ]

  const [selectedReport, setSelectedReport] = useState(reports[0])

  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const handleSubmit = (values) => {
    selectedReport.handlePdfPrint(values)
  }

  const getExcelPoll = async (id, pollStart) => {
    const pollInstant = new Date().valueOf()

    if (pollInstant - pollStart < 300000) {
      const file = await selectedReport.handleExcel.get(id)
      if (file.status === 'success') {
        if (['created', 'failed'].includes(file.body.status)) {
          if (file.body.status === 'created')
            downloadFile(file.body.presignedUrl)
          if (file.body.status === 'failed') Swal.fire('error', local.failed)
          setShowModal(false)
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
    setShowModal(false)

    const res = await selectedReport.handleExcel.post(values)

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
              {local.monthlyQuarterlyReports}
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
                      <Button
                        type="button"
                        variant="default"
                        onClick={() => setSelectedReport(report)}
                        title="download"
                      >
                        <LtsIcon name="download" size="40px" color="#7dc356" />
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Can>
            )
          })}
        </Card.Body>
      </Card>
      {showModal && (
        <ReportsModal
          pdf={selectedReport}
          show={showModal}
          hideModal={() => setShowModal(false)}
          submit={(values) => handleSubmit(values)}
          getExcel={(values) => getExcel(values)}
        />
      )}

      {/* {print === 'monthly' && data && (
        <MonthlyReport data={data as MonthReport} />
      )} */}
    </>
  )
}

export default CreditInquiryRequests
