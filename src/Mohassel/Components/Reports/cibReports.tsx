import React, { useState, useEffect, FC } from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Swal from 'sweetalert2'
import HeaderWithCards, {
  Tab,
} from 'Shared/Components/HeaderWithCards/headerWithCards'
import { Loader } from '../../../Shared/Components/Loader'
import local from '../../../Shared/Assets/ar.json'
import errorMessages from '../../../Shared/Assets/errorMessages.json'
import {
  getCibPortoReports,
  cibPaymentReport,
  getTpayFiles,
  getCibPortoFile,
} from '../../Services/APIs/Reports/cibPaymentReport'
import {
  downloadFile,
  getIscoreReportStatus,
  timeToArabicDate,
} from '../../../Shared/Services/utils'
import { cibTpayURL } from '../../Services/APIs/Reports/cibURL'
import { LtsIcon } from '../../../Shared/Components'
import ReportsModal from '../../../Shared/Components/ReportsModal/reportsModal'
import ability from '../../config/ability'

interface TPAYFile {
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
}

interface Tabs {
  header: string
  stringKey: string
  permission: string
  permissionKey: string
  inputs: string[]
}

const tabs: Tabs[] = [
  {
    header: `${local.cibReports}`,
    stringKey: 'cibReports',
    permission: 'cibScreen',
    permissionKey: 'report',
    inputs: ['date'],
  },
  {
    header: `${local.cibPortfolioSecuritization}`,
    stringKey: 'cibPortofolioReports',
    permission: 'cibPortfolioSecuritization',
    permissionKey: 'application',
    inputs: ['dateFromTo', 'branches'],
  },
]

const CIBReports: FC = () => {
  const [data, setData] = useState<TPAYFile[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<string>('cibReports')
  const [headerTabs] = useState<Tab[]>(() =>
    tabs
      .filter((t) => ability.can(t.permission, t.permissionKey))
      .map((t) => ({
        header: t.header,
        stringKey: t.stringKey,
      }))
  )

  const getCibReports = async () => {
    setLoading(true)
    const res = await getTpayFiles()
    if (res.status === 'success' && res.body) {
      setLoading(false)
      setData(res.body.cibFile ? res.body.cibFile : [])
    } else {
      setLoading(false)
      Swal.fire('error', local.searchError, 'error')
    }
  }

  useEffect(() => {
    getCibReports()
  }, [activeTab])

  const handleSubmit = async (values) => {
    setLoading(true)
    setShowModal(false)
    if (activeTab === 'cibPortofolioReports') {
      const startDate = new Date(values.fromDate)
        .setHours(23, 59, 59, 999)
        .valueOf()
      const endDate = new Date(values.toDate)
        .setHours(23, 59, 59, 999)
        .valueOf()
      const res = await getCibPortoReports({
        startDate,
        endDate,
        branches: [],
      })
      setLoading(false)
      if (res.status === 'success') {
        if (res.body.status && res.body.status === 'queued') {
          Swal.fire('', local.fileQueuedSuccess, 'success').then(async () => {
            const fileRes = await getCibPortoFile(res.body.fileId)
            if (fileRes.body.status && fileRes.body.status === 'processing') {
              // handle get files
            } else {
              const link = document.createElement('a')
              link.href = res.body.url
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
              link.remove()
            }
          })
        }
      } else {
        setLoading(false)
        Swal.fire('', local.fileQueuedError, 'error')
      }
    } else {
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
  }

  const getFileUrl = async (fileKey: string) => {
    setLoading(true)
    const res = await cibTpayURL(fileKey)
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
      <HeaderWithCards
        array={headerTabs}
        active={headerTabs.findIndex((t) => t.stringKey === activeTab)}
        selectTab={(tab: string) => {
          setActiveTab(tab)
        }}
      />
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
                          {timeToArabicDate(pdf.created.at, true)}
                        </span>
                        <span className="mr-5">{pdf.key.split('/')[1]}</span>
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
          pdf={{
            key: 'cibPaymentReport',
            local: 'سداد اقساط CIB',
            inputs: tabs.find((f) => activeTab === f.stringKey)?.inputs,
            permission:
              tabs.find((t) => t.stringKey === activeTab)?.permission ||
              'cibScreen',
          }}
          show={showModal}
          hideModal={() => {
            setShowModal(false)
          }}
          submit={(values) => handleSubmit(values)}
        />
      )}
    </>
  )
}

export default CIBReports
