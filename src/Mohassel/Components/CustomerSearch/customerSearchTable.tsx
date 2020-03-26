import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import * as local from '../../../Shared/Assets/ar.json';
interface Props {
    source: string;
    searchResults: Array<object>;
    handleSearch: Function;
    selectCustomer: Function;
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
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.handleSearch(this.state.searchKey)
    };
    render() {
        return (
            <div style={{ justifyContent: 'center', alignItems: 'flex-start', display: 'flex', flexDirection: 'column' }}>

                <form style={{ width: '100%'}} onSubmit={this.handleSubmit}>
                    <div style={{ width: '100%', justifyContent: 'flex-start', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <p>Search Customer</p>
                        <input
                            type="text"
                            name="searchKey"
                            data-qc="searchKey"
                            value={this.state.searchKey}
                            onChange={(e) => this.handleSearchChange(e)}
                            style={{ width: '50%' }}
                        />
                        <Button type="submit" onClick={this.handleSubmit} style={{ margin: 10 }}>{local.submit}</Button>
                    </div>
                </form>
                {this.props.searchResults && this.props.searchResults.length > 0 && <div>
                    {this.props.searchResults.map((element: any) => {
                        return (
                            <p key={element.id} onClick={() => this.props.selectCustomer(element)}>{element.customerInfo.customerName}</p>
                        )
                    }
                    )}
                </div>}
            </div>
        )
    }
}
export default CustomerSearch