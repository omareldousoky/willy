import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { withRouter } from 'react-router-dom';
import Swal from 'sweetalert2';
import DynamicTable from '../../../Shared/Components/DynamicTable/dynamicTable';
import { getDateAndTime } from '../../Services/getRenderDate';
import { Loader } from '../../../Shared/Components/Loader';
import * as local from '../../../Shared/Assets/ar.json';
import Can from '../../config/Can';
import Search from '../../../Shared/Components/Search/search';
import { connect } from 'react-redux';
import { search, searchFilters } from '../../../Shared/redux/search/actions';
import { loading } from '../../../Shared/redux/loading/actions';
import HeaderWithCards, { Tab } from '../HeaderWithCards/headerWithCards';
import { manageLegalAffairsArray } from './manageLegalAffairsInitials';
import { getErrorMessage, timeToDateyyymmdd } from '../../../Shared/Services/utils';
import { Col, FormCheck, Modal } from 'react-bootstrap';
import CustomerSearch from '../CustomerSearch/customerSearchTable';
import { searchCustomer } from '../../Services/APIs/Customer-Creation/searchCustomer';
import { Customer } from '../../../Shared/Services/interfaces';
import { searchLoan } from '../../Services/APIs/Loan/searchLoan';
import { Application } from '../LoanApplication/loanApplicationStates';
import { addCustomerToDefaultingList } from '../../Services/APIs/LegalAffairs/defaultingCustomers';

interface Props {
    history: any;
    data: DefaultedCustomer[];
    error: string;
    totalCount: number;
    loading: boolean;
    searchFilters: object;
    search: (data) => Promise<void>;
    setLoading: (data) => void;
    setSearchFilters: (data) => void;
    branchId?: string;
    withHeader: boolean;
};
interface State {
    size: number;
    from: number;
    checkAll: boolean;
    showModal: boolean;
    manageLegalAffairsTabs: Tab[];
    selectedEntries: DefaultedCustomer[];
    customerSearchResults: { results: Array<Customer>; empty: boolean };
    loanSearchResults: { applications: { application: Application; id: string }[]; totalCount: number };
    selectedCustomer: Customer;
    modalLoader: boolean;
}
interface DefaultedCustomer {
    _id: string;
    updated: { at: number; by: string };
    created: { at: number; by: string };
    status: string;
    nationalId: string;
    loanId: string;
    customerType: string;
    customerName: string;
    customerId: string;
    customerKey: number;

}
class DefaultingCustomersList extends Component<Props, State> {
    mappers: { title: (() => void) | string; key: string; sortable?: boolean; render: (data: DefaultedCustomer) => void }[]
    constructor(props: Props) {
        super(props);
        this.state = {
            size: 10,
            from: 0,
            checkAll: false,
            showModal: false,
            manageLegalAffairsTabs: [],
            selectedEntries: [],
            customerSearchResults: { results: [], empty: false },
            loanSearchResults: { applications: [], totalCount: 0 },
            selectedCustomer: {},
            modalLoader: false
        }
        this.mappers = [
            // {
            //     title: () => <FormCheck type='checkbox' onChange={(e) => this.checkAll(e)} checked={this.state.checkAll}></FormCheck>,
            //     key: 'selected',
            //     render: data => <FormCheck
            //         type='checkbox'
            //         checked={Boolean(this.state.selectedEntries.find(application => application._id === data._id))}
            //         onChange={() => this.addRemoveItemFromChecked(data)}
            //     ></FormCheck>
            // },
            {
                title: local.code,
                key: 'customerKey',
                render: data => data.customerKey
            },
            {
                title: local.customerName,
                key: 'customerName',
                render: data => data.customerName
            },
            {
                title: local.customerType,
                key: 'customerType',
                render: data => data.customerType
            },
            {
                title: local.loanDetails,
                key: 'loanId',
                render: data => data.loanId
            },
            // {
            //     title: local.hrCode,
            //     key: 'hrCode',
            //     render: data => data.hrCode
            // },
            {
                title: local.date,
                key: 'employment',
                render: data => data.created.at ? this.getRecordAgeInDays(data.created.at) : ''
            },
            {
                title: local.status,
                key: 'status',
                render: data => data.status
            },
            {
                title: '',
                key: 'actions',
                render: (data) => this.renderIcons(data)
            },
        ]
    }
    componentDidMount() {
        this.props.search({ size: this.state.size, from: this.state.from, url: 'defaultingCustomers', branchId: this.props.branchId }).then(() => {
            if (this.props.error)
                Swal.fire('Error !', getErrorMessage(this.props.error), 'error')
        })
        this.setState({
            manageLegalAffairsTabs: manageLegalAffairsArray()
        })
    }
    handleSearch = async (key, query) => {
        this.setState({ modalLoader: true })
        const results = await searchCustomer({ from: 0, size: 1000, [key]: query })
        if (results.status === 'success') {
            if (results.body.data.length > 0) {
                this.setState({ modalLoader: false, customerSearchResults: { results: results.body.data, empty: false } });
            } else {
                this.setState({ modalLoader: false, customerSearchResults: { results: results.body.data, empty: true } });
            }
        } else {
            this.setState({ modalLoader: false })
            Swal.fire('Error !', getErrorMessage(results.error.error), 'error')
        }
    }
    getRecordAgeInDays(date: number) {
        return ((new Date().getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24))
    }
    renderIcons(data: DefaultedCustomer) {
        const daysSince = this.getRecordAgeInDays(data.created.at)
        return (
            <>
                {daysSince >= 3 && daysSince < 6 && <img style={{ cursor: 'pointer', marginLeft: 20 }} alt={'view'} src={require('../../Assets/view.svg')} onClick={() => { console.log('second', data) }} ></img>}
                {/* <Can I='updateUser' a='user'> */}
                {daysSince < 3 && <img style={{ cursor: 'pointer', marginLeft: 20 }} alt={'edit'} src={require('../../Assets/editIcon.svg')} onClick={() => { console.log('first', data) }} ></img>}
                {/* </Can> */}
                {/* <Can I='userActivation' a='user'> */}
                {/* < span className='icon' onClick={() => this.handleActivationClick(data)}> {data.status === 'active' && <img alt={'deactive'} src={require('../../Assets/deactivate-user.svg')} />} {data.status === 'inactive' && local.activate} </span> */}
                {/* </Can> */}
            </>
        );
    }
    async getDefaultingCustomers() {
        this.props.search({ ...this.props.searchFilters, size: this.state.size, from: this.state.from, url: 'defaultingCustomers', branchId: this.props.branchId }).then(() => {
            if (this.props.error)
                Swal.fire('Error !', getErrorMessage(this.props.error), 'error')
        }
        );
    }
    componentWillUnmount() {
        this.props.setSearchFilters({})
    }
    addRemoveItemFromChecked(selectedEntry: DefaultedCustomer) {
        if (this.state.selectedEntries.findIndex(customer => customer._id === selectedEntry._id) > -1) {
            this.setState({
                selectedEntries: this.state.selectedEntries.filter(customer => customer._id !== selectedEntry._id),
            })
        } else {
            this.setState({
                selectedEntries: [...this.state.selectedEntries, selectedEntry],
            })
        }
    }
    checkAll(e: React.FormEvent<HTMLInputElement>) {
        if (e.currentTarget.checked) {
            this.setState({ checkAll: true, selectedEntries: this.props.data })
        } else this.setState({ checkAll: false, selectedEntries: [] })
    }
    async findLoans(customer: Customer) {
        this.setState({ modalLoader: true, selectedCustomer: customer })
        const results = await searchLoan({ from: 0, size: 1000, nationalId: customer.nationalId, status: 'issued' })
        if (results.status === 'success') {
            this.setState({ modalLoader: false, loanSearchResults: results.body });
        } else {
            this.setState({ modalLoader: false })
            Swal.fire('Error !', getErrorMessage(results.error.error), 'error')
        }
    }
    async defaultCustomerLoan(loanId: string) {
        console.log(loanId, this.state.selectedCustomer._id)
        if (this.state.selectedCustomer._id) {
            this.setState({ modalLoader: true })
            const results = await addCustomerToDefaultingList({ customerId: this.state.selectedCustomer._id, loanId: loanId })
            if (results.status === 'success') {
                this.setState({ modalLoader: false }, () => { this.getDefaultingCustomers() });
                Swal.fire('', local.customerAddedToDefaultiingListSuccess, 'success')
            } else {
                this.setState({ modalLoader: false })
                Swal.fire('Error !', getErrorMessage(results.error.error), 'error')
            }
        }
    }
    render() {
        return (
            <div>
                <HeaderWithCards
                    header={local.legalAffairs}
                    array={this.state.manageLegalAffairsTabs}
                    active={this.state.manageLegalAffairsTabs.map(item => { return item.icon }).indexOf('loanUses')}
                />
                <Card className='main-card'>
                    <Loader type='fullscreen' open={this.props.loading} />
                    <Card.Body style={{ padding: 0 }}>
                        <div className='custom-card-header'>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>{local.lateCustomers}</Card.Title>
                                <span className='text-muted'>{local.noOfUsers + ` (${this.props.totalCount ? this.props.totalCount : 0})`}</span>
                            </div>
                            <div>
                                <Can I='createUser' a='user'><Button className='big-button' onClick={() => this.setState({
                                    showModal: true
                                })}>{local.addCustomerToLateCustomers}</Button></Can>
                                {/* <Button variant='outline-primary' className='big-button'>download pdf</Button> */}
                            </div>
                        </div>
                        <hr className='dashed-line' />
                        <Search
                            searchKeys={['keyword', 'dateFromTo', 'defaultingCustomerStatus']}
                            dropDownKeys={['name', 'nationalId', 'key']}
                            searchPlaceholder={local.searchByBranchNameOrNationalIdOrCode}
                            setFrom={(from) => this.setState({ from: from })}
                            url='defaultingCustomers' from={this.state.from} size={this.state.size}
                            hqBranchIdRequest={this.props.branchId} />

                        <DynamicTable
                            url='defaultingCustomers' from={this.state.from} size={this.state.size}
                            totalCount={this.props.totalCount}
                            mappers={this.mappers}
                            pagination={true}
                            data={this.props.data}
                            changeNumber={(key: string, number: number) => {
                                this.setState({ [key]: number } as any, () => this.getDefaultingCustomers());
                            }}
                        />
                    </Card.Body>
                </Card>
                <Modal show={this.state.showModal} size='lg'>
                    <Modal.Header>
                        <Modal.Title>{local.addCustomerToLateCustomers}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Loader type='fullsection' open={this.state.modalLoader} />
                        {Object.keys(this.state.selectedCustomer).length === 0 ? <CustomerSearch
                            source='loanApplication'
                            style={{ width: '100%' }}
                            handleSearch={(key, query) => this.handleSearch(key, query)}
                            selectedCustomer={this.state.selectedCustomer}
                            searchResults={this.state.customerSearchResults}
                            selectCustomer={(customer) => this.findLoans(customer)}
                        />
                            : (this.state.loanSearchResults.totalCount > 0) ? <div className='d-flex flex-column w-100'>
                                {this.state.loanSearchResults.applications.map(loan => <Col key={loan.id} onClick={() => this.defaultCustomerLoan(loan.id)}>{loan.id}</Col>)}
                            </div>
                                : <span>{local.noResultsFound}</span>}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({
                            showModal: false, selectedCustomer: {}, customerSearchResults: { results: [], empty: false },
                            loanSearchResults: { applications: [], totalCount: 0 }
                        })}>{local.cancel}</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

const addSearchToProps = dispatch => {
    return {
        search: data => dispatch(search(data)),
        setLoading: data => dispatch(loading(data)),
        setSearchFilters: data => dispatch(searchFilters(data)),
    };
};
const mapStateToProps = state => {
    return {
        data: state.search.data,
        error: state.search.error,
        totalCount: state.search.totalCount,
        loading: state.loading,
        searchFilters: state.searchFilters
    };
};

export default connect(mapStateToProps, addSearchToProps)(withRouter(DefaultingCustomersList));