import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import * as local from '../../../Shared/Assets/ar.json';

export const LoanApplicationCreationForm = (props: any) => {
    const { values, handleSubmit, handleBlur, handleChange, errors, touched, setFieldValue } = props;
    return (
        <Form style={{ justifyContent: 'center', alignItems: 'flex-start', display: 'flex', flexDirection: 'column' }} onSubmit={handleSubmit}>
            <div style={{ border: '1px solid black', width: '100%' }}>
                <p style={{ textAlign: 'right' }}>{local.mainInfo}</p>
                <div>
                    <Form.Group as={Row} controlId="customerName">
                        <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.name}</Form.Label>
                        <Col sm={6}>
                            <Form.Control
                                type="text"
                                name="customerName"
                                data-qc="customerName"
                                value={values.customerName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={errors.customerName && touched.customerName}
                                disabled
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="customerCode">
                        <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.customerCode}</Form.Label>
                        <Col sm={6}>
                            <Form.Control
                                type="text"
                                name="customerCode"
                                data-qc="customerCode"
                                value={values.customerCode}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={errors.customerCode && touched.customerCode}
                                disabled
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="nationalId">
                        <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.nationalId}</Form.Label>
                        <Col sm={6}>
                            <Form.Control
                                type="text"
                                name="nationalId"
                                data-qc="nationalId"
                                value={values.nationalId}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                isInvalid={errors.nationalId && touched.nationalId}
                                maxLength={14}
                                disabled
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="birthDate">
                        <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.birthDate}</Form.Label>
                        <Col sm={6}>
                            <Form.Control
                                type="date"
                                name="birthDate"
                                data-qc="birthDate"
                                value={values.birthDate}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                isInvalid={errors.birthDate && touched.birthDate}
                                disabled
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="gender">
                        <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.gender}</Form.Label>
                        <Col sm={6}>
                            <Form.Control as="select"
                                type="select"
                                name="gender"
                                data-qc="gender"
                                value={values.gender}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                isInvalid={errors.gender && touched.gender}
                                disabled
                            >
                                <option value="" disabled></option>
                                <option value="male">{local.male}</option>
                                <option value="female">{local.female}</option>
                            </Form.Control>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="nationalIdIssueDate">
                        <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.nationalIdIssueDate}</Form.Label>
                        <Col sm={6}>
                            <Form.Control
                                type="date"
                                name="nationalIdIssueDate"
                                data-qc="nationalIdIssueDate"
                                value={values.nationalIdIssueDate}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                isInvalid={errors.nationalIdIssueDate && touched.nationalIdIssueDate}
                                disabled
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="businessSector">
                        <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.businessSector}</Form.Label>
                        <Col sm={6}>
                            <Form.Control as="select"
                                type="select"
                                name="businessSector"
                                data-qc="businessSector"
                                value={values.businessSector}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                isInvalid={errors.businessSector && touched.businessSector}
                                disabled
                            >
                                <option value="" disabled></option>
                                <option value="businessSector1">businessSector1</option>
                                <option value="businessSector2">businessSector2</option>
                            </Form.Control>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="businessActivity">
                        <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.businessActivity}</Form.Label>
                        <Col sm={6}>
                            <Form.Control as="select"
                                type="select"
                                name="businessActivity"
                                data-qc="businessActivity"
                                value={values.businessActivity}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                isInvalid={errors.businessActivity && touched.businessActivity}
                                disabled
                            >
                                <option value="" disabled></option>
                                <option value="businessActivity1">businessActivity1</option>
                                <option value="businessActivity2">businessActivity2</option>
                            </Form.Control>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="businessSpeciality">
                        <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.businessSpeciality}</Form.Label>
                        <Col sm={6}>
                            <Form.Control as="select"
                                type="select"
                                name="businessSpeciality"
                                data-qc="businessSpeciality"
                                value={values.businessSpeciality}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                isInvalid={errors.businessSpeciality && touched.businessSpeciality}
                                disabled
                            >
                                <option value="" disabled></option>
                                <option value="businessSpeciality1">businessSpeciality1</option>
                                <option value="businessSpeciality2">businessSpeciality2</option>
                            </Form.Control>
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
                                onChange={handleChange}
                                isInvalid={errors.permanentEmployeeCount && touched.permanentEmployeeCount}
                                disabled
                            />
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
                                onChange={handleChange}
                                isInvalid={errors.partTimeEmployeeCount && touched.partTimeEmployeeCount}
                                disabled
                            />
                        </Col>
                    </Form.Group>
                </div>
            </div>
            <div style={{ width: '100%' }}>
                <p style={{ textAlign: 'right' }}>{local.loanInfo}</p>
                <div>
                    <Form.Group as={Row} controlId="productName">
                        <Form.Label style={{ textAlign: 'right' }} column sm={4}>{local.productName}</Form.Label>
                        <Col sm={6}>
                            <Form.Control
                                type="text"
                                name="productName"
                                data-qc="productName"
                                value={values.productName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={errors.productName && touched.productName}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.productName}
                            </Form.Control.Feedback>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="calculationFormulaId">
                        <Form.Label style={{ textAlign: 'right' }} column sm={4}>{local.calculationFormulaId}</Form.Label>
                        <Col sm={6}>
                            <Form.Control as="select"
                                name="calculationFormulaId"
                                data-qc="calculationFormulaId"
                                value={values.calculationFormulaId}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                isInvalid={errors.calculationFormulaId && touched.calculationFormulaId}
                            >
                                <option value=''></option>
                                {props.formulas.map((formula, i) =>
                                    <option key={i} value={formula._id}>{formula.name}</option>
                                )}
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">
                                {errors.calculationFormulaId}
                            </Form.Control.Feedback>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="currency">
                        <Form.Label style={{ textAlign: 'right' }} column sm={4}>{local.currency}</Form.Label>
                        <Col sm={6}>
                            <Form.Control as="select"
                                name="currency"
                                data-qc="currency"
                                value={values.currency}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                isInvalid={errors.currency && touched.currency}
                            >
                                <option value='egp'>EGP</option>
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">
                                {errors.currency}
                            </Form.Control.Feedback>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="interest">
                        <Form.Label style={{ textAlign: 'right' }} column sm={4}>{local.interest}</Form.Label>
                        <Col sm={6}>
                            <Form.Control
                                type="text"
                                name="interest"
                                data-qc="interest"
                                value={values.interest}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={errors.interest && touched.interest}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.interest}
                            </Form.Control.Feedback>
                        </Col>
                        <Col sm={3}>
                            <Form.Control as="select"
                                name="interestPeriod"
                                data-qc="interestPeriod"
                                value={values.interestPeriod}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                isInvalid={errors.interestPeriod && touched.interestPeriod}
                            >
                                <option value='yearly'>نسبه سنويه</option>
                                <option value='monthly'>نسبه شهريه</option>
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">
                                {errors.interestPeriod}
                            </Form.Control.Feedback>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="inAdvanceFees">
                        <Form.Label style={{ textAlign: 'right' }} column sm={4}>{local.inAdvanceFees}</Form.Label>
                        <Col sm={6}>
                            <Form.Control
                                type="text"
                                name="inAdvanceFees"
                                data-qc="inAdvanceFees"
                                value={values.inAdvanceFees}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={errors.inAdvanceFees && touched.inAdvanceFees}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.inAdvanceFees}
                            </Form.Control.Feedback>
                        </Col>
                        <Col sm={3}>
                            <Form.Control as="select"
                                name="inAdvanceFrom"
                                data-qc="v"
                                value={values.inAdvanceFrom}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                isInvalid={errors.inAdvanceFrom && touched.inAdvanceFrom}
                            >
                                <option value='principal'>نسبة من قيمة القرض</option>
                                <option value='monthly'>شهري</option>
                                <option value='yearly'>سنوي</option>
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">
                                {errors.inAdvanceFrom}
                            </Form.Control.Feedback>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="InAdvanceType">
                        <Form.Label style={{ textAlign: 'right' }} column sm={4}>{local.inAdvanceType}</Form.Label>
                        <Col sm={6}>
                            <Form.Control as="select"
                                name="InAdvanceType"
                                data-qc="InAdvanceType"
                                value={values.InAdvanceType}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                isInvalid={errors.InAdvanceType && touched.InAdvanceType}
                            >
                                <option value='cut'>تستقطع من المصاريف</option>
                                <option value='uncut'>لا تستقطع من المصاريف</option>
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">
                                {errors.InAdvanceType}
                            </Form.Control.Feedback>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="periodLength">
                        <Form.Label style={{ textAlign: 'right' }} column sm={4}>{local.periodLength}</Form.Label>
                        <Col sm={6}>
                            <Form.Control
                                type="text"
                                name="periodLength"
                                data-qc="periodLength"
                                value={values.periodLength}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={errors.periodLength && touched.periodLength}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.periodLength}
                            </Form.Control.Feedback>
                        </Col>
                        <Col sm={3}>
                            <Form.Control as="select"
                                name="periodType"
                                data-qc="periodType"
                                value={values.periodType}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                isInvalid={errors.periodType && touched.periodType}
                            >
                                <option value='months'>شهر</option>
                                <option value='days'>يوم</option>
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">
                                {errors.periodType}
                            </Form.Control.Feedback>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="gracePeriod">
                        <Form.Label style={{ textAlign: 'right' }} column sm={4}>{local.gracePeriod}</Form.Label>
                        <Col sm={6}>
                            <Form.Control
                                type="text"
                                name="gracePeriod"
                                data-qc="gracePeriod"
                                value={values.gracePeriod}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={errors.gracePeriod && touched.gracePeriod}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.gracePeriod}
                            </Form.Control.Feedback>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="pushPayment">
                        <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.pushPayment}</Form.Label>
                        <Col sm={6}>
                            <Form.Control
                                type="number"
                                name="pushPayment"
                                data-qc="pushPayment"
                                value={values.pushPayment}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={errors.pushPayment && touched.pushPayment}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.pushPayment}
                            </Form.Control.Feedback>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="noOfInstallments">
                        <Form.Label style={{ textAlign: 'right' }} column sm={4}>{local.noOfInstallments}</Form.Label>
                        <Col sm={6}>
                            <Form.Control
                                type="text"
                                name="noOfInstallments"
                                data-qc="noOfInstallments"
                                value={values.noOfInstallments}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={errors.noOfInstallments && touched.noOfInstallments}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.noOfInstallments}
                            </Form.Control.Feedback>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="principal">
                        <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.principal}</Form.Label>
                        <Col sm={6}>
                            <Form.Control
                                type="number"
                                name="principal"
                                data-qc="principal"
                                value={values.principal}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={errors.principal && touched.principal}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.principal}
                            </Form.Control.Feedback>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="applicationFee">
                        <Form.Label style={{ textAlign: 'right' }} column sm={4}>{local.applicationFee}</Form.Label>
                        <Col sm={6}>
                            <Form.Control
                                type="text"
                                name="applicationFee"
                                data-qc="applicationFee"
                                value={values.applicationFee}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={errors.applicationFee && touched.applicationFee}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.applicationFee}
                            </Form.Control.Feedback>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="individualApplicationFee">
                        <Form.Label style={{ textAlign: 'right' }} column sm={4}>{local.individualApplicationFee}</Form.Label>
                        <Col sm={6}>
                            <Form.Control
                                type="text"
                                name="individualApplicationFee"
                                data-qc="individualApplicationFee"
                                value={values.individualApplicationFee}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={errors.individualApplicationFee && touched.individualApplicationFee}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.individualApplicationFee}
                            </Form.Control.Feedback>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="applicationFeePercent">
                        <Form.Label style={{ textAlign: 'right' }} column sm={4}>{local.applicationFeePercent}</Form.Label>
                        <Col sm={6}>
                            <Form.Control
                                type="text"
                                name="applicationFeePercent"
                                data-qc="applicationFeePercent"
                                value={values.applicationFeePercent}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={errors.applicationFeePercent && touched.applicationFeePercent}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.applicationFeePercent}
                            </Form.Control.Feedback>
                        </Col>
                        <Col sm={4}>
                            <Form.Control as="select"
                                name="applicationFeeType"
                                data-qc="applicationFeeType"
                                value={values.applicationFeeType}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                isInvalid={errors.applicationFeeType && touched.applicationFeeType}
                            >
                                <option value='principal'>نسبة من قيمة القرض</option>
                                <option value='monthly'>شهري</option>
                                <option value='yearly'>سنوي</option>
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">
                                {errors.applicationFeeType}
                            </Form.Control.Feedback>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="applicationFeePercentPerPerson">
                        <Form.Label style={{ textAlign: 'right' }} column sm={4}>{local.applicationFeePercentPerPerson}</Form.Label>
                        <Col sm={6}>
                            <Form.Control
                                type="text"
                                name="applicationFeePercentPerPerson"
                                data-qc="applicationFeePercentPerPerson"
                                value={values.applicationFeePercentPerPerson}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={errors.applicationFeePercentPerPerson && touched.applicationFeePercentPerPerson}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.applicationFeePercentPerPerson}
                            </Form.Control.Feedback>
                        </Col>
                        <Col sm={4}>
                            <Form.Control as="select"
                                name="applicationFeePercentPerPersonType"
                                data-qc="applicationFeePercentPerPersonType"
                                value={values.applicationFeePercentPerPersonType}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                isInvalid={errors.applicationFeePercentPerPersonType && touched.applicationFeePercentPerPersonType}
                            >
                                <option value='principal'>نسبة من قيمة القرض</option>
                                <option value='monthly'>شهري</option>
                                <option value='yearly'>سنوي</option>
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">
                                {errors.applicationFeePercentPerPersonType}
                            </Form.Control.Feedback>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="representativeFees">
                        <Form.Label style={{ textAlign: 'right' }} column sm={4}>{local.representativeFees}</Form.Label>
                        <Col sm={6}>
                            <Form.Control
                                type="text"
                                name="representativeFees"
                                data-qc="representativeFees"
                                value={values.representativeFees}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={errors.representativeFees && touched.representativeFees}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.representativeFees}
                            </Form.Control.Feedback>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="stamps">
                        <Form.Label style={{ textAlign: 'right' }} column sm={4}>{local.stamps}</Form.Label>
                        <Col sm={6}>
                            <Form.Control
                                type="text"
                                name="stamps"
                                data-qc="stamps"
                                value={values.stamps}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={errors.stamps && touched.stamps}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.stamps}
                            </Form.Control.Feedback>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="adminFees">
                        <Form.Label style={{ textAlign: 'right' }} column sm={4}>{local.adminFees}</Form.Label>
                        <Col sm={6}>
                            <Form.Control
                                type="text"
                                name="adminFees"
                                data-qc="adminFees"
                                value={values.adminFees}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={errors.adminFees && touched.adminFees}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.adminFees}
                            </Form.Control.Feedback>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="dataEnrtyDate">
                        <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.dataEnrtyDate}</Form.Label>
                        <Col sm={6}>
                            <Form.Control
                                type="date"
                                name="dataEnrtyDate"
                                data-qc="dataEnrtyDate"
                                value={values.dataEnrtyDate}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                isInvalid={errors.dataEnrtyDate && touched.dataEnrtyDate}
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="loanPurpose">
                        <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.loanPurpose}</Form.Label>
                        <Col sm={6}>
                            <Form.Control as="select"
                                type="select"
                                name="loanPurpose"
                                data-qc="loanPurpose"
                                value={values.loanPurpose}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                isInvalid={errors.loanPurpose && touched.loanPurpose}
                                disabled
                            >
                                <option value="" disabled></option>
                            </Form.Control>
                        </Col>
                    </Form.Group><Form.Group as={Row} controlId="representative">
                        <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.representative}</Form.Label>
                        <Col sm={6}>
                            <Form.Control as="select"
                                type="select"
                                name="representative"
                                data-qc="representative"
                                value={values.representative}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                isInvalid={errors.representative && touched.representative}
                                disabled
                            >
                                <option value="" disabled></option>
                            </Form.Control>
                        </Col>
                    </Form.Group><Form.Group as={Row} controlId="examiner">
                        <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.examiner}</Form.Label>
                        <Col sm={6}>
                            <Form.Control as="select"
                                type="select"
                                name="examiner"
                                data-qc="examiner"
                                value={values.examiner}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                isInvalid={errors.examiner && touched.examiner}
                                disabled
                            >
                                <option value="" disabled></option>
                            </Form.Control>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="examinationDate">
                        <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.examinationDate}</Form.Label>
                        <Col sm={6}>
                            <Form.Control
                                type="date"
                                name="examinationDate"
                                data-qc="examinationDate"
                                value={values.examinationDate}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                isInvalid={errors.examinationDate && touched.examinationDate}
                                disabled
                            />
                        </Col>
                    </Form.Group>
                </div>
            </div>
            <div style={{ border: '1px solid black', width: '100%' }}>
                <p style={{ textAlign: 'right' }}>{local.guarantorInfo}</p>
                <div>

                </div>
            </div>
            <Button type="button" style={{ margin: 10 }} onClick={handleSubmit}>{local.submit}</Button>
        </Form >
    )
}