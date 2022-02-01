import React, { Component } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Swal from 'sweetalert2'
import Table from 'react-bootstrap/Table'
import { Loader } from '../../../Shared/Components/Loader'
import local from '../../../Shared/Assets/ar.json'
import BackButton from '../../../Shared/Components/BackButton/back-button'
import {
  loanNature,
  currency,
  periodType,
  interestPeriod,
  inAdvanceFrom,
  inAdvanceType,
  getErrorMessage,
} from '../../../Shared/Services/utils'
import { getProduct } from '../../../Shared/Services/APIs/loanProduct/getProduct'

interface State {
  product: any
  loading: boolean
}

class ViewProduct extends Component<
  RouteComponentProps<{}, {}, { id: string }>,
  State
> {
  constructor(props: RouteComponentProps<{}, {}, { id: string }>) {
    super(props)
    this.state = {
      product: {},
      loading: false,
    }
  }

  componentDidMount() {
    const { id } = this.props.location.state
    this.getFomula(id)
  }

  async getFomula(id: string) {
    this.setState({ loading: true })
    const product = await getProduct(id)
    if (product.status === 'success') {
      this.setState({
        product: product.body.data,
        loading: false,
      })
    } else {
      Swal.fire({
        title: local.errorTitle,
        confirmButtonText: local.confirmationText,
        text: getErrorMessage(product.error.error),
        icon: 'error',
      })
      this.setState({ loading: false })
    }
  }

  render() {
    return (
      <>
        <BackButton title={local.productName} />
        <Container>
          <Loader type="fullscreen" open={this.state.loading} />
          {Object.keys(this.state.product).length > 0 && (
            <div>
              <Table striped bordered style={{ textAlign: 'right' }}>
                <tbody>
                  <tr>
                    <td>{local.productName}</td>
                    <td>{this.state.product.productName}</td>
                  </tr>
                  <tr>
                    <td>{local.calculationFormulaId}</td>
                    <td>{this.state.product.calculationFormula.name}</td>
                  </tr>
                  <tr>
                    <td>{local.loanNature}</td>
                    <td>{loanNature(this.state.product.loanNature)}</td>
                  </tr>
                  <tr>
                    <td>{local.currency}</td>
                    <td>{currency(this.state.product.currency)}</td>
                  </tr>
                  <tr>
                    <td>{local.periodLengthEvery}</td>
                    <td>
                      {this.state.product.periodLength}
                      {periodType(this.state.product.periodType)}
                    </td>
                  </tr>
                  <tr>
                    <td>{local.noOfInstallments}</td>
                    <td>{this.state.product.noOfInstallments}</td>
                  </tr>
                  <tr>
                    <td>{local.lateDays}</td>
                    <td>{this.state.product.lateDays}</td>
                  </tr>
                  <tr>
                    <td>{local.gracePeriod}</td>
                    <td>{this.state.product.gracePeriod}</td>
                  </tr>
                  <tr>
                    <td>{local.interest}</td>
                    <td>
                      {this.state.product.interest}%
                      {interestPeriod(this.state.product.interestPeriod)}
                    </td>
                  </tr>
                  <tr>
                    <td>{local.allowInterestAdjustment}</td>
                    <td>
                      {this.state.product.allowInterestAdjustment
                        ? local.yes
                        : local.no}
                    </td>
                  </tr>
                  <tr>
                    <td>{local.inAdvanceFees}</td>
                    <td>
                      {this.state.product.inAdvanceFees}
                      {inAdvanceFrom(this.state.product.inAdvanceFrom)}
                    </td>
                  </tr>
                  <tr>
                    <td>{local.inAdvanceType}</td>
                    <td> {inAdvanceType(this.state.product.inAdvanceType)}</td>
                  </tr>
                  <tr>
                    <td>{local.stamps}</td>
                    <td>{this.state.product.stamps}</td>
                  </tr>
                  <tr>
                    <td>{local.allowStampsAdjustment}</td>
                    <td>
                      {this.state.product.allowStampsAdjustment
                        ? local.yes
                        : local.no}
                    </td>
                  </tr>
                  <tr>
                    <td>{local.representativeFees}</td>
                    <td>{this.state.product.representativeFees}</td>
                  </tr>
                  <tr>
                    <td>{local.allowRepresentativeFeesAdjustment}</td>
                    <td>
                      {this.state.product.allowRepresentativeFeesAdjustment
                        ? local.yes
                        : local.no}
                    </td>
                  </tr>
                  <tr>
                    <td>{local.adminFees}</td>
                    <td>{this.state.product.adminFees}</td>
                  </tr>
                  <tr>
                    <td>{local.allowAdminFeesAdjustment}</td>
                    <td>
                      {this.state.product.allowAdminFeesAdjustment
                        ? local.yes
                        : local.no}
                    </td>
                  </tr>
                  <tr>
                    <td>{local.earlyPaymentFees}</td>
                    <td>{this.state.product.earlyPaymentFees}</td>
                  </tr>
                  <tr>
                    <td>{local.maxNoOfRestructuring}</td>
                    <td>{this.state.product.maxNoOfRestructuring}</td>
                  </tr>
                  <tr>
                    <td>{local.minPrincipal}</td>
                    <td>{this.state.product.minPrincipal}</td>
                  </tr>
                  <tr>
                    <td>{local.maxPrincipal}</td>
                    <td>{this.state.product.maxPrincipal}</td>
                  </tr>
                  <tr>
                    <td>{local.minInstallment}</td>
                    <td>{this.state.product.minInstallment}</td>
                  </tr>
                  <tr>
                    <td>{local.maxInstallment}</td>
                    <td>{this.state.product.maxInstallment}</td>
                  </tr>
                  {this.state.product.beneficiaryType === 'individual' && (
                    <>
                      <tr>
                        <td>{local.applicationFee}</td>
                        <td>{this.state.product.applicationFee}</td>
                      </tr>
                      <tr>
                        <td>{local.applicationFeePercent}</td>
                        <td>
                          {this.state.product.applicationFeePercent}%
                          {inAdvanceFrom(this.state.product.applicationFeeType)}
                        </td>
                      </tr>
                    </>
                  )}
                  {this.state.product.beneficiaryType === 'group' && (
                    <>
                      <tr>
                        <td>{local.individualApplicationFee}</td>
                        <td>{this.state.product.individualApplicationFee}</td>
                      </tr>
                      <tr>
                        <td>{local.applicationFeePercentPerPerson}</td>
                        <td>
                          {this.state.product.applicationFeePercentPerPerson}%
                          {inAdvanceFrom(
                            this.state.product
                              .applicationFeePercentPerPersonType
                          )}
                        </td>
                      </tr>
                    </>
                  )}
                  <tr>
                    <td>{local.allowApplicationFeeAdjustment}</td>
                    <td>
                      {this.state.product.allowApplicationFeeAdjustment
                        ? local.yes
                        : local.no}
                    </td>
                  </tr>
                  {/* <tr>
                    <td>{local.spreadApplicationFee}</td>
                    <td>
                      {this.state.product.spreadApplicationFee
                        ? local.yes
                        : local.no}
                    </td>
                  </tr> */}
                  <tr>
                    <td>{local.loanImpactPrincipal}</td>
                    <td>
                      {this.state.product.loanImpactPrincipal
                        ? local.yes
                        : local.no}
                    </td>
                  </tr>
                  {this.state.product.beneficiaryType !== 'group' && (
                    <>
                      <tr>
                        <td>{local.mustEnterGuarantor}</td>
                        <td>
                          {this.state.product.mustEnterGuarantor
                            ? local.yes
                            : local.no}
                        </td>
                      </tr>
                      {this.state.product.mustEnterGuarantor && (
                        <>
                          <tr>
                            <td>{local.noOfGuarantors}</td>
                            <td>{this.state.product.noOfGuarantors}</td>
                          </tr>
                        </>
                      )}
                    </>
                  )}
                </tbody>
              </Table>
            </div>
          )}
        </Container>
      </>
    )
  }
}
export default withRouter(ViewProduct)
