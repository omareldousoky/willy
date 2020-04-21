import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import * as local from '../../../Shared/Assets/ar.json';
import { Application } from '../LoanApplication/loanApplicationStates';
import Swal from 'sweetalert2';
interface Props {
    status: string;
    application: Application;
    id: string;
    handleStatusChange: Function;
};

interface State {
    loading: boolean;
    reviewStatus: string;
    unreviewStatus: string;
    rejectionStatus: string;
    rejectionReason: string;
    reviewDate: any;
    unreviewDate: any;
    rejectionDate: any;
}
const today = new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().split("T")[0]
class StatusHelper extends Component<Props, State>{
    constructor(props: Props) {
        super(props);
        this.state = {
            loading: false,
            reviewStatus: 'reviewRequired',
            unreviewStatus: 'reviewDone',
            rejectionStatus: '',
            rejectionReason: '',
            reviewDate: today,
            unreviewDate: today,
            rejectionDate: today
        }
    }
    handleStatusChange() {
        if(this.props.status === 'reject' && this.state.rejectionReason.length === 0){
            Swal.fire('','Rejection reason mandatory','warning')
        }else{
            this.props.handleStatusChange(this.state, this.props)
        }
    }
    getDateString(date){
        return new Date(new Date(date).getTime() - (new Date(date).getTimezoneOffset() * 60000)).toISOString().split("T")[0]
    }
    render() {
        const selectValues = [{
            value: "reviewRequired",
            label: local.notReview
        }, {
            value: "reviewDone",
            label: local.loanReviewed
        }];
        const decisionValues = [{
            value: 'rejected',
            label: local.rejected
        }]
        const rejectionReasonValues = [{
            value: 'noShow',
            label: local.noShow
        }, {
            value: 'wrongData',
            label: local.wrongData
        }, {
            value: 'changeRequirements',
            label: local.changeRequirements
        }, {
            value: 'badReputation',
            label: local.badReputation
        }, {
            value: 'existingFellony',
            label: local.existingFellony
        }, {
            value: 'existingLoan',
            label: local.existingLoan
        }, {
            value: 'existingDebts',
            label: local.existingDebts
        }, {
            value: 'guarantorRefused',
            label: local.guarantorRefused
        }]
        if (this.props.status === 'review') {
            return (
                <Col>
                    <Row>
                        <h1>
                            {local.reviewStatus}
                        </h1>
                    </Row>
                    <Row>
                        <Col sm={4}>
                            <Form.Group as={Row} controlId="productID">
                                <Form.Label style={{ textAlign: 'right' }} column sm={4}>{local.reviewStatus}</Form.Label>
                                <Col sm={6}>
                                    <Form.Control as="select"
                                        name="reviewStatus"
                                        data-qc="reviewStatus"
                                        value={this.state.reviewStatus}
                                        onChange={(event: any) => { this.setState({ reviewStatus: event.currentTarget.value }) }}
                                    >
                                        <option value="" disabled></option>
                                        {selectValues.map((option, i) =>
                                            <option key={i} value={option.value}>{option.label}</option>
                                        )}
                                    </Form.Control>
                                </Col>
                            </Form.Group>
                        </Col>
                        {this.state.reviewStatus === "reviewDone" && <Col sm={8}>
                            <Form.Group as={Row} controlId="productID">
                                <Form.Label style={{ textAlign: 'right' }} column sm={4}>{local.reviewDate}</Form.Label>
                                <Col sm={5}>
                                    <Form.Control
                                        type="date"
                                        name="entryDate"
                                        data-qc="entryDate"
                                        value={this.state.reviewDate}
                                        onChange={(e) => { this.setState({ reviewDate: e.currentTarget.value }) }}
                                    />
                                </Col>
                                <Button onClick={() => this.handleStatusChange()}>{local.reviewLoan}</Button>
                            </Form.Group>
                        </Col>}
                    </Row>
                </Col>
            )
        } else if (this.props.status === 'unreview') {
            return (
                <Col>
                    <Row>
                        <h1>
                            {local.undoLoanReview}
                        </h1>
                    </Row>
                    <Row>
                        <Col sm={4}>
                            <Form.Group as={Row} controlId="productID">
                                <Form.Label style={{ textAlign: 'right' }} column sm={4}>{local.reviewStatus}</Form.Label>
                                <Col sm={6}>
                                    <Form.Control as="select"
                                        name="reviewStatus"
                                        data-qc="reviewStatus"
                                        value={this.state.unreviewStatus}
                                        onChange={(event: any) => { this.setState({ unreviewStatus: event.currentTarget.value }) }}
                                    >
                                        <option value="" disabled></option>
                                        {selectValues.map((option, i) =>
                                            <option key={i} value={option.value}>{option.label}</option>
                                        )}
                                    </Form.Control>
                                </Col>
                            </Form.Group>
                        </Col>
                        {this.state.unreviewStatus === "reviewRequired" && <Col sm={8}>
                            <Form.Group as={Row} controlId="productID">
                                <Form.Label style={{ textAlign: 'right' }} column sm={4}>{local.reviewDate}</Form.Label>
                                <Col sm={5}>
                                    <Form.Control
                                        type="date"
                                        name="reviewedDate"
                                        data-qc="reviewedDate"
                                        value={this.getDateString(this.props.application.reviewedDate)}
                                        disabled
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId="productID">
                                <Form.Label style={{ textAlign: 'right' }} column sm={4}>{local.unreviewDate}</Form.Label>
                                <Col sm={5}>
                                    <Form.Control
                                        type="date"
                                        name="entryDate"
                                        data-qc="entryDate"
                                        value={this.state.unreviewDate}
                                        onChange={(e) => { this.setState({ unreviewDate: e.currentTarget.value }) }}
                                        min={this.getDateString(this.props.application.reviewedDate)}
                                    />
                                </Col>
                                <Button onClick={() => this.handleStatusChange()}>{local.undoLoanReview}</Button>
                            </Form.Group>
                        </Col>}
                    </Row>
                </Col>
            )
        } else if (this.props.status === 'reject') {
            return (
                <Col>
                    <Row>
                        <h1>
                            {local.committeeDecision}
                        </h1>
                    </Row>
                    <Row>
                        <Col sm={4}>
                            <Form.Group as={Row} controlId="productID">
                                <Form.Label style={{ textAlign: 'right' }} column sm={4}>{local.theDecision}</Form.Label>
                                <Col sm={6}>
                                    <Form.Control as="select"
                                        name="rejectionStatus"
                                        data-qc="rejectionStatus"
                                        value={this.state.rejectionStatus}
                                        onChange={(event: any) => { this.setState({ rejectionStatus: event.currentTarget.value }) }}
                                    >
                                        <option value="" disabled></option>
                                        {decisionValues.map((option, i) =>
                                            <option key={i} value={option.value}>{option.label}</option>
                                        )}
                                    </Form.Control>
                                </Col>
                            </Form.Group>
                        </Col>
                        {this.state.rejectionStatus === "rejected" && <Col sm={8}>
                        <Form.Group as={Row} controlId="productID">
                                <Form.Label style={{ textAlign: 'right' }} column sm={4}>{local.reviewDate}</Form.Label>
                                <Col sm={5}>
                                    <Form.Control
                                        type="date"
                                        name="reviewedDate"
                                        data-qc="reviewedDate"
                                        value={this.getDateString(this.props.application.reviewedDate)}
                                        disabled
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId="productID">
                                <Form.Label style={{ textAlign: 'right' }} column sm={4}>{local.decisionDate}</Form.Label>
                                <Col sm={5}>
                                    <Form.Control
                                        type="date"
                                        name="entryDate"
                                        data-qc="entryDate"
                                        value={this.state.rejectionDate}
                                        onChange={(e) => { this.setState({ rejectionDate: e.currentTarget.value }) }}
                                        min={this.getDateString(this.props.application.reviewedDate)}
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId="productID">
                                <Form.Label style={{ textAlign: 'right' }} column sm={4}>{local.rejectionReason}</Form.Label>
                                <Col sm={6}>
                                    <Form.Control as="select"
                                        name="rejectionReason"
                                        data-qc="rejectionReason"
                                        value={this.state.rejectionReason}
                                        onChange={(event: any) => { this.setState({ rejectionReason: event.currentTarget.value }) }}
                                    >
                                        <option value="" disabled></option>
                                        {rejectionReasonValues.map((option, i) =>
                                            <option key={i} value={option.value}>{option.label}</option>
                                        )}
                                    </Form.Control>
                                </Col>
                            </Form.Group>
                            <Button onClick={() => this.handleStatusChange()}>{local.undoLoanReview}</Button>
                        </Col>}
                    </Row>
                </Col>
            )
        } else {
            return null;
        }
    }
}
export default StatusHelper