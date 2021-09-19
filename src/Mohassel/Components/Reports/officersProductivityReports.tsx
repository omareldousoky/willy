import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Swal from 'sweetalert2'
import { Loader } from '../../../Shared/Components/Loader'
import * as local from '../../../Shared/Assets/ar.json'
import {
  fetchOfficersProductivityReport,
  getOfficersProductivityReportById,
  getOfficersProductivityReports,
} from '../../Services/APIs/Reports/officersProductivity'
import {
  OfficersProductivityRequest,
  OfficersProductivityResponse,
} from '../../Models/OfficersProductivityReport'
import OfficersProductivity from '../pdfTemplates/officersPercentPayment/officersProductivity/officersProductivity'
import { ReportsList } from '../../../Shared/Components/ReportsList'
import { CurrentHierarchiesSingleResponse } from '../../../Shared/Models/OfficerProductivity/OfficerProductivityReport'
import ReportsModal from '../../../Shared/Components/ReportsModal/reportsModal'

interface State {
  data: any
  loading: boolean
  showModal: boolean
  dataToPrint?: OfficersProductivityResponse
}
class OfficersProductivityReports extends Component<{}, State> {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      showModal: false,
      data: [],
    }
  }

  componentDidMount() {
    this.getProductivityReports()
  }

  async handleSubmit(values) {
    const obj: OfficersProductivityRequest = {
      startDate: new Date(values.fromDate).setUTCHours(0, 0, 0, 0),
      endDate: new Date(values.toDate).setUTCHours(23, 59, 59, 999),
      branches: [].concat(
        ...values.managers.map(
          (manager: CurrentHierarchiesSingleResponse) => manager.branches
        )
      ),
      gracePeriod: values.gracePeriod,
    }
    this.setState({ loading: true })
    const res = await fetchOfficersProductivityReport(obj)
    if (res.status === 'success') {
      Swal.fire('success', local.fileQueuedSuccess, 'success')
      this.setState(
        {
          loading: false,
          showModal: false,
        },
        () => {
          this.getProductivityReports()
        }
      )
    } else {
      this.setState({ loading: false })
      Swal.fire('error', local.fileQueuedError, 'error')
    }
  }

  async getProductivityReports() {
    this.setState({ loading: true })
    const res = await getOfficersProductivityReports()
    if (res.status === 'success' && res.body?.files) {
      this.setState({
        data: res.body.files ?? [],
        loading: false,
      })
    } else {
      this.setState({ loading: false })
    }
  }

  async getFile(fileRequestId) {
    const res = await getOfficersProductivityReportById(fileRequestId)
    if (res.status === 'success') {
      this.setState(
        {
          loading: false,
          dataToPrint: res.body,
        },
        () => window.print()
      )
    } else {
      this.setState({ loading: false })
      Swal.fire('error', local.searchError, 'error')
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
                {local.officersProductivityReport}
              </Card.Title>
              <Button
                type="button"
                variant="primary"
                onClick={() => this.setState({ showModal: true })}
              >
                {local.requestNewreport}
              </Button>
            </div>
            <ReportsList
              list={this.state.data}
              onClickDownload={(itemId) => this.getFile(itemId)}
            />
          </Card.Body>
        </Card>
        {this.state.showModal && (
          <ReportsModal
            pdf={{
              key: 'officersProductivity',
              local: 'نسبة سداد المندوبين',
              inputs: ['dateFromTo', 'managers', 'gracePeriod'],
              permission: 'officersProductivityReport',
            }}
            show={this.state.showModal}
            hideModal={() => this.setState({ showModal: false })}
            submit={(values) => this.handleSubmit(values)}
          />
        )}
        {this.state.dataToPrint && (
          <OfficersProductivity data={this.state.dataToPrint} />
        )}
      </>
    )
  }
}

export default OfficersProductivityReports
