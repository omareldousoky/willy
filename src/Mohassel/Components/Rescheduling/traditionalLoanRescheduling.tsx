import React, { Component } from 'react';
import { LoanDetailsBoxView } from '../LoanProfile/applicationsDetails';
import DynamicTable from '../DynamicTable/dynamicTable';
import * as local from '../../../Shared/Assets/ar.json';
import { getRenderDate } from '../../Services/getRenderDate';
import { testTraditionalRescheduling, traditionalRescheduling } from '../../Services/APIs/loanApplication/traditionalRescheduling';
import { Formik } from 'formik';
import Form from 'react-bootstrap/Form';
import { traditionalReschedulingValidation } from './reschedulingValidations';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Swal from 'sweetalert2';
import { Loader } from '../../../Shared/Components/Loader';
import { getStatus } from '../../Services/utils';

interface Props {
    application: any;
    test: boolean;
}
interface State {
    installmentsAfterRescheduling: any;
    loading: boolean;
    noOfInstallments: number;
}
class TraditionalLoanRescheduling extends Component<Props, State>{
    mappers: { title: string; key: string; render: (data: any) => any }[]
    constructor(props: Props) {
        super(props);
        this.state = {
            installmentsAfterRescheduling: [],
            loading: false,
            noOfInstallments: 0
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
                render: data => getStatus(data)
            },
        ];
    }
    componentDidUpdate(prevProps: Props, _prevState: State) {
        if (prevProps.test !== this.props.test) {
            this.setState({ installmentsAfterRescheduling: [], noOfInstallments: 0});
        }
    }
    async handleSubmit(values) {
        this.setState({ loading: true })
        const obj = {
            noOfInstallments: values.noOfInstallments
        }
        const res = await testTraditionalRescheduling(this.props.application._id, obj);
        if (res.status === "success") {
            this.setState({ loading: false })
            this.setState({
                noOfInstallments: values.noOfInstallments,
                installmentsAfterRescheduling: res.body.installments
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
            noOfInstallments: this.state.noOfInstallments
        }
        const res = await traditionalRescheduling(this.props.application._id, obj);
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
                        noOfInstallments: this.state.noOfInstallments
                    }}
                    onSubmit={this.handleSubmit.bind(this)}
                    validationSchema={traditionalReschedulingValidation}
                    validateOnBlur
                    validateOnChange
                    enableReinitialize
                >
                    {(formikProps) =>
                        <Form onSubmit={formikProps.handleSubmit}>
                            <Col>
                                <Form.Group controlId="noOfInstallments">
                                    <Form.Label column sm={6}>{local.noOfInstallments}</Form.Label>
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
                            </Col>
                            <div className="d-flex justify-content-end">
                                <Button type="submit" variant="primary" data-qc="submit">{local.submit}</Button>
                            </div>
                        </Form>
                    }
                </Formik>
                <div style={{ margin: '10px 0' }}>
                    <Row>
                        <h5>{local.installmentsTableBeforeRescheduling}</h5>
                    </Row>
                    <DynamicTable totalCount={0} pagination={false} data={this.props.application.installmentsObject.installments} mappers={this.mappers} />
                </div>
                {this.state.installmentsAfterRescheduling.length > 0 &&
                    <div style={{ margin: '10px 0' }}>
                        <Row>
                            <h5>{local.installmentsTableAfterRescheduling}</h5>
                        </Row>
                        <DynamicTable totalCount={0} pagination={false} data={this.state.installmentsAfterRescheduling} mappers={this.mappers} />
                    </div>
                }
                {!this.props.test && <Button disabled={this.state.noOfInstallments === 0} onClick={() => this.applyChanges()}>{local.save}</Button>}
            </div>
        )
    }
}
export default TraditionalLoanRescheduling;