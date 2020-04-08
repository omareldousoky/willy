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
}
interface State {
  loanUses: Array<LoanUse>;
  loading: boolean;
}
class LoanUses extends Component<{}, State> {
  constructor(props) {
    super(props);
    this.state = {
      loanUses: [
        {
          name: "loan use 1",
          disabled: true,
        },
        {
          name: "loan use 2",
          disabled: true,
        },
        {
          name: "loan use 3",
          disabled: true,

        },
      ],
      loading: false,
    }
  }
  async componentDidMount() {
    this.setState({ loading: true });
    const res = await getLoanUsage();
    if (res.status === "success") {
      this.setState({ loading: false });
      console.log(res);
    } else {
      this.setState({ loading: false });
    }
  }
  addLoanUse() {
    this.setState({
      loanUses: [...this.state.loanUses, { name: "", disabled: false }]
    })
  }
  handleChangeInput(event: React.FormEvent<HTMLInputElement>, index: number) {
    this.setState({
      loanUses: this.state.loanUses.map((loanUse, loanUseIndex) => loanUseIndex === index ? { ...loanUse, name: event.currentTarget.value } : loanUse)
    })
  }
  handleKeyDown(event: React.KeyboardEvent, index: number) {
    if (event.key === 'Enter') {
      this.toggleClick(index)
    }
  }
  toggleClick(index: number) {
    if (this.state.loanUses[index].disabled === false) {
      this.setState({
        // loanUses: this.state.loanUses.map((loanUse, loanUseIndex) => loanUseIndex === index ? { ...loanUse, loading: true } : loanUse)
        loading: true,
      })
    }
    this.setState({
      loanUses: this.state.loanUses.map((loanUse, loanUseIndex) => loanUseIndex === index ? { ...loanUse, disabled: !loanUse.disabled } : loanUse),
      loading: false,
    })
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
                  onClick={() => this.toggleClick(index)}
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