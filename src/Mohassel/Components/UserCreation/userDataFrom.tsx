import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import './userCreation.css'
import * as local from '../../../Shared/Assets/ar.json';
import { Loader } from '../../../Shared/Components/Loader';
import Can from '../../config/Can';
import { Values, Errors, Touched } from './userCreationinterfaces';

interface Props {
    values: Values;
    errors: Errors;
    touched: Touched;
    handleChange?: any;
    handleBlur?: any;
    handleSubmit?: any;
}
export const UserDataForm = (props: Props) => {
    return (
        <Form
            onSubmit={() => props.handleSubmit}
            className="user-data-form"
        >
            <Form.Group
                className={'user-data-group'}
                controlId={'userFullName'}
            >
                <Form.Label
                    className={'user-data-label'}
                >{`${local.name}*`}
                </Form.Label>
                <Form.Control
                    placeholder={local.name}
                    type={"text"}
                    name={"userFullName"}
                    data-qc={"userFullName"}
                    value={props.values.userFullName}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    isInvalid={(props.errors.userFullName && props.touched.userFullName) as boolean}
                />
                <Form.Control.Feedback
                    type="invalid">
                    {props.errors.userFullName}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group
                controlId={'userNationalId'}
                className={'user-data-group'}
            >
                <Form.Label
                    className={'user-data-label'}
                >{`${local.nationalId}*`}
                </Form.Label>
                <Form.Control
                    type={"text"}
                    placeholder={`${local.example} : ${local.nationalIdPlaceholder}`}
                    name={"userNationalId"}
                    data-qc={"userNationalId"}
                    value={props.values.userNationalId}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    isInvalid={(props.errors.userNationalId && props.touched.userNationalId) as boolean}
                />
                <Form.Control.Feedback
                    type="invalid">
                    {props.errors.userNationalId}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group
                controlId={'userHiringDate'}
                className={'user-data-group'}
            >
                <Form.Label
                    className={'user-data-label'}
                >{`${local.dateOfHire}*`}
                </Form.Label>
                <Form.Control
                    className={"input-group date"}
                    type={"date"}
                    name={"userHiringDate"}
                    data-qc={"userHiringDate"}
                    value={props.values.userHiringDate}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    isInvalid={(props.errors.userHiringDate && props.touched.userHiringDate) as boolean}
                >
                </Form.Control>
                <Form.Control.Feedback
                    type="invalid">
                    {props.errors.userHiringDate}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group
                controlId={'userName'}
                className={'user-data-group'}
            >
                <Form.Label
                    className={'user-data-label'}
                >{`${local.username}*`}
                </Form.Label>
                <Form.Control
                    type={"text"}
                    name={"userName"}
                    data-qc={"userName"}
                    value={props.values.userName}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    isInvalid={(props.errors.userName && props.touched.userName) as boolean}
                />
                <Form.Control.Feedback
                    type="invalid">
                    {props.errors.userName}
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Row}
            className={'user-data-group'}
            >
                <Col>
                    <Form.Label
                        className={'user-data-label'}
                    >{`${local.password}*`}
                    </Form.Label>
                    <Form.Control
                        type={"password"}
                        placeholder={local.password}
                    />
                </Col>
                <Col>
                    <Form.Label
                        className={'user-data-label'}
                    >{`${local.confrimPassword}*`}
                    </Form.Label>
                    <Form.Control
                        type={"password"}
                        placeholder={local.confrimPassword}
                    />
                </Col>
            </Form.Group>
            <Form.Group 
            as={Row}
            className={'user-data-group'}
            >
                <Col >
                    <Button className ={'btn-cancel-prev'} style={{ width:'60%' }} >{local.cancel}</Button>
                </Col>
                <Col>
                    <Button  className= {'btn-submit-next'} style={{ float :'left',width:'60%' }} type="submit" data-qc="next">{local.next}</Button>
                </Col>
            </Form.Group>
        </Form>
    );

}