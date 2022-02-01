import React, { Component } from 'react'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'

import Swal from 'sweetalert2'
import { Loader } from '../../../../Shared/Components/Loader'
import local from '../../../../Shared/Assets/ar.json'
import {
  downloadOracleReviewFile,
  getOracleReviewFiles,
  ReviewFilesResponse,
} from '../../../../Shared/Services/APIs/loanApplication/financialClosing'
import {
  downloadFile,
  getErrorMessage,
  timeToArabicDate,
} from '../../../../Shared/Services/utils'
import { LtsIcon } from '../../../../Shared/Components'

interface State {
  loading: boolean
  data: ReviewFilesResponse
}
class LtsOracleReviewing extends Component<{}, State> {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      data: {},
    }
  }

  componentDidMount() {
    this.getOracleReviews()
  }

  async getOracleReviews() {
    this.setState({ loading: true })
    const res = await getOracleReviewFiles()
    if (res.status === 'success' && res.body) {
      this.setState({ data: res.body })
    } else {
      Swal.fire({
        title: local.errorTitle,
        text: getErrorMessage((res.error as Record<string, string>).error),
        icon: 'error',
        confirmButtonText: local.confirmationText,
      })
    }
    this.setState({ loading: false })
  }

  async getFileUrl(id: string) {
    this.setState({ loading: true })
    const res = await downloadOracleReviewFile(id)
    if (res.status === 'success') {
      if (res.body) downloadFile(res.body?.presignedUrl)
    } else {
      Swal.fire({
        title: local.errorTitle,
        text: getErrorMessage((res.error as Record<string, string>).error),
        icon: 'error',
        confirmButtonText: local.confirmationText,
      })
    }
    this.setState({ loading: false })
  }

  render() {
    return (
      <Card className="main-card">
        <Loader type="fullscreen" open={this.state.loading} />
        <Card.Header className="d-flex justify-content-between bg-white border-0">
          <div className="d-flex align-items-center">
            <Card.Title className="mx-5 my-0">{local.oracleReports}</Card.Title>
          </div>
        </Card.Header>
        <Card.Body>
          {this.state.data?.reviewFiles?.length ? (
            this.state.data.reviewFiles?.map((file, index) => {
              return (
                <Card key={index}>
                  <Card.Body>
                    <div className="file-review-container">
                      <div className="d-flex align-items-center">
                        <span className="mx-3 text-secondary">
                          #{index + 1}
                        </span>
                        <span className="file-date-container mx-5">
                          <span>{local.closeDate}</span>
                          {file.toDate
                            ? timeToArabicDate(file.toDate, true)
                            : ''}
                        </span>
                        <span className="mx-5">{file.fileName}</span>
                        <span
                          className={`mx-5  text-${
                            file.status === 'created'
                              ? 'success'
                              : file.status.toLowerCase() === 'processing'
                              ? 'warning'
                              : 'danger'
                          } `}
                        >
                          {local[file.status.toLowerCase()]}
                        </span>
                        {file.status === 'created' && (
                          <span className="file-date-container mx-5">
                            <span>{local.creationDate}</span>
                            {file.fileGeneratedAt
                              ? timeToArabicDate(file.fileGeneratedAt, true)
                              : ''}
                          </span>
                        )}
                      </div>
                      {file.status === 'created' && (
                        <Button
                          type="button"
                          variant="default"
                          onClick={() => this.getFileUrl(file._id)}
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
            <div className="d-flex justify-content-center align-items-center mr-5 text-align-center">
              <div>
                <img
                  alt="no-data-found"
                  src={require('../../../../Shared/Assets/no-results-found.svg')}
                />
                <h4>{local.noResultsFound}</h4>
              </div>
            </div>
          )}
        </Card.Body>
      </Card>
    )
  }
}

export default LtsOracleReviewing
