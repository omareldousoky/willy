import React, { Component } from 'react'
import { Card } from 'react-bootstrap'
import { Loader } from '../../../../Shared/Components/Loader'
import local from '../../../../Shared/Assets/ar.json'
import { downloadOracleReviewFile, getOracleReviewFiles, ReviewFileResponse } from '../../../Services/APIs/loanApplication/financialClosing'
import { downloadFile, getErrorMessage, timeToArabicDate } from '../../../../Shared/Services/utils'
import Swal from 'sweetalert2'
interface State {
  loading: boolean;
  data: ReviewFileResponse[];
}
class LtsOracleReviewing extends Component<{}, State> {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      data: [],
    }
  }
  componentDidMount(){
    this.getOracleReviews()
  }
 async getOracleReviews(){
     this.setState({loading: true})
     const res = await getOracleReviewFiles();
     if(res.status==='success' && res.body){
          this.setState({data: res.body})
     } else {
         Swal.fire('Error!', getErrorMessage((res.error as Record<string, string>).error),'error')
     }
     this.setState({loading: false})
  }
  async getFileUrl(id: string){
      this.setState({loading: true})
      const res = await downloadOracleReviewFile(id);
      if(res.status==='success') {
          if(res.body)
           downloadFile(res.body?.presignedUrl)
      }else{
          Swal.fire('Error !', getErrorMessage((res.error as Record<string, string>).error),'error')
      }
      this.setState({loading: false})
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
          {this.state.data.length > 0 ? (
            this.state.data.map((file, index) => {
              return (
                <Card key={index}>
                  <Card.Body>
                    <div className="file-review-container">
                      <div className="d-flex align-items-center">
                        <span className="mx-3">#{index + 1}</span>
                        <span className="file-date-container mx-5">
                          <span>{local.loanAppCreationDate}</span>
                          {timeToArabicDate(file.fileGeneratedAt, true)}
                        </span>
                        <span className="mx-5">{file.fileName}</span>
                        <span className="mx-5">{local[file.status]}</span>
                        {file.status === 'created' && (
                          <span className="file-date-container mx-5">
                            <span>{local.creationDate}</span>
                            {timeToArabicDate(file.fileGeneratedAt, true)}
                          </span>
                        )}
                      </div>
                      {file.status === 'created' && (
                        <img
                         className="btn"
                          alt="download"
                          data-qc="download"
                          src={require(`../../../Assets/green-download.svg`)}
                          onClick={() => this.getFileUrl(file._id)}
                        />
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
