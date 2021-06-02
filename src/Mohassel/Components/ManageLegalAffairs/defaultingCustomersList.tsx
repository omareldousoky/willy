import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { withRouter } from 'react-router-dom';
import Swal from 'sweetalert2';
import DynamicTable from '../../../Shared/Components/DynamicTable/dynamicTable';
import { Loader } from '../../../Shared/Components/Loader';
import local from '../../../Shared/Assets/ar.json';
import Can from '../../config/Can';
import Search from '../../../Shared/Components/Search/search';
import { connect } from 'react-redux';
import { search, searchFilters } from '../../../Shared/redux/search/actions';
import { loading } from '../../../Shared/redux/loading/actions';
import HeaderWithCards, { Tab } from '../HeaderWithCards/headerWithCards';
import { manageLegalAffairsArray } from './manageLegalAffairsInitials';
import { getErrorMessage, timeToArabicDate } from '../../../Shared/Services/utils';
import { FormCheck, Modal, Table } from 'react-bootstrap';
import CustomerSearch from '../CustomerSearch/customerSearchTable';
import { searchCustomer } from '../../Services/APIs/Customer-Creation/searchCustomer';
import { Customer } from '../../../Shared/Services/interfaces';
import { searchLoan } from '../../Services/APIs/Loan/searchLoan';
import { Application } from '../LoanApplication/loanApplicationStates';
import {
  addCustomerToDefaultingList,
  deleteCustomerDefaultedLoan,
  fetchReviewedDefaultingCustomers,
  reviewCustomerDefaultedLoan,
} from '../../Services/APIs/LegalAffairs/defaultingCustomers'
import ability from '../../config/ability';
import ReportsModal from '../Reports/reportsModal';
import { PDF } from '../Reports/reports';
import DefaultingCustomersPdfTemplate from '../pdfTemplates/defaultingCustomers/DefaultingCustomers';

interface Review {
    at: number;
    by: string;
    notes: string;
    userName: string;
}

export interface ManagerReviews {
    branchManagerReview?: Review;
    areaManagerReview?: Review;
    areaSupervisorReview?: Review;
    financialManagerReview?: Review;
}

export interface DefaultedCustomer extends ManagerReviews {
    _id: string;
    updated: { at: number; by: string };
    created: { at: number; by: string };
    status: string;
    nationalId: string;
    loanId: string;
    loanKey: string;
    customerType: string;
    customerName: string;
    customerId: string;
    customerKey: number;
    customerBranchId?: string;
}
export interface ReviewedDefaultingCustomer {
  customerKey: string;
  customerName: string;
  customerType: string;
  loanKey: string;
  loanIssueDate: string;
  customerAddress: string;
  installmentAmount: number;
  overdueInstallmentCount: number;
  unpaidInstallmentCount: number;
  unpaidInstallmentAmount: number;
  branchName: string;
  branchId: string;
}

export interface ReviewedDefaultingCustomersReq {
    status: string;
    branches: string;
    startDate: number;
    endDate: number;
}

interface Props {
    history: any;
    data: DefaultedCustomer[];
    error: string;
    totalCount: number;
    loading: boolean;
    searchFilters: {
        reviewer?: string;
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
    showLogs: boolean;
    manageLegalAffairsTabs: Tab[];
    selectedEntries: DefaultedCustomer[];
    customerSearchResults: { results: Array<Customer>; empty: boolean };
    loanSearchResults: { application: Application; id: string }[];
    defaultingCustomersReport: ReviewedDefaultingCustomer[];
    selectedCustomer: Customer;
    modalLoader: boolean;
    loading: boolean;
    rowToView: DefaultedCustomer;
    showReportsModal: boolean;
}
const rowToViewInit = {
    _id: '',
    updated: { at: 0, by: '' },
    created: { at: 0, by: '' },
    status: '',
    nationalId: '',
    loanId: '',
    loanKey: '',
    customerType: '',
    customerName: '',
    customerId: '',
    customerKey: 0
}

class DefaultingCustomersList extends Component<Props, State> {
    mappers: { title: (() => void) | string; key: string; sortable?: boolean; render: (data: DefaultedCustomer) => void }[]
    loanMappers: { title: string; key: string; sortable?: boolean; render: (data: { id: string; application: Application }) => void }[]
    reportsPDF: PDF = {
        key: 'defaultingCustomers',
        local: 'تقرير العملاء المتأخرون',
        inputs: ["defaultingCustomerStatus", "branches","dateFromTo"],
        permission: ''
    }

    constructor(props: Props) {
        super(props);
        this.state = {
            size: 10,
            from: 0,
            checkAll: false,
            showModal: false,
            showLogs: false,
            manageLegalAffairsTabs: [],
            selectedEntries: [],
            customerSearchResults: { results: [], empty: false },
            loanSearchResults: [],
            defaultingCustomersReport: [],
            selectedCustomer: {},
            modalLoader: false,
            loading: false,
            rowToView: rowToViewInit,
            showReportsModal: false
        }
        this.mappers = [
            {
                title: () => <FormCheck type='checkbox' onChange={(e) => this.checkAll(e)} checked={this.state.checkAll} disabled={!this.props.searchFilters.reviewer || this.props.searchFilters.reviewer === 'underReview'}></FormCheck>,
                key: 'selected',
                render: data => <FormCheck
                    type='checkbox'
                    checked={Boolean(this.state.selectedEntries.find(application => application._id === data._id))}
                    onChange={() => this.addRemoveItemFromChecked(data)}
                    disabled={!this.props.searchFilters.reviewer || this.props.searchFilters.reviewer === 'underReview'}
                ></FormCheck>
            },
            {
                title: local.code,
                key: 'customerKey',
                render: data => ability.can('getCustomer', 'customer') ? <span style={{ cursor: 'pointer'}} onClick={ () =>
                    this.props.history.push("/customers/view-customer", {
                        id: data.customerId
                      })
                }>{data.customerKey}</span> : data.customerKey
            },
            {
                title: local.customerName,
                key: 'customerName',
                render: data => data.customerName
            },
            {
                title: local.customerType,
                key: 'customerType',
                render: data => local[data.customerType]
            },
            {
                title: local.loanCode,
                key: 'loanId',
                render: data => (ability.can('getIssuedLoan', 'application') || ability.can('branchIssuedLoan', 'application')) ? <span style={{ cursor: 'pointer'}} onClick={ () =>
                    this.props.history.push('/loans/loan-profile', { 
                        id: data.loanId 
                    })
                }>{data.loanKey}</span> : data.loanKey
            },
            {
                title: local.date,
                key: 'creationDate',
                render: data => data.created.at ? timeToArabicDate(data.created.at, true) : ''
            },
            {
                title: local.status,
                key: 'status',
                render: data => local[data.status]
            },
            {
                title: '',
                key: 'actions',
                render: (data) => this.renderIcons(data)
            },
        ]
        this.loanMappers = [
            {
                title: local.customerCode,
                key: 'customerCode',
                render: data => this.state.selectedCustomer.key || ''
            }, {
                title: local.loanCode,
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
        const results = await searchCustomer({ from: 0, size: 1000, [key]: query, customerType: 'individual' })
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
                {(data.branchManagerReview || data.areaManagerReview || data.areaSupervisorReview || data.financialManagerReview) && <img style={{ cursor: 'pointer', marginLeft: 20 }} title={local.logs} src={require('../../Assets/view.svg')} onClick={() => { this.showLogs(data) }} ></img>}
                {(daysSince < 3 && data.status === 'underReview') && <Can I='branchManagerReview' a='legal'><img style={{ cursor: 'pointer', marginLeft: 20 }} title={local.branchManagerReview} src={require('../../Assets/check-circle.svg')} onClick={() => { this.reviewDefaultedLoan([data._id], 'branchManagerReview') }} ></img><img style={{ cursor: 'pointer', marginLeft: 20 }} title={local.delete} src={require('../../../Shared/Assets/deleteIcon.svg')} onClick={() => { this.deleteDefaultedLoanEntry([data._id]) }} ></img></Can>}
                {(daysSince < 6 && (data.status === 'branchManagerReview' || ( daysSince >= 3 && data.status === 'underReview'))) && <Can I='areaSupervisorReview' a='legal'><img style={{ cursor: 'pointer', marginLeft: 20 }} title={local.areaSupervisorReview} src={require('../../Assets/check-circle.svg')} onClick={() => { this.reviewDefaultedLoan([data._id], 'areaSupervisorReview') }} ></img><img style={{ cursor: 'pointer', marginLeft: 20 }} title={local.delete} src={require('../../../Shared/Assets/deleteIcon.svg')} onClick={() => { this.deleteDefaultedLoanEntry([data._id]) }} ></img></Can>}
                {(daysSince < 9 && (data.status === 'areaSupervisorReview' || ( daysSince >= 6 && (data.status === 'branchManagerReview' || data.status === 'underReview')))) && <Can I='areaManagerReview' a='legal'><img style={{ cursor: 'pointer', marginLeft: 20 }} title={local.areaManagerReview} src={require('../../Assets/check-circle.svg')} onClick={() => { this.reviewDefaultedLoan([data._id], 'areaManagerReview') }} ></img><img style={{ cursor: 'pointer', marginLeft: 20 }} title={local.delete} src={require('../../../Shared/Assets/deleteIcon.svg')} onClick={() => { this.deleteDefaultedLoanEntry([data._id]) }} ></img></Can>}
                {(daysSince < 15 && (data.status === 'areaManagerReview' || ( daysSince >= 9 && (data.status === 'areaSupervisorReview' || data.status === 'branchManagerReview' || data.status === 'underReview')))) && <Can I='financialManagerReview' a='legal'><img style={{ cursor: 'pointer', marginLeft: 20 }} title={local.financialManagerReview} src={require('../../Assets/check-circle.svg')} onClick={() => { this.reviewDefaultedLoan([data._id], 'financialManagerReview') }} ></img><img style={{ cursor: 'pointer', marginLeft: 20 }} title={local.delete} src={require('../../../Shared/Assets/deleteIcon.svg')} onClick={() => { this.deleteDefaultedLoanEntry([data._id]) }} ></img></Can>}
                {daysSince >= 15 && data.status !== 'financialManagerReview' && <Can I='deleteDefaultingCustomer' a='legal'><img style={{ cursor: 'pointer', marginLeft: 20 }} alt={local.delete} title={local.delete} src={require('../../../Shared/Assets/deleteIcon.svg')} onClick={() => { this.deleteDefaultedLoanEntry([data._id]) }} ></img></Can>}
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
        const results = await searchLoan({ from: 0, size: 1000, customerKey: customer.key, type: 'micro' })
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
                }, () => { this.wait(2000); this.getDefaultingCustomers() });
                Swal.fire('', local.customerAddedToDefaultiingListSuccess, 'success')
            } else {
                this.setState({ modalLoader: false })
                Swal.fire('Error !', getErrorMessage(results.error.error), 'error')
            }
        }
    }
    async reviewDefaultedLoan(ids: string[], type: string) {
        const { value: text } = await Swal.fire({
            title: `${local[type]}${ids.length > 1 ? ids.length + ' ' + local.loans : ''}`,
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
                } else if(value.length > 200){
                    return local.maxLength200
                }
                 else return ''
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
                    const res = await reviewCustomerDefaultedLoan({ ids: ids, notes: text, type: type });
                    if (res.status === "success") {
                        this.setState({ loading: false })
                        Swal.fire('', local.defaultingReviewSuccess, 'success').then(() => { this.wait(2000); this.getDefaultingCustomers() });
                    } else {
                        this.setState({ loading: false }, () => Swal.fire("Error !", getErrorMessage(res.error.error), 'error'))
                    }
                }
            })
        }
    }
    bulkAction(action: string){
        const ids = this.state.selectedEntries.map(entry => entry._id)
        action === 'review' && this.props.searchFilters.reviewer && this.reviewDefaultedLoan(ids, this.props.searchFilters.reviewer)
        action === 'delete' && this.deleteDefaultedLoanEntry(ids)
    }
    deleteDefaultedLoanEntry(ids: string[]){
        Swal.fire({
            title: local.areYouSure,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: local.delete,
            cancelButtonText: local.cancel
        }).then(async (result) => {
            if (result.value) {
                this.setState({ loading: true });
                const res = await deleteCustomerDefaultedLoan({ ids: ids });
                if (res.status === "success") {
                    this.setState({ loading: false })
                    Swal.fire('', local.defaultedLoanDeleteSuccess, 'success').then(() => { this.wait(2000); this.getDefaultingCustomers() });
                } else {
                    this.setState({ loading: false }, () => Swal.fire("Error !", getErrorMessage(res.error.error), 'error'))
                }
            }
        })
    }
    showLogs(row: DefaultedCustomer){
        this.setState({
            showLogs: true,
            rowToView: row
        })
    }
    renderLogRow(key: string){
        return (
            <tr>
                <td>{timeToArabicDate(this.state.rowToView[key].at, true)}</td>
                <td>{local[key]}</td>
                <td>{this.state.rowToView[key].userName}</td>
                <td style={{ wordBreak: 'break-word' }}>{this.state.rowToView[key].notes}</td>
            </tr>
        )
    }
    wait(ms){
        const start = new Date().getTime();
        let end = start;
        while(end < start + ms) {
          end = new Date().getTime();
       }
     }
     async handlePrintReport(values: any) {
        const { defaultingCustomerStatus, branches, fromDate, toDate } = values
        const printReportReq: ReviewedDefaultingCustomersReq = {
          status: defaultingCustomerStatus ?? '',
          branches:
            branches.length === 1 && branches[0]._id === ''
              ? []
              : branches.map((branch) => branch._id),
           startDate: new Date(fromDate).setHours(0, 0, 0, 0).valueOf(),
           endDate: new Date(toDate).setHours(23, 59, 59, 999).valueOf(),
        }

        const printReportRes: {
          status: string;
          body?: {result: ReviewedDefaultingCustomer[]};
          error?: any;
        } = await fetchReviewedDefaultingCustomers(printReportReq)

        const defaultingCustomersReport = printReportRes.body?.result ?? []

        if (printReportRes.status === 'success') {
            this.setState(
              { defaultingCustomersReport, showReportsModal: false },
              () => {
                window.print()
              }
            )
        } else {
            this.setState({ showReportsModal: false })
            Swal.fire('Error !', getErrorMessage(printReportRes.error.error), 'error')
        }


     }
    render() {
        return (
        <>
            <div className="print-none">
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
                            <div className='d-flex w-50 justify-content-end'>
                                <Can I='addDefaultingCustomer' a='legal'><Button className='big-button' style={{ marginLeft: 10 }} onClick={() => this.setState({
                                    showModal: true
                                })}>{local.addCustomerToLateCustomers}</Button></Can>
                                {(ability.can('branchManagerReview','legal') || 
                                ability.can('areaSupervisorReview','legal') || 
                                ability.can('areaManagerReview','legal') || 
                                ability.can('financialManagerReview','legal')) && <>
                                <Button className='big-button' style={{ marginLeft: 10 }} disabled={this.state.selectedEntries.length === 0} onClick={() => this.bulkAction('review')}>{local.reviewAll}</Button>
                                <Button className='big-button' style={{ marginLeft: 10 }} disabled={this.state.selectedEntries.length === 0} onClick={() => this.bulkAction('delete')}>{local.deleteAll}</Button>
                                <Button className='big-button' onClick={() => this.setState({ showReportsModal: true })}>{local.downloadPDF}</Button>
                                </>}
                            </div>
                        </div>
                        <hr className='dashed-line' />
                        <Search
                            searchKeys={['keyword', 'defaultingCustomerStatus']}
                            dropDownKeys={['name', 'key','customerKey', 'customerShortenedCode']}
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
                <Modal show={this.state.showLogs} size='lg'>
                    <Modal.Header>
                        <Modal.Title>{local.logs}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Table>
                            <thead>
                                <tr>
                                    <th>{local.reviewDate}</th>
                                    <th>{local.reviewStatus}</th>
                                    <th>{local.doneBy}</th>
                                    <th>{local.comments}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.rowToView.branchManagerReview && this.renderLogRow('branchManagerReview')}
                                {this.state.rowToView.areaManagerReview && this.renderLogRow('areaManagerReview')}
                                {this.state.rowToView.areaSupervisorReview && this.renderLogRow('areaSupervisorReview')}
                                {this.state.rowToView.financialManagerReview && this.renderLogRow('financialManagerReview')}
                            </tbody>
                        </Table>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({
                            showLogs: false,
                            rowToView: rowToViewInit
                            })}>{local.cancel}</Button>
                    </Modal.Footer>
                </Modal>
                {this.state.showReportsModal && (
                    <ReportsModal
                        pdf={this.reportsPDF}
                        show={this.state.showReportsModal}
                        hideModal={() => this.setState({ showReportsModal: false })}
                        submit={(values) => this.handlePrintReport(values)}
                        />)
                }
            </div>
            <DefaultingCustomersPdfTemplate customers={this.state.defaultingCustomersReport} />
        </>
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