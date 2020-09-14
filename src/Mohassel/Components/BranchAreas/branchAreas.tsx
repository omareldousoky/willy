import React, { Component } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { Loader } from '../../../Shared/Components/Loader';
import { getLoanUsage } from '../../Services/APIs/LoanUsage/getLoanUsage';
import { addLoanUsage } from '../../Services/APIs/LoanUsage/addLoanUsage';
import { updateLoanUsage } from '../../Services/APIs/LoanUsage/updateLoanUsage';
import * as local from '../../../Shared/Assets/ar.json';
import { Branch } from '../Branch/assignProductToBranch';
import { getBranches } from '../../Services/APIs/Branch/getBranches';
import Swal from 'sweetalert2';
import Select from 'react-select';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { getAreasByBranch } from '../../Services/APIs/Branch/getBranchAreas';

interface BranchArea {
    name: string;
    disabledUi: boolean;
    id: string;
    activated: boolean;
}
interface State {
    branchAreas: Array<BranchArea>;
    branches: Array<Branch>;
    branch: Branch;
    loading: boolean;
    filterBranchAreas: string;
    temp: Array<string>;
}
class BranchAreas extends Component<{}, State> {
    constructor(props) {
        super(props);
        this.state = {
            branch: {
                _id: '',
                name: '',
            },
            branchAreas: [],
            branches: [],
            loading: false,
            filterBranchAreas: '',
            temp: []
        }
    }
    async componentDidMount() {
        this.setState({ loading: true });
        const branches = await getBranches();
        if (branches.status === 'success') {
            this.setState({
                branches: branches.body.data.data,
                loading: false
            })
        } else {
            this.setState({ loading: false });
            Swal.fire('', local.searchError, 'error');

        }
    }
    addBranchArea() {
        if (!this.state.branchAreas.some(branchArea => branchArea.name === "")) {
            this.setState({
                filterBranchAreas: '',
                branchAreas: [...this.state.branchAreas, { name: "", disabledUi: false, id: "", activated: true }],
                temp: [...this.state.temp, '']
            })
        }
    }
    handleChangeInput(event: React.ChangeEvent<HTMLInputElement>, index: number) {
        this.setState({
            branchAreas: this.state.branchAreas.map((branchArea, branchAreaIndex) => branchAreaIndex === index ? { ...branchArea, name: event.currentTarget.value } : branchArea)
        })
    }
    handleKeyDown(event: React.KeyboardEvent, index: number) {
        if (event.key === 'Enter') {
            this.toggleClick(index, true)
        }
    }
    async toggleClick(index: number, submit: boolean) {
        if (this.state.branchAreas[index].disabledUi === false && this.state.branchAreas[index].name.trim() !== "") {
            if (this.state.branchAreas[index].id === "") {
                //New 
                // this.setState({ loading: true })
                // const res = await addLoanUsage({ name: this.state.branchAreas[index].name, activated: this.state.branchAreas[index].activated });
                // if (res.status === "success") {
                //     this.setState({
                //         branchAreas: this.state.branchAreas.map((branchArea, branchAreaIndex) => branchAreaIndex === index ? { ...branchArea, disabledUi: !branchArea.disabledUi } : branchArea),
                //         loading: false,
                //     })
                // } else this.setState({ loading: false })
            } else {
                //Edit 
                // this.setState({ loading: true })
                // const res = await updateLoanUsage(this.state.branchAreas[index].id, this.state.branchAreas[index].name, this.state.branchAreas[index].activated);
                // if (res.status === "success") {
                //     this.setState({
                //         branchAreas: this.state.branchAreas.map((branchArea, branchAreaIndex) => branchAreaIndex === index ? { ...branchArea, disabledUi: !branchArea.disabledUi } : branchArea),
                //         loading: false,
                //     })
                // } else this.setState({ loading: false })
            }
        } else if (!submit) {
            this.setState({
                branchAreas: this.state.branchAreas.map((branchArea, branchAreaIndex) => branchAreaIndex === index ? { ...branchArea, disabledUi: !branchArea.disabledUi } : branchArea)
            })
        }
    }
    async getBranchAreas(branch) {
        console.log(branch)
        this.setState({ loading: true, branch: branch })
        const branchsAreas = await getAreasByBranch(branch._id);
        if (branchsAreas.status === 'success') {
            this.setState({
                branchAreas: branchsAreas.body.data,
                loading: false,
            })
        } else {
            Swal.fire('', local.searchError, 'error');
            this.setState({
                loading: false,
            })
        }
    }
    render() {
        return (
            <Container style={{ marginTop: 20 }}>
                <Form.Group as={Row} controlId="branch" style={{ width: '100%' }}>
                    <Form.Label style={{ textAlign: 'right' }} column sm={4}>{local.branch}</Form.Label>
                    <Col sm={6}>
                    <Select
                        name="branch"
                        data-qc="branch"
                        value={this.state.branch}
                        enableReinitialize={false}
                        onChange={(event: any) => { this.getBranchAreas(event) }}
                        type='text'
                        getOptionLabel={(option) => option.name}
                        getOptionValue={(option) => option._id}
                        options={this.state.branches}
                    />
                    </Col>
                </Form.Group>
                <Form.Control
                    type="text"
                    data-qc="filterBranchAreas"
                    placeholder={local.search}
                    style={{ marginBottom: 20 }}
                    maxLength={100}
                    value={this.state.filterBranchAreas}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ filterBranchAreas: e.currentTarget.value })}
                />
                <div style={{ display: 'flex', textAlign: 'center' }}>
                    <h4 style={{ textAlign: 'right' }}>{local.branchAreas}</h4>
                    <span
                        onClick={() => this.addBranchArea()}
                        className="fa fa-plus fa-lg"
                        style={{ margin: 'auto 20px', color: '#7dc356', cursor: 'pointer' }}
                    />
                </div>
                <ListGroup style={{ textAlign: 'right', position: 'absolute', marginBottom: 30 }}>
                    <Loader type="fullsection" open={this.state.loading} />
                    {this.state.branchAreas
                        .filter(branchArea => branchArea.name.toLocaleLowerCase().includes(this.state.filterBranchAreas.toLocaleLowerCase()))
                        .map((branchArea, index) => {
                            return (
                                <ListGroup.Item key={index} style={{ display: 'flex', alignItems: 'center' }}>
                                    <Form.Group style={{ margin: '0px 0px 0px 20px' }}>
                                        <Form.Control
                                            type="text"
                                            data-qc="branchAreaInput"
                                            maxLength={100}
                                            title={branchArea.name}
                                            value={branchArea.name}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.handleChangeInput(e, index)}
                                            onKeyDown={(e: React.KeyboardEvent) => this.handleKeyDown(e, index)}
                                            disabled={branchArea.disabledUi}
                                            style={branchArea.disabledUi ? { background: 'none', border: 'none' } : {}}
                                            isInvalid={this.state.branchAreas[index].name.trim() === ""}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {local.required}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    {branchArea.disabledUi ?
                                        <span
                                            style={branchArea.activated ? { color: '#7dc356', marginLeft: 20 } : { color: '#d51b1b', marginLeft: 20 }}
                                            className={branchArea.activated ? "fa fa-check-circle fa-lg" : "fa fa-times-circle fa-lg"} />
                                        :
                                        <>
                                            <Form.Check
                                                type="checkbox"
                                                data-qc={`activate${index}`}
                                                label={local.active}
                                                className="checkbox-label"
                                                checked={this.state.branchAreas[index].activated}
                                                onChange={() => this.setState({ branchAreas: this.state.branchAreas.map((branchArea, branchAreaIndex) => branchAreaIndex === index ? { ...branchArea, activated: !this.state.branchAreas[index].activated } : branchArea) })}
                                            />
                                            <span className="fa fa-undo fa-lg"
                                                style={{ color: '#7dc356', cursor: 'pointer', marginLeft: 20 }}
                                                onClick={() => this.state.temp[index] !== '' ? this.setState({ branchAreas: this.state.branchAreas.map((branchArea, branchAreaIndex) => branchAreaIndex === index ? { ...branchArea, name: this.state.temp[index], disabledUi: true } : branchArea) }) : this.setState({ branchAreas: this.state.branchAreas.filter(loanItem => loanItem.id !== "") })}
                                            />
                                        </>
                                    }
                                    <span
                                        onClick={() => branchArea.disabledUi ? this.toggleClick(index, false) : this.toggleClick(index, true)}
                                        style={{ color: '#7dc356', cursor: 'pointer', marginLeft: 20 }}
                                        data-qc="editSaveIcon"
                                        className={branchArea.disabledUi ? "fa fa-edit fa-lg" : "fa fa-save fa-lg"} />
                                </ListGroup.Item>
                            )
                        }).reverse()}
                </ListGroup>
            </Container>
        );
    }
}

export default BranchAreas;