import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { withRouter } from 'react-router-dom';
import Swal from 'sweetalert2';
import DynamicTable from '../DynamicTable/dynamicTable';
import { getDateAndTime } from '../../Services/getRenderDate';
import { Loader } from '../../../Shared/Components/Loader';
import * as local from '../../../Shared/Assets/ar.json';
import Can from '../../config/Can';
import { setUserActivation } from '../../Services/APIs/Users/userActivation';
import Search from '../Search/search';
import { connect } from 'react-redux';
import { search, searchFilters } from '../../redux/search/actions';
import { loading } from '../../redux/loading/actions';
import HeaderWithCards from '../HeaderWithCards/headerWithCards';
import { manageLoansArray } from './manageLoansInitials';
import { timeToDateyyymmdd } from '../../Services/utils';

interface Props {
    history: any;
    data: any;
    totalCount: number;
    loading: boolean;
    searchFilters: any;
    search: (data) => void;
    setLoading: (data) => void;
    setSearchFilters: (data) => void;
    branchId?: string;
    withHeader: boolean;
};
interface State {
    size: number;
    from: number;
}

class LoanProducts extends Component<Props, State> {
    mappers: { title: string; key: string; render: (data: any) => void }[]
    constructor(props: Props) {
        super(props);
        this.state = {
            size: 5,
            from: 0,
        }
        this.mappers = [
            {
                title: local.username,
                key: "username",
                render: data => data.username
            },
            {
                title: local.name,
                key: "name",
                render: data => data.name
            },
            {
                title: local.employment,
                key: "employment",
                render: data => data.hiringDate ? timeToDateyyymmdd(data.hiringDate) : ''
            },
            {
                title: local.createdBy,
                key: "createdBy",
                render: data => data.created ? data.created.by : null
            },
            {
                title: local.creationDate,
                key: "creationDate",
                render: data => data.created.at ? getDateAndTime(data.created.at) : ''
            },
            {
                title: '',
                key: "actions",
                render: (data) => this.renderIcons(data)
            },
        ]
    }
    componentDidMount() {
        this.getUsers()
    }
    componentWillUnmount() {
        this.props.setSearchFilters({})
    }
    async handleActivationClick(data: any) {
        const req = { id: data._id, status: data.status === "active" ? "inactive" : "active" }
        this.props.setLoading(true);

        const res = await setUserActivation(req);
        if (res.status === 'success') {
            this.props.setLoading(false);
            Swal.fire("", `${data.username}  ${req.status} `, 'success').then(() => this.getUsers())
        } else {
            this.props.setLoading(false);
            Swal.fire("error");
        }

    }
    renderIcons(data: any) {
        return (
            <>
                <span onClick={() => { this.props.history.push({ pathname: "/manage-accounts/users/user-details", state: { details: data._id } }) }} className='fa fa-eye icon'></span>
            </>
        );
    }
    getUsers() {
        this.props.search({ ...this.props.searchFilters, size: this.state.size, from: this.state.from, url: 'user', branchId: this.props.branchId });
    }
    render() {
        return (
            <div>
                <HeaderWithCards
                    header={local.loanProducts}
                    array={manageLoansArray}
                    active={0}
                />
                <Card style={{ margin: '20px 50px' }}>
                    <Loader type="fullsection" open={this.props.loading} />
                    <Card.Body style={{ padding: 0 }}>
                        <div className="custom-card-header">
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>{local.loanProducts}</Card.Title>
                                <span className="text-muted">{local.noOfLoanProducts + ` (${this.props.totalCount})`}</span>
                            </div>
                            <div>
                                <Can I='createLoanProduct' a='product'><Button className="big-button" style={{ marginLeft: 20 }} onClick={() => this.props.history.push('/manage-loans/loan-products/new-loan-product')}>{local.createLoanProduct}</Button></Can>
                                {/* <Button variant="outline-primary" className="big-button">download pdf</Button> */}
                            </div>
                        </div>
                        <hr className="dashed-line" />
                        {/* <Search searchKeys={['keyword', 'dateFromTo']} dropDownKeys={['name', 'nationalId']} url="user" from={this.state.from} size={this.state.size} hqBranchIdRequest={this.props.branchId} /> */}

                        <DynamicTable
                            totalCount={this.props.totalCount}
                            mappers={this.mappers}
                            pagination={true}
                            data={this.props.data}
                            changeNumber={(key: string, number: number) => {
                                this.setState({ [key]: number } as any, () => this.getUsers());
                            }}
                        />
                    </Card.Body>
                </Card>
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
        totalCount: state.search.totalCount,
        loading: state.loading,
        searchFilters: state.searchFilters
    };
};

export default connect(mapStateToProps, addSearchToProps)(withRouter(LoanProducts));