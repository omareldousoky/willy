import React, { Component } from 'react'
import { Formik } from 'formik'
import Container from 'react-bootstrap/Container'
import Swal from 'sweetalert2'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Table from 'react-bootstrap/Table'
import {
  FormulaTestClass,
  loanFormulaTestValidation,
} from './loanCreationInitialStates'
import { LoanFormulaTestForm } from './loanFormulaTestForm'
import TestCalculateFormulaPDF from '../pdfTemplates/testCalculateFormula/testCalculateFormula'
import { getFormulas } from '../../../Shared/Services/APIs/LoanFormula/getFormulas'
import { testFormula } from '../../../Shared/Services/APIs/LoanFormula/testFormula'
import { Loader } from '../../../Shared/Components/Loader'
import * as local from '../../../Shared/Assets/ar.json'
import {
  timeToDateyyymmdd,
  parseJwt,
  getErrorMessage,
} from '../../../Shared/Services/utils'
import { getCookie } from '../../../Shared/Services/getCookie'
import BackButton from '../../../Shared/Components/BackButton/back-button'
import store from '../../../Shared/redux/store'

interface Props {
  title: string
}
interface State {
  formula: FormulaTestClass
  loading: boolean
  formulas: Array<Formula>
  result: any
  branchName: string
}
interface Formula {
  name: string
  _id: string
}
const date = new Date()
class FormulaTest extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      formula: {
        calculationFormulaId: '',
        principal: 1,
        pushPayment: 0,
        noOfInstallments: 1,
        gracePeriod: 0,
        periodLength: 1,
        periodType: 'months',
        interest: 0,
        interestPeriod: 'yearly',
        adminFees: 0,
        loanStartDate: new Date(
          date.getTime() - date.getTimezoneOffset() * 60000
        )
          .toISOString()
          .split('T')[0],
        pushHolidays: 'next',
        inAdvanceFees: 0,
        inAdvanceFrom: 'principal',
        inAdvanceType: 'cut',
      },
      loading: false,
      formulas: [],
      result: {},
      branchName: '',
    }
  }

  async UNSAFE_componentWillMount() {
    this.setState({ loading: true })
    const formulas = await getFormulas()
    if (formulas.status === 'success') {
      this.setState({
        formulas: formulas.body.data,
        loading: false,
      })
    } else {
      Swal.fire({
        title: local.errorTitle,
        confirmButtonText: local.confirmationText,
        text: getErrorMessage(formulas.error.error),
        icon: 'error',
      })
      this.setState({ loading: false })
    }
  }

  componentDidMount() {
    this.getBranchData()
  }

  getBranchData() {
    const token = getCookie('token')
    const branchDetails = parseJwt(token)
    const branchName = store
      .getState()
      .auth.validBranches?.find((branch) => branch._id === branchDetails.branch)
      ?.name
    this.setState({ branchName })
  }

  submit = async (values: FormulaTestClass) => {
    this.setState({ loading: true })
    const obj = { ...values }
    obj.loanStartDate = new Date(obj.loanStartDate).valueOf()
    const formula = this.state.formulas.find(
      (item) => item._id === values.calculationFormulaId
    )
    const formulaName = formula ? formula.name : ''
    const res = await testFormula(obj)
    if (res.status === 'success') {
      this.setState({
        loading: false,
        result: { result: res.body.data, formulaName },
      })
      Swal.fire({
        title: local.success,
        text: local.formulaTested,
        confirmButtonText: local.confirmationText,
        icon: 'success',
      })
    } else {
      Swal.fire({
        title: local.errorTitle,
        confirmButtonText: local.confirmationText,
        text: getErrorMessage(res.error.error),
        icon: 'error',
      })
      this.setState({ loading: false })
    }
  }

  render() {
    return (
      <>
        <span className="print-none">
          <BackButton title={local.testCalculationMethod} />
        </span>
        <Container className="print-none">
          <Loader open={this.state.loading} type="fullscreen" />
          <Card style={{ textAlign: 'right' }}>
            {Object.keys(this.state.result).length === 0 ? (
              <Formik
                initialValues={this.state.formula}
                onSubmit={this.submit}
                validationSchema={loanFormulaTestValidation}
                validateOnBlur
                validateOnChange
              >
                {(formikProps) => (
                  <LoanFormulaTestForm
                    {...formikProps}
                    formulas={this.state.formulas}
                    result={this.state.result}
                  />
                )}
              </Formik>
            ) : (
              <div>
                <Table striped style={{ textAlign: 'right' }}>
                  <thead>
                    <tr>
                      <th>{local.installmentNumber}</th>
                      <th>{local.installmentType}</th>
                      <th>{local.principalInstallment}</th>
                      <th>{local.fees}</th>
                      <th>{local.paymentDate}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.result.result.output &&
                      this.state.result.result.output.map(
                        (installment, index) => {
                          return (
                            <tr key={index}>
                              <td>{installment.id}</td>
                              <td>
                                {installment.installmentResponse
                                  ? installment.installmentResponse.toFixed(2)
                                  : 0}
                              </td>
                              <td>
                                {installment.principalInstallment
                                  ? installment.principalInstallment.toFixed(2)
                                  : 0}
                              </td>
                              <td>
                                {installment.feesInstallment
                                  ? installment.feesInstallment.toFixed(2)
                                  : 0}
                              </td>
                              <td>
                                {timeToDateyyymmdd(installment.dateOfPayment)}
                              </td>
                            </tr>
                          )
                        }
                      )}
                  </tbody>
                </Table>
                <div
                  className="d-flex justify-content-between"
                  style={{ padding: 50, backgroundColor: '#f7fff2' }}
                >
                  <div>
                    <h4 style={{ color: '#2a3390' }}>
                      {local.noOfInstallments}
                    </h4>
                    <span
                      style={{
                        color: '#7dc356',
                        fontWeight: 'bold',
                        fontSize: 'large',
                      }}
                    >
                      {this.state.result.result.output.length}
                    </span>
                  </div>
                  <div>
                    <h4 style={{ color: '#2a3390' }}>{local.sumValue}</h4>
                    <span
                      style={{
                        color: '#7dc356',
                        fontWeight: 'bold',
                        fontSize: 'large',
                      }}
                    >
                      {this.state.result.result.sum.installmentSum}
                    </span>
                  </div>
                  <div>
                    <h4 style={{ color: '#2a3390' }}>{local.sumPrinciple}</h4>
                    <span
                      style={{
                        color: '#7dc356',
                        fontWeight: 'bold',
                        fontSize: 'large',
                      }}
                    >
                      {this.state.result.result.sum.principal}
                    </span>
                  </div>
                  <div>
                    <h4 style={{ color: '#2a3390' }}>{local.sumFees}</h4>
                    <span
                      style={{
                        color: '#7dc356',
                        fontWeight: 'bold',
                        fontSize: 'large',
                      }}
                    >
                      {this.state.result.result.sum.feesSum
                        ? this.state.result.result.sum.feesSum
                        : 0}
                    </span>
                  </div>
                  <div className="d-flex justify-content-end">
                    <Button
                      style={{ marginTop: 10 }}
                      onClick={() => window.print()}
                    >
                      {local.downloadPDF}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </Container>
        {Object.keys(this.state.result).length > 0 && (
          <TestCalculateFormulaPDF
            data={this.state.result}
            branchName={this.state.branchName}
          />
        )}
      </>
    )
  }
}
export default FormulaTest
