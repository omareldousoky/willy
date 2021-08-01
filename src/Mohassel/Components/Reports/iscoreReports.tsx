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
import { downloadFile } from '../../../Shared/Services/utils'
import Can from '../../config/Can'
import { LtsIcon } from '../../../Shared/Components'

import { ReportsList } from '../../../Shared/Components/ReportsList'

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

  async getFile(fileRequestId) {
    const res = await getiScoreReport(fileRequestId)
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
            <ReportsList
              list={this.state.data}
              onClickDownload={(itemId) => this.getFile(itemId)}
            />
          </Card.Body>
        </Card>
      </>
    )
  }
}
export default IscoreReports
