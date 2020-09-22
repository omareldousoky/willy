import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import { Loader } from '../../../Shared/Components/Loader';
import * as local from '../../../Shared/Assets/ar.json';
import Button from 'react-bootstrap/Button';
import { getiScoreReportRequests, generateiScoreReport } from '../../Services/APIs/Reports/iScoreReports';
import { downloadFile, getIscoreReportStatus, timeToDateyyymmdd, timeToArabicDate } from '../../Services/utils';

interface State {
    showModal?: boolean;
    data: any;
    loading: boolean;
}
class IscoreReports extends Component<{}, State>{
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            loading: false,
            data: []
        }
    }
    componentDidMount() {
        this.getiScoreReports()
    }
    async getiScoreReports() {
        this.setState({ loading: true })
        const res = await getiScoreReportRequests();
        if (res.status === 'success') {
            this.setState({
                data: res.body.data,
                showModal: false,
                loading: false,
            })
        } else {
            this.setState({ loading: false });
            console.log(res)
        }
    }
    async generateReport() {
        this.setState({ loading: true })
        const res = await generateiScoreReport();
        if (res.status === 'success') {
            this.setState({
                loading: false,
            })
        } else {
            this.setState({ loading: false });
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
                            <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>{local.iScoreReports}</Card.Title>
                            <Button type='button' variant='primary' onClick={() => this.generateReport()}>{local.requestNewreport}</Button>
                        </div>
                        {this.state.data.length > 0 ? this.state.data.map((pdf, index) => {
                            return (
                                <Card key={index}>
                                    <Card.Body>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0px 20px', fontWeight: 'bold', alignItems: 'center' }}>
                                            <div style={{ display: 'flex' }}>
                                                <span style={{ marginLeft: 40 }}>#{index + 1}</span>
                                                <span style={{ marginLeft: 40 }}>{pdf.fileName}</span>
                                                <span style={{ marginLeft: 40, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}><span>{local.loanAppCreationDate}</span>{timeToArabicDate(pdf.requestedAt, true)}</span>
                                                <span style={{ marginLeft: 40 }}>{getIscoreReportStatus(pdf.status)}</span>
                                                {pdf.status === 'created' && <span style={{ marginLeft: 40, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}><span>{local.creationDate}</span>{timeToArabicDate(pdf.fileCreatedAt, true)}</span>}
                                            </div>
                                            {pdf.status === 'created' && pdf.url && <img style={{ cursor: 'pointer' }} alt="download" data-qc="download" src={require(`../../Assets/green-download.svg`)} onClick={() => downloadFile(pdf.url)} />}
                                        </div>
                                    </Card.Body>
                                </Card>
                            )
                        }) : <div className="d-flex align-items-center justify-content-center">{local.noResults} </div>}
                    </Card.Body>
                </Card>
            </>
        )
    }
}
export default IscoreReports