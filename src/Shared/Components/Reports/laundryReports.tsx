import React, { FunctionComponent, useState } from 'react'
import Swal from 'sweetalert2'

import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import * as local from '../../Assets/ar.json'
import { getErrorMessage } from '../../Services/utils'
import { LaundryReportRequest } from '../../Models/LaundryReports'
import { fetchFalteringPaymentsReport } from '../../Services/APIs/Reports/falteringPayments'
import { Loader } from '../Loader'
import Can from '../../config/Can'
import { FalteringPayments as FalteringPaymentsPdf } from '../pdfTemplates/falteringPayments/falteringPayments'
import { fetchEarlyPaymentsReport } from '../../Services/APIs/Reports/earlyPayments'
import { EarlyPayments as EarlyPaymentsPdf } from '../pdfTemplates/earlyPayments/earlyPayments'
import { LtsIcon } from '../index'
import { ApiResponse } from '../../Models/common'
import { PDF } from '../PdfList/types'
import ReportsModal from '../ReportsModal/reportsModal'

enum ReportEnum {
  FalteringPayments = 'falteringPayments',
  EarlyPayments = 'earlyPayments',
  EarlyPayments4Months = 'earlyPayments4Months',
}

const laundryPdfs = [
  {
    key: ReportEnum.FalteringPayments,
    local: 'تقرير سداد المتعثرين',
    inputs: ['dateFromTo', 'branches'],
    permission: ReportEnum.FalteringPayments,
  },
  {
    key: ReportEnum.EarlyPayments,
    local: 'تقرير السداد المعجل',
    inputs: ['dateFromTo', 'branches'],
    permission: ReportEnum.EarlyPayments,
  },
  {
    key: ReportEnum.EarlyPayments4Months,
    local: 'تقرير السداد المعجل خلال ٤ شهور',
    inputs: ['dateFromTo', 'branches'],
    permission: ReportEnum.EarlyPayments4Months,
  },
]

const LaundryReports: FunctionComponent = () => {
  const [showModal, setShowModal] = useState(false)
  const [printReport, setPrintReport] = useState<ReportEnum>()
  const [selectedPdf, setSelectedPdf] = useState<PDF>()
  const [loading, setLoading] = useState(false)
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [data, setData] = useState<any>()

  const handlePrint = (chosenPdf: PDF) => {
    setShowModal(true)
    setSelectedPdf(chosenPdf)
    setData(undefined)
    setFromDate('')
    setToDate('')
  }

  const reportRequest = (values): LaundryReportRequest => {
    const { branches } = values
    const startDate = new Date(values.fromDate).setHours(0, 0, 0, 0).valueOf()
    const endDate = new Date(values.toDate).setHours(23, 59, 59, 999).valueOf()

    return {
      startDate,
      endDate,
      branches,
    }
  }

  const handleFetchReport = (res: ApiResponse<any>, report: ReportEnum) => {
    if (res.status === 'success') {
      if (!res.body || !Object.keys(res.body).length) {
        setLoading(false)
        Swal.fire('error', local.noResults)
      } else {
        setData(res.body)
        setShowModal(false)
        setPrintReport(report)
        setLoading(false)

        // print pdf
        window.print()
      }
    } else {
      setLoading(false)
      Swal.fire(
        'Error !',
        getErrorMessage((res.error as Record<string, string>).error),
        'error'
      )
    }
  }

  const handleSubmit = async (values) => {
    const branches = values.branches.map((branch) => branch._id)
    values.branches = branches.includes('') ? [] : branches
    setShowModal(false)
    setLoading(true)
    setFromDate(values.fromDate)
    setToDate(values.toDate)
    switch (selectedPdf?.key) {
      case ReportEnum.FalteringPayments: {
        const falteringResponse = await fetchFalteringPaymentsReport(
          reportRequest(values)
        )
        return handleFetchReport(
          falteringResponse,
          ReportEnum.FalteringPayments
        )
      }
      case ReportEnum.EarlyPayments: {
        const earlyResponse = await fetchEarlyPaymentsReport(
          reportRequest(values)
        )
        return handleFetchReport(earlyResponse, ReportEnum.EarlyPayments)
      }
      case ReportEnum.EarlyPayments4Months: {
        const early4MonthsResponse = await fetchEarlyPaymentsReport(
          reportRequest(values),
          true
        )
        return handleFetchReport(
          early4MonthsResponse,
          ReportEnum.EarlyPayments4Months
        )
      }
      default:
        return null
    }
  }

  return (
    <>
      <Card style={{ margin: '20px 50px' }} className="print-none">
        <Loader type="fullscreen" open={loading} />
        <Card.Body style={{ padding: 15 }}>
          <div className="custom-card-header">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>
                {local.laundryReports}
              </Card.Title>
            </div>
          </div>
          {laundryPdfs.map((pdf, index) => {
            return (
              <Can I={pdf.permission} a="report" key={index}>
                <Card key={index}>
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center px-2">
                      <div className="font-weight-bold">
                        <span className="mr-4">#{index + 1}</span>
                        <span>{pdf.local}</span>
                      </div>
                      <Button
                        type="button"
                        variant="default"
                        onClick={() => handlePrint(pdf)}
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
      {showModal && selectedPdf && (
        <ReportsModal
          pdf={selectedPdf}
          show={showModal}
          hideModal={() => setShowModal(false)}
          submit={(values) => handleSubmit(values)}
        />
      )}
      {printReport === ReportEnum.FalteringPayments && data && (
        <FalteringPaymentsPdf data={data} fromDate={fromDate} toDate={toDate} />
      )}
      {printReport === ReportEnum.EarlyPayments && data && (
        <EarlyPaymentsPdf data={data} fromDate={fromDate} toDate={toDate} />
      )}
      {printReport === ReportEnum.EarlyPayments4Months && data && (
        <EarlyPaymentsPdf
          data={data}
          fromDate={fromDate}
          toDate={toDate}
          is4Months
        />
      )}
    </>
  )
}

export default LaundryReports
