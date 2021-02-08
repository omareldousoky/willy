import React, { Component } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { Loader } from '../../../Shared/Components/Loader';
import { getLoanUsage } from '../../Services/APIs/LoanUsage/getLoanUsage';
import { addLoanUsage } from '../../Services/APIs/LoanUsage/addLoanUsage';
import { updateLoanUsage } from '../../Services/APIs/LoanUsage/updateLoanUsage';
import * as local from '../../../Shared/Assets/ar.json';
import HeaderWithCards from '../HeaderWithCards/headerWithCards';
import { manageLoanDetailsArray } from '../ManageLoanDetails/manageLoanDetailsInitials';
import Swal from 'sweetalert2';
import { getErrorMessage } from '../../../Shared/Services/utils';
import CRUDList from '../CRUDList/crudList';

interface LoanUse {
  name: string;
  disabledUi: boolean;
  id: string;
  activated: boolean;
}
interface State {
  loanUses: Array<LoanUse>;
  loading: boolean;
  filterLoanUsage: string;
  temp: Array<string>;
}
class LoanUses extends Component<{}, State> {
  constructor(props) {
    super(props);
    this.state = {
      loanUses: [],
      loading: false,
      filterLoanUsage: '',
      temp: []
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
        loanUses: responseLoanUsages,
        temp: res.body.usages.map(usage => usage.name)
      });
    } else {
      this.setState({ loading: false }, () => Swal.fire("Error !", getErrorMessage(res.error.error), 'error'));
    }
  }
  // addLoanUse() {
  //   if (!this.state.loanUses.some(loanUse => loanUse.name === "")) {
  //     this.setState({
  //       filterLoanUsage: '',
  //       loanUses: [...this.state.loanUses, { name: "", disabledUi: false, id: "", activated: true }],
  //       temp: [...this.state.temp, '']
  //     })
  //   }
  // }
  // handleChangeInput(event: React.ChangeEvent<HTMLInputElement>, index: number) {
  //   this.setState({
  //     loanUses: this.state.loanUses.map((loanUse, loanUseIndex) => loanUseIndex === index ? { ...loanUse, name: event.currentTarget.value } : loanUse)
  //   })
  // }
  // handleKeyDown(event: React.KeyboardEvent, index: number) {
  //   if (event.key === 'Enter') {
  //     this.toggleClick(index, true)
  //   }
  // }
  // async toggleClick(index: number, submit: boolean) {
  //   if (this.state.loanUses[index].disabledUi === false && this.state.loanUses[index].name.trim() !== "") {
  //     if (this.state.loanUses[index].id === "") {
  //       //New 

  //     } else {
  //       //Edit 

  //     }
  //   } else if (!submit) {
  //     this.setState({
  //       loanUses: this.state.loanUses.map((loanUse, loanUseIndex) => loanUseIndex === index ? { ...loanUse, disabledUi: !loanUse.disabledUi } : loanUse)
  //     })
  //   }
  // }
  async editLoanUse(id, name, active, index) {
    this.setState({ loading: true })
    const res = await updateLoanUsage(id, name, active);
    if (res.status === "success") {
      const options = this.state.loanUses;
      options[index].disabledUi = !options[index].disabledUi;
      this.setState({
        loanUses: options,
        loading: false,
      }, () => this.getUses())
    } else this.setState({ loading: false }, () => Swal.fire("Error !", getErrorMessage(res.error.error), 'error'))
  }
  async newLoanUse(name, activated, index) {
    this.setState({ loading: true })
    const res = await addLoanUsage({ name: name, activated: activated });
    if (res.status === "success") {
      const options = this.state.loanUses;
      options[index].disabledUi = !options[index].disabledUi;
      this.setState({
        loanUses: options,
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
          addOption={() => {
            console.log('addrow')
            this.setState({
              loanUses: [...this.state.loanUses, { name: "", disabledUi: false, id: "", activated: true }],
            })
          }}
          newOption={(name, active, index) => { this.newLoanUse(name, active, index) }}
          updateOption={(id, name, active, index) => { this.editLoanUse(id, name, active, index) }} />
        {/* <Container style={{ marginTop: 20 }}>
          <div style={{ display: 'flex', textAlign: 'center', justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
            <Form.Control
              type="text"
              data-qc="filterLoanUsage"
              placeholder={local.search}
              maxLength={100}
              value={this.state.filterLoanUsage}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ filterLoanUsage: e.currentTarget.value })}
            />
            <span
              onClick={() => this.addLoanUse()}
              className="fa fa-plus fa-lg"
              style={{ margin: '0px 20px', color: '#7dc356', cursor: 'pointer' }}
            />
          </div>
          <ListGroup style={{ textAlign: 'right', width: '30%', marginBottom: 30 }}>
            {this.state.loanUses
              .filter(loanUse => loanUse.name.toLocaleLowerCase().includes(this.state.filterLoanUsage.toLocaleLowerCase()))
              .map((loanUse, index) => {
                return (
                  <ListGroup.Item key={index} style={{ display: 'flex', alignItems: 'center' }}>
                    <Form.Group style={{ margin: '0px 0px 0px 20px' }}>
                      <Form.Control
                        type="text"
                        data-qc="loanUsageInput"
                        maxLength={100}
                        title={loanUse.name}
                        value={loanUse.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.handleChangeInput(e, index)}
                        onKeyDown={(e: React.KeyboardEvent) => this.handleKeyDown(e, index)}
                        disabled={loanUse.disabledUi}
                        style={loanUse.disabledUi ? { background: 'none', border: 'none' } : {}}
                        isInvalid={this.state.loanUses[index].name.trim() === ""}
                      />
                      <Form.Control.Feedback type="invalid">
                        {local.required}
                      </Form.Control.Feedback>
                    </Form.Group>
                    {loanUse.disabledUi ?
                      <span
                        style={loanUse.activated ? { color: '#7dc356', marginLeft: 20 } : { color: '#d51b1b', marginLeft: 20 }}
                        className={loanUse.activated ? "fa fa-check-circle fa-lg" : "fa fa-times-circle fa-lg"} />
                      :
                      <>
                        <Form.Check
                          type="checkbox"
                          data-qc={`activate${index}`}
                          label={local.active}
                          className="checkbox-label"
                          checked={this.state.loanUses[index].activated}
                          onChange={() => this.setState({ loanUses: this.state.loanUses.map((loanUse, loanUseIndex) => loanUseIndex === index ? { ...loanUse, activated: !this.state.loanUses[index].activated } : loanUse) })}
                        />
                        <span className="fa fa-undo fa-lg"
                          style={{ color: '#7dc356', cursor: 'pointer', marginLeft: 20 }}
                          onClick={() => this.state.temp[index] !== '' ? this.setState({ loanUses: this.state.loanUses.map((loanUse, loanUseIndex) => loanUseIndex === index ? { ...loanUse, name: this.state.temp[index], disabledUi: true } : loanUse) }) : this.setState({ loanUses: this.state.loanUses.filter(loanItem => loanItem.id !== "") })}
                        />
                      </>
                    }
                    <span
                      onClick={() => loanUse.disabledUi ? this.toggleClick(index, false) : this.toggleClick(index, true)}
                      style={{ color: '#7dc356', cursor: 'pointer', marginLeft: 20 }}
                      data-qc="editSaveIcon"
                      className={loanUse.disabledUi ? "fa fa-edit fa-lg" : "fa fa-save fa-lg"} />
                  </ListGroup.Item>
                )
              }).reverse()}
          </ListGroup>
        </Container> */}
      </>
    );
  }
}

export default LoanUses;