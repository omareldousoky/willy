import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import AsyncSelect from 'react-select/async';
import { searchLoanOfficer } from '../../Services/APIs/LoanOfficers/searchLoanOfficer';
import * as local from '../../../Shared/Assets/ar.json';

interface LoanOfficers {
    _id: string;
    username: string;
}
export const StepThreeForm = (props: any) => {
    const [loanOfficers, setLoanOfficers] = useState<Array<LoanOfficers>>([]);
    const getLoanOfficers = async (inputValue: string) => {
        const res = await searchLoanOfficer({ from: 0, size: 100, name: inputValue });
        setLoanOfficers(res.body.data);
        return res.body.data;
    }
    const { values, handleSubmit, handleBlur, handleChange, errors, touched, setFieldValue, previousStep } = props;
    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group as={Row} controlId="geographicalDistribution">
                <Form.Label style={{ textAlign: 'right' }} column sm={2}>{`${local.geographicalDistribution}*`}</Form.Label>
                <Col sm={6}>
                    <Form.Control as="select"
                        type="select"
                        name="geographicalDistribution"
                        data-qc="geographicalDistribution"
                        value={values.geographicalDistribution}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        isInvalid={errors.geographicalDistribution && touched.geographicalDistribution}
                    >
                        <option value="" disabled></option>
                        <option value="geographicalDistribution1">geographicalDistribution1</option>
                        <option value="geographicalDistribution2">geographicalDistribution2</option>
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                        {errors.geographicalDistribution}
                    </Form.Control.Feedback>
                </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="representative">
                <Form.Label style={{ textAlign: 'right' }} column sm={2}>{`${local.representative}*`}</Form.Label>
                <Col sm={6}>
                    {/* <Form.Control as="select"
                        type="select"
                        name="representative"
                        data-qc="representative"
                        value={values.representative}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        isInvalid={errors.representative && touched.representative}
                    >
                        <option value="" disabled></option>
                        <option value="representative1">representative1</option>
                        <option value="representative2">representative2</option>
                    </Form.Control> */}
                    <AsyncSelect
                        name="representative"
                        data-qc="representative"
                        value={loanOfficers?.find(loanOfficer => loanOfficer._id ===values.representative)}
                        onBlur={handleBlur}
                        onChange={(e) => setFieldValue("representative", e._id)}
                        getOptionLabel={(option) => option.username}
                        getOptionValue={(option) => option._id}
                        loadOptions={getLoanOfficers}
                        cacheOptions defaultOptions
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.representative}
                    </Form.Control.Feedback>
                </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="applicationDate">
                <Form.Label style={{ textAlign: 'right' }} column sm={2}>{`${local.applicationDate}*`}</Form.Label>
                <Col sm={6}>
                    <Form.Control
                        type="date"
                        name="applicationDate"
                        data-qc=""
                        value={values.applicationDate}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        isInvalid={errors.applicationDate && touched.applicationDate}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.applicationDate}
                    </Form.Control.Feedback>
                </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="permanentEmployeeCount">
                <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.permanentEmployeeCount}</Form.Label>
                <Col sm={6}>
                    <Form.Control
                        type="text"
                        name="permanentEmployeeCount"
                        data-qc="permanentEmployeeCount"
                        value={values.permanentEmployeeCount}
                        onBlur={handleBlur}
                        onChange={(event: React.FormEvent<HTMLInputElement>) => {
                            const re = /^\d*$/;
                            if (event.currentTarget.value === '' || re.test(event.currentTarget.value)) {
                                setFieldValue('permanentEmployeeCount', event.currentTarget.value)
                            }
                        }}
                        isInvalid={errors.permanentEmployeeCount && touched.permanentEmployeeCount}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.permanentEmployeeCount}
                    </Form.Control.Feedback>
                </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="partTimeEmployeeCount">
                <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.partTimeEmployeeCount}</Form.Label>
                <Col sm={6}>
                    <Form.Control
                        type="text"
                        name="partTimeEmployeeCount"
                        data-qc="partTimeEmployeeCount"
                        value={values.partTimeEmployeeCount}
                        onBlur={handleBlur}
                        onChange={(event: React.FormEvent<HTMLInputElement>) => {
                            const re = /^\d*$/;
                            if (event.currentTarget.value === '' || re.test(event.currentTarget.value)) {
                                setFieldValue('partTimeEmployeeCount', event.currentTarget.value)
                            }
                        }}
                        isInvalid={errors.partTimeEmployeeCount && touched.partTimeEmployeeCount}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.partTimeEmployeeCount}
                    </Form.Control.Feedback>
                </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="accountNumber">
                <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.accountNumber}</Form.Label>
                <Col sm={6}>
                    <Form.Control
                        type="text"
                        name="accountNumber"
                        data-qc="accountNumber"
                        value={values.accountNumber}
                        onBlur={handleBlur}
                        onChange={(event: React.FormEvent<HTMLInputElement>) => {
                            const re = /^\d*$/;
                            if (event.currentTarget.value === '' || re.test(event.currentTarget.value)) {
                                setFieldValue('accountNumber', event.currentTarget.value)
                            }
                        }}
                        isInvalid={errors.accountNumber && touched.accountNumber}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.accountNumber}
                    </Form.Control.Feedback>
                </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="accountBranch">
                <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.accountBranch}</Form.Label>
                <Col sm={6}>
                    <Form.Control
                        type="text"
                        name="accountBranch"
                        data-qc="accountBranch"
                        value={values.accountBranch}
                        onChange={handleChange}
                        isInvalid={errors.accountBranch && touched.accountBranch}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.accountBranch}
                    </Form.Control.Feedback>
                </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="comments">
                <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.comments}</Form.Label>
                <Col sm={6}>
                    <Form.Control as="textarea"
                        rows="3"
                        name="comments"
                        data-qc="comments"
                        value={values.comments}
                        onChange={handleChange}
                        isInvalid={errors.comments && touched.comments}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.comments}
                    </Form.Control.Feedback>
                </Col>
            </Form.Group>
            <Button style={{ float: 'right' }} onClick={() => previousStep(values)} data-qc="previous">{local.previous}</Button>
            <Button type="submit" data-qc="submit">{local.submit}</Button>
        </Form>
    )
}