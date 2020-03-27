import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { Customer } from '../CustomerCreation/customer-creation';
import * as local from '../../../Shared/Assets/ar.json';
interface Props {
    source: string;
    searchResults: Array<object>;
    handleSearch: Function;
    selectCustomer: Function;
    selectedGuarantor?: Customer;
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
            <div style={{ justifyContent: 'center', alignItems: 'flex-start', display: 'flex', flexDirection: 'column' }}>

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
                {this.props.selectedGuarantor && Object.keys(this.props.selectedGuarantor).length > 0 && this.props.searchResults && this.props.searchResults.length > 0 && <div>
                    <h1>{this.props.source}</h1>
                    <p>{this.props.selectedGuarantor.customerInfo.customerName}</p>
                    <p>{this.props.selectedGuarantor.customerInfo.nationalId}</p>
                    <p>{new Date(this.props.selectedGuarantor.customerInfo.birthDate).toISOString()}</p>
                    <p>{new Date(this.props.selectedGuarantor.customerInfo.nationalIdIssueDate).toISOString()}</p>
                    <p>{this.props.selectedGuarantor.customerInfo.customerHomeAddress}</p>
                </div>
                }
            </div>
        )
    }
}
export default CustomerSearch