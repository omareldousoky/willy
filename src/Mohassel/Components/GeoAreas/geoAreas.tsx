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
import { getGeoAreas, getGeoAreasByBranch } from '../../Services/APIs/GeoAreas/getGeoAreas';
import { addGeoArea } from '../../Services/APIs/GeoAreas/addGeoArea';
import { updateGeoArea } from '../../Services/APIs/GeoAreas/updateGeoArea';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

interface GeoArea {
    name: string;
    disabledUi: boolean;
    id: string;
    active: boolean;
}
interface State {
    geoAreas: Array<GeoArea>;
    loading: boolean;
    showModal: boolean;
    filterGeoAreas: string;
    temp: Array<string>;
    branches: Array<any>;
    branchAreas: Array<any>;
    branch: any;
}
class GeoAreas extends Component<{}, State> {
    constructor(props) {
        super(props);
        this.state = {
            geoAreas: [],
            loading: false,
            showModal: false,
            filterGeoAreas: '',
            temp: [],
            branches: [],
            branchAreas: [],
            branch: {}
        }
    }
    async componentDidMount() {
        this.getGeoAreas()
    }
    addBranchArea() {
        if (!this.state.geoAreas.some(branchArea => branchArea.name === "")) {
            this.setState({
                filterGeoAreas: '',
                geoAreas: [...this.state.geoAreas, { name: "", disabledUi: false, id: "", active: true }],
                temp: [...this.state.temp, '']
            })
        }
    }
    handleChangeInput(event: React.ChangeEvent<HTMLInputElement>, index: number) {
        this.setState({
            geoAreas: this.state.geoAreas.map((branchArea, branchAreaIndex) => branchAreaIndex === index ? { ...branchArea, name: event.currentTarget.value } : branchArea)
        })
    }
    handleKeyDown(event: React.KeyboardEvent, index: number) {
        if (event.key === 'Enter') {
            this.toggleClick(index, true)
        }
    }
    async toggleClick(index: number, submit: boolean) {
        if (this.state.geoAreas[index].disabledUi === false && this.state.geoAreas[index].name.trim() !== "") {
            console.log(this.state.geoAreas[index])
            if (this.state.geoAreas[index].id === "") {
                //New 
                this.setState({ loading: true })
                const res = await addGeoArea({ name: this.state.geoAreas[index].name });
                if (res.status === "success") {
                    this.setState({
                        geoAreas: this.state.geoAreas.map((branchArea, branchAreaIndex) => branchAreaIndex === index ? { ...branchArea, disabledUi: !branchArea.disabledUi } : branchArea),
                        loading: false,
                    }, () => this.getGeoAreas())
                } else this.setState({ loading: false })
            } else {
                //Edit 
                this.setState({ loading: true })
                const res = await updateGeoArea(this.state.geoAreas[index].id, { name: this.state.geoAreas[index].name, active: this.state.geoAreas[index].active });
                if (res.status === "success") {
                    this.setState({
                        geoAreas: this.state.geoAreas.map((branchArea, branchAreaIndex) => branchAreaIndex === index ? { ...branchArea, disabledUi: !branchArea.disabledUi } : branchArea),
                        loading: false,
                    })
                } else this.setState({ loading: false })
            }
        } else if (!submit) {
            this.setState({
                geoAreas: this.state.geoAreas.map((branchArea, branchAreaIndex) => branchAreaIndex === index ? { ...branchArea, disabledUi: !branchArea.disabledUi } : branchArea)
            })
        }
    }
    async getGeoAreas() {
        this.setState({ loading: true });
        const geoAreas = await getGeoAreas();
        if (geoAreas.status === 'success') {
            this.setState({
                geoAreas: geoAreas.body.data ? geoAreas.body.data.map(area => ({ ...area, disabledUi: true })) : [],
                loading: false
            })
        } else {
            this.setState({ loading: false });
            Swal.fire('', local.searchError, 'error');

        }
    }
    async openAssignToBranches() {
        console.log('now')
        await this.getBranches();
        this.setState({
            showModal: true
        })
    }
    async getBranches() {
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
    async getBranchAreas(branch) {
        console.log(branch)
        this.setState({ loading: true, branch: branch })
        const branchsAreas = await getGeoAreasByBranch(branch._id);
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
                <div style={{ display: 'flex', textAlign: 'center', flexDirection: 'column' }}>
                    <h4 style={{ textAlign: 'right' }}>{local.branchAreas}</h4>
                    <Form.Control
                        type="text"
                        data-qc="filterGeoAreas"
                        placeholder={local.search}
                        style={{ marginBottom: 20 }}
                        maxLength={100}
                        value={this.state.filterGeoAreas}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ filterGeoAreas: e.currentTarget.value })}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span
                            onClick={() => this.addBranchArea()}
                            className="fa fa-plus fa-lg"
                            style={{ margin: 'auto 20px', color: '#7dc356', cursor: 'pointer' }}
                        />
                        <Button variant='primary' type='button' onClick={() => this.openAssignToBranches()}>Assign</Button>
                    </div>
                </div>
                <ListGroup style={{ textAlign: 'right', width: '30%', margin: '30px 0' }}>
                    <Loader type="fullsection" open={this.state.loading} />
                    {this.state.geoAreas
                        .filter(branchArea => branchArea.name.toLocaleLowerCase().includes(this.state.filterGeoAreas.toLocaleLowerCase()))
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
                                            isInvalid={this.state.geoAreas[index].name.trim() === ""}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {local.required}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    {branchArea.disabledUi ?
                                        <span
                                            style={branchArea.active ? { color: '#7dc356', marginLeft: 20 } : { color: '#d51b1b', marginLeft: 20 }}
                                            className={branchArea.active ? "fa fa-check-circle fa-lg" : "fa fa-times-circle fa-lg"} />
                                        :
                                        <>
                                            {branchArea.id.length > 0 && <Form.Check
                                                type="checkbox"
                                                data-qc={`activate${index}`}
                                                label={local.active}
                                                className="checkbox-label"
                                                checked={this.state.geoAreas[index].active}
                                                onChange={() => this.setState({ geoAreas: this.state.geoAreas.map((branchArea, branchAreaIndex) => branchAreaIndex === index ? { ...branchArea, active: !this.state.geoAreas[index].active } : branchArea) })}
                                            />}
                                            {/* <span className="fa fa-undo fa-lg"
                                                style={{ color: '#7dc356', cursor: 'pointer', marginLeft: 20 }}
                                                onClick={() => this.state.temp[index] !== '' ? this.setState({ geoAreas: this.state.geoAreas.map((branchArea, branchAreaIndex) => branchAreaIndex === index ? { ...branchArea, name: this.state.temp[index], disabledUi: true } : branchArea) }) : this.setState({ geoAreas: this.state.geoAreas.filter(loanItem => loanItem.id !== "") })}
                                            /> */}
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
                {this.state.showModal && <Modal show={this.state.showModal} backdrop="static">
                    <Modal.Header>
                        <Modal.Title>{local.branchAreas}</Modal.Title>
                        <Button variant='danger' type='button' onClick={()=>{this.setState({ showModal: false })}}>x</Button>
                    </Modal.Header>
                    <Modal.Body>
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
                    </Modal.Body>
                </Modal>}
            </Container>
        );
    }
}

export default GeoAreas;