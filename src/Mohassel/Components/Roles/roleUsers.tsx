import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import { withRouter } from 'react-router-dom';
import DynamicTable from '../DynamicTable/dynamicTable';
import { Loader } from '../../../Shared/Components/Loader';
import * as local from '../../../Shared/Assets/ar.json';
import Search from '../Search/search';
import { connect } from 'react-redux';
import { search, searchFilters } from '../../redux/search/actions';
import Can from '../../config/Can';
import { timeToDateyyymmdd } from '../../Services/utils';
import { getDateAndTime } from '../../Services/getRenderDate';

interface Props {
    history: any;
    _id: string;
    data: any;
    totalCount: number;
    loading: boolean;
    searchFilters: any;
    search: (data) => void;
    setSearchFilters: (data) => void;
};
interface State {
    size: number;
    from: number;
}

class RoleUsers extends Component<Props, State> {
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
                title: local.nationalId,
                key: "nationalId",
                render: data => data.nationalId
            },
            {
                title: local.employment,
                key: "employment",
                render: data => data.hiringDate? timeToDateyyymmdd(data.hiringDate): ''
            },
            {
                title: local.creationDate,
                key: "creationDate",
                render: data => data.created?.at ? getDateAndTime(data.created.at) : ''
            },
            {
                title: '',
                key: "actions",
                render: data => <>
                    <span className='fa fa-eye icon' onClick={() => { this.props.history.push({ pathname: "/manage-accounts/users/user-details", state: { details: data._id } }) }}></span>
                    <Can I="createUser" a="user"><span className='fa fa-pencil-alt icon' onClick={() => { this.props.history.push({ pathname: "/manage-accounts/users/edit-user", state: { details: data._id } }) }}></span></Can>
                </>
            },
        ]
    }
    componentDidMount() {
        this.getUsers();
    }
    getUsers() {
        this.props.search({ ...this.props.searchFilters, size: this.state.size, from: this.state.from, roleId: this.props._id, url: 'user' });
    }
    render() {
        return (
            <>
                <Card style={{ margin: '20px 50px' }}>
                    <Loader type="fullsection" open={this.props.loading} />
                    <Card.Body style={{ padding: 0 }}>
                        <div className="custom-card-header">
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>{local.users}</Card.Title>
                                <span className="text-muted">{local.noOfUsers} {this.props.totalCount}</span>
                            </div>
                            {/* <div>
                                <Button variant="outline-primary" className="big-button">download pdf</Button>
                            </div> */}
                        </div>
                        <hr className="dashed-line" />
                        <Search
                            searchKeys={['keyword', 'dateFromTo']}
                            dropDownKeys={['name', 'nationalId']}
                            searchPlaceholder={local.searchByNameOrNationalId}
                            url="user"
                            from={this.state.from}
                            size={this.state.size}
                            roleId={this.props._id} />
                        <DynamicTable
                            mappers={this.mappers}
                            totalCount={this.props.totalCount}
                            pagination={true}
                            data={this.props.data}
                            changeNumber={(key: string, number: number) => {
                                this.setState({ [key]: number } as any, () => this.getUsers());
                            }}
                        />
                    </Card.Body>
                </Card>
            </>
        )
    }
}

const addSearchToProps = dispatch => {
    return {
        search: data => dispatch(search(data)),
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

export default connect(mapStateToProps, addSearchToProps)(withRouter(RoleUsers));