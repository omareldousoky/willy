import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import * as local from '../../../Shared/Assets/ar.json';

export const LoanFormulaTestForm = (props: any) => {
    const { values, handleSubmit, handleBlur, handleChange, errors, touched, setFieldValue } = props;
    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group as={Row} controlId="calculationFormulaId">
                <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.calculationFormulaId}</Form.Label>
                <Col sm={6}>
                    <Form.Control as="select"
                        name="calculationFormulaId"
                        data-qc="calculationFormulaId"
                        value={values.calculationFormulaId}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        isInvalid={errors.calculationFormulaId && touched.calculationFormulaId}
                    >
                        {props.formulas.map((formula, i) =>
                            <option key={i} value={formula._id}>{formula.name}</option>
                        )}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                        {errors.calculationFormulaId}
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
                <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.noOfInstallments}</Form.Label>
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
            <Form.Group as={Row} controlId="gracePeriod">
                <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.gracePeriod}</Form.Label>
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
            <Form.Group as={Row} controlId="periodLength">
                <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.periodLength}</Form.Label>
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
            <Form.Group as={Row} controlId="interest">
                <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.interest}</Form.Label>
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
                        {errors.periodType}
                    </Form.Control.Feedback>
                </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="adminFees">
                <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.adminFees}</Form.Label>
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
            <Form.Group as={Row} controlId="loanStartDate">
                <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.loanStartDate}</Form.Label>
                <Col sm={6}>
                    <Form.Control
                        type="date"
                        name="loanStartDate"
                        data-qc="loanStartDate"
                        value={values.loanStartDate}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        isInvalid={errors.loanStartDate && touched.loanStartDate}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.loanStartDate}
                    </Form.Control.Feedback>
                </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="pushHolidays">
                <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.pushHolidays}</Form.Label>
                <Col sm={6}>
                    <Form.Control as="select"
                        name="pushHolidays"
                        data-qc="pushHolidays"
                        value={values.pushHolidays}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        isInvalid={errors.pushHolidays && touched.pushHolidays}
                    >
                        <option value='previous'>السابق</option>
                        <option value='next'>التالى</option>
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                        {errors.pushHolidays}
                    </Form.Control.Feedback>
                </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="inAdvanceFees">
                <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.inAdvanceFees}</Form.Label>
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
                        data-qc="inAdvanceFrom"
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

            <Form.Group as={Row} controlId="inAdvanceType">
                <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.inAdvanceType}</Form.Label>
                <Col sm={6}>
                    <Form.Control as="select"
                        name="inAdvanceType"
                        data-qc="inAdvanceType"
                        value={values.inAdvanceType}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        isInvalid={errors.inAdvanceType && touched.inAdvanceType}
                    >
                        <option value='uncut'>لا تستقطع من المصاريف الموزعه</option>
                        <option value='cut'>تستقطع من المصاريف الموزعه</option>
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                        {errors.inAdvanceType}
                    </Form.Control.Feedback>
                </Col>
            </Form.Group>
            <Button type="button" onClick={handleSubmit}>{local.submit}</Button>
        </Form >
    )
}
