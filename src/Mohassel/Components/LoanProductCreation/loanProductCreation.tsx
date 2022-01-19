import React, { Component } from 'react'
import { Formik } from 'formik'
import Container from 'react-bootstrap/Container'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import Swal from 'sweetalert2'
import Card from 'react-bootstrap/Card'
import { LoanProductValidation } from './loanProductStates'
import { LoanProductCreationForm } from './loanProductCreationForm'
import {
  createProduct,
  editProduct,
} from '../../../Shared/Services/APIs/loanProduct/productCreation'
import { getFormulas } from '../../../Shared/Services/APIs/LoanFormula/getFormulas'
import { getProduct } from '../../../Shared/Services/APIs/loanProduct/getProduct'
import { Loader } from '../../../Shared/Components/Loader'
import * as local from '../../../Shared/Assets/ar.json'
import BackButton from '../../../Shared/Components/BackButton/back-button'
import { getErrorMessage } from '../../../Shared/Services/utils'
import { getMaxPrinciples } from '../../../Shared/Services/APIs/config'

interface Props extends RouteComponentProps<{}, {}, { id: string }> {
  title: string
  edit: boolean
}
interface State {
  product: any
  loading: boolean
  formulas: Array<object>
}
class LoanProductCreation extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      product: {
        productName: '',
        beneficiaryType: 'individual',
        contractType: 'standard',
        calculationFormulaId: '',
        type: 'micro',
        financialLeasing: false,
        loanNature: 'cash',
        currency: 'egp',
        periodLength: 1,
        periodType: 'days',
        noOfInstallments: 1,
        lateDays: 0,
        gracePeriod: 0,
        interest: 0,
        interestPeriod: 'yearly',
        allowInterestAdjustment: false,
        inAdvanceFees: 0,
        inAdvanceFrom: 'principal',
        inAdvanceType: 'uncut',
        stamps: 0,
        allowStampsAdjustment: true,
        representativeFees: 0,
        allowRepresentativeFeesAdjustment: true,
        adminFees: 0,
        allowAdminFeesAdjustment: true,
        earlyPaymentFees: 0,
        maxNoOfRestructuring: 0,
        minPrincipal: 0,
        maxPrincipal: 0,
        minInstallment: 0,
        maxInstallment: 0,
        applicationFee: 0,
        allowApplicationFeeAdjustment: false,
        spreadApplicationFee: false,
        individualApplicationFee: 0,
        applicationFeePercent: 0,
        applicationFeeType: 'principal',
        applicationFeePercentPerPerson: 0,
        applicationFeePercentPerPersonType: 'principal',
        loanImpactPrincipal: true,
        mustEnterGuarantor: false,
        noOfGuarantors: 2,
        deductionFee: 0,
        allocatedDebtForGoodLoans: 0,
        aging: [
          { from: 0, to: 1, fee: 0 },
          { from: 0, to: 1, fee: 0 },
          { from: 0, to: 1, fee: 0 },
          { from: 0, to: 1, fee: 0 },
          { from: 0, to: 1, fee: 0 },
          { from: 0, to: 1, fee: 0 },
          { from: 0, to: 1, fee: 0 },
          { from: 0, to: 1, fee: 0 },
          { from: 0, to: 1, fee: 0 },
        ],
        mergeUndoubtedLoans: false,
        mergeUndoubtedLoansFees: 0,
        mergeDoubtedLoans: false,
        mergeDoubtedLoansFees: 0,
        pushPayment: 0,
        pushDays: [0, 0, 0, 0, 0, 0, 0],
        pushHolidays: 'previous',
        enabled: true,
        viceFieldManagerAndDate: true,
        reviewerChiefAndDate: true,
        branchManagerAndDate: true,
        principals: {
          maxIndividualPrincipal: 0,
          maxGroupIndividualPrincipal: 0,
          maxGroupPrincipal: 0,
        },
      },
      loading: false,
      formulas: [],
    }
  }

  componentDidMount() {
    this.getFormulas()
    if (this.props.edit) {
      this.getProduct().then(() => this.getGlobalPrinciple())
    } else this.getGlobalPrinciple()
  }

  async getGlobalPrinciple() {
    this.setState({ loading: true })
    const princples = await getMaxPrinciples()
    if (princples.status === 'success') {
      const principals = {
        maxIndividualPrincipal: princples.body.maxIndividualPrincipal,
        maxGroupIndividualPrincipal: princples.body.maxGroupIndividualPrincipal,
        maxGroupPrincipal: princples.body.maxGroupPrincipal,
      }
      const { product } = this.state
      product.principals = principals
      this.setState({
        loading: false,
        product,
      })
    } else {
      Swal.fire('error', getErrorMessage(princples.error.error), 'error')
      this.setState({ loading: false })
    }
  }

  async getFormulas() {
    this.setState({ loading: true })
    const formulas = await getFormulas()
    if (formulas.status === 'success') {
      this.setState({
        formulas: formulas.body.data,
        loading: false,
      })
    } else {
      Swal.fire('error', getErrorMessage(formulas.error.error), 'error')
      this.setState({ loading: false })
    }
  }

  async getProduct() {
    const { id } = this.props.location.state
    this.setState({ loading: true })
    const product = await getProduct(id)
    if (product.status === 'success') {
      const calculationFormulaId = product.body.data.calculationFormula._id
      const loanProduct = product.body.data
      loanProduct.calculationFormulaId = calculationFormulaId
      this.setState({
        product: loanProduct,
        loading: false,
      })
    } else {
      Swal.fire('error', getErrorMessage(product.error.error), 'error')
      this.setState({ loading: false })
    }
  }

  submit = async (values: any) => {
    if (this.props.edit) {
      const { id } = this.props.location.state
      this.setState({ loading: true })
      const res = await editProduct(id, values)
      if (res.status === 'success') {
        this.setState({ loading: false })
        Swal.fire('success', local.updateLoanProductPrincipalsSuccess).then(
          () => {
            this.props.history.push('/manage-loans/loan-products')
          }
        )
      } else {
        this.setState({ loading: false })
        Swal.fire('error', getErrorMessage(res.error.error), 'error')
      }
    } else {
      this.setState({ loading: true })
      const obj = { ...values }
      if (obj.mustEnterGuarantor === false) {
        obj.noOfGuarantors = 0
      }
      obj.aging.forEach((entry) => {
        if (entry.new) delete entry.new
      })
      const res = await createProduct(obj)
      if (res.status === 'success') {
        this.setState({ loading: false })
        Swal.fire('success', local.loanProductCreated).then(() => {
          this.props.history.push('/manage-loans/loan-products')
        })
      } else {
        Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
        this.setState({ loading: false })
      }
    }
  }

  cancel() {
    this.props.history.goBack()
  }

  render() {
    return (
      <>
        <BackButton
          title={
            this.props.edit ? local.editLoanProduct : local.createLoanProduct
          }
        />
        <Container>
          <Loader open={this.state.loading} type="fullscreen" />
          <Card>
            <Formik
              enableReinitialize
              initialValues={this.state.product}
              onSubmit={this.submit}
              validationSchema={LoanProductValidation}
              validateOnBlur
              validateOnChange
            >
              {(formikProps) => (
                <LoanProductCreationForm
                  {...formikProps}
                  formulas={this.state.formulas}
                  edit={this.props.edit}
                  cancel={() => this.cancel()}
                />
              )}
            </Formik>
          </Card>
        </Container>
      </>
    )
  }
}
export default withRouter(LoanProductCreation)
