import React, { Component } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { Loader } from '../../../Shared/Components/Loader';
import * as local from '../../../Shared/Assets/ar.json';
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
import DualBox from '../DualListBox/dualListBox';
import { assignGeoAreas } from '../../Services/APIs/GeoAreas/assignGeoAreas';

interface GeoArea {
    name: string;
    disabledUi: boolean;
    _id: string;
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
                geoAreas: [...this.state.geoAreas, { name: "", disabledUi: false, _id: "", active: true }],
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
            if (this.state.geoAreas[index]._id === "") {
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
                const res = await updateGeoArea(this.state.geoAreas[index]._id, { name: this.state.geoAreas[index].name, active: this.state.geoAreas[index].active });
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
            const areas = geoAreas.body.data ? geoAreas.body.data.map(area => ({ ...area, disabledUi: true })) : [];
            this.setState({
                geoAreas: areas,
                loading: false
            })
        } else {
            this.setState({ loading: false });
            Swal.fire('', local.searchError, 'error');

        }
    }
    async openAssignToBranches() {
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
        await this.getGeoAreas();
        this.setState({ loading: true, branch: branch, branchAreas: [] })
        const branchAreas = await getGeoAreasByBranch(branch._id);
        if (branchAreas.status === 'success') {
            const areas = (branchAreas.body.data) ? branchAreas.body.data : [];
            this.setState({
                branchAreas: areas,
                loading: false,
            })
        } else {
            Swal.fire('', local.searchError, 'error');
            this.setState({
                loading: false,
            })
        }
    }
    handleChange(list) {
        this.setState({
            branchAreas: list
        })
    }
    async submitChange() {
        const areaIds: Array<any> = [];
        this.state.branchAreas.forEach(area => areaIds.push(area._id))
        const obj = {
            id: this.state.branch._id,
            geoAreas: areaIds
        }
        this.setState({ loading: true })
        const branchAreas = await assignGeoAreas(obj);
        if (branchAreas.status === 'success') {
            Swal.fire('success', local.branchAssignGeoAreaSuccess, 'success');
            this.setState({
                loading: false,
                showModal: false,
                branchAreas: [],
                branch: {}
            })
        } else {
            Swal.fire('', local.branchAssignGeoAreaFail, 'error');
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
                        <Button variant='primary' type='button' onClick={() => this.openAssignToBranches()}>{local.assignBranchAreas}</Button>
                    </div>
                </div>
                <ListGroup style={{ textAlign: 'right', width: '30%', margin: '30px 0' }}>
                    <Loader type="fullscreen" open={this.state.loading} />
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
                                            {branchArea._id.length > 0 && <Form.Check
                                                type="checkbox"
                                                data-qc={`activate${index}`}
                                                label={local.active}
                                                className="checkbox-label"
                                                checked={this.state.geoAreas[index].active}
                                                onChange={() => this.setState({ geoAreas: this.state.geoAreas.map((branchArea, branchAreaIndex) => branchAreaIndex === index ? { ...branchArea, active: !this.state.geoAreas[index].active } : branchArea) })}
                                            />}
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
                {this.state.showModal && <Modal show={this.state.showModal} backdrop="static" size="lg">
                    <Modal.Header>
                        <Modal.Title>{local.branchAreas}</Modal.Title>
                        <Button variant='danger' type='button' onClick={() => {
                            this.setState({
                                showModal: false,
                                branchAreas: [],
                                branch: {}
                            })
                        }}>x</Button>
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
                        {Object.keys(this.state.branch).length > 0 && this.state.geoAreas.length > 0 &&
                            <DualBox
                                labelKey={"name"}
                                options={this.state.geoAreas.filter(area => area.active)}
                                selected={this.state.branchAreas}
                                onChange={(list) => this.handleChange(list)}
                                filterKey={this.state.branch._id}
                                rightHeader={local.availableGeoAreas}
                                leftHeader={local.branchgeoAreas}
                            />
                        }
                        {this.state.branch._id ? <Button type="button" style={{ margin: 10, width: '10%', alignSelf: 'flex-end' }} onClick={() => this.submitChange()}>{local.submit}</Button> : null}

                    </Modal.Body>
                </Modal>}
            </Container>
        );
    }
}

export default GeoAreas;