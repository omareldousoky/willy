import React, { useState } from 'react'
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Governorates from '../Governorates/governorates'
import './createBranch.scss';
import { Loader } from '../../../Shared/Components/Loader';
import Map from '../Map/map';
import * as local from '../../../Shared/Assets/ar.json';
import { BasicValues, BasicErrors, BasicTouched } from './branchCreationInterfaces';
import { checkBranchNameDuplicates } from '../../Services/APIs/Branch/checkBranchNameDuplicates';


interface Props {
    values: BasicValues;
    handleSubmit: any;
    handleChange: any;
    handleBlur: any;
    setFieldValue: any;
    cancel: any;
    errors: BasicErrors;
    touched: BasicTouched;
}
const StepOneForm = (props: Props) => {
    const [mapState, openCloseMap] = useState(false);
    const [loading, setLoading] = useState(false);
    return (
        <Form
            className={'branch-data-form'}
            onSubmit={props.handleSubmit}
        >
            {mapState && <Map show={mapState}
                handleClose={() => openCloseMap(false)}
                save={(branchAddressLatLong: { lat: number; lng: number }) => { props.setFieldValue('branchAddressLatLong', branchAddressLatLong); openCloseMap(false) }}
                location={props.values.branchAddressLatLong}
                header={local.branchOnMap}
            />}
            <Row>
                <Col>
                    <Form.Group
                        className={'branch-data-group'}
                        controlId={'name'}
                    >
                        <Form.Label
                            className={'branch-data-label'}
                        >{`${local.branchName}*`}
                        </Form.Label>
                        <Form.Control
                            placeholder={local.branchName}
                            type={"text"}
                            name={"name"}
                            data-qc={"name"}
                            value={props.values.name}
                            onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                props.setFieldValue('name', event.currentTarget.value);
                                setLoading(true);
                                const res = await checkBranchNameDuplicates({ branchName: event.currentTarget.value });

                                if (res.status === 'success') {
                                    setLoading(false);
                                    props.setFieldValue('branchNameChecker', res.body.Exists);
                                } else setLoading(false);

                            }}
                            onBlur={props.handleBlur}
                            isInvalid={(props.errors.name && props.touched.name) as boolean}
                        />
                        <Form.Control.Feedback
                            type="invalid">
                            {props.errors.name}
                        </Form.Control.Feedback>
                        <Col sm={1}>
                            <Col sm={1}>
                                <Loader type="inline" open={loading} />
                            </Col>
                        </Col>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group
                        className={'branch-data-group'}
                        controlId={'governorate'}
                    >
                        <Form.Label
                            className={'branch-data-label'}
                        >
                            {`${local.governorate}*`}
                        </Form.Label>

                        <Governorates
                            values={props.values}

                        />
                    </Form.Group>
                </Col>
            </Row>
            <Col
                className={'branch-data-group'}
            >
                <div
                    className={'branch-data-label'}
                >{`${local.branchOnMap}`}
                </div>
                <Button
                    className={'map-btn'}
                    name={"branchAddressLatLong"}
                    data-qc={"branchAddressLatLong"}
                    onClick={() => openCloseMap(true)}

                ><span><img alt={'location'} src={require('../../Assets/activeLocation.svg')} /> {local.branchOnMap} </span></Button>
            </Col>
            <Row>
                <Col>
                    <Form.Group
                        className={'branch-data-group'}
                        controlId={'address'}
                    >
                        <Form.Label
                            className={'branch-data-label'}
                        >{`${local.branchAddress}*`}
                        </Form.Label>
                        <Form.Control
                            placeholder={local.branchAddress}
                            type={"text"}
                            name={"address"}
                            data-qc={"address"}
                            value={props.values.address}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            isInvalid={(props.errors.address && props.touched.address) as boolean}
                        />
                        <Form.Control.Feedback
                            type="invalid">
                            {props.errors.address}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group
                        controlId={'postalCode'}
                        className={'branch-data-group'}
                    >
                        <Form.Label
                            className={'branch-data-label'}
                        >{local.postalCode}
                        </Form.Label>
                        <Form.Control
                            type={"text"}
                            name={"postalCode"}
                            placeholder={local.postalCode}
                            data-qc={"postalCode"}
                            value={props.values.postalCode as string}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            isInvalid={(props.errors.postalCode && props.touched.postalCode) as boolean}
                        >
                        </Form.Control>
                        <Form.Control.Feedback
                            type="invalid">
                            {props.errors.postalCode}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form.Group className={'branch-data-group'}>
                        <Form.Label className={'branch-data-label'}>
                            {local.mobilePhoneNumber}
                        </Form.Label>
                        <Form.Control
                            type={"text"}
                            name={"phoneNumber"}
                            placeholder={local.mobilePhoneNumber}
                            data-qc={"phoneNumber"}
                            value={props.values.phoneNumber}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            isInvalid={(props.errors.phoneNumber && props.touched.phoneNumber) as boolean}
                        />
                        <Form.Control.Feedback
                            type="invalid">
                            {props.errors.phoneNumber}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className={'branch-data-group'}>
                        <Form.Label className={'branch-data-label'}>
                            {local.faxNumber}
                        </Form.Label>
                        <Form.Control
                            type={"text"}
                            name={"faxNumber"}
                            placeholder={local.faxNumber}
                            data-qc={"faxNumber"}
                            value={props.values.faxNumber}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            isInvalid={(props.errors.faxNumber && props.touched.faxNumber) as boolean}
                        />
                        <Form.Control.Feedback
                            type="invalid">
                            {props.errors.faxNumber}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form.Group className={'branch-data-group'}>
                        <Form.Label className={'branch-data-label'}>
                            {`${local.licenseNumber}*`}
                        </Form.Label>
                        <Form.Control
                            type={"text"}
                            name={"licenseNumber"}
                            placeholder={local.licenseNumber}
                            data-qc={"licenseNumber"}
                            value={props.values.licenseNumber}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            isInvalid={(props.errors.licenseNumber && props.touched.licenseNumber) as boolean}
                        />
                        <Form.Control.Feedback
                            type="invalid">
                            {props.errors.licenseNumber}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className={'branch-data-group'}>
                        <Form.Label className={'branch-data-label'}>
                            {`${local.licenseDate}*`}
                        </Form.Label>
                        <Form.Control
                            type={"date"}
                            name={"licenseDate"}
                            data-qc={"licenseDate"}
                            value={props.values.licenseDate as string}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            isInvalid={(props.errors.licenseDate && props.touched.licenseDate) as boolean}
                        />
                        <Form.Control.Feedback
                            type="invalid">
                            {props.errors.licenseDate}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>
            <Form.Group
                as={Row}
                className={['branch-data-group']}
            >
                <Col >
                    <Button
                        className={'btn-cancel-prev'} style={{ width: '60%' }}
                        onClick={() => { props.cancel() }}
                    >{local.cancel}</Button>
                </Col>
                <Col>
                    <Button className={'btn-submit-next'} style={{ float: 'left', width: '60%' }} type="submit" data-qc="submit">{local.submit}</Button>
                </Col>
            </Form.Group>
        </Form>
    )
}

export default StepOneForm