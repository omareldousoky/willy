import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import { Loader } from '../../../Shared/Components/Loader';
import * as local from '../../../Shared/Assets/ar.json';
import Button from 'react-bootstrap/Button';
import { getIscoreReportStatus, timeToArabicDate } from '../../../Shared/Services/utils';
import Swal from 'sweetalert2';
import Can from '../../config/Can';
import { fetchOfficersProductivityReport, getOfficersProductivityReportById, getOfficersProductivityReports } from '../../Services/APIs/Reports/officersProductivity';
import ReportsModal from './reportsModal';
import { CurrentHierarchiesSingleResponse, OfficersProductivityRequest, OfficersProductivityResponse } from '../../Models/OfficersProductivityReport';
import OfficersProductivity from '../pdfTemplates/officersPercentPayment/officersProductivity/officersProductivity';

interface State {
    data: any;
    loading: boolean;
    showModal: boolean;
    dataToPrint?: OfficersProductivityResponse;
}
class OfficersProductivityReports extends Component<{}, State>{
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            showModal: false,
            data: []
        }
    }
    componentDidMount() {
        this.getProductivityReports()
    }
    async getProductivityReports() {
        this.setState({ loading: true })
        const res = await getOfficersProductivityReports();
        if (res.status === 'success' && res.body?.files) {
            this.setState({
                data: res.body.files ?? [],
                loading: false,
            })
        } else {
            this.setState({ loading: false });
        }
    }
    async handleSubmit(values) {
        const obj: OfficersProductivityRequest = {
            startDate: new Date(values.fromDate).setUTCHours(
                0,
                0,
                0,
                0
              ),
            endDate: new Date(values.toDate).setUTCHours(
                23,
                59,
                59,
                999
              ),
            branches: [].concat(...values.managers.map((manager: CurrentHierarchiesSingleResponse) => manager.branches)),
            gracePeriod: values.gracePeriod,
        }
        this.setState({ loading: true })
        const res = await fetchOfficersProductivityReport(obj);
        if (res.status === 'success') {
            Swal.fire("success", local.fileQueuedSuccess, 'success')
            this.setState({
                loading: false,
                showModal: false
            },()=>{this.getProductivityReports()})
        } else {
            this.setState({ loading: false });
            Swal.fire("error", local.fileQueuedError, 'error')
        }
    }
    async getFile(fileRequest){
        const res = await getOfficersProductivityReportById(fileRequest._id);
        if (res.status === 'success') {
            this.setState({
                loading: false,
                dataToPrint: res.body
            }, () => window.print())
        } else {
            this.setState({ loading: false });
            Swal.fire("error", local.searchError, 'error')
        }
    }
    render() {
        return (
            <>
                <Card style={{ margin: '20px 50px' }} className="print-none">
                    <Loader type="fullscreen" open={this.state.loading} />
                    <Card.Body style={{ padding: 15 }}>
                        <div className="custom-card-header">
                            <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>{local.officersProductivityReport}</Card.Title>
                            {/* <Can I="createIscoreFile" a="report"> */}
                                <Button type='button' variant='primary' onClick={() => this.setState({ showModal: true })}>{local.requestNewreport}</Button>
                                {/* </Can> */}
                        </div>
                        {this.state.data.length > 0 ? this.state.data.map((pdf, index) => {
                            return (
                                <Card key={index}>
                                    <Card.Body>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0px 20px', fontWeight: 'bold', alignItems: 'center' }}>
                                            <div style={{ display: 'flex' }}>
                                                <span style={{ marginLeft: 40 }}>#{index + 1}</span>
                                                <span style={{ marginLeft: 40, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}><span>{local.loanAppCreationDate}</span>{timeToArabicDate(pdf.created.at, true)}</span>
                                                <span style={{ marginLeft: 40 }}>{getIscoreReportStatus(pdf.status)}</span>
                                                {pdf.status === 'created' && <span style={{ marginLeft: 40, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}><span>{local.creationDate}</span>{timeToArabicDate(pdf.generatedAt, true)}</span>}
                                            </div>
                                            {pdf.status === 'created' && <img style={{ cursor: 'pointer' }} alt="download" data-qc="download" src={require(`../../Assets/green-download.svg`)} onClick={() => this.getFile(pdf)} />}
                                        </div>
                                    </Card.Body>
                                </Card>
                            )
                        }) : <div className="d-flex align-items-center justify-content-center">{local.noResults} </div>}
                    </Card.Body>
                </Card>
                {this.state.showModal && <ReportsModal pdf={{ key: 'officersProductivity', local: 'نسبة سداد المندوبين', inputs: ['dateFromTo', 'managers', 'gracePeriod'], permission: 'officersProductivityReport' }} show={this.state.showModal} hideModal={() => this.setState({ showModal: false })} submit={(values) => this.handleSubmit(values)} />}   
                {this.state.dataToPrint && <OfficersProductivity data={this.state.dataToPrint} />}
            </>
        )
    }
}
export default OfficersProductivityReports