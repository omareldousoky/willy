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
import Can from '../../config/Can';

interface GeoDivision {
    majorGeoDivisionName: { ar: string };
    majorGeoDivisionLegacyCode: number;
}
interface LoanOfficer {
    _id: string;
    username: string;
    name: string;
}
export const StepThreeForm = (props: any) => {
    const [loading, setLoading] = useState(false);
    const [loanOfficers, setLoanOfficers] = useState<Array<LoanOfficer>>([]);
    const [geoDivisions, setgeoDivisions] = useState<Array<GeoDivision>>([{
        majorGeoDivisionName: { ar: '' },
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
    async function getConfig() {
        setLoading(true);
        const resGeo = await getGeoDivision();
        if (resGeo.status === "success") {
            setLoading(false);
            setgeoDivisions(resGeo.body.geoDivisions)
        } else setLoading(false);
    }
    useEffect(() => {
        getConfig();
    }, [])
    const { values, handleSubmit, handleBlur, handleChange, errors, touched, setFieldValue, previousStep } = props;
    return (
        <Form onSubmit={handleSubmit}>
            <Loader open={loading} type="fullscreen" />
            <Row>
                <Col sm={12}>
                    <Form.Group controlId="geographicalDistribution">
                        <Form.Label className="customer-form-label">{`${local.geographicalDistribution}*`}</Form.Label>
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
                                return <option key={index} value={geoDivision.majorGeoDivisionName.ar} >{geoDivision.majorGeoDivisionName.ar}</option>
                            })}
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                            {errors.geographicalDistribution}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col sm={6}>
                    <Form.Group controlId="representative">
                        <Form.Label className="customer-form-label">{`${local.representative}*`}</Form.Label>
                        <AsyncSelect
                            className={errors.representative ? "error" : ""}
                            name="representative"
                            data-qc="representative"
                            value={loanOfficers?.find(loanOfficer => loanOfficer._id === values.representative)}
                            onBlur={handleBlur}
                            onChange={(id) => setFieldValue("representative", id)}
                            getOptionLabel={(option) => option.name}
                            getOptionValue={(option) => option._id}
                            loadOptions={getLoanOfficers}
                            cacheOptions defaultOptions
                        />
                        <div style={{ width: '100%', marginTop: '0.25rem', fontSize: '80%', color: '#d51b1b' }}>
                            {errors.representative}
                        </div>
                    </Form.Group>
                </Col>
                <Col sm={6}>
                    <Form.Group controlId="applicationDate">
                        <Form.Label className="customer-form-label">{`${local.applicationDate}*`}</Form.Label>
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
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col sm={6}>
                    <Form.Group controlId="permanentEmployeeCount">
                        <Form.Label className="customer-form-label">{local.permanentEmployeeCount}</Form.Label>
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
                    </Form.Group>
                </Col>
                <Col sm={6}>
                    <Form.Group controlId="partTimeEmployeeCount">
                        <Form.Label className="customer-form-label">{local.partTimeEmployeeCount}</Form.Label>
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
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col sm={6}>
                    <Form.Group controlId="accountNumber">
                        <Form.Label className="customer-form-label">{local.accountNumber}</Form.Label>
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
                    </Form.Group>
                </Col>
                <Col sm={6}>
                    <Form.Group controlId="accountBranch">
                        <Form.Label className="customer-form-label">{local.accountBranch}</Form.Label>
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
                    </Form.Group>
                </Col>
            </Row>
            <Can I="updateNationalId" a="customer" passThrough>
                {allowed =>
                    props.edit && allowed &&
                    <Row>
                        <Col sm={4}>
                            <Form.Group>
                                <Form.Check
                                    name="allowMultiLoans"
                                    id="allowMultiLoans"
                                    data-qc="allowMultiLoans"
                                    type='checkbox'
                                    checked={values.allowMultiLoans}
                                    label={local.allowMultiLoans}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col sm={4}>
                            <Form.Group>
                                <Form.Check
                                    name="allowGuarantorLoan"
                                    id="allowGuarantorLoan"
                                    data-qc="allowGuarantorLoan"
                                    type='checkbox'
                                    checked={values.allowGuarantorLoan}
                                    label={local.allowGuarantorLoan}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col sm={4}>
                            <Form.Group>
                                <Form.Check
                                    name="allowMultiGuarantee"
                                    id="allowMultiGuarantee"
                                    data-qc="allowMultiGuarantee"
                                    type='checkbox'
                                    checked={values.allowMultiGuarantee}
                                    label={local.allowMultiGuarantee}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                }
            </Can>
            <Row>
                <Col sm={12}>
                    <Form.Group controlId="comments">
                        <Form.Label className="customer-form-label">{local.comments}</Form.Label>
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
                    </Form.Group>
                </Col>
            </Row>
            <Button style={{ float: 'right' }} onClick={() => previousStep(values)} data-qc="previous">{local.previous}</Button>
            <Button type="submit" data-qc="submit">{local.submit}</Button>
        </Form>
    )
}