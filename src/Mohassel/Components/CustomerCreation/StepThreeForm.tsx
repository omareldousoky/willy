import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import AsyncSelect from 'react-select/async';
import { getGeoDivision } from '../../Services/APIs/configApis/config'
import { searchLoanOfficer } from '../../Services/APIs/LoanOfficers/searchLoanOfficer';
import * as local from '../../../Shared/Assets/ar.json';
import { Loader } from '../../../Shared/Components/Loader';

interface GeoDivision {
    majorGeoDivisionName: {ar: string};
    majorGeoDivisionLegacyCode: number;
}
interface LoanOfficer {
    _id: string;
    username: string;
}
export const StepThreeForm = (props: any) => {
    const [loading, setLoading] = useState(false);
    const [loanOfficers, setLoanOfficers] = useState<Array<LoanOfficer>>([]);
    const [geoDivisions, setgeoDivisions] = useState<Array<GeoDivision>>([{
        majorGeoDivisionName: {ar: ''},
        majorGeoDivisionLegacyCode: 0
    }])
    const getLoanOfficers = async (inputValue: string) => {
        const res = await searchLoanOfficer({ from: 0, size: 100, name: inputValue });
        if (res.status === "success") {
            setLoanOfficers(res.body.data);
            return res.body.data;
        } else {
            setLoanOfficers([]);
            return [];
        }
    }
    useEffect(() => {
        getConfig();
    }, [])
    async function getConfig() {
        setLoading(true);
        const resGeo = await getGeoDivision();
        if (resGeo.status === "success") {
            setLoading(false);
            setgeoDivisions(resGeo.body.geoDivisions)
        } else setLoading(false);
    }
    const { values, handleSubmit, handleBlur, handleChange, errors, touched, setFieldValue, previousStep } = props;
    return (
        <Form onSubmit={handleSubmit}>
            <Loader open={loading} type="fullscreen"/>
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
                        {geoDivisions.map((geoDivision, index) => {
                            return <option key={index} value={geoDivision.majorGeoDivisionLegacyCode} >{geoDivision.majorGeoDivisionName.ar}</option>
                        })}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                        {errors.geographicalDistribution}
                    </Form.Control.Feedback>
                </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="representative">
                <Form.Label style={{ textAlign: 'right' }} column sm={2}>{`${local.representative}*`}</Form.Label>
                <Col sm={6}>
                        <AsyncSelect
                            className={errors.representative? "error": ""}
                            name="representative"
                            data-qc="representative"
                            value={loanOfficers?.find(loanOfficer => loanOfficer._id === values.representative._id)}
                            onBlur={handleBlur}
                            onChange={(id) => setFieldValue("representative", id)}
                            getOptionLabel={(option) => option.username}
                            getOptionValue={(option) => option._id}
                            loadOptions={getLoanOfficers}
                            cacheOptions defaultOptions
                        />
                    <div style={{width: '100%',marginTop: '0.25rem',fontSize: '80%',color: '#d51b1b'}}>
                        {errors.representative}
                    </div>
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
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
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
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
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
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
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
                        rows={3}
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