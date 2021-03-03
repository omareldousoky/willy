import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import Swal from 'sweetalert2'
import { Loader } from '../../../Shared/Components/Loader'
import * as local from '../../../Shared/Assets/ar.json'
import Can from '../../config/Can'
import MonthlyReport from '../pdfTemplates/monthlyReport/monthlyReport'
import QuarterlyReport from '../pdfTemplates/quarterlyReport/quarterlyReport'
import {
  monthlyReport,
  getMonthlyReportExcel,
  postMonthlyReportExcel,
} from '../../Services/APIs/Reports/monthlyReport'
import {
  quarterlyReport,
  getQuarterlyReportExcel,
  postQuarterlyReportExcel,
} from '../../Services/APIs/Reports/quarterlyReport'
import ReportsModal from './reportsModal'
import { getErrorMessage, downloadFile } from '../../../Shared/Services/utils'

import { MonthReport, QuarterReport } from '../../../Shared/Services/interfaces'

export interface PDF {
  key?: string
  local?: string
  inputs?: Array<string>
  permission: string
}

interface State {
  loading: boolean
  print: string
  data: QuarterReport | MonthReport | object
  pdfsArray?: Array<PDF>
  selectedPdf: PDF
  showModal: boolean
}
class MonthlyQuarterlyReports extends Component<{}, State> {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      print: '',
      pdfsArray: [
        {
          key: 'monthlyReport',
          local: 'التقرير الشهري',
          inputs: [],
          permission: 'monthlyReport',
        },
        {
          key: 'quarterlyReport',
          local: 'التقرير الربع سنوي',
          inputs: ['quarterYear', 'quarterNumber'],
          permission: 'quarterlyReport',
        },
      ],
      data: {},
      showModal: false,
      selectedPdf: { permission: '' },
    }
  }

  handlePrint(selectedPdf: PDF) {
    this.setState({ showModal: true, selectedPdf })
  }

  async handleSubmit(values) {
    switch (this.state.selectedPdf.key) {
      case 'monthlyReport':
        return this.monthlyReport()
      case 'quarterlyReport':
        return this.quarterlyReport(values)
    }
  }

  async monthlyReport() {
    this.setState({ loading: true, showModal: false })
    const res = await monthlyReport()
    if (res.status === 'success') {
      this.setState({ loading: false, print: 'monthly', data: res.body }, () =>
        window.print()
      )
    } else {
      this.setState({ loading: false }, () =>
        Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
      )
    }
  }

  async quarterlyReport(values) {
    const date = values.quarterYear.split('-')
    const year = date[0]
    this.setState({ loading: true, showModal: false })
    if (values) {
      const res = await quarterlyReport({
        quarter: `${year}-${values.quarterNumber}`,
      })
      if (res.status === 'success') {
        this.setState(
          { loading: false, print: 'quarterly', data: res.body },
          () => window.print()
        )
      } else {
        this.setState({ loading: false }, () =>
          Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
        )
      }
    }
  }

  getExcel(values) {
    let obj = {}
    if (values) {
      const date = values.quarterYear?.split('-')
      const year = date?.length > 0 ? date[0] : ''
      obj = {
        quarter: `${year}-${values.quarterNumber}`,
      }
    }
    switch (this.state.selectedPdf.key) {
      case 'monthlyReport':
        return this.getExcelFile(
          postMonthlyReportExcel,
          getMonthlyReportExcel,
          {}
        )
      case 'quarterlyReport':
        return this.getExcelFile(
          postQuarterlyReportExcel,
          getQuarterlyReportExcel,
          obj
        )
    }
  }

  async getExcelFile(func, pollFunc, obj) {
    this.setState({ loading: true, showModal: false })
    const res = await func(obj)
    if (res.status === 'success') {
      if (Object.keys(res.body).length === 0) {
        this.setState({ loading: false })
        Swal.fire('error', local.noResults)
      } else {
        this.setState({ loading: true })
        const pollStart = new Date().valueOf()
        this.getExcelPoll(pollFunc, res.body.fileId, pollStart)
      }
    } else {
      this.setState({ loading: false })
      Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
    }
  }

  async getExcelPoll(func, id, pollStart) {
    const pollInstant = new Date().valueOf()
    if (pollInstant - pollStart < 300000) {
      const file = await func(id)
      if (file.status === 'success') {
        if (['created', 'failed'].includes(file.body.status)) {
          if (file.body.status === 'created')
            downloadFile(file.body.presignedUrl)
          if (file.body.status === 'failed') Swal.fire('error', local.failed)
          this.setState({
            showModal: false,
            loading: false,
          })
        } else {
          setTimeout(() => this.getExcelPoll(func, id, pollStart), 10000)
        }
      } else {
        this.setState({ loading: false })
        console.log(file)
      }
    } else {
      this.setState({ loading: false })
      Swal.fire('error', 'TimeOut')
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
                {local.monthlyQuarterlyReports}
              </Card.Title>
            </div>
            {this.state.pdfsArray?.map((pdf, index) => {
              return (
                <Can I={pdf.permission} a="report" key={index}>
                  <Card>
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
                          <span style={{ marginLeft: 40 }}>{pdf.local}</span>
                        </div>
                        <img
                          style={{ cursor: 'pointer' }}
                          alt="download"
                          data-qc="download"
                          src={require(`../../Assets/green-download.svg`)}
                          onClick={() => this.handlePrint(pdf)}
                        />
                      </div>
                    </Card.Body>
                  </Card>
                </Can>
              )
            })}
          </Card.Body>
        </Card>
        {this.state.showModal && (
          <ReportsModal
            pdf={this.state.selectedPdf}
            show={this.state.showModal}
            hideModal={() => this.setState({ showModal: false })}
            submit={(values) => this.handleSubmit(values)}
            getExcel={(values) => this.getExcel(values)}
          />
        )}
        {this.state.print === 'monthly' && this.state.data && (
          <MonthlyReport data={this.state.data as MonthReport} />
        )}
        {this.state.print === 'quarterly' && (
          <QuarterlyReport data={this.state.data as QuarterReport} />
        )}
      </>
    )
  }
}
export default MonthlyQuarterlyReports
