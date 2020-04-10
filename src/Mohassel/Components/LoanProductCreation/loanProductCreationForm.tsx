import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import * as local from '../../../Shared/Assets/ar.json';

export const LoanProductCreationForm = (props: any) => {
    const { values, handleSubmit, handleBlur, handleChange, errors, touched, setFieldValue } = props;
    return (
        <Form onSubmit={handleSubmit}>
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
            <Form.Group as={Row} controlId="loanNature">
                <Form.Label style={{ textAlign: 'right' }} column sm={4}>{local.loanNature}</Form.Label>
                <Col sm={6}>
                    <Form.Control as="select"
                        name="loanNature"
                        data-qc="loanNature"
                        value={values.loanNature}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        isInvalid={errors.loanNature && touched.loanNature}
                    >
                        <option value='cash'>Cash</option>
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                        {errors.loanNature}
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
            <Form.Group as={Row} controlId="periodLength">
                <Form.Label style={{ textAlign: 'right' }} column sm={4}>{local.periodLengthEvery}</Form.Label>
                <Col sm={6}>
                    <Form.Control
                        type="number"
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
            <Form.Group as={Row} controlId="noOfInstallments">
                <Form.Label style={{ textAlign: 'right' }} column sm={4}>{local.noOfInstallments}</Form.Label>
                <Col sm={6}>
                    <Form.Control
                        type="number"
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
            <Form.Group as={Row} controlId="lateDays">
                <Form.Label style={{ textAlign: 'right' }} column sm={4}>{local.lateDays}</Form.Label>
                <Col sm={6}>
                    <Form.Control
                        type="number"
                        name="lateDays"
                        data-qc="lateDays"
                        value={values.lateDays}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={errors.lateDays && touched.lateDays}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.lateDays}
                    </Form.Control.Feedback>
                </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="gracePeriod">
                <Form.Label style={{ textAlign: 'right' }} column sm={4}>{local.gracePeriod}</Form.Label>
                <Col sm={6}>
                    <Form.Control
                        type="number"
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
            <Form.Group as={Row} controlId="interest">
                <Form.Label style={{ textAlign: 'right' }} column sm={4}>{local.interest}</Form.Label>
                <Col sm={6}>
                    <Form.Control
                        type="number"
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
            <Form.Group as={Row} controlId='allowInterestAdjustmentTrue'>
                <Form.Label style={{ textAlign: 'right' }} column sm={4}>{local.allowInterestAdjustment}</Form.Label>
                <Form.Check
                    type='checkbox'
                    name='allowInterestAdjustment'
                    data-qc='allowInterestAdjustment'
                    value={values.allowInterestAdjustment}
                    checked={values.allowInterestAdjustment}
                    onBlur={handleBlur}
                    onChange={(e: any) => {
                        const val = e.currentTarget.value;
                        if (val === true) {
                            setFieldValue('allowInterestAdjustment', false)
                        } else {
                            setFieldValue('allowInterestAdjustment', true)
                        }
                    }}
                    isInvalid={errors.allowInterestAdjustment && touched.allowInterestAdjustment}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.allowInterestAdjustment}
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Row} controlId='allowInterestAdjustmentFalse'>
                <Form.Label style={{ textAlign: 'right' }} column sm={4}>{local.allowInterestAdjustmentFalse}</Form.Label>
                <Form.Check
                    type='checkbox'
                    name='allowInterestAdjustment'
                    data-qc='allowInterestAdjustment'
                    value={values.allowInterestAdjustment}
                    checked={(!values.allowInterestAdjustment)}
                    onBlur={handleBlur}
                    onChange={(e: any) => {
                        const val = e.currentTarget.value;
                        if (val === false) {
                            setFieldValue('allowInterestAdjustment', true)
                        } else {
                            setFieldValue('allowInterestAdjustment', false)
                        }
                    }}
                    isInvalid={errors.allowInterestAdjustment && touched.allowInterestAdjustment}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.allowInterestAdjustment}
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Row} controlId="inAdvanceFees">
                <Form.Label style={{ textAlign: 'right' }} column sm={4}>{local.inAdvanceFees}</Form.Label>
                <Col sm={6}>
                    <Form.Control
                        type="number"
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
            <Form.Group as={Row} controlId="stamps">
                <Form.Label style={{ textAlign: 'right' }} column sm={4}>{local.stamps}</Form.Label>
                <Col sm={4}>
                    <Form.Control
                        type="number"
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
                <Form.Label style={{ textAlign: 'right' }} column md={3}>{local.allowStampsAdjustment}</Form.Label>
                <Col sm={1}>
                    <Form.Check
                        type="checkbox"
                        name="allowStampsAdjustment"
                        data-qc="allowStampsAdjustment"
                        value={values.allowStampsAdjustment}
                        checked={values.allowStampsAdjustment}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        isInvalid={errors.allowStampsAdjustment && touched.allowStampsAdjustment}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.allowStampsAdjustment}
                    </Form.Control.Feedback>
                </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="representativeFees">
                <Form.Label style={{ textAlign: 'right' }} column sm={4}>{local.representativeFees}</Form.Label>
                <Col sm={4}>
                    <Form.Control
                        type="number"
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
                <Form.Label style={{ textAlign: 'right' }} column sm={3}>{local.allowRepresentativeFeesAdjustment}</Form.Label>
                <Col sm={1}>
                    <Form.Check
                        type="checkbox"
                        name="allowRepresentativeFeesAdjustment"
                        data-qc="allowRepresentativeFeesAdjustment"
                        value={values.allowRepresentativeFeesAdjustment}
                        checked={values.allowRepresentativeFeesAdjustment}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        isInvalid={errors.allowRepresentativeFeesAdjustment && touched.allowRepresentativeFeesAdjustment}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.allowRepresentativeFeesAdjustment}
                    </Form.Control.Feedback>
                </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="adminFees">
                <Form.Label style={{ textAlign: 'right' }} column sm={4}>{local.adminFees}</Form.Label>
                <Col sm={4}>
                    <Form.Control
                        type="number"
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
                <Form.Label style={{ textAlign: 'right' }} column sm={3}>{local.allowAdminFeesAdjustment}</Form.Label>
                <Col sm={1}>
                    <Form.Check
                        type="checkbox"
                        name="allowAdminFeesAdjustment"
                        data-qc="allowAdminFeesAdjustment"
                        value={values.allowAdminFeesAdjustment}
                        checked={values.allowAdminFeesAdjustment}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        isInvalid={errors.allowAdminFeesAdjustment && touched.allowAdminFeesAdjustment}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.allowAdminFeesAdjustment}
                    </Form.Control.Feedback>
                </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="earlyPaymentFees">
                <Form.Label style={{ textAlign: 'right' }} column sm={4}>{local.earlyPaymentFees}</Form.Label>
                <Col sm={6}>
                    <Form.Control
                        type="number"
                        name="earlyPaymentFees"
                        data-qc="earlyPaymentFees"
                        value={values.earlyPaymentFees}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={errors.earlyPaymentFees && touched.earlyPaymentFees}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.earlyPaymentFees}
                    </Form.Control.Feedback>
                </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="maxNoOfRestructuring">
                <Form.Label style={{ textAlign: 'right' }} column sm={4}>{local.maxNoOfRestructuring}</Form.Label>
                <Col sm={6}>
                    <Form.Control
                        type="number"
                        name="maxNoOfRestructuring"
                        data-qc="maxNoOfRestructuring"
                        value={values.maxNoOfRestructuring}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={errors.maxNoOfRestructuring && touched.maxNoOfRestructuring}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.maxNoOfRestructuring}
                    </Form.Control.Feedback>
                </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="minPrincipal">
                <Form.Label style={{ textAlign: 'right' }} column sm={4}>{local.minPrincipal}</Form.Label>
                <Col sm={4}>
                    <Form.Control
                        type="number"
                        name="minPrincipal"
                        data-qc="minPrincipal"
                        value={values.minPrincipal}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={errors.minPrincipal && touched.minPrincipal}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.minPrincipal}
                    </Form.Control.Feedback>
                </Col>
                <Form.Label style={{ textAlign: 'right' }} column sm={1}>{local.maxPrincipal}</Form.Label>
                <Col sm={4}>
                    <Form.Control
                        type="number"
                        name="maxPrincipal"
                        data-qc="maxPrincipal"
                        value={values.maxPrincipal}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={errors.maxPrincipal && touched.maxPrincipal}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.maxPrincipal}
                    </Form.Control.Feedback>
                </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="minInstallment">
                <Form.Label style={{ textAlign: 'right' }} column sm={4}>{local.minInstallment}</Form.Label>
                <Col sm={4}>
                    <Form.Control
                        type="number"
                        name="minInstallment"
                        data-qc="minInstallment"
                        value={values.minInstallment}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={errors.minInstallment && touched.minInstallment}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.minInstallment}
                    </Form.Control.Feedback>
                </Col>
                <Form.Label style={{ textAlign: 'right' }} column sm={1}>{local.maxInstallment}</Form.Label>
                <Col sm={4}>
                    <Form.Control
                        type="number"
                        name="maxInstallment"
                        data-qc="maxInstallment"
                        value={values.maxInstallment}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={errors.maxInstallment && touched.maxInstallment}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.maxInstallment}
                    </Form.Control.Feedback>
                </Col>
            </Form.Group>
            <Col style={{ border: '1px solid black', borderRadius: '9px', margin: '10px 0 10px 0' }}>
                <Row>
                    <Col>
                        <Form.Group as={Row} sm={4} controlId="applicationFee">
                            <Form.Label style={{ textAlign: 'right' }} column sm={6}>{local.applicationFee}</Form.Label>
                            <Col sm={6}>
                                <Form.Control
                                    type="number"
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
                    </Col>
                    <Col>
                        <Form.Group as={Row} sm={8} controlId='allowApplicationFeeAdjustment'>
                            <Form.Label style={{ textAlign: 'right' }} column sm={7}>{local.allowApplicationFeeAdjustment}</Form.Label>
                            <Col sm={1}>
                                <Form.Check
                                    type='checkbox'
                                    name='allowApplicationFeeAdjustment'
                                    data-qc='allowApplicationFeeAdjustment'
                                    value={values.allowApplicationFeeAdjustment}
                                    checked={values.allowApplicationFeeAdjustment}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    isInvalid={errors.allowApplicationFeeAdjustment && touched.allowApplicationFeeAdjustment}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.allowApplicationFeeAdjustment}
                                </Form.Control.Feedback>
                            </Col>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group as={Row} sm={8} controlId='spreadApplicationFee'>
                            <Form.Label style={{ textAlign: 'right' }} column sm={7}>{local.spreadApplicationFee}</Form.Label>
                            <Col sm={1}>
                                <Form.Check
                                    type='checkbox'
                                    name='spreadApplicationFee'
                                    data-qc='spreadApplicationFee'
                                    value={values.spreadApplicationFee}
                                    checked={values.spreadApplicationFee}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    isInvalid={errors.spreadApplicationFee && touched.spreadApplicationFee}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.spreadApplicationFee}
                                </Form.Control.Feedback>
                            </Col>
                        </Form.Group>
                    </Col>
                </Row>
                <Form.Group as={Row} controlId="individualApplicationFee">
                    <Form.Label style={{ textAlign: 'right' }} column md={4}>{local.individualApplicationFee}</Form.Label>
                    <Col md={8}>
                        <Form.Control
                            type="number"
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
                    <Col sm={4}>
                        <Form.Control
                            type="number"
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
                    <Col sm={4}>
                        <Form.Control
                            type="number"
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
            </Col>
            <Col style={{ border: '2px solid black', borderRadius: '9px' }}>
                <Form.Group as={Row} controlId='loanImpactPrincipal'>
                    <Form.Label style={{ textAlign: 'right' }} column sm={4}>{local.loanImpactPrincipal}</Form.Label>
                    <Form.Check
                        type='checkbox'
                        name='loanImpactPrincipal'
                        data-qc='loanImpactPrincipal'
                        value={values.loanImpactPrincipal}
                        checked={values.loanImpactPrincipal}
                        onBlur={handleBlur}
                        onChange={(e: any) => {
                            const val = e.currentTarget.value;
                            if (val === true) {
                                setFieldValue('loanImpactPrincipal', false)
                            } else {
                                setFieldValue('loanImpactPrincipal', true)
                            }
                        }}
                        isInvalid={errors.loanImpactPrincipal && touched.loanImpactPrincipal}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.loanImpactPrincipal}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Row} controlId='loanImpactPrincipal'>
                    <Form.Label style={{ textAlign: 'right' }} column sm={4}>{local.loanImpactPrincipal2}</Form.Label>
                    <Form.Check
                        type='checkbox'
                        name='loanImpactPrincipal'
                        data-qc='loanImpactPrincipal'
                        value={values.loanImpactPrincipal}
                        checked={(!values.loanImpactPrincipal)}
                        onBlur={handleBlur}
                        onChange={(e: any) => {
                            const val = e.currentTarget.value;
                            if (val === false) {
                                setFieldValue('loanImpactPrincipal', true)
                            } else {
                                setFieldValue('loanImpactPrincipal', false)
                            }
                        }}
                        isInvalid={errors.loanImpactPrincipal && touched.loanImpactPrincipal}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.loanImpactPrincipal}
                    </Form.Control.Feedback>
                </Form.Group>
            </Col>
            <Col>
                <Form.Group as={Row} controlId='mustEnterGuarantor'>
                    <Form.Label style={{ textAlign: 'right' }} column sm={4}>{local.mustEnterGuarantor}</Form.Label>
                    <Form.Check
                        type='checkbox'
                        name='mustEnterGuarantor'
                        data-qc='mustEnterGuarantor'
                        value={values.mustEnterGuarantor}
                        checked={values.mustEnterGuarantor}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        isInvalid={errors.mustEnterGuarantor && touched.mustEnterGuarantor}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.mustEnterGuarantor}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Row} controlId="noOfGuarantors">
                        <Form.Label style={{ textAlign: 'right' }} column sm={4}>{local.noOfGuarantors}</Form.Label>
                        <Col sm={6}>
                            <Form.Control
                                type="number"
                                name="noOfGuarantors"
                                data-qc="noOfGuarantors"
                                value={values.noOfGuarantors}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={errors.noOfGuarantors && touched.noOfGuarantors}
                                disabled={!values.mustEnterGuarantor}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.noOfGuarantors}
                            </Form.Control.Feedback>
                        </Col>
                    </Form.Group>
                <Form.Group as={Row} controlId='guarantorGuaranteesMultiple'>
                    <Form.Label style={{ textAlign: 'right' }} column sm={4}>{local.guarantorGuaranteesMultiple}</Form.Label>
                    <Form.Check
                        type='checkbox'
                        name='guarantorGuaranteesMultiple'
                        data-qc='guarantorGuaranteesMultiple'
                        value={values.guarantorGuaranteesMultiple}
                        checked={values.guarantorGuaranteesMultiple}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        isInvalid={errors.guarantorGuaranteesMultiple && touched.guarantorGuaranteesMultiple}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.guarantorGuaranteesMultiple}
                    </Form.Control.Feedback>
                </Form.Group>
            </Col>
            <Button type="button" style={{ margin: 10 }} onClick={handleSubmit}>{local.submit}</Button>
        </Form >
    )
}