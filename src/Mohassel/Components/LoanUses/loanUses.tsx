import React, { Component } from 'react'
import Swal from 'sweetalert2'
import { Loader } from '../../../Shared/Components/Loader'
import * as local from '../../../Shared/Assets/ar.json'
import HeaderWithCards from '../../../Shared/Components/HeaderWithCards/headerWithCards'
import { manageLoanDetailsArray } from '../ManageLoanDetails/manageLoanDetailsInitials'
import { getErrorMessage } from '../../../Shared/Services/utils'
import { CRUDList } from '../../../Shared/Components/CRUDList/crudList'
import { getLoanUsage } from '../../../Shared/Services/APIs/LoanUsage/getLoanUsage'
import { updateLoanUsage } from '../../../Shared/Services/APIs/LoanUsage/updateLoanUsage'
import { addLoanUsage } from '../../../Shared/Services/APIs/LoanUsage/addLoanUsage'

interface LoanUse {
  name: string
  disabledUi: boolean
  id: string
  activated: boolean
}
interface State {
  loanUses: Array<LoanUse>
  loading: boolean
}
class LoanUses extends Component<{}, State> {
  constructor(props) {
    super(props)
    this.state = {
      loanUses: [],
      loading: false,
    }
  }

  async componentDidMount() {
    await this.getUses()
  }

  async getUses() {
    this.setState({ loading: true })
    const res = await getLoanUsage()
    if (res.status === 'success') {
      const responseLoanUsages = res.body.usages.map((usage) => ({
        ...usage,
        disabledUi: true,
      }))
      this.setState({
        loading: false,
        loanUses: responseLoanUsages.reverse(),
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

  async editLoanUse(id, name, active) {
    this.setState({ loading: true })
    const res = await updateLoanUsage(id, name, active)
    if (res.status === 'success') {
      this.setState(
        {
          loading: false,
        },
        () => this.getUses()
      )
    } else
      this.setState({ loading: false }, () =>
        Swal.fire({
          title: local.errorTitle,
          text: getErrorMessage(res.error.error),
          icon: 'error',
          confirmButtonText: local.confirmationText,
        })
      )
  }

  async newLoanUse(name, activated) {
    this.setState({ loading: true })
    const res = await addLoanUsage({ name, activated })
    if (res.status === 'success') {
      this.setState(
        {
          loading: false,
        },
        () => this.getUses()
      )
    } else
      this.setState({ loading: false }, () =>
        Swal.fire({
          title: local.errorTitle,
          text: getErrorMessage(res.error.error),
          icon: 'error',
          confirmButtonText: local.confirmationText,
        })
      )
  }

  render() {
    const array = manageLoanDetailsArray()
    return (
      <>
        <Loader type="fullscreen" open={this.state.loading} />
        <HeaderWithCards
          header={local.loanUses}
          array={array}
          active={array
            .map((item) => {
              return item.icon
            })
            .indexOf('loan-uses')}
        />
        <CRUDList
          source="loanUses"
          options={this.state.loanUses}
          newOption={(name, active) => {
            this.newLoanUse(name, active)
          }}
          updateOption={(id, name, active) => {
            this.editLoanUse(id, name, active)
          }}
          canCreate
          canEdit
        />
      </>
    )
  }
}

export default LoanUses
