import React, { Component } from 'react';
import { getApplication } from '../../Services/APIs/loanApplication/getApplication';
import InfoBox from '../userInfoBox';
import { englishToArabic } from '../../Services/statusLanguage';
import { getRenderDate } from '../../Services/getRenderDate';
import Tab from 'react-bootstrap/Tab';
import Table from 'react-bootstrap/Table';
import * as local from '../../../Shared/Assets/ar.json';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Swal from 'sweetalert2';
interface State {
    prevId: string;
    application: any;
}

interface Props {
    history: any;
    location: any;
}

class LoanProfile extends Component<Props, State>{
    constructor(props: Props) {
        super(props);
        this.state = {
            prevId: '',
            application: {}
        };
    }
    componentDidMount() {
        const appId = this.props.history.location.state.id;
        this.getAppByID(appId)
    }
    async getAppByID(id) {
        const application = await getApplication(id);
        if (application.status === 'success') {
            this.setState({
                application: application.body
            })
        } else {
            Swal.fire('','fetch error','error')
        }
    }
    renderApplicationData() {
        return (
            <Table striped bordered style={{ textAlign: 'right' }}>
                <tbody>
                    <tr>
                        <td>نوع القرض</td>
                        <td>{this.state.application.product.currency}</td>
                    </tr>
                    <tr>
                        <td>{local.currency}</td>
                        <td>{this.state.application.product.currency}</td>
                    </tr>
                    <tr>
                        <td>{local.calculationFormulaId}</td>
                        <td>{this.state.application.product.calculationFormula.name}</td>
                    </tr>
                    <tr>
                        <td>{local.interest}</td>
                        <td>{this.state.application.product.interest + ' ' + this.state.application.product.interestPeriod}</td>
                    </tr>
                    <tr>
                        <td>{local.inAdvanceFees}</td>
                        <td>{this.state.application.product.inAdvanceFees}</td>
                    </tr>
                    <tr>
                        <td>{local.periodLengthEvery}</td>
                        <td>{this.state.application.product.periodLength + ' ' + this.state.application.product.periodType}</td>
                    </tr>
                    <tr>
                        <td>{local.gracePeriod}</td>
                        <td>{this.state.application.product.gracePeriod}</td>
                    </tr>
                    <tr>
                        <td>{local.pushPayment}</td>
                        <td>{this.state.application.product.pushPayment}</td>
                    </tr>
                    <tr>
                        <td>{local.noOfInstallments}</td>
                        <td>{this.state.application.product.noOfInstallments}</td>
                    </tr>
                    <tr>
                        <td>{local.principal}</td>
                        <td>{this.state.application.principal}</td>
                    </tr>
                    <tr>
                        <td>{local.applicationFee}</td>
                        <td>{this.state.application.product.applicationFee}</td>
                    </tr>
                    <tr>
                        <td>{local.individualApplicationFee}</td>
                        <td>{this.state.application.product.individualApplicationFee}</td>
                    </tr>
                    <tr>
                        <td>{local.applicationFeePercent}</td>
                        <td>{this.state.application.product.applicationFeePercent}</td>
                    </tr>
                    <tr>
                        <td>{local.applicationFeePercentPerPerson}</td>
                        <td>{this.state.application.product.applicationFeePercentPerPerson}</td>
                    </tr>
                    <tr>
                        <td>{local.stamps}</td>
                        <td>{this.state.application.product.stamps}</td>
                    </tr>
                    <tr>
                        <td>{local.adminFees}</td>
                        <td>{this.state.application.product.adminFees}</td>
                    </tr>
                    <tr>
                        <td>{local.entryDate}</td>
                        <td>{getRenderDate(this.state.application.entryDate)}</td>
                    </tr>
                    <tr>
                        <td>{local.usage}</td>
                        <td>{this.state.application.usage}</td>
                    </tr>
                    <tr>
                        <td>{local.representative}</td>
                        <td>{this.state.application.representativeId}</td>
                    </tr>
                    <tr>
                        <td>{local.enquiror}</td>
                        <td>{this.state.application.enquirorId}</td>
                    </tr>
                    <tr>
                        <td>{local.visitationDate}</td>
                        <td>{getRenderDate(this.state.application.visitationDate)}</td>
                    </tr>
                </tbody>
            </Table>
        )
    }
    renderGuarantorData() {
        return(
            <div className="d-flex justify-content-around">
                {(this.state.application.guarantors.length>0) ? this.state.application.guarantors.map((guar,i) => 
                <div key={i}>
                    <div className="d-flex flex-row">
                        <p>{local.name}</p>
                        <p style={{ margin: '0 10px 0 0' }}>{guar.customerName}</p>
                    </div>
                    <div className="d-flex flex-row">
                        <p>{local.nationalId}</p>
                        <p style={{ margin: '0 10px 0 0' }}>{guar.nationalId}</p>
                    </div>
                    <div className="d-flex flex-row">
                        <p>{local.birthDate}</p>
                        <p style={{ margin: '0 10px 0 0' }}>{getRenderDate(guar.birthDate)}</p>
                    </div>
                    <div className="d-flex flex-row">
                        <p>{local.nationalIdIssueDate}</p>
                        <p style={{ margin: '0 10px 0 0' }}>{getRenderDate(guar.nationalIdIssueDate)}</p>
                    </div>
                    <div className="d-flex flex-row">
                        <p>{local.customerHomeAddress}</p>
                        <p style={{ width: '60%', margin: '0 10px 0 0', wordBreak: 'break-all' }}>{guar.homeAddress}</p>
                    </div>

                </div>
                )
                : <p>No Guarantors</p> }
            </div>
        )
    }
    render() {
        return (
            <Container>
                {Object.keys(this.state.application).length > 0 &&
                    <div>
                        <div>
                            <p>{englishToArabic(this.state.application.status)}</p>
                        </div>
                        <InfoBox values={this.state.application.customer} />
                        <div>
                            <Tab.Container id="tabs-example" defaultActiveKey="first">
                                <Nav variant="pills" className="flex-row" style={{margin:'20px 0'}}>
                                    <Nav.Item>
                                        <Nav.Link eventKey="first">بيانات طلب القرض</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="second">بيانات الضامن</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="third">سجل</Nav.Link>
                                    </Nav.Item>
                                </Nav>
                                <Row>
                                    <Tab.Content style={{width:'100%', textAlign:'right'}}>
                                        <Tab.Pane eventKey="first">
                                            {this.renderApplicationData()}
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="second">
                                           {this.renderGuarantorData()}
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="third">
                                            <p>Logs</p>
                                            <p>Logs</p>
                                            <p>Logs</p>
                                            <p>Logs</p>
                                            <p>Logs</p>
                                            <p>Logs</p>
                                        </Tab.Pane>
                                    </Tab.Content>
                                </Row>
                            </Tab.Container>
                        </div>
                    </div>
                }
            </Container>
        )
    }
}
export default LoanProfile