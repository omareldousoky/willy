import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Swal from 'sweetalert2'
import { Loader } from '../../../Shared/Components/Loader'
import * as local from '../../../Shared/Assets/ar.json'
import {
  getiScoreReportRequests,
  generateiScoreReport,
  getiScoreReport,
} from '../../Services/APIs/Reports/iScoreReports'
import {
  downloadFile,
  getIscoreReportStatus,
  timeToArabicDate,
} from '../../../Shared/Services/utils'
import Can from '../../config/Can'
import { LtsIcon } from '../../../Shared/Components'

interface State {
  data: any
  loading: boolean
}
class IscoreReports extends Component<{}, State> {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      data: [],
    }
  }

  componentDidMount() {
    this.getiScoreReports()
  }

  async getiScoreReports() {
    this.setState({ loading: true })
    const res = await getiScoreReportRequests()
    if (res.status === 'success') {
      this.setState({
        data: res.body.iscoreFiles ? res.body.iscoreFiles : [],
        loading: false,
      })
    } else {
      this.setState({ loading: false })
      Swal.fire('error', local.searchError, 'error')
      // TODO:lint: (3 in file) remove??
      console.log(res)
    }
  }

  async getFile(fileRequest) {
    const res = await getiScoreReport(fileRequest._id)
    if (res.status === 'success') {
      this.setState(
        {
          loading: false,
        },
        () => {
          downloadFile(res.body.presignedUrl)
        }
      )
    } else {
      this.setState({ loading: false })
      Swal.fire('error', local.searchError, 'error')
      console.log(res)
    }
  }

  async generateReport() {
    this.setState({ loading: true })
    const res = await generateiScoreReport()
    if (res.status === 'success') {
      Swal.fire('success', local.fileQueuedSuccess, 'success')
      this.setState(
        {
          loading: false,
        },
        () => {
          this.getiScoreReports()
        }
      )
    } else {
      this.setState({ loading: false })
      Swal.fire('error', local.fileQueuedError, 'error')
      console.log(res)
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
                {local.iScoreReports}
              </Card.Title>
              <Can I="createIscoreFile" a="report">
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => this.generateReport()}
                >
                  {local.requestNewreport}
                </Button>
              </Can>
            </div>
            {this.state.data.length > 0 ? (
              this.state.data.map((pdf, index) => {
                return (
                  <Card key={index}>
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
                          <span
                            style={{
                              marginLeft: 40,
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'flex-start',
                            }}
                          >
                            <span>{local.loanAppCreationDate}</span>
                            {timeToArabicDate(pdf.created.at, true)}
                          </span>
                          <span style={{ marginLeft: 40 }}>
                            {getIscoreReportStatus(pdf.status)}
                          </span>
                          <span style={{ marginLeft: 40 }}>{pdf.fileName}</span>
                          {pdf.status === 'created' && (
                            <span
                              style={{
                                marginLeft: 40,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                              }}
                            >
                              <span>{local.creationDate}</span>
                              {timeToArabicDate(pdf.fileGeneratedAt, true)}
                            </span>
                          )}
                        </div>
                        {pdf.status === 'created' && (
                          <Button
                            type="button"
                            variant="default"
                            onClick={() => this.getFile(pdf)}
                            title="download"
                          >
                            <LtsIcon
                              name="download"
                              size="40px"
                              color="#7dc356"
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
                {local.noResults}
              </div>
            )}
          </Card.Body>
        </Card>
      </>
    )
  }
}
export default IscoreReports
