import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { Customer } from '../CustomerCreation/customer-creation';
import * as local from '../../../Shared/Assets/ar.json';
import { getRenderDate } from '../../Services/getRenderDate';
interface Props {
    source: string;
    searchResults: Array<object>;
    handleSearch: Function;
    selectCustomer: Function;
    selectedGuarantor?: Customer;
    style?: object;
};

interface State {
    searchKey: string;
}
class CustomerSearch extends Component<Props, State>{
    constructor(props: Props) {
        super(props);
        this.state = {
            searchKey: ''
        }
    }
    handleSearchChange(event) {
        const fleldVal = event.target.value;
        this.setState({
            searchKey: fleldVal
        })
    }
    _handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            this.handleSubmit(event)
        }
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.handleSearch(this.state.searchKey)
    };
    render() {
        return (
            <div style={{ justifyContent: 'center', alignItems: 'flex-start', display: 'flex', flexDirection: 'column',...this.props.style }}>

                {(!this.props.selectedGuarantor || Object.keys(this.props.selectedGuarantor).length === 0) && <div style={{ width: '100%' }}>
                    <div style={{ width: '100%', justifyContent: 'flex-start', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <p>Search Customer</p>
                        <input
                            type="text"
                            name="searchKey"
                            data-qc="searchKey"
                            value={this.state.searchKey}
                            onChange={(e) => this.handleSearchChange(e)}
                            onKeyDown={this._handleKeyDown}
                            style={{ width: '50%' }}
                        />
                        <Button type="button" onClick={this.handleSubmit} style={{ margin: 10 }}>{local.submit}</Button>
                    </div>
                </div>}
                {(!this.props.selectedGuarantor || Object.keys(this.props.selectedGuarantor).length === 0) && this.props.searchResults && this.props.searchResults.length > 0 && <div>
                    {this.props.searchResults.map((element: any) => {
                        return (
                            <p key={element.id} onClick={() => this.props.selectCustomer(element)}>{element.customerInfo.customerName}</p>
                        )
                    }
                    )}
                </div>
                }
                {this.props.selectedGuarantor && Object.keys(this.props.selectedGuarantor).length > 0 && this.props.searchResults && this.props.searchResults.length > 0 && <div style={{ textAlign: 'right' }}>
                    <h5>{local.guarantor + this.props.source}</h5>
                    <div className="d-flex flex-row">
                        <p>{local.name}</p>
                        <p style={{ margin:'0 10px 0 0'}}>{this.props.selectedGuarantor.customerInfo.customerName}</p>
                    </div>
                    <div className="d-flex flex-row">
                        <p>{local.nationalId}</p>
                        <p style={{ margin:'0 10px 0 0'}}>{this.props.selectedGuarantor.customerInfo.nationalId}</p>
                    </div>
                    <div className="d-flex flex-row">
                        <p>{local.birthDate}</p>
                        <p style={{ margin:'0 10px 0 0'}}>{getRenderDate(this.props.selectedGuarantor.customerInfo.birthDate)}</p>
                    </div>
                    <div className="d-flex flex-row">
                        <p>{local.nationalIdIssueDate}</p>
                        <p style={{ margin:'0 10px 0 0'}}>{getRenderDate(this.props.selectedGuarantor.customerInfo.nationalIdIssueDate)}</p>
                    </div>
                    <div className="d-flex flex-row">
                        <p>{local.customerHomeAddress}</p>
                        <p style={{ width:'60%', margin:'0 10px 0 0', wordBreak: 'break-all' }}>{this.props.selectedGuarantor.customerInfo.customerHomeAddress}</p>
                    </div>
                </div>
                }
            </div>
        )
    }
}
export default CustomerSearch