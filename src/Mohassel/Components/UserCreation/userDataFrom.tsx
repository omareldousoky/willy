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
    handleChange:  (eventOrPath: string | React.ChangeEvent<any>) => void | ((eventOrTextValue: string | React.ChangeEvent<any>) => void);
    handleBlur: (eventOrString: any) => void | ((e: any) => void);
    handleSubmit: (e?: React.FormEvent<HTMLFormElement> | undefined) => void;
    cancle: (e?: React.FormEvent<HTMLFormElement> | undefined) => void;
}
export const UserDataForm = (props: Props) => {
    const handleSubmit = props.handleSubmit;
    return (
        <Form
             onSubmit={handleSubmit}
             className="user-data-form"
        >
            <Form.Group
                className={'user-data-group'}
                controlId={'name'}
            >
                <Form.Label
                    className={'user-data-label'}
                >{`${local.name}*`}
                </Form.Label>
                <Form.Control
                    placeholder={local.name}
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

            <Form.Group
                controlId={'nationalId'}
                className={'user-data-group'}
            >
                <Form.Label
                    className={'user-data-label'}
                >{`${local.nationalId}*`}
                </Form.Label>
                <Form.Control
                    type={"text"}
                    placeholder={`${local.example} : ${local.nationalIdPlaceholder}`}
                    name={"nationalId"}
                    data-qc={"nationalId"}
                    value={props.values.nationalId}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    isInvalid={(props.errors.nationalId && props.touched.nationalId) as boolean}
                />
                <Form.Control.Feedback
                    type="invalid">
                    {props.errors.nationalId}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group
                controlId={'hiringDate'}
                className={'user-data-group'}
            >
                <Form.Label
                    className={'user-data-label'}
                >{`${local.dateOfHire}*`}
                </Form.Label>
                <Form.Control
                    type={"date"}
                    name={"hiringDate"}
                    data-qc={"hiringDate"}
                    value={props.values.hiringDate as string}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    isInvalid={(props.errors.hiringDate && props.touched.hiringDate) as boolean}
                >
                </Form.Control>
                {/* <Form.Control.Feedback
                    type="invalid">
                    {props.errors.hiringDate}
                </Form.Control.Feedback> */}
            </Form.Group>
            <Form.Group
                className={'user-data-group'}
                controlId={'hrCode'}
            >
                <Form.Label
                    className={'user-data-label'}
                >{`${local.hrCode}*`}
                </Form.Label>
                <Form.Control
                    placeholder={local.hrCode}
                    type={"text"}
                    name={"hrCode"}
                    data-qc={"hrCode"}
                    value={props.values.hrCode}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    isInvalid={(props.errors.hrCode && props.touched.hrCode) as boolean}
                /> 
                <Form.Control.Feedback
                    type="invalid">
                    {props.errors.hrCode}
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group
            controlId={'mobilePhoneNumber'}
            className={'user-data-group'}
            >
                <Form.Label
                className={'user-data-label'}
                >{`${local.mobilePhoneNumber}`}
                </Form.Label>
                <Form.Control 
                   type={"text"}
                   name={"mobilePhoneNumber"}
                   data-qc={"mobilePhoneNumber"}
                   value={props.values.mobilePhoneNumber}
                   onChange={props.handleChange}
                   onBlur={props.handleBlur}
                   isInvalid={(props.errors.mobilePhoneNumber && props.touched.mobilePhoneNumber) as boolean}

                />
                <Form.Control.Feedback
                type={"invalid"}
                >
                    {props.errors.mobilePhoneNumber}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group
                controlId={'username'}
                className={'user-data-group'}
            >
                <Form.Label
                    className={'user-data-label'}
                >{`${local.username }*`}
                </Form.Label>
                <Form.Control
                    type={"text"}
                    name={"username"}
                    data-qc={"username"}
                    value={props.values.username}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    isInvalid={(props.errors.username && props.touched.username) as boolean}
                />
                <Form.Control.Feedback
                    type="invalid">
                    {props.errors.username}
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
                        name={"password"}
                        data-qc={"password"}
                        value= {props.values.password}
                        placeholder={local.password}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        isInvalid={(props.errors.password && props.touched.password) as boolean}
                    />
                    <Form.Control.Feedback
                    type={'invalid'}
                    >
                        {props.errors.password}
                    </Form.Control.Feedback>
                </Col>
                <Col>
                    <Form.Label
                        className={'user-data-label'}
                    >{`${local.confrimPassword}*`}
                    </Form.Label>
                    <Form.Control
                        type={"password"}
                        name={'confirmPassword'}
                        data-qc={'confirmPassword'}
                        value={props.values.confirmPassword}
                        placeholder={local.confrimPassword}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        isInvalid={(props.errors.confirmPassword && props.touched.confirmPassword) as boolean}
                    />
                    <Form.Control.Feedback
                    type={'invalid'}
                    >
                        {props.errors.confirmPassword}
                    </Form.Control.Feedback>
                </Col>
            </Form.Group>
            <Form.Group 
            as={Row}
            className={['user-data-group']}
            >
                <Col >
                    <Button 
                    className ={'btn-cancel-prev'} style={{ width:'60%' }}  
                    onClick = {()=>{props.cancle()}}
                    >{local.cancel}</Button>
                </Col>
                <Col>
                    <Button  className= {'btn-submit-next'} style={{ float :'left',width:'60%' }} type="submit" data-qc="next">{local.next}</Button>
                </Col>
            </Form.Group>
        </Form>
    );

}