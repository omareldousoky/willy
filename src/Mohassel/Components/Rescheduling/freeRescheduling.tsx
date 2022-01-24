import React, { Component } from 'react'
import { Formik } from 'formik'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Swal from 'sweetalert2'
import Table from 'react-bootstrap/Table'
import { LoanDetailsBoxView } from '../LoanProfile/applicationsDetails'
import DynamicTable from '../../../Shared/Components/DynamicTable/dynamicTable'
import * as local from '../../../Shared/Assets/ar.json'
import {
  testFreeRescheduling,
  freeRescheduling,
} from '../../../Shared/Services/APIs/loanApplication/freeRescheduling'
import { freeReschedulingValidation } from './reschedulingValidations'
import { Loader } from '../../../Shared/Components/Loader'
import {
  getStatus,
  getDateString,
  getErrorMessage,
  getRenderDate,
} from '../../../Shared/Services/utils'
import { LtsIcon } from '../../../Shared/Components'

interface Props {
  application: any
  test: boolean
}
interface State {
  loading: boolean
  application: any
  installmentsAfterRescheduling: any
}
class FreeRescheduling extends Component<Props, State> {
  mappers: { title: string; key: string; render: (data: any) => any }[]

  constructor(props: Props) {
    super(props)
    this.state = {
      loading: false,
      application: {},
      installmentsAfterRescheduling: [],
    }

    this.mappers = [
      {
        title: local.installmentNumber,
        key: 'id',
        render: (data) => data.id,
      },
      {
        title: local.principalInstallment,
        key: 'principalInstallment',
        render: (data) => data.principalInstallment,
      },
      {
        title: local.feesInstallment,
        key: 'feesInstallment',
        render: (data) => data.feesInstallment,
      },
      {
        title: local.installmentResponse,
        key: 'installmentResponse',
        render: (data) => data.installmentResponse,
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
        key: 'dateOfPayment',
        render: (data) => getRenderDate(data.dateOfPayment),
      },
      {
        title: local.loanStatus,
        key: 'loanStatus',
        render: (data) => getStatus(data),
      },
      {
        title: '',
        key: 'action',
        render: () => '',
      },
    ]
  }

  // TODO:lint: check return
  static getDerivedStateFromProps(props: Props, state: State) {
    if (props.application._id !== state.application._id) {
      return {
        application: props.application,
      }
    }
    return state
  }

  handleSubmit = async (values) => {
    this.setState({ loading: true })
    values.installments.forEach((inst) => {
      if (inst.new) {
        delete inst.new
      }
    })
    const res = await testFreeRescheduling(this.props.application._id, values)
    if (res.status === 'success') {
      this.setState({ loading: false })
      this.setState({
        installmentsAfterRescheduling: res.body.installments,
      })
      Swal.fire({
        text: local.loanFreeReschedulingTestSuccess,
        icon: 'success',
        confirmButtonText: local.confirmationText,
      })
    } else {
      this.setState({ loading: false }, () =>
        Swal.fire({
          title: local.errorTitle,
          text: getErrorMessage(res.error.error),
          icon: 'error',
          confirmButtonText: local.confirmationText,
        })
      )
    }
  }

  getTotals(values) {
    let feesSum = 0
    let principleSum = 0
    values.installments.forEach((inst) => {
      if (inst.status !== 'rescheduled') {
        feesSum += inst.feesInstallment
        principleSum += inst.principalInstallment
      }
    })
    return { feesSum, principleSum }
  }

  getRescheuleDate(values, index) {
    const reschedFreeInsts = values.installments
      .slice(0, index - 1)
      .filter((i) => i.status !== 'rescheduled')
    if (reschedFreeInsts.length > 0) {
      let maxDate = reschedFreeInsts[0].dateOfPayment
      reschedFreeInsts.forEach((element) => {
        if (element.dateOfPayment > maxDate) {
          maxDate = element.dateOfPayment
        }
      })
      return maxDate
    }
    return 0
  }

  rescheduleInstallment(values, index) {
    const installments = [...values.installments]
    installments[index].status = 'rescheduled'
    return installments
  }

  async pushInstallments() {
    this.setState({ loading: true })
    const obj = {
      installments: this.state.installmentsAfterRescheduling,
    }
    const res = await freeRescheduling(this.props.application._id, obj)
    if (res.status === 'success') {
      this.setState({ loading: false })
      Swal.fire({
        icon: 'success',
        text: local.loanFreeReschedulingSuccess,
        confirmButtonText: local.confirmationText,
      }).then(() => window.location.reload())
    } else {
      this.setState({ loading: false }, () =>
        Swal.fire({
          title: local.errorTitle,
          text: getErrorMessage(res.error.error),
          icon: 'error',
          confirmButtonText: local.confirmationText,
        })
      )
    }
  }

  applyChanges() {
    Swal.fire({
      title: local.areYouSure,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: local.freeRescheduling,
      cancelButtonText: local.cancel,
    }).then((result) => {
      if (result.value) {
        this.pushInstallments()
      }
    })
  }

  addRow(values: { installments: any }) {
    const installments = [...values.installments]
    installments.push({
      id:
        values.installments[0].id === 0
          ? values.installments.length
          : values.installments.length + 1,
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
      new: true,
    })
    return installments
  }

  removeNew(values, index) {
    const installments = [...values.installments]
    installments.forEach((installment, i) => {
      if (i > index) {
        installment.id = -1
      }
    })
    installments.splice(index, 1)
    return installments
  }

  editable(installment) {
    if (
      installment.status === 'pending' ||
      installment.status === 'paid' ||
      installment.status === 'rescheduled' ||
      installment.status === 'partiallyPaid'
    ) {
      return false
    }
    return true
  }

  render() {
    return (
      <div className="d-flex flex-column">
        <Loader type="fullscreen" open={this.state.loading} />
        {/* <Col> */}
        <LoanDetailsBoxView application={this.props.application} />
        {/* </Col> */}
        <div style={{ margin: '10px 0' }}>
          <Row>
            <h5>{local.installmentsTableBeforeRescheduling}</h5>
          </Row>
          <Formik
            initialValues={{
              // JSON.parse(JSON.stringify here is CLONE Deep
              installments: JSON.parse(
                JSON.stringify(
                  this.props.application.installmentsObject.installments
                )
              ),
            }}
            onSubmit={this.handleSubmit}
            validationSchema={freeReschedulingValidation}
            validateOnBlur
            validateOnChange
          >
            {(formikProps) => (
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
                      {formikProps.values.installments.map(
                        (item, index: number) => {
                          return (
                            <tr key={index}>
                              <td>{item.id}</td>
                              <td>
                                {!this.editable(item) ? (
                                  formikProps.values.installments[index]
                                    .principalInstallment
                                ) : (
                                  <Form.Control
                                    type="number"
                                    name={`installments[${index}].principalInstallment`}
                                    data-qc="principalInstallment"
                                    value={
                                      formikProps.values.installments[index]
                                        .principalInstallment
                                    }
                                    onBlur={formikProps.handleBlur}
                                    isInvalid={
                                      formikProps.errors.installments &&
                                      formikProps.errors.installments[index] &&
                                      formikProps.errors.installments[index]
                                        .principalInstallment &&
                                      formikProps.touched.installments &&
                                      formikProps.touched.installments[index] &&
                                      formikProps.touched.installments[index]
                                        .principalInstallment
                                    }
                                    onChange={(e) => {
                                      formikProps.setFieldValue(
                                        `installments[${index}].principalInstallment`,
                                        Number(e.currentTarget.value)
                                      )
                                      formikProps.setFieldValue(
                                        `installments[${index}].installmentResponse`,
                                        parseFloat(
                                          (
                                            Number(e.currentTarget.value) +
                                            formikProps.values.installments[
                                              index
                                            ].feesInstallment
                                          ).toFixed(2)
                                        )
                                      )
                                    }}
                                  />
                                )}
                                {formikProps.errors.installments &&
                                  formikProps.errors.installments[index] &&
                                  formikProps.errors.installments[index]
                                    .principalInstallment && (
                                    <Form.Control.Feedback
                                      type="invalid"
                                      style={{ display: 'block' }}
                                    >
                                      {formikProps.errors.installments[index]
                                        .principalInstallment
                                        ? local.amountShouldNotbeLessThanPaidAmount +
                                          ' ' +
                                          formikProps.values.installments[index]
                                            .principalPaid
                                        : ''}
                                    </Form.Control.Feedback>
                                  )}
                              </td>
                              <td>
                                {!this.editable(item) ? (
                                  formikProps.values.installments[index]
                                    .feesInstallment
                                ) : (
                                  <Form.Control
                                    type="number"
                                    name={`installments[${index}].feesInstallment`}
                                    data-qc="feesInstallment"
                                    value={
                                      formikProps.values.installments[index]
                                        .feesInstallment
                                    }
                                    onBlur={formikProps.handleBlur}
                                    isInvalid={
                                      formikProps.errors.installments &&
                                      formikProps.errors.installments[index] &&
                                      formikProps.errors.installments[index]
                                        .feesInstallment &&
                                      formikProps.touched.installments &&
                                      formikProps.touched.installments[index] &&
                                      formikProps.touched.installments[index]
                                        .feesInstallment
                                    }
                                    onChange={(e) => {
                                      formikProps.setFieldValue(
                                        `installments[${index}].feesInstallment`,
                                        Number(e.currentTarget.value)
                                      )
                                      formikProps.setFieldValue(
                                        `installments[${index}].installmentResponse`,
                                        parseFloat(
                                          (
                                            Number(e.currentTarget.value) +
                                            formikProps.values.installments[
                                              index
                                            ].principalInstallment
                                          ).toFixed(2)
                                        )
                                      )
                                    }}
                                  />
                                )}
                                {formikProps.errors.installments &&
                                  formikProps.errors.installments[index] &&
                                  formikProps.errors.installments[index]
                                    .feesInstallment && (
                                    <Form.Control.Feedback
                                      type="invalid"
                                      style={{ display: 'block' }}
                                    >
                                      {formikProps.errors.installments[index]
                                        .feesInstallment
                                        ? local.amountShouldNotbeLessThanPaidAmount +
                                          ' ' +
                                          formikProps.values.installments[index]
                                            .feesPaid
                                        : ''}
                                    </Form.Control.Feedback>
                                  )}
                              </td>
                              <td>
                                {
                                  formikProps.values.installments[index]
                                    .installmentResponse
                                }
                                {formikProps.errors.installments &&
                                  formikProps.errors.installments[index] &&
                                  formikProps.errors.installments[index]
                                    .installmentResponse && (
                                    <Form.Control.Feedback
                                      type="invalid"
                                      style={{ display: 'block' }}
                                    >
                                      {
                                        formikProps.errors.installments[index]
                                          .installmentResponse
                                      }
                                    </Form.Control.Feedback>
                                  )}
                              </td>
                              <td>
                                {!this.editable(item) ? (
                                  getRenderDate(
                                    formikProps.values.installments[index]
                                      .dateOfPayment
                                  )
                                ) : (
                                  <Form.Control
                                    type="date"
                                    name={`installments[${index}].dateOfPayment`}
                                    data-qc="dateOfPayment"
                                    value={getDateString(
                                      formikProps.values.installments[index]
                                        .dateOfPayment
                                    )}
                                    onBlur={formikProps.handleBlur}
                                    onChange={(e) => {
                                      formikProps.setFieldValue(
                                        `installments[${index}].dateOfPayment`,
                                        new Date(
                                          e.currentTarget.value
                                        ).valueOf()
                                      )
                                    }}
                                    min={
                                      index > 0
                                        ? formikProps.values.installments[
                                            index - 1
                                          ] &&
                                          formikProps.values.installments[
                                            index - 1
                                          ].status !== 'rescheduled'
                                          ? getDateString(
                                              formikProps.values.installments[
                                                index - 1
                                              ].dateOfPayment
                                            )
                                          : getDateString(
                                              this.getRescheuleDate(
                                                formikProps.values,
                                                index
                                              )
                                            )
                                        : undefined
                                    }
                                    // max={index < formikProps.values.installments.length - 1 ? this.getDateString(formikProps.values.installments[index + 1].dateOfPayment) : undefined}
                                    isInvalid={
                                      formikProps.errors.installments &&
                                      formikProps.errors.installments[index] &&
                                      formikProps.errors.installments[index]
                                        .dateOfPayment
                                    }
                                  />
                                )}
                                {formikProps.errors.installments &&
                                  formikProps.errors.installments[index] &&
                                  formikProps.errors.installments[index]
                                    .dateOfPayment && (
                                    <Form.Control.Feedback
                                      type="invalid"
                                      style={{ display: 'block' }}
                                    >
                                      {
                                        formikProps.errors.installments[index]
                                          .dateOfPayment
                                      }
                                    </Form.Control.Feedback>
                                  )}
                              </td>
                              <td>
                                {getStatus(
                                  formikProps.values.installments[index]
                                )}
                              </td>
                              <td>
                                {formikProps.values.installments[index].new && (
                                  <span
                                    onClick={() =>
                                      formikProps.setFieldValue(
                                        'installments',
                                        this.removeNew(
                                          formikProps.values,
                                          index
                                        )
                                      )
                                    }
                                  >
                                    <span
                                      className="fa fa-trash"
                                      style={{ margin: '0px 0px 0px 5px' }}
                                    />
                                  </span>
                                )}
                                {!formikProps.values.installments[index].new &&
                                  this.editable(item) && (
                                    <span
                                      onClick={() =>
                                        formikProps.setFieldValue(
                                          'installments',
                                          this.rescheduleInstallment(
                                            formikProps.values,
                                            index
                                          )
                                        )
                                      }
                                    >
                                      <LtsIcon name="reschedule" />
                                    </span>
                                  )}
                              </td>
                            </tr>
                          )
                        }
                      )}
                    </tbody>
                  </Table>
                  <div
                    className="d-flex flex-column justify-content-end"
                    style={{ margin: '10px 0px', textAlign: 'right' }}
                  >
                    <div className="d-flex flex-column">
                      <span>
                        {local.totalPricipleInTable}
                        {parseFloat(
                          this.getTotals(
                            formikProps.values
                          ).principleSum.toFixed(2)
                        )}
                      </span>
                      <span>
                        {local.totalPricipleInLoan}
                        {
                          this.props.application.installmentsObject
                            .totalInstallments.principal
                        }
                      </span>
                    </div>
                    <div className="d-flex flex-column">
                      <span>
                        {local.totalFeesInTable}
                        {parseFloat(
                          this.getTotals(formikProps.values).feesSum.toFixed(2)
                        )}
                      </span>
                      <span>
                        {local.totalFeesInLoan}
                        {
                          this.props.application.installmentsObject
                            .totalInstallments.feesSum
                        }
                      </span>
                    </div>
                    <Button
                      style={{ width: '4%', alignSelf: 'flex-end' }}
                      onClick={() =>
                        formikProps.setFieldValue(
                          'installments',
                          this.addRow(formikProps.values)
                        )
                      }
                    >
                      +
                    </Button>
                  </div>
                  {parseFloat(
                    this.getTotals(formikProps.values).principleSum.toFixed(2)
                  ) ===
                  parseFloat(
                    this.props.application.installmentsObject.totalInstallments.principal.toFixed(
                      2
                    )
                  ) ? (
                    <div className="d-flex justify-content-end">
                      <Button type="submit" variant="primary" data-qc="submit">
                        {local.submit}
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <h1>
                        {local.principalOfTotalInstallmentsMustBe}
                        {
                          this.props.application.installmentsObject
                            .totalInstallments.principal
                        }
                        {local.itIs}
                        {this.getTotals(
                          formikProps.values
                        ).principleSum.toFixed(2)}
                      </h1>
                    </div>
                  )}
                </Col>
              </Form>
            )}
          </Formik>
        </div>
        {this.state.installmentsAfterRescheduling.length > 0 && (
          <div style={{ margin: '10px 0' }}>
            <Row>
              <h5>{local.installmentsTableAfterRescheduling}</h5>
            </Row>
            <DynamicTable
              totalCount={0}
              pagination={false}
              data={this.state.installmentsAfterRescheduling}
              mappers={this.mappers}
            />
            {!this.props.test && (
              <Button onClick={() => this.applyChanges()}>{local.save}</Button>
            )}
          </div>
        )}
      </div>
    )
  }
}
export default FreeRescheduling
