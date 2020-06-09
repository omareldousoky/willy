import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import { withRouter } from 'react-router-dom';
import DynamicTable from '../DynamicTable/dynamicTable';
import { Loader } from '../../../Shared/Components/Loader';
import * as local from '../../../Shared/Assets/ar.json';
import Search from '../Search/search';
import { connect } from 'react-redux';
import { search } from '../../redux/search/actions';

interface Props {
    history: any;
    _id: string;
    data: any;
    totalCount: number;
    loading: boolean;
    search: (data) => void;
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
                title: local.employment,
                key: "employment",
                render: data => "employment"
            },
            {
                title: local.createdBy,
                key: "createdBy",
                render: data => "createdBy"
            },
            {
                title: local.creationDate,
                key: "creationDate",
                render: data => "creationDate"
            },
            {
                title: '',
                key: "actions",
                render: data => <>
                    <span className='fa fa-eye icon' onClick={() => { this.props.history.push({ pathname: "/user-details", state: { details: data._id } }) }}></span>
                    <span className='fa fa-pencil-alt icon' onClick={() => { this.props.history.push({ pathname: "/edit-user", state: { details: data._id } }) }}></span>
                </>
            },
        ]
    }
    componentDidMount() {
        this.getUsers();
    }

    async getUsers() {
        this.props.search({ size: this.state.size, from: this.state.from, roleId: this.props._id, url: 'user' });
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
                        <Search searchKeys={['keyword', 'dateFromTo']} url="user" from={this.state.from} size={this.state.size} />
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
    };
  };
  const mapStateToProps = state => {
    return {
      data: state.search.data,
      totalCount: state.search.totalCount,
      loading: state.loading
    };
  };

export default connect(mapStateToProps, addSearchToProps)(withRouter(RoleUsers));