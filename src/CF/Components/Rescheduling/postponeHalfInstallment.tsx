import React, { Component } from 'react'
import { Formik } from 'formik'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Swal from 'sweetalert2'
import DynamicTable from '../../../Shared/Components/DynamicTable/dynamicTable'
import * as local from '../../../Shared/Assets/ar.json'
import {
  testPostponeHalfInstallment,
  postponeHalfInstallment,
} from '../../../Shared/Services/APIs/loanApplication/postponeHalfInstallment'
import { reschedulingValidation } from './reschedulingValidations'
import { Loader } from '../../../Shared/Components/Loader'
import {
  getErrorMessage,
  getStatus,
  getRenderDate,
} from '../../../Shared/Services/utils'
import { LoanDetailsBoxView } from '../Loans/LoanProfile/applicationsDetails'

interface Props {
  application: any
  test: boolean
}
interface State {
  installmentsAfterRescheduling: any
  loading: boolean
  noOfInstallments: number
  withInterest: boolean
  postponementInterest: number
  payWhere: string
  installmentNumber: number
}
class PostponeHalfInstallment extends Component<Props, State> {
  mappers: { title: string; key: string; render: (data: any) => any }[]

  constructor(props: Props) {
    super(props)
    this.state = {
      installmentsAfterRescheduling: [],
      loading: false,
      noOfInstallments: 0,
      withInterest: false,
      postponementInterest: 0,
      payWhere: '',
      installmentNumber: 0,
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
    ]
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.test !== this.props.test) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        installmentsAfterRescheduling: [],
        noOfInstallments: 0,
        withInterest: false,
      })
    }
  }

  handleSubmit = async (values) => {
    this.setState({ loading: true })
    const obj = {
      noOfInstallments: values.noOfInstallments,
      withInterest: values.withInterest,
      postponementInterest: values.postponementInterest,
      payWhere: values.payWhere,
      installmentNumber: Number(values.installmentNumber),
      // shiftInstallments:true
    }
    const res = await testPostponeHalfInstallment(
      this.props.application._id,
      obj
    )
    if (res.status === 'success') {
      this.setState({ loading: false })
      this.setState({
        noOfInstallments: values.noOfInstallments,
        withInterest: values.withInterest,
        postponementInterest: values.postponementInterest,
        payWhere: values.payWhere,
        installmentNumber: values.installmentNumber,
        installmentsAfterRescheduling: res.body.output,
      })
      Swal.fire({
        icon: 'success',
        text: local.postponeTested,
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

  applyChanges() {
    Swal.fire({
      title: local.areYouSure,
      text: `${local.willBePostponed}  ${
        this.state.noOfInstallments > 1
          ? this.state.noOfInstallments + local.installments
          : local.installment
      }`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: local.postponeHalfInstallment,
      cancelButtonText: local.cancel,
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
      installmentNumber: Number(this.state.installmentNumber),
      // shiftInstallments:true
    }
    const res = await postponeHalfInstallment(this.props.application._id, obj)
    if (res.status === 'success') {
      this.setState({ loading: false })
      Swal.fire({
        text: local.donePostponing,
        icon: 'success',
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

  render() {
    return (
      <div className="d-flex flex-column">
        <Loader type="fullscreen" open={this.state.loading} />
        <LoanDetailsBoxView application={this.props.application} />

        <Formik
          initialValues={{
            noOfInstallments: this.state.noOfInstallments,
            withInterest: this.state.withInterest,
            postponementInterest: this.state.postponementInterest,
            payWhere: this.state.payWhere,
            installmentNumber: this.state.installmentNumber,
          }}
          onSubmit={this.handleSubmit}
          validationSchema={reschedulingValidation}
          validateOnBlur
          validateOnChange
          enableReinitialize
        >
          {(formikProps) => (
            <Form onSubmit={formikProps.handleSubmit}>
              <Col>
                <Form.Group controlId="noOfInstallments">
                  <Form.Label column sm={6}>
                    {local.noOfInstallments}
                  </Form.Label>
                  <Col sm={6}>
                    <Form.Control
                      type="number"
                      name="noOfInstallments"
                      data-qc="noOfInstallments"
                      value={formikProps.values.noOfInstallments.toString()}
                      onBlur={formikProps.handleBlur}
                      onChange={formikProps.handleChange}
                      isInvalid={
                        Boolean(formikProps.errors.noOfInstallments) &&
                        Boolean(formikProps.touched.noOfInstallments)
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {formikProps.errors.noOfInstallments}
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="withInterest">
                  <Form.Label column md={3}>
                    {local.withInterest}
                  </Form.Label>
                  <div className="d-flex align-items-center">
                    <Form.Check
                      type="checkbox"
                      name="withInterest"
                      data-qc="withInterest"
                      value={formikProps.values.withInterest.toString()}
                      checked={formikProps.values.withInterest}
                      onBlur={formikProps.handleBlur}
                      onChange={formikProps.handleChange}
                      isInvalid={
                        Boolean(formikProps.errors.withInterest) &&
                        Boolean(formikProps.touched.withInterest)
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {formikProps.errors.withInterest}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>

                <Form.Group controlId="postponementInterest">
                  <Form.Label column sm={6}>
                    {local.postponementInterest}
                  </Form.Label>
                  <Col sm={6}>
                    <Form.Control
                      type="number"
                      name="postponementInterest"
                      data-qc="postponementInterest"
                      value={formikProps.values.postponementInterest.toString()}
                      onBlur={formikProps.handleBlur}
                      onChange={formikProps.handleChange}
                      isInvalid={
                        Boolean(formikProps.errors.postponementInterest) &&
                        Boolean(formikProps.touched.postponementInterest)
                      }
                      disabled={!formikProps.values.withInterest}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formikProps.errors.postponementInterest}
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>

                <Form.Group controlId="payWhere">
                  <Form.Label column sm={6}>
                    {local.payWhere}
                  </Form.Label>
                  <Col sm={6}>
                    <Form.Control
                      as="select"
                      name="payWhere"
                      data-qc="payWhere"
                      value={formikProps.values.payWhere}
                      onBlur={formikProps.handleBlur}
                      onChange={formikProps.handleChange}
                      isInvalid={
                        Boolean(formikProps.errors.payWhere) &&
                        Boolean(formikProps.touched.payWhere)
                      }
                      disabled={!formikProps.values.withInterest}
                    >
                      <option value="" />
                      <option value="now">{local.now}</option>
                      <option value="divide">{local.divide}</option>
                      <option value="installment">{local.installment}</option>
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {formikProps.errors.payWhere}
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>
                <Form.Group controlId="installmentNumber">
                  <Form.Label column sm={6}>
                    {local.installmentNumber}
                  </Form.Label>
                  <Col sm={6}>
                    <Form.Control
                      as="select"
                      name="installmentNumber"
                      data-qc="installmentNumber"
                      value={formikProps.values.installmentNumber.toString()}
                      onBlur={formikProps.handleBlur}
                      onChange={formikProps.handleChange}
                      isInvalid={
                        Boolean(formikProps.errors.installmentNumber) &&
                        Boolean(formikProps.touched.installmentNumber)
                      }
                      disabled={
                        !(formikProps.values.payWhere === 'installment') ||
                        !formikProps.values.withInterest
                      }
                    >
                      <option value="" />
                      {this.props.application.installmentsObject.installments
                        .filter(
                          (inst) =>
                            inst.status === 'unpaid' ||
                            inst.status === 'partiallyPaid'
                        )
                        .map((inst) => (
                          <option key={inst.id} value={inst.id}>
                            {local.installment} {inst.id}
                          </option>
                        ))}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {formikProps.errors.installmentNumber}
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>
              </Col>
              <div className="d-flex justify-content-end">
                <Button type="submit" variant="primary" data-qc="submit">
                  {local.submit}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
        <div style={{ margin: '10px 0' }}>
          <Row>
            <h5>{local.installmentsTableBeforeRescheduling}</h5>
          </Row>
          <DynamicTable
            totalCount={0}
            pagination={false}
            data={this.props.application.installmentsObject.installments}
            mappers={this.mappers}
          />
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
          </div>
        )}
        {!this.props.test && (
          <Button
            disabled={this.state.noOfInstallments === 0}
            onClick={() => this.applyChanges()}
          >
            {local.save}
          </Button>
        )}
      </div>
    )
  }
}
export default PostponeHalfInstallment
