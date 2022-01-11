import React, { useState, useEffect, FC } from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Swal from 'sweetalert2'
import HeaderWithCards, {
  Tab,
} from 'Shared/Components/HeaderWithCards/headerWithCards'
import { PDF } from 'Shared/Components/PdfList/types'

import { Loader } from '../../../Shared/Components/Loader'
import local from '../../../Shared/Assets/ar.json'
import errorMessages from '../../../Shared/Assets/errorMessages.json'
import {
  postCibPortofolioReport,
  cibPaymentReport,
  getTpayFiles,
  getCibPortoFiles,
} from '../../Services/APIs/Reports/cibPaymentReport'
import {
  downloadFile,
  getIscoreReportStatus,
  timeToArabicDate,
} from '../../../Shared/Services/utils'
import { cibTpayURL, cibPortoURL } from '../../Services/APIs/Reports/cibURL'
import { LtsIcon } from '../../../Shared/Components'
import ReportsModal from '../../../Shared/Components/ReportsModal/reportsModal'
import ability from '../../config/ability'

interface CibReportFile {
  created: {
    at: number
    by: string
    userName: string
  }
  failReason: string
  key: string
  _id: string
  status: string
  url?: string
  fileGeneratedAt?: number
  fileName?: string
  fromDate?: number
  toDate?: number
}

interface CibReportTab extends Tab {
  permission: string
  permissionKey: string
}

const CIBReports: FC = () => {
  const PDFArray: PDF[] = [
    {
      key: 'cibPaymentReport',
      local: 'سداد اقساط CIB',
      inputs: ['date'],
      permission: 'cibScreen',
    },
    {
      key: 'cibPortofolioReports',
      local: `سداد اقساط ${local.cibPortfolioSecuritization}`,
      inputs: ['dateFromTo', 'branches'],
      permission: 'cibPortfolioSecuritization',
      hidePdf: true,
    },
  ]
  const Tabs: CibReportTab[] = [
    {
      header: `${local.cibReports}`,
      stringKey: 'cibPaymentReport',
      permission: 'cibScreen',
      permissionKey: 'report',
    },
    {
      header: `${local.cibPortfolioSecuritization}`,
      stringKey: 'cibPortofolioReports',
      permission: 'getCibPortfolioSecuritization',
      permissionKey: 'report',
    },
  ]
  const [data, setData] = useState<CibReportFile[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [selectedPdf, setSelectedPdf] = useState<PDF>({ permission: '' })
  const [activeTab, setActiveTab] = useState<string>('')
  const headerTabs: CibReportTab[] = Tabs.filter((f) =>
    ability.can(f.permission, f.permissionKey)
  )

  const getCibReports = async () => {
    setLoading(true)
    const cibReportFiles = {
      cibPortofolioReports: { fun: getCibPortoFiles, key: 'reportFiles' },
      cibPaymentReport: { fun: getTpayFiles, key: 'cibFile' },
    }
    const getReport = cibReportFiles[activeTab]
    const res = await getReport.fun()
    setLoading(false)
    if (res.status === 'success' && res.body) {
      setData(res.body[getReport.key] || [])
    } else {
      Swal.fire('error', local.searchError, 'error')
    }
    setLoading(false)
  }

  useEffect(() => {
    setActiveTab(headerTabs[0]?.stringKey || '')
  }, [])

  useEffect(() => {
    setSelectedPdf(
      PDFArray.find((f) => activeTab === f.key) || { permission: '' }
    )
    getCibReports()
  }, [activeTab])

  const getExcelFile = async (func, values) => {
    const { branches, fromDate, toDate, loanType } = values
    setLoading(true)
    setShowModal(false)
    const obj = {
      startDate: fromDate,
      endDate: toDate,
      branches: !branches
        ? undefined
        : branches.some((branch) => branch._id === '')
        ? []
        : branches.map((branch) => branch._id),
      loanType,
    }
    const res = await func(obj)
    if (res.status === 'success') {
      if (!res.body) {
        setLoading(false)
        Swal.fire('error', local.noResults)
      } else if (res.body.status === 'queued') {
        setLoading(false)
        await Swal.fire('', local.fileQueuedSuccess, 'success')
        getCibReports()
      }
    } else {
      setLoading(false)
    }
  }

  const getExcel = (values) => {
    const from = new Date(values.fromDate).setHours(0, 0, 0, 0).valueOf()
    const to = new Date(values.toDate).setHours(23, 59, 59, 999).valueOf()
    values.fromDate = from
    values.toDate = to
    switch (selectedPdf.key) {
      case 'cibPortofolioReports':
        return getExcelFile(postCibPortofolioReport, values)
      default:
        return null
    }
  }

  const handleSubmit = async (values) => {
    setLoading(true)
    setShowModal(false)
    const date = new Date(values.date).setHours(23, 59, 59, 999).valueOf()
    const res = await cibPaymentReport({ endDate: date })
    if (res.status === 'success') {
      setLoading(false)
      if (res.body.status && res.body.status === 'processing') {
        Swal.fire('', local.fileQueuedSuccess, 'success').then(() =>
          getCibReports()
        )
      } else {
        const link = document.createElement('a')
        link.href = res.body.url
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        link.remove()
      }
    } else {
      setLoading(false)
      Swal.fire('', local.fileQueuedError, 'error')
    }
  }

  const getFileUrl = async (fileKey: string) => {
    setLoading(true)
    const cibUrlDownload = {
      cibPortofolioReports: cibPortoURL,
      cibPaymentReport: cibTpayURL,
    }
    const reportDownload = cibUrlDownload[activeTab]
    const res = await reportDownload(fileKey)
    if (res.status === 'success') {
      setLoading(false)
      downloadFile(res.body.url)
    } else {
      setLoading(false)
      Swal.fire('', errorMessages.doc_read_failed.ar, 'error')
    }
  }

  return (
    <>
      {headerTabs && headerTabs.length > 1 && (
        <HeaderWithCards
          array={headerTabs}
          active={headerTabs.findIndex((t) => t.stringKey === activeTab)}
          selectTab={(tab: string) => {
            setActiveTab(tab)
          }}
        />
      )}
      <Card style={{ margin: '20px 50px' }} className="print-none">
        <Loader type="fullscreen" open={loading} />
        <Card.Body style={{ padding: 15 }}>
          <div className="custom-card-header">
            <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>
              {headerTabs.find((t) => t.stringKey === activeTab)?.header ||
                local.cibReports}
            </Card.Title>
            <div>
              <Button
                className="mr-2"
                type="button"
                variant="primary"
                onClick={() => setShowModal(true)}
              >
                {local.newRequest}
              </Button>
            </div>
          </div>
          {data.length > 0 ? (
            data.map((pdf, index) => {
              return (
                <Card key={index}>
                  <Card.Body>
                    <div className="d-flex justify-content-between font-weight-bold">
                      <div className="d-flex">
                        <span className="mr-5 text-secondary">
                          #{index + 1}
                        </span>
                        <span className="mr-5 d-flex flex-start flex-column">
                          <span>{local.loanAppCreationDate}</span>
                          {timeToArabicDate(
                            !pdf.fileGeneratedAt
                              ? pdf.created.at
                              : pdf.fileGeneratedAt,
                            true
                          )}
                        </span>
                        {pdf.key && (
                          <span className="mr-5">{pdf.key.split('/')[1]}</span>
                        )}
                        <span
                          className={`mr-5  text-${
                            pdf.status === 'created'
                              ? 'success'
                              : pdf.status === 'processing'
                              ? 'warning'
                              : 'danger'
                          } `}
                        >
                          {getIscoreReportStatus(pdf.status)}
                        </span>
                        {pdf.status === 'created' && (
                          <span className="mr-5 d-flex flex-start flex-column">
                            <span>{local.creationDate}</span>
                            {timeToArabicDate(pdf.created?.at, true)}
                          </span>
                        )}
                      </div>
                      {pdf.status === 'created' && (
                        <Button
                          type="button"
                          variant="default"
                          onClick={() => getFileUrl(pdf.key)}
                          title="download"
                        >
                          <LtsIcon
                            name="download"
                            color="#7dc356"
                            size="40px"
                          />
                        </Button>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              )
            })
          ) : (
            <div className="d-flex align-items-center justify-content-center">
              {local.noResults}{' '}
            </div>
          )}
        </Card.Body>
      </Card>
      {showModal && (
        <ReportsModal
          pdf={selectedPdf}
          show={showModal}
          hideModal={() => {
            setShowModal(false)
          }}
          getExcel={(values) => getExcel(values)}
          submit={(values) => handleSubmit(values)}
          disableExcel={activeTab === 'cibPaymentReport'}
        />
      )}
    </>
  )
}

export default CIBReports
