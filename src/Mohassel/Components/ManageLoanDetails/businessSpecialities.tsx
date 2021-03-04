import React, { Component } from 'react';
import { Loader } from '../../../Shared/Components/Loader';
import * as local from '../../../Shared/Assets/ar.json';
import HeaderWithCards from '../HeaderWithCards/headerWithCards';
import { Activities, BusinessSector, manageLoanDetailsArray } from '../ManageLoanDetails/manageLoanDetailsInitials';
import Swal from 'sweetalert2';
import { getErrorMessage } from '../../../Shared/Services/utils';
import { CRUDList, CrudOption } from '../CRUDList/crudList';
import { createBusinessSpeciality, editBusinessSpeciality, getBusinessSectors } from '../../Services/APIs/configApis/config';
import { Col, Form, Row } from 'react-bootstrap';
import Select from 'react-select';
import ability from '../../config/ability';


interface State {
    businessSectors: Array<BusinessSector>;
    sector: BusinessSector;
    businessActivities: Array<Activities>;
    activity: Activities;
    businessSpecialities: Array<CrudOption>;
    loading: boolean;
}
class BusinessSpecialities extends Component<{}, State> {
    constructor(props) {
        super(props);
        this.state = {
            businessSectors: [],
            sector: {
                i18n: { ar: '' },
                id: '',
                activities: []
            },
            businessActivities: [],
            activity: {
                i18n: { ar: '' },
                id: '',
                specialties: [],
                active: false
            },
            businessSpecialities: [],
            loading: false
        }
    }
    async componentDidMount() {
        await this.getBusinessSectors();
    }

    async getBusinessSectors() {
        this.setState({ loading: true });
        const res = await getBusinessSectors();
        if (res.status === "success") {
            this.setState({
                loading: false,
                businessSectors: res.body.sectors,
            });
        } else {
            this.setState({ loading: false }, () => Swal.fire("Error !", getErrorMessage(res.error.error), 'error'));
        }
    }
    prepareActivites(id) {
        const sector = this.state.businessSectors.filter(sctr => sctr.id === id)[0]
        this.setState({ businessActivities: sector.activities })
    }
    prepareSpecialties(id) {
        const activity = this.state.businessActivities.filter(act => act.id === id)[0]
        const specialties = activity.specialties ? activity.specialties.map(specialty => { return { name: specialty.businessSpecialtyName.ar, id: specialty.id ? (specialty.id).toString() : '0', activated: specialty.active ? true : false, disabledUi: true } }) : []
        this.setState({ businessSpecialities: specialties })
    }
    async editBusinessSpeciality(id, active) {
        this.setState({ loading: true })
        const res = await editBusinessSpeciality({ businessSpecialtyId: Number(id), BusinessActivityId: this.state.activity.id, BusinessSectorId: this.state.sector.id, active: active });
        if (res.status === "success") {
            this.setState({
                loading: false
            }, async () => { await this.getBusinessSectors(); await this.prepareActivites(this.state.sector.id); await this.prepareSpecialties(this.state.activity.id) })
        } else this.setState({ loading: false }, () => Swal.fire("Error !", getErrorMessage(res.error.error), 'error'))
    }
    async newBusinessSpeciality(name) {
        this.setState({ loading: true })
        const res = await createBusinessSpeciality({ businessSpecialtyName: name, businessSectorId: this.state.sector.id, businessActivityId: this.state.activity.id });
        if (res.status === "success") {
            this.setState({
                loading: false
            }, async () => { await this.getBusinessSectors(); await this.prepareActivites(this.state.sector.id); await this.prepareSpecialties(this.state.activity.id) })
        } else this.setState({ loading: false }, () => Swal.fire("Error !", getErrorMessage(res.error.error), 'error'))
    }
    render() {
        const array = manageLoanDetailsArray();
        return (
            <>
                <Loader type="fullscreen" open={this.state.loading} />
                <HeaderWithCards
                    header={local.businessSpecialities}
                    array={array}
                    active={array.map(item => { return item.icon }).indexOf('businessSpecialities')}
                />
                <div className="d-flex flex-column align-items-center">
                    <Form.Group as={Row} controlId="businessSector" style={{ width: '60%', marginTop: '1rem' }}>
                        <Form.Label style={{ textAlign: 'right' }} column sm={4}>{local.businessSector}</Form.Label>
                        <Col sm={6}>
                            <Select
                                name="businessSector"
                                data-qc="businessSector"
                                value={this.state.sector}
                                enableReinitialize={false}
                                onChange={(event: any) => { this.setState({ sector: event }, () => this.prepareActivites(event.id)) }}
                                type='text'
                                getOptionLabel={(option) => option.i18n.ar}
                                getOptionValue={(option) => option.id}
                                options={this.state.businessSectors}
                            />
                        </Col>
                    </Form.Group>
                    {this.state.sector.id.length > 0 &&
                        <Form.Group as={Row} controlId="businessActivity" style={{ width: '60%', marginTop: '1rem' }}>
                            <Form.Label style={{ textAlign: 'right' }} column sm={4}>{local.businessActivity}</Form.Label>
                            <Col sm={6}>
                                <Select
                                    name="businessActivity"
                                    data-qc="businessActivity"
                                    value={this.state.activity}
                                    enableReinitialize={false}
                                    onChange={(event: any) => { this.setState({ activity: event }, () => this.prepareSpecialties(event.id)) }}
                                    type='text'
                                    getOptionLabel={(option) => option.i18n.ar}
                                    getOptionValue={(option) => option.id}
                                    options={this.state.businessActivities}
                                />
                            </Col>
                        </Form.Group>}
                </div>
                {(this.state.activity.id).toString().length > 0 && <CRUDList source={'businessSpecialities'} options={this.state.businessSpecialities}
                    newOption={(name, active, index) => { this.newBusinessSpeciality(name) }}
                    updateOption={(id, name, active, index) => { this.editBusinessSpeciality(id, active) }}
                    disableNameEdit
                    canCreate={ability.can('createBusinessSpecialty','config')}
                    canEdit={ability.can('updateBusinessSpecialty','config')} />}
            </>
        );
    }
}

export default BusinessSpecialities;