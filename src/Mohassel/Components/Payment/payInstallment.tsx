import React, { Component } from 'react'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Card from 'react-bootstrap/Card'
import AsyncSelect from 'react-select/async'
import { Formik, FormikProps } from 'formik'
import Swal from 'sweetalert2'
import { connect } from 'react-redux'
import * as local from '../../../Shared/Assets/ar.json'
import { paymentValidation } from './paymentValidation'
import { searchUserByAction } from '../../Services/APIs/UserByAction/searchUserByAction'
import { payment } from '../../../Shared/redux/payment/actions'
import './styles.scss'
import { Employee } from './payment'
import { getErrorMessage } from '../../../Shared/Services/utils'
import Can from '../../config/Can'
import { theme } from '../../../Shared/theme'
import { LtsIcon } from '../../../Shared/Components'

interface FormValues {
  requiredAmount: number
  truthDate: string
  payAmount: number
  randomPaymentType: string
  max: number
  paymentType: string
  penaltyAction: string
  payerType: string
  payerNationalId: string
  payerName: string
  payerId: string
  installmentNumber: number
}
export interface Installment {
  id: number
  installmentResponse: number
  principalInstallment: number
  feesInstallment: number
  totalPaid: number
  principalPaid: number
  feesPaid: number
  dateOfPayment: number
  status: string
}
interface Application {
  principal: number
  status: string
  installmentsObject: InstallmentsObject
  group: any
  product: any
  beneficiaryType: string
}
interface InstallmentsObject {
  totalInstallments: TotalInstallments
}
interface TotalInstallments {
  installmentSum: number
}
interface Props {
  installments: Array<Installment>
  application: Application
  changePaymentState: (data) => void
  handleSubmit: (data) => void
  payAmount: number
  truthDate: string
  paymentType: string
  penaltyAction: string
  penalty: number
}
interface SelectObject {
  label: string
  value: string
}
interface State {
  payAmount: number
  truthDate: string
  randomPaymentType: string
  requiredAmount: number
  paymentType: string
  randomPaymentTypes: Array<SelectObject>
  penaltyAction: string
  payerType: string
  payerNationalId: string
  payerName: string
  payerId: string
  installmentNumber: number
  employees: Array<Employee>
  sidePaymentInfo: Record<string, string>
}
class PayInstallment extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      payAmount: this.props.payAmount,
      truthDate: this.props.truthDate,
      randomPaymentType: '',
      requiredAmount: 0,
      paymentType: this.props.paymentType,
      randomPaymentTypes: [
        { label: local.reissuingFees, value: 'reissuingFees' },
        { label: local.legalFees, value: 'legalFees' },
        { label: local.clearanceFees, value: 'clearanceFees' },
        { label: local.toktokStamp, value: 'toktokStamp' },
        { label: local.tricycleStamp, value: 'tricycleStamp' },
      ],
      penaltyAction: this.props.penaltyAction,
      payerType: '',
      payerNationalId: '',
      payerName: '',
      payerId: '',
      installmentNumber: -1,
      employees: [],
      sidePaymentInfo: {
        image: 'pay-installment',
        local: local.payInstallment,
      },
    }
  }

  componentDidMount() {
    if (this.props.paymentType === 'penalties' && this.props.penaltyAction) {
      this.props.penaltyAction !== 'cancel'
        ? this.setState({
            sidePaymentInfo: { image: 'pay-penalty', local: local.payPenalty },
          })
        : this.setState({
            sidePaymentInfo: {
              image: 'cancel-penalty',
              local: local.cancelPenalty,
            },
          })
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.penaltyAction !== this.props.penaltyAction)
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ penaltyAction: prevProps.penaltyAction })
  }

  getUsersByAction = async (input: string, values) => {
    const obj = {
      size: 100,
      from: 0,
      serviceKey: 'halan.com/application',
      action: 'acceptPayment',
      name: input,
    }
    const res = await searchUserByAction(obj)
    if (res.status === 'success') {
      this.setState({
        ...values,
        employees: res.body.data,
        payerType: 'employee',
      })
      return res.body.data
    }
    this.setState({ employees: [] }, () =>
      Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
    )
    return []
  }

  getRequiredAmount() {
    const installment = this.props.installments.find((inst) => {
      return (
        inst.status !== 'paid' &&
        inst.status !== 'rescheduled' &&
        inst.status !== 'pending'
      )
    })
    return installment
      ? installment.installmentResponse - installment.totalPaid
      : 0
  }

  render() {
    return (
      <Card className="payment-menu">
        <div className="payment-info" style={{ textAlign: 'center' }}>
          <LtsIcon
            name={this.state.sidePaymentInfo.image}
            size="90px"
            color="#7dc255"
          />
          <Button
            variant="default"
            onClick={() => this.props.changePaymentState(0)}
          >
            <span className="font-weight-bolder text-primary">&#8702;</span>
            <small className="font-weight-bolder text-nowrap text-primary">
              &nbsp;{this.state.sidePaymentInfo.local}
            </small>
          </Button>
        </div>
        <div className="verticalLine" />
        <div style={{ width: '100%', padding: 20 }}>
          <Formik
            enableReinitialize
            initialValues={{
              ...this.state,
              max:
                this.props.application.status === 'canceled'
                  ? this.props.application.principal
                  : this.props.application.installmentsObject.totalInstallments
                      .installmentSum,
              beneficiaryType: this.props.application.product.beneficiaryType,
              payAmount:
                this.props.paymentType === 'normal'
                  ? this.getRequiredAmount()
                  : this.state.payAmount,
            }}
            onSubmit={this.props.handleSubmit}
            validationSchema={() => paymentValidation(this.props.penalty)}
            validateOnBlur
            validateOnChange
          >
            {(formikBag: FormikProps<FormValues>) => (
              <Form onSubmit={formikBag.handleSubmit}>
                <Container>
                  <Form.Group as={Row} md={12}>
                    {/* `${this.props.paymentType==="normal"? local.installmentToBePaid: local.randomPaymentToBePaid}`} */}
                    {this.props.paymentType === 'normal' ? (
                      <>
                        <Form.Group
                          as={Col}
                          md={6}
                          controlId="installmentNumber"
                        >
                          <Form.Label
                            className="pr-0"
                            column
                          >{`${local.installmentToBePaid}`}</Form.Label>
                          <Col className="pr-0">
                            <Form.Control
                              as="select"
                              name="installmentNumber"
                              data-qc="installmentNumber"
                              onChange={(event) => {
                                const installment = this.props.installments.find(
                                  (inst) =>
                                    inst.id ===
                                    Number(event.currentTarget.value)
                                )
                                formikBag.setFieldValue(
                                  'installmentNumber',
                                  event.currentTarget.value
                                )
                                formikBag.setFieldValue(
                                  'requiredAmount',
                                  installment
                                    ? installment.installmentResponse -
                                        installment?.totalPaid
                                    : 0
                                )
                                formikBag.setFieldValue(
                                  'payAmount',
                                  installment
                                    ? installment.installmentResponse -
                                        installment?.totalPaid
                                    : 0
                                )
                              }}
                            >
                              <option value={-1} />
                              {this.props.installments.map((installment) => {
                                if (
                                  installment.status !== 'paid' &&
                                  installment.status !== 'rescheduled'
                                )
                                  return (
                                    <option
                                      key={installment.id}
                                      value={installment.id}
                                    >
                                      {installment.id}
                                    </option>
                                  )
                              })}
                            </Form.Control>
                          </Col>
                        </Form.Group>
                        <Form.Group as={Col} md={6} controlId="requiredAmount">
                          <Form.Label
                            className="pr-0"
                            column
                          >{`${local.requiredAmount}`}</Form.Label>
                          <Col className="pr-0">
                            <Form.Control
                              type="number"
                              name="requiredAmount"
                              value={
                                formikBag.values.requiredAmount ||
                                this.getRequiredAmount()
                              }
                              disabled
                            />
                          </Col>
                        </Form.Group>
                      </>
                    ) : null}
                    {this.props.paymentType === 'random' ? (
                      <Form.Group as={Col} md={6} controlId="randomPaymentType">
                        <Form.Label
                          className="pr-0"
                          column
                        >{`${local.randomPaymentToBePaid}`}</Form.Label>
                        <Form.Control
                          as="select"
                          name="randomPaymentType"
                          data-qc="randomPaymentType"
                          onChange={(event) => {
                            formikBag.setFieldValue(
                              'randomPaymentType',
                              event.currentTarget.value
                            )
                          }}
                        >
                          <option value={-1} />
                          {this.state.randomPaymentTypes.map(
                            (randomPaymentType: SelectObject) => {
                              return (
                                <option
                                  key={randomPaymentType.value}
                                  value={randomPaymentType.value}
                                >
                                  {randomPaymentType.label}
                                </option>
                              )
                            }
                          )}
                        </Form.Control>
                      </Form.Group>
                    ) : null}
                    <Form.Group as={Col} md={6} controlId="payAmount">
                      <Form.Label
                        className="pr-0"
                        column
                      >{`${local.amountCollectedFromCustomer}`}</Form.Label>
                      <Form.Control
                        type="number"
                        name="payAmount"
                        data-qc="payAmount"
                        value={formikBag.values.payAmount.toString()}
                        onBlur={formikBag.handleBlur}
                        onChange={formikBag.handleChange}
                        isInvalid={
                          Boolean(formikBag.errors.payAmount) &&
                          Boolean(formikBag.touched.payAmount)
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {formikBag.errors.payAmount}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} controlId="truthDate">
                      <Form.Label
                        style={{ textAlign: 'right', paddingRight: 0 }}
                        column
                      >{`${local.truthDate}`}</Form.Label>
                      <Form.Control
                        type="date"
                        name="truthDate"
                        data-qc="truthDate"
                        value={formikBag.values.truthDate}
                        onBlur={formikBag.handleBlur}
                        onChange={formikBag.handleChange}
                        min="2021-02-01"
                        isInvalid={
                          Boolean(formikBag.errors.truthDate) &&
                          Boolean(formikBag.touched.truthDate)
                        }
                        disabled={Boolean(
                          this.props.paymentType === 'normal' ||
                            this.props.paymentType === 'random' ||
                            this.props.paymentType === 'penalties'
                        )}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formikBag.errors.truthDate}
                      </Form.Control.Feedback>
                    </Form.Group>
                    {(this.props.penaltyAction !== 'cancel' ||
                      this.props.paymentType === 'random') && (
                      <Form.Group as={Col} md={6} controlId="whoPaid">
                        <Form.Label
                          className="pr-0"
                          column
                        >{`${local.whoMadeThePayment}`}</Form.Label>
                        <Form.Control
                          as="select"
                          name="payerType"
                          data-qc="payerType"
                          value={formikBag.values.payerType}
                          onChange={formikBag.handleChange}
                          onBlur={formikBag.handleBlur}
                          isInvalid={
                            Boolean(formikBag.errors.payerType) &&
                            Boolean(formikBag.touched.payerType)
                          }
                        >
                          <option value="" />
                          <Can I="payInstallment" an="application">
                            <option value="beneficiary" data-qc="beneficiary">
                              {local.customer}
                            </option>
                            <option value="employee" data-qc="employee">
                              {local.employee}
                            </option>
                            <option value="family" data-qc="family">
                              {local.familyMember}
                            </option>
                            <option value="nonFamily" data-qc="nonFamily">
                              {local.nonFamilyMember}
                            </option>
                          </Can>
                          <Can I="payByInsurance" an="application">
                            <option value="insurance" data-qc="insurance">
                              {local.byInsurance}
                            </option>
                          </Can>
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                          {formikBag.errors.payerType}
                        </Form.Control.Feedback>
                      </Form.Group>
                    )}
                    {formikBag.values.payerType === 'beneficiary' &&
                      this.props.application.product.beneficiaryType ===
                        'group' && (
                        <Form.Group as={Col} md={6} controlId="customer">
                          <Form.Label
                            className="pr-0"
                            column
                          >{`${local.customer}`}</Form.Label>
                          <Form.Control
                            as="select"
                            name="payerId"
                            data-qc="payerId"
                            onChange={formikBag.handleChange}
                            onBlur={formikBag.handleBlur}
                            isInvalid={
                              Boolean(formikBag.errors.payerId) &&
                              Boolean(formikBag.touched.payerId)
                            }
                          >
                            <option value="" />
                            {this.props.application.group.individualsInGroup.map(
                              (member, index) => {
                                return (
                                  <option
                                    key={index}
                                    value={member.customer._id}
                                  >
                                    {member.customer.customerName}
                                  </option>
                                )
                              }
                            )}
                          </Form.Control>
                          <Form.Control.Feedback type="invalid">
                            {formikBag.errors.payerId}
                          </Form.Control.Feedback>
                        </Form.Group>
                      )}
                    {formikBag.values.payerType === 'employee' && (
                      <Form.Group as={Col} md={6} controlId="whoPaid">
                        <Form.Label
                          className="pr-0"
                          column
                        >{`${local.employee}`}</Form.Label>
                        <AsyncSelect
                          className={formikBag.errors.payerId ? 'error' : ''}
                          name="payerId"
                          data-qc="payerId"
                          styles={theme.selectStyleWithBorder}
                          theme={theme.selectTheme}
                          value={this.state.employees.find(
                            (employee) =>
                              employee._id === formikBag.values.payerId
                          )}
                          onBlur={formikBag.handleBlur}
                          onChange={(employee: any) =>
                            formikBag.setFieldValue('payerId', employee._id)
                          }
                          getOptionLabel={(option) => option.name}
                          getOptionValue={(option) => option._id}
                          loadOptions={(input) =>
                            this.getUsersByAction(input, formikBag.values)
                          }
                          cacheOptions
                          defaultOptions
                        />
                        {formikBag.touched.payerId && (
                          <div
                            style={{
                              width: '100%',
                              marginTop: '0.25rem',
                              fontSize: '80%',
                              color: '#d51b1b',
                            }}
                          >
                            {formikBag.errors.payerId}
                          </div>
                        )}
                      </Form.Group>
                    )}
                    {(formikBag.values.payerType === 'family' ||
                      formikBag.values.payerType === 'nonFamily') && (
                      <>
                        <Form.Group as={Col} md={6} controlId="whoPaid">
                          <Form.Label
                            className="pr-0"
                            column
                          >{`${local.name}`}</Form.Label>
                          <Form.Control
                            name="payerName"
                            data-qc="payerName"
                            value={formikBag.values.payerName.toString()}
                            onBlur={formikBag.handleBlur}
                            onChange={formikBag.handleChange}
                            isInvalid={
                              Boolean(formikBag.errors.payerName) &&
                              Boolean(formikBag.touched.payerName)
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {formikBag.errors.payerName}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} md={6} controlId="whoPaid">
                          <Form.Label
                            className="pr-0"
                            column
                          >{`${local.nationalId}`}</Form.Label>
                          <Form.Control
                            type="text"
                            name="payerNationalId"
                            data-qc="payerNationalId"
                            maxLength={14}
                            value={formikBag.values.payerNationalId.toString()}
                            onBlur={formikBag.handleBlur}
                            onChange={(
                              event: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              const re = /^\d*$/
                              if (
                                event.currentTarget.value === '' ||
                                re.test(event.currentTarget.value)
                              ) {
                                formikBag.setFieldValue(
                                  'payerNationalId',
                                  event.currentTarget.value
                                )
                              }
                            }}
                            isInvalid={
                              Boolean(formikBag.errors.payerNationalId) &&
                              Boolean(formikBag.touched.payerNationalId)
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {formikBag.errors.payerNationalId}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </>
                    )}
                  </Form.Group>
                </Container>
                <div className="payments-buttons-container">
                  <Button
                    variant="secondary"
                    data-qc="cancel"
                    onClick={() => this.props.changePaymentState(0)}
                  >
                    {local.cancel}
                  </Button>
                  <Button
                    variant="primary"
                    data-qc="submit"
                    type="submit"
                    disabled={!formikBag.isValid}
                  >
                    {local.submit}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </Card>
    )
  }
}
const addPaymentToProps = (dispatch) => {
  return {
    changePaymentState: (data) => dispatch(payment(data)),
  }
}
const mapStateToProps = (state) => {
  return {
    paymentState: state.payment,
  }
}
export default connect(mapStateToProps, addPaymentToProps)(PayInstallment)
