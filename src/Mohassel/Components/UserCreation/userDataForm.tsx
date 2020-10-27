import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import './userCreation.scss'
import * as local from '../../../Shared/Assets/ar.json';
import { Loader } from '../../../Shared/Components/Loader';
import Can from '../../config/Can';
import { checkIssueDate } from '../../../Shared/Services/utils';
import { Values, Errors, Touched } from './userCreationinterfaces';
import { checkNationalIdDuplicates } from '../../Services/APIs/User-Creation/checkNationalIdDup';
import { checkUsernameDuplicates } from '../../Services/APIs/User-Creation/checkUsernameDup';
import { checkHRCodeDuplicates } from '../../Services/APIs/User-Creation/checkHRCodeDUP';
import { getBirthdateFromNationalId, getGenderFromNationalId } from '../../Services/nationalIdValidation';
interface Props {
    values: Values;
    errors: Errors;
    touched: Touched;
    edit?: boolean;
    _id?: string;
    handleChange: (eventOrPath: string | React.ChangeEvent<any>) => void | ((eventOrTextValue: string | React.ChangeEvent<any>) => void);
    handleBlur: (eventOrString: any) => void | ((e: any) => void);
    handleSubmit: (e?: React.FormEvent<HTMLFormElement> | undefined) => void;
    cancle: (e?: React.FormEvent<HTMLFormElement> | undefined) => void;
    setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => any;
}
export const UserDataForm = (props: Props) => {
    const handleSubmit = props.handleSubmit;
    const [loading, setLoading] = useState(false);
    return (
        <Form
            onSubmit={handleSubmit}
            className=" user-data-form"
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
            <Row>
                <Col sm={5}>
                    <Form.Group
                        controlId={'nationalId'}
                        className={'user-data-group'}
                    >
                        <Form.Label
                            className={'user-data-label'}
                        >{`${local.nationalId}*`}
                        </Form.Label>
                        <Can I="edit" a="NationalId" passThrough>
                            {allowed => <Form.Control
                                type={"text"}
                                placeholder={`${local.example} : ${local.nationalIdPlaceholder}`}
                                name={"nationalId"}
                                data-qc={"nationalId"}
                                value={props.values.nationalId}
                                onBlur={props.handleBlur}
                                onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                    const re = /^\d*$/;
                                    const { name, value } = event.currentTarget;
                                    if (event.currentTarget.value === '' || re.test(event.currentTarget.value)) {
                                        props.setFieldValue('nationalId', value)
                                    }
                                    if (value.length === 14) {
                                        setLoading(true);
                                        const res = await checkNationalIdDuplicates(value);
                                        if (res.status === 'success') {
                                            setLoading(false);
                                            props.setFieldValue('nationalIdChecker', res.body.Exists);
                                            props.setFieldValue('birthDate', getBirthdateFromNationalId(value));
                                            props.setFieldValue('gender', getGenderFromNationalId(value));
                                        } else setLoading(false);
                                    }
                                }}
                                isInvalid={(props.errors.nationalId && props.touched.nationalId) as boolean}
                                maxLength={14}
                                disabled={(!allowed && props.edit)}
                            />
                            }
                        </Can>
                        <Form.Control.Feedback
                            type="invalid">
                            {props.errors.nationalId}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col sm={4}>
                    <Form.Group controlId="birthDate">
                        <Form.Label className={'user-data-label'}>{`${local.birthDate}*`}</Form.Label>
                        <Form.Control
                            type="Date"
                            name="birthDate"
                            data-qc="birthDate"
                            value={(props.values.birthDate) as string}
                            onBlur={props.handleBlur}
                            onChange={props.handleChange}
                            isInvalid={(props.errors.birthDate && props.touched.birthDate) as boolean}
                            disabled
                        >
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                            {props.errors.birthDate}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col sm={3}>
                    <Form.Group controlId="gender">
                        <Form.Label className={'user-data-label'}>{`${local.gender}*`}</Form.Label>
                        <Form.Control as="select"
                            type="select"
                            name="gender"
                            data-qc="gender"
                            placeholder={`${local.example}:${local.female}`}
                            value={props.values.gender}
                            onBlur={props.handleBlur}
                            onChange={props.handleChange}
                            isInvalid={(props.errors.gender && props.touched.gender) as boolean}
                            disabled
                        >
                            <option value="" disabled></option>
                            <option value="male">{local.male}</option>
                            <option value="female">{local.female}</option>
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                            {props.errors.gender}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>
            <Form.Group controlId="nationalIdIssueDate">
                <Form.Label className={'user-data-label'}>{`${local.nationalIdIssueDate}*`}</Form.Label>
                <Form.Control
                    type="date"
                    name="nationalIdIssueDate"
                    data-qc="nationalIdIssueDate"
                    value={(props.values.nationalIdIssueDate) as string}
                    onBlur={props.handleBlur}
                    onChange={props.handleChange}
                    isInvalid={(props.errors.nationalIdIssueDate && props.touched.nationalIdIssueDate) as boolean}
                />
                <Form.Control.Feedback type="invalid" style={checkIssueDate(props.values.nationalIdIssueDate) !== "" ? { display: 'block' } : {}}>
                    {props.errors.nationalIdIssueDate || checkIssueDate(props.values.nationalIdIssueDate)}
                </Form.Control.Feedback>
            </Form.Group>
            <Row>
                <Col>
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
                            value={props.values.hrCode.trim()}
                            onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                props.setFieldValue('hrCode', event.currentTarget.value);
                                setLoading(true);
                                const res = await checkHRCodeDuplicates(event.currentTarget.value,props._id);

                                if (res.status === 'success') {
                                    setLoading(false);
                                    props.setFieldValue('hrCodeChecker', res.body.Exists);
                                } else setLoading(false);

                            }}
                            onBlur={props.handleBlur}
                            isInvalid={(props.errors.hrCode && props.touched.hrCode) as boolean}
                        />
                        <Form.Control.Feedback
                            type="invalid">
                            {props.errors.hrCode}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col>
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
                        />
                        <Form.Control.Feedback
                            type="invalid">
                            {props.errors.hiringDate}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>


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
                >{`${local.username}*`}
                </Form.Label>
                <Form.Control
                    type={"text"}
                    name={"username"}
                    data-qc={"username"}
                    value={props.values.username}
                    onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                        props.setFieldValue('username', event.currentTarget.value);
                        setLoading(true);
                        const res = await checkUsernameDuplicates(event.currentTarget.value.trim());

                        if (res.status === 'success') {
                            setLoading(false);
                            props.setFieldValue('usernameChecker', res.body.Exists);
                        } else setLoading(false);

                    }}
                    onBlur={props.handleBlur}
                    disabled={props.edit}
                    isInvalid={(props.errors.username && props.touched.username) as boolean}
                />
                <Form.Control.Feedback
                    type="invalid">
                    {props.errors.username}
                </Form.Control.Feedback>
                <Col sm={1}>
                    <Col sm={1}>
                        <Loader type="inline" open={loading} />
                    </Col>
                </Col>
            </Form.Group>
            <Form.Group as={Row}
                className={'user-data-group'}
            >
                <Col>
                    <Form.Label
                        className={'user-data-label'}
                    >{props.edit ? `${local.changePassword}` : `${local.password}*`}
                    </Form.Label>
                    <Form.Control
                        type={"password"}
                        name={"password"}
                        data-qc={"password"}
                        value={props.values.password}
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
                    >{props.edit ? local.confrimPassword : `${local.confrimPassword}*`}
                    </Form.Label>
                    <Form.Control
                        type={"password"}
                        name={'confirmPassword'}
                        data-qc={'confirmPassword'}
                        value={props.values.confirmPassword}
                        placeholder={`${local.confrimPassword}*`}
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
                        className={'btn-cancel-prev'} style={{ width: '60%' }}
                        onClick={() => { props.cancle() }}
                    >{local.cancel}</Button>
                </Col>
                <Col>
                    <Button className={'btn-submit-next'} style={{ float: 'left', width: '60%' }} type="submit" data-qc="next">{local.next}</Button>
                </Col>
            </Form.Group>
        </Form>
    );

}