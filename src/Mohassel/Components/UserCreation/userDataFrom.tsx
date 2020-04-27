import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import './userCreation.css'
import * as local from '../../../Shared/Assets/ar.json';
import { Loader } from '../../../Shared/Components/Loader';
import Can from '../../config/Can';

interface Touched {
    fullName?: boolean;
    userName?: boolean;
    nationalId?: boolean;
    hrCode?: boolean;
    mobileNumber?: boolean;
    hiringDate?: boolean;
    password?: boolean;
    confirmPassword?: boolean;

}
interface Values {
    fullName: string;
    nationalId: string;
    hiringData: string;
    mobileNumber?: string;
    hrCode: string;
    userName: string;
    password: string;
    confrimPassword: string;
}
interface Props {
    values: Values;
    errors: Values;
    touched: Touched;
    handleonSubmit?: (event: React.FormEvent<HTMLInputElement>) => void;
    handleOnChange?: (event: React.FormEvent<HTMLInputElement>) => void;
    handleOnBlur?: (event: React.FormEvent<HTMLInputElement>) => void;
    handleSubmit?: (event: React.FormEvent<HTMLInputElement>) => void;
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
                    value={props.values.fullName}
                    onChange={props.handleOnChange}
                    onBlur={props.handleOnBlur}
                    isInvalid={(props.errors.fullName && props.touched.fullName) as boolean}
                />
                <Form.Control.Feedback
                    type="invalid">
                    {props.errors.fullName}
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
                    value={props.values.nationalId}
                    onChange={props.handleOnChange}
                    onBlur={props.handleOnBlur}
                    isInvalid={(props.errors.nationalId && props.touched.nationalId) as boolean}
                />
                <Form.Control.Feedback
                    type="invalid">
                    {props.errors.nationalId}
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
                    name={"userDateOfHire"}
                    data-qc={"userDateOfHire"}
                    value={props.values.hiringData}
                    onChange={props.handleOnChange}
                    onBlur={props.handleOnBlur}
                    isInvalid={(props.errors.hiringData && props.touched.hiringDate) as boolean}
                >
                </Form.Control>
                <Form.Control.Feedback
                    type="invalid">
                    {props.errors.hiringData}
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
                    value={props.values.hiringData}
                    onChange={props.handleOnChange}
                    onBlur={props.handleOnBlur}
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