import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Swal from 'sweetalert2'
import { Loader } from '../../../../Shared/Components/Loader'
import * as local from '../../../../Shared/Assets/ar.json'
import {
  getiScoreReportRequests,
  generateiScoreReport,
  getiScoreReport,
} from '../../../Services/APIs/Reports/iScoreReports'
import { downloadFile } from '../../../../Shared/Services/utils'
import Can from '../../../config/Can'

import { ReportsList } from '../../../../Shared/Components/ReportsList'
import HeaderWithCards from '../../../../Shared/Components/HeaderWithCards/headerWithCards'
import CreditInquiryRequests from './CreditInquiryRequests'
import ability from '../../../config/ability'

interface State {
  data: any
  loading: boolean
  activeTabIndex: number
}
class IscoreReports extends Component<{}, State> {
  tabs = [
    ...(ability.can('createIscoreFile', 'report') ||
    ability.can('downloadIscoreFile', 'report')
      ? [
          {
            header: local.iScoreReports,
            stringKey: 'iScoreReports',
          },
        ]
      : []),
    {
      header: local.creditInquiryRequestsReport,
      stringKey: 'creditInquiryRequestsReport',
    },
  ]

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      data: [],
      activeTabIndex: 0,
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
        data: res.body?.iscoreFiles ?? [],
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

  handleSelectTab = (activeTabStringKey: string) => {
    const activeKeyIndex = this.tabs.findIndex(
      ({ stringKey }) => stringKey === activeTabStringKey
    )

    this.setState({
      activeTabIndex: activeKeyIndex,
    })
  }

  async generateReport(type: string) {
    this.setState({ loading: true })
    const res = await generateiScoreReport(type)
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
        <HeaderWithCards
          header=""
          array={this.tabs}
          active={this.state.activeTabIndex}
          selectTab={this.handleSelectTab}
        />
        {this.tabs[this.state.activeTabIndex].stringKey ===
        'creditInquiryRequestsReport' ? (
          <CreditInquiryRequests />
        ) : (
          <Card style={{ margin: '20px 50px' }} className="print-none">
            <Loader type="fullscreen" open={this.state.loading} />

            <Card.Body style={{ padding: 15 }}>
              <div className="custom-card-header">
                <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>
                  {this.tabs[this.state.activeTabIndex].header}
                </Card.Title>
                <Can I="createIscoreFile" a="report">
                  <div className="w-50 d-flex justify-content-end">
                    <Button
                      type="button"
                      variant="primary"
                      onClick={() => this.generateReport('micro')}
                      className="mx-2"
                    >
                      {local.requestNewreport}-{local.micro}
                    </Button>
                    <Button
                      type="button"
                      variant="primary"
                      onClick={() => this.generateReport('sme')}
                    >
                      {local.requestNewreport}-{local.sme}
                    </Button>
                  </div>
                </Can>
              </div>
              <ReportsList
                list={this.state.data}
                onClickDownload={(itemId) => this.getFile(itemId)}
                iscoreType
              />
            </Card.Body>
          </Card>
        )}
      </>
    )
  }
}
export default IscoreReports
