import React, { useState } from 'react'
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import './createBranch.scss';
import Map from '../Map/map';
import * as local from '../../../Shared/Assets/ar.json';
import { BasicValues, BasicErrors, BasicTouched } from './branchCreationInterfaces';

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
    const [activeState, setActive] = useState(true);
    const [inactiveState, setInactive] = useState(false);
    return (
        <Form
            className={'branch-data-form'}
            onSubmit={props.handleSubmit}
        >
            {mapState && <Map show={mapState}
                handleClose={() => openCloseMap(false)}
                save={(branchAddressLatLong: {lat: number ; lng: number})=>{props.setFieldValue('branchAddressLatLong',branchAddressLatLong);openCloseMap(false)}}
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
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            isInvalid={(props.errors.name && props.touched.name) as boolean}
                        />
                        <Form.Control.Feedback
                            type="invalid">
                            {props.errors.name}
                        </Form.Control.Feedback>
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
                        <Form.Control
                            placeholder={local.governorate}
                            type={"text"}
                            name={"governorate"}
                            data-qc={"governorate"}
                            value={props.values.governorate}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            isInvalid={(props.errors.governorate && props.touched.governorate) as boolean}
                        />
                        <Form.Control.Feedback
                            type="invalid">
                            {props.errors.governorate}
                        </Form.Control.Feedback>
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
            <Form.Group
                className={'branch-data-group'}
            >
                <Form.Label
                    className={'branch-data-label'}
                >{local.branchState}</Form.Label>
                <Row style={{ margin: "1rem" }}>
                    <Form.Check
                        type={'radio'}
                        label={local.activeBranch}
                        value={'active'} checked={activeState}
                        onChange={props.handleChange}
                        onClick={(e: any) => {
                            setActive(true);
                            setInactive(false)
                            props.setFieldValue('status', e.target.value);
                        }}
                    />
                    <Form.Check
                        type={'radio'}
                        label={local.inActiveBranch}
                        value={'inactive'}
                        checked={inactiveState}
                        onChange={props.handleChange}
                        onClick={(e: any) => {
                            setActive(false);
                            setInactive(true)
                            props.setFieldValue('status', e.target.value);
                        }}

                    />
                </Row>
            </Form.Group>
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
