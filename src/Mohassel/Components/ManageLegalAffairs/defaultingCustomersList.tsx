import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { withRouter } from 'react-router-dom';
import Swal from 'sweetalert2';
import DynamicTable from '../../../Shared/Components/DynamicTable/dynamicTable';
import { getDateAndTime } from '../../Services/getRenderDate';
import { Loader } from '../../../Shared/Components/Loader';
import local from '../../../Shared/Assets/ar.json';
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
import { addCustomerToDefaultingList, reviewCustomerDefaultedLoan } from '../../Services/APIs/LegalAffairs/defaultingCustomers';

interface Props {
    history: any;
    data: DefaultedCustomer[];
    error: string;
    totalCount: number;
    loading: boolean;
    searchFilters: {
        status?: string;
    };
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
    loanSearchResults: { application: Application; id: string }[];
    selectedCustomer: Customer;
    modalLoader: boolean;
    loading: boolean;
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
    loanMappers: { title: string; key: string; sortable?: boolean; render: (data: { id: string; application: Application }) => void }[]
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
            loanSearchResults: [],
            selectedCustomer: {},
            modalLoader: false,
            loading: false
        }
        this.mappers = [
            {
                title: () => <FormCheck type='checkbox' onChange={(e) => this.checkAll(e)} checked={this.state.checkAll} disabled={!this.props.searchFilters.status || this.props.searchFilters.status === 'underReview'}></FormCheck>,
                key: 'selected',
                render: data => <FormCheck
                    type='checkbox'
                    checked={Boolean(this.state.selectedEntries.find(application => application._id === data._id))}
                    onChange={() => this.addRemoveItemFromChecked(data)}
                    disabled={!this.props.searchFilters.status || this.props.searchFilters.status === 'underReview'}
                ></FormCheck>
            },
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
        this.loanMappers = [
            {
                title: local.code,
                key: 'LoanKey',
                render: data => data.id || ''
            }, {
                title: local.code,
                key: 'LoanKey',
                render: data => data.application.loanApplicationKey || ''
            },
            {
                title: local.principal,
                key: 'principal',
                render: data => data.application.principal || 0
            },
            {
                title: '',
                key: 'action',
                render: data => <Button onClick={() => this.defaultCustomerLoan(data.id)}>{local.choose}</Button>
            }
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
                {daysSince < 3 && data.status !== 'branchManagerReview' && <Can I='branchManagerReview' a='legal'><img style={{ cursor: 'pointer', marginLeft: 20 }} alt={'edit'} src={require('../../Assets/editIcon.svg')} onClick={() => { this.reviewDefaultedLoan(data._id, 'branchManagerReview') }} ></img><span>branchManagerReview</span></Can>}
                {daysSince >= 3 && daysSince < 6 && data.status !== 'areaSupervisorReview' && <Can I='areaSupervisorReview' a='legal'><img style={{ cursor: 'pointer', marginLeft: 20 }} alt={'view'} src={require('../../Assets/view.svg')} onClick={() => { this.reviewDefaultedLoan(data._id, 'areaSupervisorReview') }} ></img><span>areaSupervisorReview</span></Can>}
                {daysSince >= 6 && daysSince < 9 && data.status !== 'areaManagerReview' && <Can I='areaManagerReview' a='legal'><img style={{ cursor: 'pointer', marginLeft: 20 }} alt={'view'} src={require('../../Assets/view.svg')} onClick={() => { this.reviewDefaultedLoan(data._id, 'areaManagerReview') }} ></img><span>areaManagerReview</span></Can>}
                {daysSince >= 9 && daysSince < 15 && data.status !== 'financialManagerReview' && <Can I='financialManagerReview' a='legal'><img style={{ cursor: 'pointer', marginLeft: 20 }} alt={'view'} src={require('../../Assets/view.svg')} onClick={() => { this.reviewDefaultedLoan(data._id, 'financialManagerReview') }} ></img><span>financialManagerReview</span></Can>}
            </>
        );
    }
    async getDefaultingCustomers() {
        this.props.search({ ...this.props.searchFilters, size: this.state.size, from: this.state.from, url: 'defaultingCustomers', branchId: this.props.branchId }).then(() => {
            this.setState({
                selectedEntries: [],
                checkAll: false
            })
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
        const results = await searchLoan({ from: 0, size: 1000, nationalId: customer.nationalId })
        if (results.status === 'success') {
            this.setState({ modalLoader: false, loanSearchResults: results.body.applications.filter(loan => loan.application.status && ['pending', 'issued'].includes(loan.application.status)) });
        } else {
            this.setState({ modalLoader: false })
            Swal.fire('Error !', getErrorMessage(results.error.error), 'error')
        }
    }
    async defaultCustomerLoan(loanId: string) {
        if (this.state.selectedCustomer._id) {
            this.setState({ modalLoader: true })
            const results = await addCustomerToDefaultingList({ customerId: this.state.selectedCustomer._id, loanId: loanId })
            if (results.status === 'success') {
                this.setState({
                    modalLoader: false, showModal: false, selectedCustomer: {}, customerSearchResults: { results: [], empty: false },
                    loanSearchResults: []
                }, () => { this.getDefaultingCustomers() });
                Swal.fire('', local.customerAddedToDefaultiingListSuccess, 'success')
            } else {
                this.setState({ modalLoader: false })
                Swal.fire('Error !', getErrorMessage(results.error.error), 'error')
            }
        }
    }
    async reviewDefaultedLoan(id, type) {
        const { value: text } = await Swal.fire({
            title: local[type],
            input: 'textarea',
            inputPlaceholder: local.writeNotes,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: local.review,
            cancelButtonText: local.cancel,
            inputValidator: (value) => {
                if (!value) {
                    return local.required
                } else return ''
            }
        })
        if (text) {
            Swal.fire({
                title: local.areYouSure,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: local.review,
                cancelButtonText: local.cancel
            }).then(async (result) => {
                if (result.value) {
                    this.setState({ loading: true });
                    const res = await reviewCustomerDefaultedLoan({ ids: [id], notes: text, type: type });
                    if (res.status === "success") {
                        this.setState({ loading: false })
                        Swal.fire('', local.defaultingReviewSuccess, 'success').then(() => this.getDefaultingCustomers());
                    } else {
                        this.setState({ loading: false }, () => Swal.fire("Error !", getErrorMessage(res.error.error), 'error'))
                    }
                }
            })
        }
    }
    // filterStatus(data, status?: string){
    //     console.log(data, status)
    //     if (!status) {
    //         return data
    //     } else if (status === 'underReview') {
    //         return data.filter(defaulted => defaulted.status === 'underReview')
    //     }
    //     return []
    // }
    // setDefaultingCustomersDate(formikProps: FormikProps<FormikValues>, role: string) {
  //   const now = new Date().valueOf()
  //   const threeDays = 259200000
  //   const sixDays = 518400000
  //   const nineDays = 777600000
  //   const fifteenDays = 1296000000
  //   const fromDate = now - (role === 'branchManagerReview' ? threeDays : role === 'areaManagerReview' ? sixDays : role === 'areaSupervisorReview' ? nineDays : fifteenDays )
  //   formikProps.setFieldValue(
  //     "fromDate",
  //     fromDate
  //   );
  //   formikProps.setFieldValue(
  //     "toDate",
  //     now
  //   );
  // }
    render() {
        return (
            <div>
                <HeaderWithCards
                    header={local.legalAffairs}
                    array={this.state.manageLegalAffairsTabs}
                    active={this.state.manageLegalAffairsTabs.map(item => { return item.icon }).indexOf('loanUses')}
                />
                <Card className='main-card'>
                    <Loader type='fullscreen' open={this.props.loading || this.state.loading} />
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
                            searchKeys={['keyword', 'defaultingCustomerStatus']}
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
                            : <DynamicTable totalCount={0} pagination={false} data={this.state.loanSearchResults} mappers={this.loanMappers} />
                        }
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({
                            showModal: false, selectedCustomer: {}, customerSearchResults: { results: [], empty: false },
                            loanSearchResults: []
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