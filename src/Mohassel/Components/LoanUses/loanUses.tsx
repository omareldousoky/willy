import React, {Component} from 'react';

interface State {
    loanUses: [];
}
class LoanUses extends Component <{}, State> {
    constructor(props) {
        super(props);
        this.state = { 
            loanUses: []
        }
    }
    render(){
        return(<h1>hi</h1>)
    }
}

export default LoanUses;