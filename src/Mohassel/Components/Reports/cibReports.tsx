import React, { useState, useEffect, FC } from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Swal from 'sweetalert2'
import { Loader } from '../../../Shared/Components/Loader'
import local from '../../../Shared/Assets/ar.json'
import errorMessages from '../../../Shared/Assets/errorMessages.json'
import {
  getCibPortoReports,
  cibPaymentReport,
  getTpayFiles,
} from '../../Services/APIs/Reports/cibPaymentReport'
import {
  downloadFile,
  getIscoreReportStatus,
  timeToArabicDate,
} from '../../../Shared/Services/utils'
import Can from '../../config/Can'
import { cibTpayURL } from '../../Services/APIs/Reports/cibURL'
import { LtsIcon } from '../../../Shared/Components'
import ReportsModal from '../../../Shared/Components/ReportsModal/reportsModal'

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

const CIBReports: FC = () => {
  const [data, setData] = useState<TPAYFile[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [showModal, setShowModal] = useState<boolean>(false)

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
    getCibPortoReports({
      branches: ['5efa45c1b7a37f7666b8d35a'],
      endDate: 1639087199999,
      startDate: 1634508000000,
    })
  }, [])

  const handleSubmit = async (values) => {
    const date = new Date(values.date).setHours(23, 59, 59, 999).valueOf()
    setLoading(true)
    setShowModal(false)
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
      <Card style={{ margin: '20px 50px' }} className="print-none">
        <Loader type="fullscreen" open={loading} />
        <Card.Body style={{ padding: 15 }}>
          <div className="custom-card-header">
            <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>
              {local.cibReports}
            </Card.Title>
            <Can I="cibScreen" a="report">
              <Button
                type="button"
                variant="primary"
                onClick={() => setShowModal(true)}
              >
                {local.newRequest}
              </Button>
            </Can>
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
            inputs: ['date'],
            permission: 'cibScreen',
          }}
          show={showModal}
          hideModal={() => setShowModal(false)}
          submit={(values) => handleSubmit(values)}
        />
      )}
    </>
  )
}

export default CIBReports
