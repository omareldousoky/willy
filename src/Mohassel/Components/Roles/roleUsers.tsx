import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import { Formik } from 'formik';
import { withRouter } from 'react-router-dom';
import Swal from 'sweetalert2';
import DynamicTable from '../DynamicTable/dynamicTable';
import { getCookie } from '../../Services/getCookie';
import { getUserCountPerRole } from "../../Services/APIs/Roles/roles";
import { Loader } from '../../../Shared/Components/Loader';
import { searchUsers } from '../../Services/APIs/Users/searchUsers';
import * as local from '../../../Shared/Assets/ar.json';
import '../ManageAccounts/styles.scss';

interface Props {
    history: any;
    role: any;
};
interface State {
    data: any;
    size: number;
    from: number;
    roleCount: number;
    searchKeyword: string;
    dateFrom: string;
    loading: boolean;
}

class RoleUsers extends Component<Props, State> {
    mappers: { title: string; key: string; render: (data: any) => void }[]
    constructor(props: Props) {
        super(props);
        this.state = {
            data: [],
            size: 5,
            from: 0,
            roleCount: 0,
            searchKeyword: '',
            dateFrom: '',
            loading: false,
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
        this.setState({ loading: true })
        // const branchId = JSON.parse(getCookie('branches'))[0]
        const res = await searchUsers({ size: this.state.size, from: this.state.from, roleId: this.props.role._id });
        if (res.status === "success") {
            this.setState({
                data: res.body.data,
                roleCount: res.body.totalCount,
                loading: false
            })
        } else {
            console.log("error")
            this.setState({ loading: false })
        }
    }
    submit = async (values) => {
        this.setState({ loading: true })
        let obj = {}
        // const branchId = JSON.parse(getCookie('branches'));
        if (values.dateFrom === "") {
            obj = {
                // branchId: branchId[0],
                size: this.state.size,
                from: this.state.from,
            }
        } else {
            obj = {
                fromDate: new Date(values.dateFrom).setHours(0, 0, 0, 0).valueOf(),
                size: this.state.size,
                from: this.state.from,
            }
        }
        if (isNaN(Number(values.searchKeyword))) obj = { ...obj, name: values.searchKeyword }
        else obj = { ...obj, nationalId: values.searchKeyword }
        obj = { ...obj, roleId: this.props.role._id }
        const res = await searchUsers(obj);
        if (res.status === "success") {
            this.setState({
                loading: false,
                data: res.body.data
            })
        } else {
            this.setState({ loading: false });
            Swal.fire('', local.searchError, 'error');
        }
    }
    render() {
        return (
            <>
                <Card style={{ margin: '20px 50px' }}>
                    <Loader type="fullsection" open={this.state.loading} />
                    <Card.Body style={{ padding: 0 }}>
                        <div className="custom-card-header">
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>{local.users}</Card.Title>
                                <span className="text-muted">{local.noOfUsers} {this.state.roleCount}</span>
                            </div>
                            {/* <div>
                                <Button variant="outline-primary" className="big-button">download pdf</Button>
                            </div> */}
                        </div>
                        <hr className="dashed-line" />
                        <Formik
                            initialValues={this.state}
                            onSubmit={this.submit}
                            validateOnBlur
                            validateOnChange>
                            {(formikProps) =>
                                <Form onSubmit={formikProps.handleSubmit}>
                                    <div className="custom-card-body">
                                        <InputGroup style={{ direction: 'ltr', marginLeft: 20, flex: 1 }}>
                                            <Form.Control
                                                type="text"
                                                name="searchKeyword"
                                                data-qc="searchKeyword"
                                                onChange={formikProps.handleChange}
                                                style={{ direction: 'rtl', borderRight: 0, padding: 22 }}
                                                placeholder={local.userSearchPlaceholder}
                                            />
                                            <InputGroup.Append>
                                                <InputGroup.Text style={{ background: '#fff' }}><span className="fa fa-search fa-rotate-90"></span></InputGroup.Text>
                                            </InputGroup.Append>
                                        </InputGroup>
                                        <div className="dropdown-container" style={{ flex: 1, alignItems: 'center' }}>
                                            <p className="dropdown-label" style={{ alignSelf: 'normal', marginLeft: 20, width: 300 }}>{local.creationDate}</p>
                                            <Form.Control
                                                style={{ marginLeft: 20, border: 'none' }}
                                                type="date"
                                                name="dateFrom"
                                                data-qc="dateFrom"
                                                onChange={formikProps.handleChange}
                                            >
                                            </Form.Control>
                                        </div>
                                    </div>
                                </Form>
                            }
                        </Formik>
                        <DynamicTable
                            mappers={this.mappers}
                            pagination={true}
                            data={this.state.data}
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

export default withRouter(RoleUsers);