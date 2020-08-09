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
    const [loanOfficers, setLoanOfficers] = useState<Array<any>>([]);
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
                        <Can I="updateNationalId" a="customer" passThrough>
                            {allowed => <Form.Control as="select"
                                type="select"
                                name="geographicalDistribution"
                                data-qc="geographicalDistribution"
                                value={values.geographicalDistribution}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                disabled={(!allowed && (props.hasLoan || props.isGuarantor))}
                                isInvalid={errors.geographicalDistribution && touched.geographicalDistribution}
                            >
                                <option value="" disabled></option>
                                {geoDivisions.map((geoDivision, index) => {
                                    return <option key={index} value={geoDivision.majorGeoDivisionName.ar} >{geoDivision.majorGeoDivisionName.ar}</option>
                                })}
                            </Form.Control>}
                        </Can>
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
                        <Can I="updateNationalId" a="customer" passThrough>
                            {allowed => <AsyncSelect
                                className={errors.representative ? "error" : ""}
                                name="representative"
                                data-qc="representative"
                                value={loanOfficers?.find(loanOfficer => loanOfficer._id === (typeof values.representative === 'string'? values.representative : values.representative._id))}
                                onBlur={handleBlur}
                                onChange={(representative) => {
                                    if(props.edit && values.representative !== representative._id) {setFieldValue("newRepresentative", representative._id); setFieldValue("representative", representative._id)}
                                    else setFieldValue("representative", representative._id)}
                                }
                                getOptionLabel={(option) => option.name}
                                getOptionValue={(option) => option._id}
                                loadOptions={getLoanOfficers}
                                isDisabled={(!allowed && (props.hasLoan || props.isGuarantor))}
                                cacheOptions defaultOptions
                            />}
                        </Can>
                        <div style={{ width: '100%', marginTop: '0.25rem', fontSize: '80%', color: '#d51b1b' }}>
                            {errors.representative}
                        </div>
                    </Form.Group>
                </Col>
                <Col sm={6}>
                    <Form.Group controlId="applicationDate">
                        <Form.Label className="customer-form-label">{`${local.applicationDate}*`}</Form.Label>
                        <Can I="updateNationalId" a="customer" passThrough>
                            {allowed => <Form.Control
                                type="date"
                                name="applicationDate"
                                data-qc=""
                                value={values.applicationDate}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                disabled={(!allowed && (props.hasLoan || props.isGuarantor))}
                                isInvalid={errors.applicationDate && touched.applicationDate}
                            />}
                        </Can>
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
                        <Can I="updateNationalId" a="customer" passThrough>
                            {allowed => <Form.Control
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
                                disabled={(!allowed && (props.hasLoan || props.isGuarantor))}
                                isInvalid={errors.permanentEmployeeCount && touched.permanentEmployeeCount}
                            />}
                        </Can>
                        <Form.Control.Feedback type="invalid">
                            {errors.permanentEmployeeCount}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col sm={6}>
                    <Form.Group controlId="partTimeEmployeeCount">
                        <Form.Label className="customer-form-label">{local.partTimeEmployeeCount}</Form.Label>
                        <Can I="updateNationalId" a="customer" passThrough>
                            {allowed => <Form.Control
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
                                disabled={(!allowed && (props.hasLoan || props.isGuarantor))}
                                isInvalid={errors.partTimeEmployeeCount && touched.partTimeEmployeeCount}
                            />}
                        </Can>
                        <Form.Control.Feedback type="invalid">
                            {errors.partTimeEmployeeCount}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col sm={6}>
                        <Form.Group controlId="guarantorMaxLoans">
                            <Form.Label className="customer-form-label">{`${local.guarantorMaxLoans}`}</Form.Label>
                            <Can I="updateNationalId" a="customer" passThrough>
                                {allowed => <Form.Control
                                    type="text"
                                    name="guarantorMaxLoans"
                                    data-qc=""
                                    value={values.guarantorMaxLoans}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    disabled={(!allowed && (props.hasLoan || props.isGuarantor))}
                                    isInvalid={errors.guarantorMaxLoans && touched.guarantorMaxLoans}
                                />}
                            </Can>
                            <Form.Control.Feedback type="invalid">
                                {errors.guarantorMaxLoans}
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
                                    value={values.allowMultiLoans}
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
                                    value={values.allowGuarantorLoan}
                                    label={local.allowGuarantorLoan}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                        {/* <Col sm={4}>
                            <Form.Group>
                                <Form.Check
                                    name="guarantorMaxLoans"
                                    id="guarantorMaxLoans"
                                    data-qc="guarantorMaxLoans"
                                    type='checkbox'
                                    checked={values.guarantorMaxLoans}
                                    value={values.guarantorMaxLoans}
                                    label={local.guarantorMaxLoans}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col> */}
                    </Row>
                }
            </Can>
            <Row>
                <Col sm={12}>
                    <Form.Group controlId="comments">
                        <Form.Label className="customer-form-label">{local.comments}</Form.Label>
                        <Can I="updateNationalId" a="customer" passThrough>
                            {allowed => <Form.Control as="textarea"
                                rows={3}
                                name="comments"
                                data-qc="comments"
                                value={values.comments}
                                onChange={handleChange}
                                disabled={(!allowed && (props.hasLoan || props.isGuarantor))}
                                isInvalid={errors.comments && touched.comments}
                            />}
                        </Can>
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