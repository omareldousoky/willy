import React, { Component } from 'react';
import { nationalIdValidation } from '../Services/nationalIdValidation';

interface Props { 
    gender: string;

};
interface State {
    nationalIdNumber: string;
    birthDate: string;
    country: string;
    gender: string;
}

class CustomerCreation extends Component<Props, State>{
    constructor(props: Props) {
        super(props);
        this.state = {
            nationalIdNumber: '29105310101678',
            birthDate: '1991-05-31',
            country: 'eg',
            gender: '',
        }
    }
    handleChange(e: React.FormEvent<HTMLInputElement> | React.FormEvent<HTMLSelectElement>) {
        const { name, value } = e.currentTarget;
        this.setState({ [name]: value } as any ,() => console.log(this.state))
    }
    checkValidity() {
        console.log(nationalIdValidation(this.state.nationalIdNumber, this.state.birthDate, this.state.country, this.state.gender))
    }
    render() {
        return (
            <div>
                <input maxLength={14} placeholder="National Id Number" type="text" name="nationalIdNumber" value={this.state.nationalIdNumber} onChange={(e) => this.handleChange(e)}></input>
                <input type="date" name="birthDate" value={this.state.birthDate} onChange={(e) => this.handleChange(e)}></input>
                <select name="gender" value={this.state.gender} onChange={(e) => this.handleChange(e)}>
                    <option value="" disabled></option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>

                <button onClick={() => this.checkValidity()}>check validity</button>
            </div>
        )
    }
}

export default CustomerCreation;