import React, { Component } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import { Loader } from '../../../Shared/Components/Loader';
import { getLoanUsage } from '../../Services/APIs/LoanUsage/getLoanUsage';
import { addLoanUsage } from '../../Services/APIs/LoanUsage/addLoanUsage';
import { updateLoanUsage } from '../../Services/APIs/LoanUsage/updateLoanUsage';
import * as local from '../../../Shared/Assets/ar.json';

interface LoanUse {
  name: string;
  disabled: boolean;
  id: string;
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
      loading: false,
    }
  }
  async componentDidMount() {
    // this.setState({ loading: true });
    const res = await getLoanUsage();
    if (res.status === "success") {
      const responseLoanUsages = res.body.usages.map(usage => ({ ...usage, disabled: true }));
      this.setState({
        loading: false,
        loanUses: responseLoanUsages
      });
    } else {
      this.setState({ loading: false });
    }
  }
  addLoanUse() {
    this.setState({
      loanUses: [...this.state.loanUses, { name: "", disabled: false, id: "" }]
    })
  }
  handleChangeInput(event: React.FormEvent<HTMLInputElement>, index: number) {
    this.setState({
      loanUses: this.state.loanUses.map((loanUse, loanUseIndex) => loanUseIndex === index ? { ...loanUse, name: event.currentTarget.value } : loanUse)
    })
  }
  handleKeyDown(event: React.KeyboardEvent, index: number) {
    if (event.key === 'Enter') {
      this.toggleClick(index, true)
    }
  }
  async toggleClick(index: number, submit: boolean) {
    if (this.state.loanUses[index].disabled === false) {
      if (this.state.loanUses[index].id === "") {
        //New 
        this.setState({ loading: true })
        const res = await addLoanUsage({ name: this.state.loanUses[index].name });
        if (res.status === "success") {
          this.setState({
            loanUses: this.state.loanUses.map((loanUse, loanUseIndex) => loanUseIndex === index ? { ...loanUse, disabled: !loanUse.disabled } : loanUse),
            loading: false,
          })
        } else this.setState({ loading: false })
      } else {
        //Edit 
        this.setState({ loading: true })
        const res = await updateLoanUsage(this.state.loanUses[index].id, this.state.loanUses[index].name);
        if (res.status === "success") {
          this.setState({
            loanUses: this.state.loanUses.map((loanUse, loanUseIndex) => loanUseIndex === index ? { ...loanUse, disabled: !loanUse.disabled } : loanUse),
            loading: false,
          })
        } else this.setState({ loading: false })
      }
    } else if (!submit) {
      this.setState({
        loanUses: this.state.loanUses.map((loanUse, loanUseIndex) => loanUseIndex === index ? { ...loanUse, disabled: !loanUse.disabled } : loanUse)
      })
    }
  }
  render() {
    return (
      <Container style={{ marginTop: 20 }}>
        <div style={{ display: 'flex', textAlign: 'center' }}>
          <h4 style={{ textAlign: 'right' }}>{local.loanUses}</h4>
          <span
            onClick={() => this.addLoanUse()}
            className="fa fa-plus fa-lg"
            style={{ margin: 'auto 20px', color: '#7dc356', cursor: 'pointer' }}
          />
        </div>
        <ListGroup style={{ textAlign: 'right', position: 'absolute' }}>
          <Loader type="fullsection" open={this.state.loading} />
          {this.state.loanUses.map((loanUse, index) => {
            return (
              <ListGroup.Item key={index} style={{ display: 'flex', alignItems: 'center' }}>
                <input value={loanUse.name}
                  onChange={(e: React.FormEvent<HTMLInputElement>) => this.handleChangeInput(e, index)}
                  onKeyDown={(e) => this.handleKeyDown(e, index)}
                  disabled={loanUse.disabled}
                  style={loanUse.disabled ? { background: 'none', border: 'none', marginLeft: 20 } : { marginLeft: 20 }} />
                <span
                  onClick={() => this.toggleClick(index, false)}
                  style={{ color: '#7dc356', cursor: 'pointer', marginLeft: 20 }}
                  className={loanUse.disabled ? "fa fa-edit fa-lg" : "fa fa-save fa-lg"} />
              </ListGroup.Item>
            )
          })}
        </ListGroup>
      </Container>
    );
  }
}

export default LoanUses;