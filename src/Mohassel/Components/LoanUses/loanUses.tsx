import React, { Component } from 'react';
import { Loader } from '../../../Shared/Components/Loader';
import { getLoanUsage } from '../../Services/APIs/LoanUsage/getLoanUsage';
import { addLoanUsage } from '../../Services/APIs/LoanUsage/addLoanUsage';
import { updateLoanUsage } from '../../Services/APIs/LoanUsage/updateLoanUsage';
import * as local from '../../../Shared/Assets/ar.json';
import HeaderWithCards from '../HeaderWithCards/headerWithCards';
import { manageLoanDetailsArray } from '../ManageLoanDetails/manageLoanDetailsInitials';
import Swal from 'sweetalert2';
import { getErrorMessage } from '../../../Shared/Services/utils';
import {CRUDList} from '../CRUDList/crudList';

interface LoanUse {
  name: string;
  disabledUi: boolean;
  id: string;
  activated: boolean;
}
interface State {
  loanUses: Array<LoanUse>;
  loading: boolean;
}
class LoanUses extends Component<{}, State> {
  constructor(props) {
    super(props);
    this.state = {
      loanUses: [],
      loading: false
    }
  }
  async componentDidMount() {
    await this.getUses();
  }

  async getUses() {
    this.setState({ loading: true });
    const res = await getLoanUsage();
    if (res.status === "success") {
      const responseLoanUsages = res.body.usages.map(usage => ({ ...usage, disabledUi: true }));
      this.setState({
        loading: false,
        loanUses: responseLoanUsages.reverse(),
      });
    } else {
      this.setState({ loading: false }, () => Swal.fire("Error !", getErrorMessage(res.error.error), 'error'));
    }
  }
  async editLoanUse(id, name, active, index) {
    this.setState({ loading: true })
    const res = await updateLoanUsage(id, name, active);
    if (res.status === "success") {
      this.setState({
        loading: false,
      }, () => this.getUses())
    } else this.setState({ loading: false }, () => Swal.fire("Error !", getErrorMessage(res.error.error), 'error'))
  }
  async newLoanUse(name, activated, index) {
    this.setState({ loading: true })
    const res = await addLoanUsage({ name: name, activated: activated });
    if (res.status === "success") {
      this.setState({
        loading: false,
      }, () => this.getUses())
    } else this.setState({ loading: false }, () => Swal.fire("Error !", getErrorMessage(res.error.error), 'error'))
  }
  render() {
    const array = manageLoanDetailsArray();
    return (
      <>
        <Loader type="fullscreen" open={this.state.loading} />
        <HeaderWithCards
          header={local.loanUses}
          array={array}
          active={array.map(item => { return item.icon }).indexOf('loanUses')}
        />
        <CRUDList source={'loanUses'} options={this.state.loanUses}
          newOption={(name, active, index) => { this.newLoanUse(name, active, index) }}
          updateOption={(id, name, active, index) => { this.editLoanUse(id, name, active, index) }} />
      </>
    );
  }
}

export default LoanUses;