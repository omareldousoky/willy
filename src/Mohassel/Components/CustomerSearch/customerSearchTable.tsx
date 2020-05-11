import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import * as local from '../../../Shared/Assets/ar.json';
import { getRenderDate } from '../../Services/getRenderDate';
import Swal from 'sweetalert2';
interface Customer {
    birthDate?: any;
    customerName?: string;
    nationalIdIssueDate?: any;
    homePostalCode?: number;
    nationalId?: string;
    homeAddress?: string;
    customerAddressLatLong?: string;
    customerAddressLatLongNumber?: {
        lat: number;
        lng: number;
    };
    businessAddressLatLong?: string;
    businessAddressLatLongNumber?: {
        lat: number;
        lng: number;
    };
    businessPostalCode?: any;
    businessLicenseIssueDate?: any;
    applicationDate?: any;
    permanentEmployeeCount?: any;
    partTimeEmployeeCount?: any;
    customerID?: string;
    customerCode?: string;
    gender?: string;
    businessSector?: string;
    businessActivity?: string;
    businessSpeciality?: string;
}
interface Results {
    results: Array<object>;
    empty: boolean;
}
interface Props {
    source: string;
    searchResults: Results;
    handleSearch: Function;
    selectCustomer: Function;
    removeCustomer?: Function;
    selectedCustomer: Customer;
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
        if (this.state.searchKey.trim().length > 0) {
            this.props.handleSearch(this.state.searchKey)
        } else {
            Swal.fire("", "please enter query", "error");
        }
    };
    render() {
        return (
            <div style={{ justifyContent: 'center', alignItems: 'flex-start', display: 'flex', flexDirection: 'column', ...this.props.style }}>

                {(!this.props.selectedCustomer || Object.keys(this.props.selectedCustomer).length === 0) && <div style={{ width: '100%' }}>
                    <div style={{ width: '100%', justifyContent: 'flex-start', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <p style={{ margin: 'auto 20px' }}>{local.search}</p>
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
                {(!this.props.selectedCustomer || Object.keys(this.props.selectedCustomer).length === 0) && this.props.searchResults.results.length > 0 && <div
                    style={{ width: '50%', height: '200px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', textAlign: 'right', overflow: 'scroll', padding: 10 }}>
                    {this.props.searchResults.results.map((element: any) =>
                        <div style={{ width: '100%', borderBottom: '0.5px solid black', cursor: 'all-scroll' }} key={element._id} onClick={() => this.props.selectCustomer(element)}>
                            <p>{element.customerName}</p>
                        </div>
                    )}
                </div>
                }
                {(!this.props.selectedCustomer || Object.keys(this.props.selectedCustomer).length === 0) && this.props.searchResults.results.length === 0 && this.props.searchResults.empty && <div className="d-flex flex-row justify-content-center align-items-center" style={{ width: '50%' }}><h4>No results</h4></div>}
                {this.props.selectedCustomer && Object.keys(this.props.selectedCustomer).length > 0 && <div style={{ textAlign: 'right', width: '100%' }}>
                    <div className="d-flex flex-row justify-content-between">
                        <h5>{local.guarantor + ` ` + this.props.source}</h5>
                        <Button onClick={() => this.props.removeCustomer && this.props.removeCustomer(this.props.selectedCustomer)}>x</Button>
                    </div>
                    <div className="d-flex flex-row">
                        <p>{local.name}</p>
                        <p style={{ margin: '0 10px 0 0' }}>{this.props.selectedCustomer.customerName}</p>
                    </div>
                    <div className="d-flex flex-row">
                        <p>{local.nationalId}</p>
                        <p style={{ margin: '0 10px 0 0' }}>{this.props.selectedCustomer.nationalId}</p>
                    </div>
                    <div className="d-flex flex-row">
                        <p>{local.birthDate}</p>
                        <p style={{ margin: '0 10px 0 0' }}>{getRenderDate(this.props.selectedCustomer.birthDate)}</p>
                    </div>
                    <div className="d-flex flex-row">
                        <p>{local.nationalIdIssueDate}</p>
                        <p style={{ margin: '0 10px 0 0' }}>{getRenderDate(this.props.selectedCustomer.nationalIdIssueDate)}</p>
                    </div>
                    <div className="d-flex flex-row">
                        <p>{local.customerHomeAddress}</p>
                        <p style={{ width: '60%', margin: '0 10px 0 0', wordBreak: 'break-all' }}>{this.props.selectedCustomer.homeAddress}</p>
                    </div>
                </div>
                }
            </div>
        )
    }
}
export default CustomerSearch