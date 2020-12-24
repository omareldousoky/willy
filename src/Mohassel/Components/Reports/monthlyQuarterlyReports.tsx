import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import { Loader } from '../../../Shared/Components/Loader';
import * as local from '../../../Shared/Assets/ar.json';
import Button from 'react-bootstrap/Button';
import Swal from 'sweetalert2';
import Can from '../../config/Can';
import MonthlyReport from '../pdfTemplates/monthlyReport/monthlyReport';
import QuarterlyReport from '../pdfTemplates/quarterlyReport/quarterlyReport';

interface State {
  loading: boolean;
  print: string;
  data: any;
}
class MonthlyQuarterlyReports extends Component<{}, State>{
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      print: '',
      data: {},
    }
  }
  async getFile(type: string) {
    this.setState({ print: type }, () => window.print())
    if (type === 'monthly') {

    } else {

    }
  }
  async generateReport() {

  }
  render() {
    return (
      <>
        <Card style={{ margin: '20px 50px' }} className="print-none">
          <Loader type="fullscreen" open={this.state.loading} />
          <Card.Body style={{ padding: 15 }}>
            <div className="custom-card-header">
              <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>{local.iScoreReports}</Card.Title>
              <Can I="createIscoreFile" a="report"><Button type='button' variant='primary' onClick={() => this.generateReport()}>{local.requestNewreport}</Button></Can>
            </div>
            <Card>
              <Card.Body>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0px 20px', fontWeight: 'bold', alignItems: 'center' }}>
                  <div style={{ display: 'flex' }}>
                    <span style={{ marginLeft: 40 }}>#1</span>
                    <span style={{ marginLeft: 40 }}>monthly</span>
                    <span style={{ marginLeft: 40 }}>status</span>
                    <span style={{ marginLeft: 40 }}>1/1/2021</span>
                  </div>
                  <img style={{ cursor: 'pointer' }} alt="download" data-qc="download" src={require(`../../Assets/green-download.svg`)} onClick={() => this.getFile('monthly')} />
                </div>
              </Card.Body>
            </Card>
            <Card>
              <Card.Body>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0px 20px', fontWeight: 'bold', alignItems: 'center' }}>
                  <div style={{ display: 'flex' }}>
                    <span style={{ marginLeft: 40 }}>#2</span>
                    <span style={{ marginLeft: 40 }}>quarterly</span>
                    <span style={{ marginLeft: 40 }}>status</span>
                    <span style={{ marginLeft: 40 }}>1/1/2021</span>
                  </div>
                  <img style={{ cursor: 'pointer' }} alt="download" data-qc="download" src={require(`../../Assets/green-download.svg`)} onClick={() => this.getFile('quarterly')} />
                </div>
              </Card.Body>
            </Card>
          </Card.Body>
        </Card>
        {this.state.print === 'monthly' ? <MonthlyReport data={this.state.data} /> : <QuarterlyReport data={this.state.data} />}
      </>
    )
  }
}
export default MonthlyQuarterlyReports