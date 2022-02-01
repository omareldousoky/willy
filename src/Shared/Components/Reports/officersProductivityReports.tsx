import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Swal from 'sweetalert2'
import { Loader } from '../Loader'
import * as local from '../../Assets/ar.json'
import {
  fetchOfficersProductivityReport,
  getOfficersProductivityReportById,
  getOfficersProductivityReports,
} from '../../Services/APIs/Reports/officersProductivity'
import {
  OfficersProductivityRequest,
  OfficersProductivityResponse,
} from '../../Models/OfficerProductivity/OfficersProductivityReport'
import OfficersProductivity from '../pdfTemplates/Operations/officersPercentPayment/officersProductivity/officersProductivity'
import { ReportsList } from '../ReportsList'
import { CurrentHierarchiesSingleResponse } from '../../Models/OfficerProductivity/OfficerProductivityReport'
import ReportsModal from '../ReportsModal/reportsModal'

interface State {
  data: any
  loading: boolean
  showModal: boolean
  dataToPrint?: OfficersProductivityResponse
  disable?: boolean
}
class OfficersProductivityReports extends Component<{}, State> {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      showModal: false,
      data: [],
      disable: false,
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
      Swal.fire({
        title: local.success,
        text: local.fileQueuedSuccess,
        confirmButtonText: local.confirmationText,
        icon: 'success',
      })
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
      Swal.fire({
        title: local.errorTitle,
        confirmButtonText: local.confirmationText,
        text: local.fileQueuedError,
        icon: 'error',
      })
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
    this.setState({
      disable: true,
      loading: true,
    })
    const res = await getOfficersProductivityReportById(fileRequestId)
    if (res.status === 'success') {
      this.setState(
        {
          loading: false,
          dataToPrint: res.body,
          disable: false,
        },
        () => window.print()
      )
    } else {
      this.setState({ loading: false })
      Swal.fire({
        title: local.errorTitle,
        confirmButtonText: local.confirmationText,
        text: local.searchError,
        icon: 'error',
      })
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
              disabledProp={this.state.disable}
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
