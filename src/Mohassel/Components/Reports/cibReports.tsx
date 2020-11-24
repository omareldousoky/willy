import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import { Loader } from '../../../Shared/Components/Loader';
import local from '../../../Shared/Assets/ar.json';
import Button from 'react-bootstrap/Button';
import { cibPaymentReport, getTpayFiles } from '../../Services/APIs/Reports/cibPaymentReport';
import { downloadFile, getIscoreReportStatus, timeToArabicDate } from '../../../Shared/Services/utils';
import Swal from 'sweetalert2';
import Can from '../../config/Can';
import ReportsModal from './reportsModal';

interface TPAYFile {
  created: {
    at: number;
    by: string;
    userName: string;
  };
  failReason: string;
  key: string;
  _id: string;
  status: string;
  url?: string;
}
interface State {
  data: Array<TPAYFile>;
  loading: boolean;
  showModal: boolean;
}
class CIBReports extends Component<{}, State>{
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: [],
      showModal: false,
    }
  }
  componentDidMount() {
    this.getCibReports()
  }
  async getCibReports() {
    this.setState({ loading: true })
    const res = await getTpayFiles();
    if (res.status === 'success') {
      this.setState({
        data: res.body.cibFile ? res.body.cibFile : [],
        loading: false,
      })
    } else {
      this.setState({ loading: false });
      Swal.fire("error", local.searchError, 'error')
    }
  }
  async handleSubmit(values) {
    const from = new Date(values.fromDate).setHours(0, 0, 0, 0).valueOf();
    const to = new Date(values.toDate).setHours(23, 59, 59, 999).valueOf();
    values.fromDate = from;
    values.toDate = to;
    this.setState({ loading: true, showModal: false });
    const res = await cibPaymentReport({ endDate: values.toDate });
    if (res.status === "success") {
      this.setState({ loading: false });
      if (res.body.status && res.body.status === "processing") {
        Swal.fire("", local.fileQueuedSuccess, "success").then(() => this.getCibReports())
      } else {
        const link = document.createElement("a");
        link.href = res.body.url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        link.remove();
      }
    } else {
      this.setState({ loading: false });
      Swal.fire("", local.fileQueuedError, "error");
    }
  }
  getFile(fileRequest) {
    downloadFile(fileRequest.url)
  }
  render() {
    return (
      <>
        <Card style={{ margin: '20px 50px' }} className="print-none">
          <Loader type="fullscreen" open={this.state.loading} />
          <Card.Body style={{ padding: 15 }}>
            <div className="custom-card-header">
              <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>{local.iScoreReports}</Card.Title>
              <Can I="cibScreen" a="report"><Button type='button' variant='primary' onClick={() => this.setState({ showModal: true })}>{local.requestNewreport}</Button></Can>
            </div>
            {this.state.data.length > 0 ? this.state.data.map((pdf, index) => {
              return (
                <Card key={index}>
                  <Card.Body>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0px 20px', fontWeight: 'bold', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ marginLeft: 40 }}>#{index + 1}</span>
                        <span style={{ marginLeft: 40, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}><span>{local.loanAppCreationDate}</span>{timeToArabicDate(pdf.created.at, true)}</span>
                        <span style={{ marginLeft: 40 }}>{pdf.key.split("/")[1]}</span>
                        <span style={{ marginLeft: 40 }}>{getIscoreReportStatus(pdf.status)}</span>
                        {pdf.status === 'created' && <span style={{ marginLeft: 40, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}><span>{local.creationDate}</span>{timeToArabicDate(pdf.created?.at, true)}</span>}
                      </div>
                      {pdf.status === 'created' && <img style={{ cursor: 'pointer' }} alt="download" data-qc="download" src={require(`../../Assets/green-download.svg`)} onClick={() => this.getFile(pdf)} />}
                    </div>
                  </Card.Body>
                </Card>
              )
            }) : <div className="d-flex align-items-center justify-content-center">{local.noResults} </div>}
          </Card.Body>
        </Card>
        {this.state.showModal && <ReportsModal pdf={{ key: 'cibPaymentReport', local: 'سداد اقساط CIB', inputs: ['dateFromTo'], permission: 'cibScreen' }} show={this.state.showModal} hideModal={() => this.setState({ showModal: false })} submit={(values) => this.handleSubmit(values)} />}
      </>
    )
  }
}
export default CIBReports