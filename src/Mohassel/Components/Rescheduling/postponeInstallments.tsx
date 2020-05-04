import React, { Component } from 'react';
import { LoanDetailsBoxView } from '../LoanProfile/applicationsDetails';
import DynamicTable from '../DynamicTable/dynamicTable';
import * as local from '../../../Shared/Assets/ar.json';
import { getRenderDate } from '../../Services/getRenderDate';
import { testFreeRescheduling, freeRescheduling } from '../../Services/APIs/loanApplication/freeRescheduling';
import { Formik } from 'formik';
import Form from 'react-bootstrap/Form';
import { reschedulingValidation } from './reschedulingValidations';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Swal from 'sweetalert2';
import { Loader } from '../../../Shared/Components/Loader';

interface Props {
    application: any;
    test: boolean;
}
interface State {
    installmentsAfterRescheduling: any;
    loading: boolean;
    noOfInstallments: number;
    withInterest: boolean;
    postponementInterest: number;
    payWhere: string;
    installmentNumber: number;
}
class PostponeInstallments extends Component<Props, State>{
    mappers: { title: string; key: string; render: (data: any) => any }[]
    constructor(props: Props) {
        super(props);
        this.state = {
            installmentsAfterRescheduling: [],
            loading: false,
            noOfInstallments: 0,
            withInterest: false,
            postponementInterest: 0,
            payWhere: '',
            installmentNumber: 0
        };


        this.mappers = [
            {
                title: local.installmentNumber,
                key: "id",
                render: data => data.id
            },
            {
                title: local.principalInstallment,
                key: "principalInstallment",
                render: data => data.principalInstallment
            },
            {
                title: local.feesInstallment,
                key: "feesInstallment",
                render: data => data.feesInstallment
            },
            {
                title: local.installmentResponse,
                key: "installmentResponse",
                render: data => data.installmentResponse
            },
            {
                title: local.dateOfPayment,
                key: "dateOfPayment",
                render: data => getRenderDate(data.dateOfPayment)
            },
            {
                title: local.loanStatus,
                key: "loanStatus",
                render: data => data.status
            },
        ];
    }
    componentDidUpdate(prevProps: Props, _prevState: State) {
        if (prevProps.test !== this.props.test) {
            this.setState({ installmentsAfterRescheduling: [], noOfInstallments: 0, withInterest: false });
        }
    }
    async handleSubmit(values) {
        console.log(values)
        this.setState({ loading: true })
        const res = await testFreeRescheduling(this.props.application._id, values);
        if (res.status === "success") {
            this.setState({ loading: false })
            this.setState({
                noOfInstallments: values.noOfInstallments,
                withInterest: values.withInterest,
                postponementInterest: values.postponementInterest,
                payWhere: values.payWhere,
                installmentNumber: values.installmentNumber,
                installmentsAfterRescheduling: res.body.output
            })
            Swal.fire('', 'Test Success', 'success');
        } else {
            this.setState({ loading: false })
            Swal.fire('', 'Test Fail', 'error');
        }
    }
    applyChanges() {
        Swal.fire({
            title: local.areYouSure,
            text: `${local.willBePostponed}  ${(this.state.noOfInstallments > 1) ? this.state.noOfInstallments + local.installments : local.installment}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: local.postponeInstallments
        }).then((result) => {
            if (result.value) {
                this.pushInstallments()
            }
        })
    }
    async pushInstallments() {
        this.setState({ loading: true })
        const obj = {
            noOfInstallments: this.state.noOfInstallments,
            withInterest: this.state.withInterest,
            postponementInterest: this.state.postponementInterest,
            payWhere: this.state.payWhere,
            installmentNumber: this.state.installmentNumber
        }
        const res = await freeRescheduling(this.props.application._id, obj);
        if (res.status === "success") {
            this.setState({ loading: false })
            Swal.fire('', 'Installment has been pushed.', 'success').then(() => window.location.reload());
        } else {
            this.setState({ loading: false })
            Swal.fire('', 'Installment push Fail', 'error');
        }
    }
    render() {
        return (
            <div className="d-flex flex-column" style={{ textAlign: 'right' }} >
                <Loader type="fullscreen" open={this.state.loading} />
                <LoanDetailsBoxView application={this.props.application} />

                <Formik
                    initialValues={{
                        noOfInstallments: this.state.noOfInstallments,
                        withInterest: this.state.withInterest,
                        postponementInterest: this.state.postponementInterest,
                        payWhere: this.state.payWhere,
                        installmentNumber: this.state.installmentNumber
                    }}
                    onSubmit={this.handleSubmit.bind(this)}
                    validationSchema={reschedulingValidation}
                    validateOnBlur
                    validateOnChange
                    enableReinitialize
                >
                    {(formikProps) =>
                        <Form onSubmit={formikProps.handleSubmit}>
                            <Col>
                                <Form.Group as={Row} md="5" controlId="noOfInstallments">
                                    <Form.Label column sm={4}>{local.noOfInstallments}</Form.Label>
                                    <Col sm={6}>
                                        <Form.Control
                                            type="number"
                                            name="noOfInstallments"
                                            data-qc="noOfInstallments"
                                            value={(formikProps.values.noOfInstallments).toString()}
                                            onBlur={formikProps.handleBlur}
                                            onChange={formikProps.handleChange}
                                            isInvalid={Boolean(formikProps.errors.noOfInstallments) && Boolean(formikProps.touched.noOfInstallments)}
                                        >
                                        </Form.Control>
                                        <Form.Control.Feedback type="invalid">
                                            {formikProps.errors.noOfInstallments}
                                        </Form.Control.Feedback>
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} controlId="withInterest">
                                    <Form.Label style={{ textAlign: 'right' }} column md={4}>with Interest</Form.Label>
                                    <Col sm={1}>
                                        <Form.Check
                                            type="checkbox"
                                            name="withInterest"
                                            data-qc="withInterest"
                                            value={(formikProps.values.withInterest).toString()}
                                            checked={formikProps.values.withInterest}
                                            onBlur={formikProps.handleBlur}
                                            onChange={formikProps.handleChange}
                                            isInvalid={Boolean(formikProps.errors.withInterest) && Boolean(formikProps.touched.withInterest)}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {formikProps.errors.withInterest}
                                        </Form.Control.Feedback>
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} md="5" controlId="postponementInterest">
                                    <Form.Label column sm={4}>postponementInterest</Form.Label>
                                    <Col sm={6}>
                                        <Form.Control
                                            type="number"
                                            name="postponementInterest"
                                            data-qc="postponementInterest"
                                            value={(formikProps.values.postponementInterest).toString()}
                                            onBlur={formikProps.handleBlur}
                                            onChange={formikProps.handleChange}
                                            isInvalid={Boolean(formikProps.errors.postponementInterest) && Boolean(formikProps.touched.postponementInterest)}
                                            disabled={!formikProps.values.withInterest}
                                        >
                                        </Form.Control>
                                        <Form.Control.Feedback type="invalid">
                                            {formikProps.errors.postponementInterest}
                                        </Form.Control.Feedback>
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} controlId="payWhere">
                                    <Form.Label style={{ textAlign: 'right' }} column sm={4}>payWhere</Form.Label>
                                    <Col sm={6}>
                                        <Form.Control as="select"
                                            name="payWhere"
                                            data-qc="payWhere"
                                            value={formikProps.values.payWhere}
                                            onBlur={formikProps.handleBlur}
                                            onChange={formikProps.handleChange}
                                            isInvalid={Boolean(formikProps.errors.payWhere) && Boolean(formikProps.touched.payWhere)}
                                            disabled={!formikProps.values.withInterest}
                                        >
                                            <option value=''></option>
                                            <option value='now'>Now</option>
                                            <option value='divide'>Divide</option>
                                            <option value='installment'>Installment</option>
                                        </Form.Control>
                                        <Form.Control.Feedback type="invalid">
                                            {formikProps.errors.payWhere}
                                        </Form.Control.Feedback>
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} controlId="installmentNumber">
                                    <Form.Label style={{ textAlign: 'right' }} column sm={4}>installmentNumber</Form.Label>
                                    <Col sm={6}>
                                        <Form.Control as="select"
                                            name="installmentNumber"
                                            data-qc="installmentNumber"
                                            value={(formikProps.values.installmentNumber).toString()}
                                            onBlur={formikProps.handleBlur}
                                            onChange={formikProps.handleChange}
                                            isInvalid={Boolean(formikProps.errors.installmentNumber) && Boolean(formikProps.touched.installmentNumber)}
                                            disabled={!(formikProps.values.payWhere === "installment")}
                                        >
                                            <option value=''></option>
                                            {this.props.application.installmentsObject.installments.filter(inst => (inst.status === 'unpaid') || (inst.status === 'partiallyPaid')).map(inst =>
                                                <option key={inst.id} value={inst.id}> Installment number {inst.id}</option>)}

                                        </Form.Control>
                                        <Form.Control.Feedback type="invalid">
                                            {formikProps.errors.installmentNumber}
                                        </Form.Control.Feedback>
                                    </Col>
                                </Form.Group>
                            </Col>
                            <div className="d-flex align-items-center">
                                <Button type="submit" variant="primary" data-qc="submit">{local.submit}</Button>
                            </div>
                        </Form>
                    }
                </Formik>
                <div style={{ margin: '10px 0' }}>
                    <Row>
                        <h5>{local.installmentsTableBeforeRescheduling}</h5>
                    </Row>
                    <DynamicTable pagination={false} data={this.props.application.installmentsObject.installments} mappers={this.mappers} />
                </div>
                {this.state.installmentsAfterRescheduling.length > 0 &&
                    <div style={{ margin: '10px 0' }}>
                        <Row>
                            <h5>{local.installmentsTableAfterRescheduling}</h5>
                        </Row>
                        <DynamicTable pagination={false} data={this.state.installmentsAfterRescheduling} mappers={this.mappers} />
                    </div>
                }
                {!this.props.test && <Button disabled={this.state.noOfInstallments === 0} onClick={() => this.applyChanges()}>{local.save}</Button>}
            </div>
        )
    }
}
export default PostponeInstallments;