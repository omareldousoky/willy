import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import { Loader } from '../../../Shared/Components/Loader';
import * as local from '../../../Shared/Assets/ar.json';
import Button from 'react-bootstrap/Button';
import Swal from 'sweetalert2';
import Can from '../../config/Can';
import MonthlyReport from '../pdfTemplates/monthlyReport/monthlyReport';
import QuarterlyReport from '../pdfTemplates/quarterlyReport/quarterlyReport';
import { monthlyReport } from '../../Services/APIs/Reports/monthlyReport';

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
    this.setState({loading:  true})
    if (type === 'monthly') {
       const res = await monthlyReport();
       if(res.status==="success")
           this.setState({ print: type,data: res.body},() => window.print());
    } else {
      this.setState({print: type,data: {}},()=> window.print());
    }
    this.setState({loading: false});
  }

  render() {
    return (
      <>
        <Card style={{ margin: '20px 50px' }} className="print-none">
          <Loader type="fullscreen" open={this.state.loading} />
          <Card.Body style={{ padding: 15 }}>
            <div className="custom-card-header">
              <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>{local.monthlyQuarterlyReports}</Card.Title>
            </div>
            <Card>
              <Card.Body>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0px 20px', fontWeight: 'bold', alignItems: 'center' }}>
                  <div style={{ display: 'flex' }}>
                    <span style={{ marginLeft: 40 }}>#1</span>
                    <span style={{ marginLeft: 40 }}>{local.monthlyReport}</span>
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
                    <span style={{ marginLeft: 40 }}>{local.quarterReport}</span>
                  </div>
                  <img style={{ cursor: 'pointer' }} alt="download" data-qc="download" src={require(`../../Assets/green-download.svg`)} onClick={() => this.getFile('quarterly')} />
                </div>
              </Card.Body>
            </Card>
          </Card.Body>
        </Card>
        {this.state.print === 'monthly' && this.state.data && <MonthlyReport data={this.state.data} /> }
        {this.state.print === 'quarterly' && <QuarterlyReport />}
      </>
    )
  }
}
export default MonthlyQuarterlyReports