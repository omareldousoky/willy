import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import * as local from '../../../Shared/Assets/ar.json';
import { Application, ReviewLoanValidation, UnReviewLoanValidation, RejectLoanValidation } from '../LoanApplication/loanApplicationStates';
import Swal from 'sweetalert2';
import { Formik } from 'formik';
interface Props {
    status: string;
    application: Application;
    id: string;
    handleStatusChange: Function;
};

interface State {
    selectValues: Array<any>;
    decisionValues: Array<any>;
    rejectionReasonValues: Array<any>;
    loading: boolean;
    reviewState: {
        reviewStatus: string;
        reviewDate: any;

    };
    unreviewState: {
        unreviewStatus: string;
        unreviewDate: any;
    };
    rejectState: {
        rejectionStatus: string;
        rejectionReason: string;
        rejectionDate: any;
    };
}
const today = new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().split("T")[0]
class StatusHelper extends Component<Props, State>{
    constructor(props: Props) {
        super(props);
        this.state = {
            selectValues: [{
                value: "reviewRequired",
                label: local.notReview
            }, {
                value: "reviewDone",
                label: local.loanReviewed
            }],
            decisionValues: [{
                value: 'rejected',
                label: local.rejected
            }],
            rejectionReasonValues: [{
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
            }],
            loading: false,
            reviewState: {
                reviewStatus: 'reviewRequired',
                reviewDate: today,
            },
            unreviewState: {
                unreviewStatus: 'reviewDone',
                unreviewDate: today,
            },
            rejectState: {
                rejectionStatus: '',
                rejectionReason: '',
                rejectionDate: today
            }
        }
    }
    handleStatusChange = (values: object) => {
            this.props.handleStatusChange(values, this.props.status)
    }
    getDateString(date) {
        return new Date(new Date(date).getTime() - (new Date(date).getTimezoneOffset() * 60000)).toISOString().split("T")[0]
    }
    renderReviewForm() {
        return (
            <Formik
                enableReinitialize
                initialValues={this.state.reviewState}
                onSubmit={this.handleStatusChange}
                validationSchema={ReviewLoanValidation}
                validateOnBlur
                validateOnChange
            >
                {(formikProps) =>
                    <Form onSubmit={formikProps.handleSubmit}>
                        <Col>
                            <Row>
                                <h1>
                                    {local.reviewStatus}
                                </h1>
                            </Row>
                            <Row>
                                <Col sm={4}>
                                    <Form.Group as={Row} controlId="reviewStatus">
                                        <Form.Label style={{ textAlign: 'right' }} column sm={4}>{local.reviewStatus}</Form.Label>
                                        <Col sm={6}>
                                            <Form.Control as="select"
                                                name="reviewStatus"
                                                data-qc="reviewStatus"
                                                value={formikProps.values.reviewStatus}
                                                onChange={formikProps.handleChange}
                                                onBlur={formikProps.handleBlur}
                                                isInvalid={Boolean(formikProps.errors.reviewStatus) && Boolean(formikProps.touched.reviewStatus)}
                                            >
                                                <option value="" disabled></option>
                                                {this.state.selectValues.map((option, i) =>
                                                    <option key={i} value={option.value}>{option.label}</option>
                                                )}
                                            </Form.Control>
                                            <Form.Control.Feedback type="invalid">
                                                {formikProps.errors.reviewStatus}
                                            </Form.Control.Feedback>
                                        </Col>
                                    </Form.Group>
                                </Col>
                                {formikProps.values.reviewStatus === "reviewDone" && <Col sm={8}>
                                    <Form.Group as={Row} controlId="productID">
                                        <Form.Label style={{ textAlign: 'right' }} column sm={3}>{local.reviewDate}</Form.Label>
                                        <Col sm={5}>
                                            <Form.Control
                                                type="date"
                                                name="reviewDate"
                                                data-qc="reviewDate"
                                                value={formikProps.values.reviewDate}
                                                min={this.props.application.entryDate}
                                                onChange={formikProps.handleChange}
                                                onBlur={formikProps.handleBlur}
                                                isInvalid={Boolean(formikProps.errors.reviewDate) && Boolean(formikProps.touched.reviewDate)}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {formikProps.errors.reviewDate}
                                            </Form.Control.Feedback>
                                        </Col>
                                        <Col sm={3}>
                                            <Button type='submit'>{local.reviewLoan}</Button>
                                        </Col>
                                    </Form.Group>
                                </Col>}
                            </Row>
                        </Col>
                    </Form>
                }
            </Formik>
        )
    }
    renderUnreviewForm() {
        return (
            <Formik
                enableReinitialize
                initialValues={this.state.unreviewState}
                onSubmit={this.handleStatusChange}
                validationSchema={UnReviewLoanValidation}
                validateOnBlur
                validateOnChange
            >
                {(formikProps) =>
                    <Form onSubmit={formikProps.handleSubmit}>
                        <Col>
                            <Row>
                                <h1>
                                    {local.undoLoanReview}
                                </h1>
                            </Row>
                            <Row>
                                <Col sm={4}>
                                    <Form.Group as={Row} controlId="unreviewStatus">
                                        <Form.Label style={{ textAlign: 'right' }} column sm={4}>{local.reviewStatus}</Form.Label>
                                        <Col sm={6}>
                                            <Form.Control as="select"
                                                name="unreviewStatus"
                                                data-qc="unreviewStatus"
                                                value={formikProps.values.unreviewStatus}
                                                onChange={formikProps.handleChange}
                                                onBlur={formikProps.handleBlur}
                                                isInvalid={Boolean(formikProps.errors.unreviewStatus) && Boolean(formikProps.touched.unreviewStatus)}
                                            >
                                                <option value="" disabled></option>
                                                {this.state.selectValues.map((option, i) =>
                                                    <option key={i} value={option.value}>{option.label}</option>
                                                )}
                                            </Form.Control>
                                            <Form.Control.Feedback type="invalid">
                                                {formikProps.errors.unreviewStatus}
                                            </Form.Control.Feedback>
                                        </Col>
                                    </Form.Group>
                                </Col>
                                {formikProps.values.unreviewStatus === "reviewRequired" && <Col sm={8}>
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
                                    <Form.Group as={Row} controlId="unreviewDate">
                                        <Form.Label style={{ textAlign: 'right' }} column sm={4}>{local.unreviewDate}</Form.Label>
                                        <Col sm={5}>
                                            <Form.Control
                                                type="date"
                                                name="unreviewDate"
                                                data-qc="unreviewDate"
                                                value={formikProps.values.unreviewDate}
                                                min={this.getDateString(this.props.application.reviewedDate)}
                                                onChange={formikProps.handleChange}
                                                onBlur={formikProps.handleBlur}
                                                isInvalid={Boolean(formikProps.errors.unreviewDate) && Boolean(formikProps.touched.unreviewDate)}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {formikProps.errors.unreviewDate}
                                            </Form.Control.Feedback>
                                        </Col>
                                        <Button type='submit'>{local.undoLoanReview}</Button>
                                    </Form.Group>
                                </Col>}
                            </Row>
                        </Col>
                    </Form>
                }
            </Formik>
        )
    }
    renderRejectForm() {
        return (
            <Formik
                enableReinitialize
                initialValues={this.state.rejectState}
                onSubmit={this.handleStatusChange}
                validationSchema={RejectLoanValidation}
                validateOnBlur
                validateOnChange
            >
                {(formikProps) =>
                    <Form onSubmit={formikProps.handleSubmit}>
                        <Col>
                            <Row>
                                <h1>
                                    {local.committeeDecision}
                                </h1>
                            </Row>
                            <Row>
                                <Col sm={4}>
                                    <Form.Group as={Row} controlId="rejectionStatus">
                                        <Form.Label style={{ textAlign: 'right' }} column sm={4}>{local.theDecision}</Form.Label>
                                        <Col sm={6}>
                                            <Form.Control as="select"
                                                name="rejectionStatus"
                                                data-qc="rejectionStatus"
                                                value={formikProps.values.rejectionStatus}
                                                onChange={formikProps.handleChange}
                                                onBlur={formikProps.handleBlur}
                                                isInvalid={Boolean(formikProps.errors.rejectionStatus) && Boolean(formikProps.touched.rejectionStatus)}
                                            >
                                                <option value="" disabled></option>
                                                {this.state.decisionValues.map((option, i) =>
                                                    <option key={i} value={option.value}>{option.label}</option>
                                                )}
                                            </Form.Control>
                                        </Col>
                                    </Form.Group>
                                </Col>
                                {formikProps.values.rejectionStatus === "rejected" && <Col sm={8}>
                                    <Form.Group as={Row} controlId="reviewedDate">
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
                                                name="rejectionDate"
                                                data-qc="rejectionDate"
                                                value={formikProps.values.rejectionDate}
                                                onChange={formikProps.handleChange}
                                                min={this.getDateString(this.props.application.reviewedDate)}
                                                onBlur={formikProps.handleBlur}
                                                isInvalid={Boolean(formikProps.errors.rejectionDate) && Boolean(formikProps.touched.rejectionDate)}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {formikProps.errors.rejectionDate}
                                            </Form.Control.Feedback>
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} controlId="rejectionReason">
                                        <Form.Label style={{ textAlign: 'right' }} column sm={4}>{local.rejectionReason}</Form.Label>
                                        <Col sm={6}>
                                            <Form.Control as="select"
                                                name="rejectionReason"
                                                data-qc="rejectionReason"
                                                value={formikProps.values.rejectionReason}
                                                onChange={formikProps.handleChange}
                                                onBlur={formikProps.handleBlur}
                                                isInvalid={Boolean(formikProps.errors.rejectionReason) && Boolean(formikProps.touched.rejectionReason)}
                                            >
                                                <option value="" disabled></option>
                                                {this.state.rejectionReasonValues.map((option, i) =>
                                                    <option key={i} value={option.value}>{option.label}</option>
                                                )}
                                            </Form.Control>
                                            <Form.Control.Feedback type="invalid">
                                                {formikProps.errors.rejectionReason}
                                            </Form.Control.Feedback>
                                        </Col>
                                    </Form.Group>
                                    <Button type='submit'>{local.rejectLoan}</Button>
                                </Col>}
                            </Row>
                        </Col>
                    </Form>
                }
            </Formik>
        )
    }
    renderContent() {
        switch (this.props.status) {
            case 'review':
                return this.renderReviewForm();
            case 'unreview':
                return this.renderUnreviewForm();
            case 'reject':
                return this.renderRejectForm();
            default:
                return null
        }
    }
    render() {
        return (
            this.renderContent()
        )
    }
}
export default StatusHelper