import React, { Component } from 'react';
import * as local from '../../../Shared/Assets/ar.json';
import PostponeInstallments from './postponeInstallments';
import { timeToDateyyymmdd } from '../../Services/utils.js';

interface Props {
    test: boolean;
    application: any;
}
interface State {
    id: string;
    selectedOption: string;
}
class Rescheduling extends Component<Props, State>{
    mappers: { title: string; key: string; render: (data: any) => any }[]
    constructor(props: Props) {
        super(props);
        this.state = {
            id: '',
            selectedOption: 'postponeInstallment'
        }
        this.mappers = [
            {
                title: local.installmentNumber,
                key: "id",
                render: data => data.id
            },
            {
                title: local.principalInstallment,
                key: "principalInstallment",
                render: data => data.principalInstallment
            },
            {
                title: local.feesInstallment,
                key: "feesInstallment",
                render: data => data.feesInstallment
            },
            {
                title: local.installmentResponse,
                key: "installmentResponse",
                render: data => data.installmentResponse
            },
            {
                title: local.dateOfPayment,
                key: "dateOfPayment",
                render: data => timeToDateyyymmdd(data.dateOfPayment)
            },
            {
                title: local.loanStatus,
                key: "loanStatus",
                render: data => data.status
            },
        ]
    }
    handleOptionChange = (changeEvent) => {
        this.setState({
          selectedOption: changeEvent.target.value
        });
    }
    renderContent(){
        switch (this.state.selectedOption){
            case "postponeInstallment":
                return <PostponeInstallments application={this.props.application} test={this.props.test} />
            default:
                return <PostponeInstallments application={this.props.application} test={this.props.test} />
        }
    }
    render() {
        return (
            <>
                <div className="d-flex justify-content-center" style={{ marginBottom: 20 }}>
                        <label className='radio-item'>
                            <input type="radio" value="postponeInstallment" onChange={this.handleOptionChange} checked={this.state.selectedOption === 'postponeInstallment'} />
                            <span className="checkmark"></span>
                            {local.postponeInstallments}
                        </label>
                        <label className='radio-item'>
                            <input type="radio" value="traditionalRescheduling" onChange={this.handleOptionChange} checked={this.state.selectedOption === 'traditionalRescheduling'} disabled />
                            <span className="checkmark"></span>
                            {local.traditionalRescheduling}
                        </label>
                        <label className='radio-item'>
                            <input type="radio" value="freeRescheduling" onChange={this.handleOptionChange} checked={this.state.selectedOption === 'freeRescheduling'} disabled />
                            <span className="checkmark"></span>
                            {local.freeRescheduling}
                        </label>
                </div>
                {this.renderContent()}
            </>
        )
    }
}
export default Rescheduling;