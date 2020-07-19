import React, { Component } from 'react';
import { LoanDetailsBoxView } from '../LoanProfile/applicationsDetails';
import DynamicTable from '../DynamicTable/dynamicTable';
import * as local from '../../../Shared/Assets/ar.json';
import { getRenderDate } from '../../Services/getRenderDate';
import { testTraditionalRescheduling, traditionalRescheduling } from '../../Services/APIs/loanApplication/traditionalRescheduling';
import { Formik } from 'formik';
import Form from 'react-bootstrap/Form';
import { freeReschedulingValidation } from './reschedulingValidations';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Swal from 'sweetalert2';
import { Loader } from '../../../Shared/Components/Loader';
import Table from 'react-bootstrap/Table';

interface Props {
    application: any;
    test: boolean;
}
interface State {
    loading: boolean;
    application: any;
}
class FreeRescheduling extends Component<Props, State>{
    mappers: { title: string; key: string; render: (data: any) => any }[]
    constructor(props: Props) {
        super(props);
        this.state = {
            loading: false,
            application: {}
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
            // {
            //     title: local.principalPaid,
            //     key: "principalPaid",
            //     render: data => data.principalPaid
            // },
            // {
            //     title: local.feesPaid,
            //     key: "feesPaid",
            //     render: data => data.feesPaid
            // },
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
            {
                title: '',
                key: "action",
                render: data => ''
            },
        ];
    }
    getDerivedStateFromProps(props: Props, state: State) {
        if (props.application._id !== state.application._id) {
            return {
                application: props.application
            }
        }
    }
    async handleSubmit(values) {
        values.installments.forEach(inst => {
            if (inst.new) {
                delete inst.new
            }
        })
        // this.setState({ loading: true })
        // const obj = {
        //     noOfInstallments: values.noOfInstallments
        // }
        // const res = await testTraditionalRescheduling(this.props.application._id, obj);
        // if (res.status === "success") {
        //     this.setState({ loading: false })
        //     this.setState({
        //         noOfInstallments: values.noOfInstallments,
        //         installmentsAfterRescheduling: res.body.installments
        //     })
        //     Swal.fire('', 'Test Success', 'success');
        // } else {
        //     this.setState({ loading: false })
        //     Swal.fire('', 'Test Fail', 'error');
        // }
    }
    addRow(values) {
        const installments = [...values.installments];
        installments.push({
            id: values.installments.length + 1,
            dateOfPayment: new Date().valueOf(),
            feesInstallment: 0,
            feesPaid: 0,
            installmentResponse: 0,
            paidAt: 0,
            pendingFees: 0,
            pendingPrincipal: 0,
            principalInstallment: 0,
            principalPaid: 0,
            status: 'unpaid',
            totalPaid: 0,
            new: true
        })
        return installments
    }
    removeNew(values, i) {
        const installments = [...values.installments];
        installments.splice(i, 1);
        return installments
    }
    editable(installment) {
        if (installment.status === "pending" || installment.status === "paid" || installment.status === "rescheduled") {
            return false
        } else {
            return true
        }
    }
    getTotals(values) {
        let feesSum = 0;
        let principleSum = 0;
        values.installments.forEach(inst => {
            if (inst.status !== 'rescheduled') {
                feesSum += inst.feesInstallment;
                principleSum += inst.principalInstallment;
            }
        })
        if (feesSum === this.props.application.installmentsObject.totalInstallments.feesSum && principleSum === this.props.application.installmentsObject.totalInstallments.principal) {
            return <div className="d-flex justify-content-end">
                <Button onClick={() => this.handleSubmit(values)} variant="primary" data-qc="submit">{local.submit}</Button>
            </div>
        } else {
            return <div><h1>Fail fees here {feesSum} not equal the total of {this.props.application.installmentsObject.totalInstallments.feesSum} OR principal here {principleSum} not equal the total of {this.props.application.installmentsObject.totalInstallments.principal}</h1></div>
        }
    }
    rescheduleInstallment(values, index) {
        const installments = [...values.installments];
        installments[index].status = 'rescheduled';
        return installments
    }
    applyChanges() {
        // Swal.fire({
        //     title: local.areYouSure,
        //     text: `${local.willBePostponed}  ${(this.state.noOfInstallments > 1) ? this.state.noOfInstallments + local.installments : local.installment}`,
        //     icon: 'warning',
        //     showCancelButton: true,
        //     confirmButtonColor: '#3085d6',
        //     cancelButtonColor: '#d33',
        //     confirmButtonText: local.postponeInstallments
        // }).then((result) => {
        //     if (result.value) {
        //         this.pushInstallments()
        //     }
        // })
    }
    getDateString(date) {
        return (
            new Date(new Date(date).getTime() - (new Date(date).getTimezoneOffset() * 60000)).toISOString().split("T")[0]
        )
    }
    async pushInstallments() {
        // this.setState({ loading: true })
        // const obj = {
        //     noOfInstallments: this.state.noOfInstallments
        // }
        // const res = await traditionalRescheduling(this.props.application._id, obj);
        // if (res.status === "success") {
        //     this.setState({ loading: false })
        //     Swal.fire('', 'Installment has been pushed.', 'success').then(() => window.location.reload());
        // } else {
        //     this.setState({ loading: false })
        //     Swal.fire('', 'Installment push Fail', 'error');
        // }
    }
    render() {
        return (
            <div className="d-flex flex-column" style={{ textAlign: 'right' }} >
                <Loader type="fullscreen" open={this.state.loading} />
                {/* <Col> */}
                    <LoanDetailsBoxView application={this.props.application} />
                {/* </Col> */}

                <Formik
                    initialValues={{
                        // JSON.parse(JSON.stringify here is CLONE Deep
                        installments: JSON.parse(JSON.stringify(this.props.application.installmentsObject.installments))
                    }}
                    onSubmit={this.handleSubmit.bind(this)}
                    validationSchema={freeReschedulingValidation}
                    validateOnBlur
                    validateOnChange
                >
                    {(formikProps) =>
                        <Form onSubmit={formikProps.handleSubmit}>
                            <Col>
                                <Table striped hover style={{ textAlign: 'right' }}>
                                    <thead>
                                        <tr>
                                            {this.mappers?.map((mapper, index: number) => {
                                                return <th key={index}>{mapper.title}</th>
                                            })}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {formikProps.values.installments.map((item, index: number) => {
                                            return (
                                                <tr key={index}>
                                                    <td>
                                                        {item.id}
                                                    </td>
                                                    <td>
                                                        {!this.editable(item) ? formikProps.values.installments[index].principalInstallment :
                                                            <Form.Control
                                                                type="number"
                                                                name={`installments[${index}].principalInstallment`}
                                                                data-qc="principalInstallment"
                                                                value={formikProps.values.installments[index].principalInstallment}
                                                                onBlur={formikProps.handleBlur}
                                                                onChange={formikProps.handleChange}
                                                            />}
                                                        {formikProps.errors.installments && formikProps.errors.installments[index] && formikProps.errors.installments[index].principalInstallment && <Form.Control.Feedback type="invalid" style={{ display: 'block' }}>
                                                            {formikProps.errors.installments[index].principalInstallment ? local.amountShouldNotbeLessThanPaidAmount + ' ' + formikProps.values.installments[index].principalPaid : ''}
                                                        </Form.Control.Feedback>}
                                                    </td>
                                                    <td>
                                                        {!this.editable(item) ? formikProps.values.installments[index].feesInstallment : <Form.Control
                                                            type="number"
                                                            name={`installments[${index}].feesInstallment`}
                                                            data-qc="feesInstallment"
                                                            value={formikProps.values.installments[index].feesInstallment}
                                                            onBlur={formikProps.handleBlur}
                                                            onChange={formikProps.handleChange}
                                                        />}
                                                        {formikProps.errors.installments && formikProps.errors.installments[index] && formikProps.errors.installments[index].feesInstallment && <Form.Control.Feedback type="invalid" style={{ display: 'block' }}>
                                                            {formikProps.errors.installments[index].feesInstallment ? local.amountShouldNotbeLessThanPaidAmount + ' ' + formikProps.values.installments[index].feesPaid : ''}
                                                        </Form.Control.Feedback>}
                                                    </td>
                                                    <td>
                                                        {formikProps.values.installments[index].feesInstallment + formikProps.values.installments[index].principalInstallment}
                                                    </td>
                                                    {/* <td>
                                                        {formikProps.values.installments[index].principalPaid}
                                                    </td>
                                                    <td>
                                                        {formikProps.values.installments[index].feesPaid}
                                                    </td> */}
                                                    <td>
                                                        {(!this.editable(item) || item.status === 'partiallyPaid') ? getRenderDate(formikProps.values.installments[index].dateOfPayment) : <Form.Control
                                                            type="date"
                                                            name={`installments[${index}].dateOfPayment`}
                                                            data-qc="dateOfPayment"
                                                            value={this.getDateString(formikProps.values.installments[index].dateOfPayment)}
                                                            onBlur={formikProps.handleBlur}
                                                            onChange={formikProps.handleChange}
                                                            min={index > 0 ? this.getDateString(formikProps.values.installments[index - 1].dateOfPayment) : undefined}
                                                            max={index < formikProps.values.installments.length - 1 ? this.getDateString(formikProps.values.installments[index + 1].dateOfPayment) : undefined}
                                                        // isInvalid={errors.entryDate && touched.entryDate}
                                                        />}
                                                    </td>
                                                    <td>
                                                        {formikProps.values.installments[index].status}
                                                    </td>
                                                    <td>
                                                        {formikProps.values.installments[index].new && <span onClick={() => formikProps.setFieldValue('installments', this.removeNew(formikProps.values, index))}>x</span>}
                                                        {!formikProps.values.installments[index].new && this.editable(item) && <span onClick={() => formikProps.setFieldValue('installments', this.rescheduleInstallment(formikProps.values, index))}>resched</span>}
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                    <Button onClick={() => formikProps.setFieldValue('installments', this.addRow(formikProps.values))}>+</Button>
                                </Table>
                                {this.getTotals(formikProps.values)}
                            </Col>
                        </Form>
                    }
                </Formik>
                {/* {!this.props.test && <Button disabled={this.state.noOfInstallments === 0} onClick={() => this.applyChanges()}>{local.save}</Button>} */}
            </div>
        )
    }
}
export default FreeRescheduling;