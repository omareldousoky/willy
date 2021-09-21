import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Swal from 'sweetalert2'
import { Loader } from '../../../Shared/Components/Loader'
import local from '../../../Shared/Assets/ar.json'
import errorMessages from '../../../Shared/Assets/errorMessages.json'
import {
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
interface State {
  data: Array<TPAYFile>
  loading: boolean
  showModal: boolean
}
class CIBReports extends Component<{}, State> {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      data: [],
      showModal: false,
    }
  }

  componentDidMount() {
    this.getCibReports()
  }

  async handleSubmit(values) {
    const date = new Date(values.date).setHours(23, 59, 59, 999).valueOf()
    this.setState({ loading: true, showModal: false })
    const res = await cibPaymentReport({ endDate: date })
    if (res.status === 'success') {
      this.setState({ loading: false })
      if (res.body.status && res.body.status === 'processing') {
        Swal.fire('', local.fileQueuedSuccess, 'success').then(() =>
          this.getCibReports()
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
      this.setState({ loading: false })
      Swal.fire('', local.fileQueuedError, 'error')
    }
  }

  async getCibReports() {
    this.setState({ loading: true })
    const res = await getTpayFiles()
    if (res.status === 'success' && res.body) {
      this.setState({
        data: res.body.cibFile ? res.body.cibFile : [],
        loading: false,
      })
    } else {
      this.setState({ loading: false })
      Swal.fire('error', local.searchError, 'error')
    }
  }

  async getFileUrl(fileKey: string) {
    this.setState({ loading: true })
    const res = await cibTpayURL(fileKey)
    if (res.status === 'success') {
      this.setState({ loading: false })
      downloadFile(res.body.url)
    } else {
      this.setState({ loading: false }, () =>
        Swal.fire('', errorMessages.doc_read_failed.ar, 'error')
      )
    }
  }

  render() {
    return (
      <>
        <Card style={{ margin: '20px 50px' }} className="print-none">
          <Loader type="fullscreen" open={this.state.loading} />
          <Card.Body style={{ padding: 15 }}>
            <div className="custom-card-header">
              <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>
                {local.cibReports}
              </Card.Title>
              <Can I="cibScreen" a="report">
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => this.setState({ showModal: true })}
                >
                  {local.newRequest}
                </Button>
              </Can>
            </div>
            {this.state.data.length > 0 ? (
              this.state.data.map((pdf, index) => {
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
                            onClick={() => this.getFileUrl(pdf.key)}
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
        {this.state.showModal && (
          <ReportsModal
            pdf={{
              key: 'cibPaymentReport',
              local: 'سداد اقساط CIB',
              inputs: ['date'],
              permission: 'cibScreen',
            }}
            show={this.state.showModal}
            hideModal={() => this.setState({ showModal: false })}
            submit={(values) => this.handleSubmit(values)}
          />
        )}
      </>
    )
  }
}
export default CIBReports
