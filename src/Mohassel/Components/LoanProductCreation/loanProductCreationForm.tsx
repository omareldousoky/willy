import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import * as local from '../../../Shared/Assets/ar.json';
import InputGroup from 'react-bootstrap/InputGroup';
import { dayToArabic } from '../../Services/utils';

export const LoanProductCreationForm = (props: any) => {
    const { values, handleSubmit, handleBlur, handleChange, errors, touched, setFieldValue } = props;
    return (
        <Form onSubmit={handleSubmit} className="data-form">
            <Row>
                <Col>
                    <Form.Group className="data-group" controlId="productName">
                        <Form.Label className="data-label" >{local.productName}</Form.Label>
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
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className="data-group" controlId="beneficiaryType">
                        <Form.Label className="data-label">{local.customerType}</Form.Label>
                        <Form.Control as="select"
                            name="beneficiaryType"
                            data-qc="beneficiaryType"
                            value={values.beneficiaryType}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            isInvalid={errors.beneficiaryType && touched.beneficiaryType}
                        >
                            <option value=''></option>
                            <option value='individual'>{local.individual}</option>
                            <option value='group'>{local.group}</option>

                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                            {errors.beneficiaryType}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form.Group className="data-group" controlId="calculationFormulaId">
                        <Form.Label className="data-label">{local.calculationFormulaId}</Form.Label>
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
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className="data-group" controlId="loanNature">
                        <Form.Label className="data-label">{local.loanNature}</Form.Label>
                        <Form.Control as="select"
                            name="loanNature"
                            data-qc="loanNature"
                            value={values.loanNature}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            isInvalid={errors.loanNature && touched.loanNature}
                        >
                            <option value='cash'>{local.cash}</option>
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                            {errors.loanNature}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form.Group className="data-group" controlId="currency">
                        <Form.Label className="data-label">{local.currency}</Form.Label>

                        <Form.Control as="select"
                            name="currency"
                            data-qc="currency"
                            value={values.currency}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            isInvalid={errors.currency && touched.currency}
                        >
                            <option value='egp'>{local.egp}</option>
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                            {errors.currency}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className="data-group" controlId="periodLength">
                        <Form.Label className="data-label">{local.periodLengthEvery}</Form.Label>
                        <Row className={"row-nowrap"}>
                            <Form.Control
                                style={{ margin: "0 20px" }}
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
                            <Form.Control as="select"
                                name="periodType"
                                data-qc="periodType"
                                value={values.periodType}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                isInvalid={errors.periodType && touched.periodType}
                            >
                                <option value='months'>{local.month}</option>
                                <option value='days'>{local.day}</option>
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">
                                {errors.periodType}
                            </Form.Control.Feedback>
                        </Row>
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form.Group className="data-group" controlId="noOfInstallments">
                        <Form.Label className="data-label" >{local.noOfInstallments}</Form.Label>
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
                            {(errors.noOfInstallments === 'outOfRange') ? `${local.mustBeinRange} ` + `${values.minInstallment} ${local.and} ${values.maxInstallment}` : errors.noOfInstallments}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className="data-group" controlId="lateDays">
                        <Form.Label className="data-label">{local.lateDays}</Form.Label>
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
                    </Form.Group>
                </Col>
            </Row>
            <Form.Group className="data-group" controlId="gracePeriod">
                <Form.Label className="data-label">{local.gracePeriod}</Form.Label>

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
            </Form.Group>
            <Row>
                <Col>
                    <Form.Group className="data-group" controlId="interest">
                        <Form.Label className="data-label">{local.interest}</Form.Label>

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
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className="data-group" controlId="interest">
                        <Form.Control as="select"
                            style={{ margin: "40px 0" }}
                            name="interestPeriod"
                            data-qc="interestPeriod"
                            value={values.interestPeriod}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            isInvalid={errors.interestPeriod && touched.interestPeriod}
                        >
                            <option value='yearly'>{local.yearlyInnterestPeriod}</option>
                            <option value='monthly'>{local.monthlyInnterestPeriod}</option>
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                            {errors.interestPeriod}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className="data-check-group row-nowrap" controlId='allowInterestAdjustment'>
                        <Form.Check
                            type='checkbox'
                            name='allowInterestAdjustment'
                            data-qc='allowInterestAdjustment'
                            value={values.allowInterestAdjustment}
                            checked={values.allowInterestAdjustment}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            isInvalid={errors.allowInterestAdjustment && touched.allowInterestAdjustment}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.allowInterestAdjustment}
                        </Form.Control.Feedback>
                        <Form.Label className="data-check-label">{local.allowInterestAdjustment}</Form.Label>
                    </Form.Group>
                </Col>
            </Row>
            <Form.Group className="data-group" controlId="inAdvanceFees">
                <Form.Label className="data-label" >{local.inAdvanceFees}</Form.Label>
                <Row className="row-nowrap">
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
                    <Col sm={6}>
                        <Form.Control as="select"
                            name="inAdvanceFrom"
                            data-qc="v"
                            value={values.inAdvanceFrom}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            isInvalid={errors.inAdvanceFrom && touched.inAdvanceFrom}
                        >
                            <option value='principal'>{local.inAdvanceFromPrinciple}</option>
                            <option value='monthly'>{local.inAdvanceFromMonthly}</option>
                            <option value='yearly'>{local.inAdvanceFromYearly}</option>
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                            {errors.inAdvanceFrom}
                        </Form.Control.Feedback>
                    </Col>
                </Row>
            </Form.Group>
            <Form.Group className="data-group" controlId="inAdvanceType">
                <Form.Label className="data-label">{local.inAdvanceType}</Form.Label>
                <Form.Control as="select"
                    name="inAdvanceType"
                    data-qc="inAdvanceType"
                    value={values.inAdvanceType}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    isInvalid={errors.inAdvanceType && touched.inAdvanceType}
                >
                    <option value='cut'>{local.inAdvanceFeesCut}</option>
                    <option value='uncut'>{local.inAdvanceFeesUncut}</option>
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                    {errors.inAdvanceType}
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="data-group" controlId="stamps">
                <Form.Label className="data-label" column sm={4}>{local.stamps}</Form.Label>
                <Row className='row-nowrap'>
                    <Col>
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
                    <Col>
                        <Row style={{ padding: "0 20px" }}>
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
                            <Form.Label className="data-check-label">{local.allowStampsAdjustment}</Form.Label>
                        </Row>
                    </Col>
                </Row>
            </Form.Group>

            <Form.Group className="data-group" controlId="representativeFees">
                <Form.Label className="data-label">{local.representativeFees}</Form.Label>
                <Row className='row-nowrap'>
                    <Col>
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

                    <Col>
                        <Row style={{ padding: "0 20px" }}>
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
                            <Form.Label className="data-check-label">{local.allowRepresentativeFeesAdjustment}</Form.Label>
                        </Row>
                    </Col>
                </Row>
            </Form.Group>
            <Form.Group className="data-group" controlId="adminFees">
                <Form.Label className="data-label">{local.adminFees}</Form.Label>
                <Row className="row-nowrap">
                    <Col>
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

                    <Col>
                        <Row style={{ padding: "0 20px" }}>
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
                            <Form.Label className="data-check-label" >{local.allowAdminFeesAdjustment}</Form.Label>
                        </Row>
                    </Col>
                </Row>
            </Form.Group>
            <Row>
                <Col>
                    <Form.Group className="data-group" controlId="earlyPaymentFees">
                        <Form.Label className="data-label">{local.earlyPaymentFees}</Form.Label>
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
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className="data-group" controlId="maxNoOfRestructuring">
                        <Form.Label className="data-label" >{local.maxNoOfRestructuring}</Form.Label>

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
                    </Form.Group>
                </Col>
            </Row>
            <Form.Group className="data-group" controlId="minPrincipal">
                <Form.Label className="data-label">{local.minPrincipal}</Form.Label>
                <Row className={'row-nowrap'}>
                    <Col >
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
                    <Form.Label className="data-label">{local.maxPrincipal}</Form.Label>
                    <Col >
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
                </Row>
            </Form.Group>
            <Form.Group className="data-group" controlId="minInstallment" >
                <Form.Label className="data-label">{local.minInstallment}</Form.Label>
                <Row className="row-nowrap">
                    <Col >
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
                    <Form.Label className="data-label" >{local.maxInstallment}</Form.Label>
                    <Col >
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
                </Row>
            </Form.Group>
            <Col style={{ border: '1px solid black', borderRadius: '9px', margin: '10px 0 10px 0' }}>
                <Row>
                    {values.beneficiaryType === 'individual' && <Col>
                        <Form.Group className="data-group" controlId="applicationFee">
                            <Form.Label className="data-label">{local.applicationFee}</Form.Label>

                            <Form.Control
                                type="number"
                                name="applicationFee"
                                data-qc="applicationFee"
                                value={values.applicationFee}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={errors.applicationFee && touched.applicationFee}
                                disabled={values.applicationFeePercent > 0}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.applicationFee}
                            </Form.Control.Feedback>

                        </Form.Group>
                    </Col>}
                    {values.beneficiaryType === 'group' && <Form.Group className="data-group" controlId="individualApplicationFee">
                        <Form.Label className="data-label">{local.individualApplicationFee}</Form.Label>
                        <Form.Control
                            type="number"
                            name="individualApplicationFee"
                            data-qc="individualApplicationFee"
                            value={values.individualApplicationFee}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={errors.individualApplicationFee && touched.individualApplicationFee}
                            disabled={values.applicationFeePercentPerPerson > 0}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.individualApplicationFee}
                        </Form.Control.Feedback>
                    </Form.Group>}
                    <Col>
                        <Form.Group className="data-check-group row-nowrap" controlId='allowApplicationFeeAdjustment'>
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
                            <Form.Label className="data-check-label" >{local.allowApplicationFeeAdjustment}</Form.Label>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="data-check-group row-nowrap" controlId='spreadApplicationFee'>
                            <Form.Check
                                type='checkbox'
                                name='spreadApplicationFee'
                                data-qc='spreadApplicationFee'
                                value={values.spreadApplicationFee}
                                checked={values.spreadApplicationFee}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                isInvalid={errors.spreadApplicationFee && touched.spreadApplicationFee}
                                disabled
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.spreadApplicationFee}
                            </Form.Control.Feedback>
                            <Form.Label className="data-check-label" >{local.spreadApplicationFee}</Form.Label>
                        </Form.Group>
                    </Col>
                </Row>

                {values.beneficiaryType === 'individual' && <Form.Group className="data-group" controlId="applicationFeePercent">
                    <Form.Label className="data-label" >{local.applicationFeePercent}</Form.Label>
                    <Row className="row-nowrap" >
                        <Col>
                            <Form.Control
                                type="number"
                                name="applicationFeePercent"
                                data-qc="applicationFeePercent"
                                value={values.applicationFeePercent}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={errors.applicationFeePercent && touched.applicationFeePercent}
                                disabled={values.applicationFee > 0}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.applicationFeePercent}
                            </Form.Control.Feedback>
                        </Col>
                        <Col>
                            <Form.Control as="select"
                                name="applicationFeeType"
                                data-qc="applicationFeeType"
                                value={values.applicationFeeType}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                isInvalid={errors.applicationFeeType && touched.applicationFeeType}
                                disabled={values.applicationFee > 0}
                            >
                                <option value='principal'>{local.inAdvanceFromPrinciple}</option>
                                <option value='monthly'>{local.inAdvanceFromMonthly}</option>
                                <option value='yearly'>{local.inAdvanceFromYearly}</option>
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">
                                {errors.applicationFeeType}
                            </Form.Control.Feedback>
                        </Col>
                    </Row>
                </Form.Group>}
                {values.beneficiaryType === 'group' && <Form.Group className="data-group" controlId="applicationFeePercentPerPerson">
                    <Form.Label className="data-label">{local.applicationFeePercentPerPerson}</Form.Label>
                    <Row className="row-nowrap">
                        <Col>
                            <Form.Control
                                type="number"
                                name="applicationFeePercentPerPerson"
                                data-qc="applicationFeePercentPerPerson"
                                value={values.applicationFeePercentPerPerson}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={errors.applicationFeePercentPerPerson && touched.applicationFeePercentPerPerson}
                                disabled={values.individualApplicationFee > 0}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.applicationFeePercentPerPerson}
                            </Form.Control.Feedback>
                        </Col>
                        <Col>
                            <Form.Control as="select"
                                name="applicationFeePercentPerPersonType"
                                data-qc="applicationFeePercentPerPersonType"
                                value={values.applicationFeePercentPerPersonType}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                isInvalid={errors.applicationFeePercentPerPersonType && touched.applicationFeePercentPerPersonType}
                                disabled={values.individualApplicationFee > 0}
                            >
                                <option value='principal'>{local.inAdvanceFromPrinciple}</option>
                                <option value='monthly'>{local.inAdvanceFromMonthly}</option>
                                <option value='yearly'>{local.inAdvanceFromYearly}</option>
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">
                                {errors.applicationFeePercentPerPersonType}
                            </Form.Control.Feedback>
                        </Col>
                    </Row>
                </Form.Group>}
            </Col>
            <Col style={{ border: '2px solid black', borderRadius: '9px', }}>
                <Row>
                    <Col>
                        <Form.Group className="data-check-group row-nowrap" controlId='loanImpactPrincipal'>
                            <Form.Check
                                type='radio'
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
                            <Form.Label className="data-check-label">{local.loanImpactPrincipal}</Form.Label>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="data-check-group row-nowrap" controlId='loanImpactPrincipal'>
                            <Form.Check
                                type='radio'
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
                            <Form.Label className="data-check-label">{local.loanImpactPrincipal2}</Form.Label>
                        </Form.Group>
                    </Col>
                </Row>
                {values.beneficiaryType !== 'group' &&
                    <Col>
                        <Row>
                            <Col>
                                <Form.Group className="data-check-group row-nowrap" controlId='mustEnterGuarantor'>

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
                                    <Form.Label className="data-check-label">{local.mustEnterGuarantor}</Form.Label>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="data-group" controlId="noOfGuarantors">
                            <Form.Label className="data-label">{local.noOfGuarantors}</Form.Label>
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
                        </Form.Group>

                    </Col>}
            </Col>
            <Form.Group className="data-group" controlId="allocatedDebtForGoodLoans">
                <Form.Label className="data-label">{local.allocatedDebtForGoodLoans}</Form.Label>
                <Form.Control
                    type="number"
                    name="allocatedDebtForGoodLoans"
                    data-qc="allocatedDebtForGoodLoans"
                    value={values.allocatedDebtForGoodLoans}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={errors.allocatedDebtForGoodLoans && touched.allocatedDebtForGoodLoans}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.allocatedDebtForGoodLoans}
                </Form.Control.Feedback>
            </Form.Group>
            <Col style={{ backgroundColor: '#e5e5e5', textAlign: 'right', padding: 20 }}>
                <Row>
                    <Col sm={6}>
                        <h3 style={{ color: '#2a3390' }}>{local.aging}</h3>
                    </Col>
                    <Col sm={6}>
                        <h3 style={{ color: '#2a3390' }}>{local.agingPercent}</h3>
                    </Col>
                </Row>
                {values.aging.map((element, i) => {
                    return (
                        <Row key={i} style={{ padding: '25px 0px' }}>
                            <Col sm={6}>
                                <div className='d-flex'>
                                    <span style={{ width: '10%', color: '#7dc356' }}>{i + 1} - </span>
                                    <span style={{ direction: 'rtl', width: '10%' }}>{local.from}</span>
                                    <span style={{ width: '10%' }}>{(i === 0) ? values.aging[i].from : values.aging[i - 1].to}</span>
                                    <span style={{ direction: 'rtl', width: '10%' }}>{local.to}</span>
                                    <Form.Group controlId={`agingTo${i}`} style={{ width: '50%' }}>
                                        <InputGroup>
                                            <Form.Control
                                                type="number"
                                                name={`aging[${i}].to`}
                                                data-qc="aging"
                                                value={values.aging[i].to}
                                                onChange={(e) => {
                                                    setFieldValue(`aging[${i}].to`, Number(e.currentTarget.value))
                                                    if (i < 6) {
                                                        setFieldValue(`aging[${i + 1}].from`, Number(e.currentTarget.value))
                                                    }
                                                }}
                                                onBlur={handleBlur}
                                                min={values.aging[i].from + 1}
                                                isInvalid={errors.aging && errors.aging[i] && errors.aging[i].to && touched.aging && touched.aging[i] && touched.aging[i].to}
                                            />
                                        </InputGroup>
                                        {errors.aging && errors.aging[i] && errors.aging[i].to && <Form.Control.Feedback type="invalid" className="d-flex">
                                            {errors.aging[i].to}
                                        </Form.Control.Feedback>}
                                    </Form.Group>
                                </div>
                            </Col>
                            <Col sm={6}>
                                <Form.Group controlId={`agingFee${i}`} style={{ width: '100%' }}>
                                    <InputGroup>
                                        <Form.Control
                                            type="number"
                                            name={`aging[${i}].fee`}
                                            data-qc="aging"
                                            value={values.aging[i].fee}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isInvalid={errors.aging && errors.aging[i] && errors.aging[i].fee && touched.aging && touched.aging[i] && touched.aging[i].fee}
                                        />
                                        <InputGroup.Prepend>
                                            <InputGroup.Text id="inputGroupPrepend">%</InputGroup.Text>
                                        </InputGroup.Prepend>
                                    </InputGroup>
                                    {errors.aging && errors.aging[i] && errors.aging[i].fee && <Form.Control.Feedback type="invalid" className="d-flex">
                                        {errors.aging[i].fee}
                                    </Form.Control.Feedback>}
                                </Form.Group>
                            </Col>
                        </Row>
                    )
                })}
            </Col>
            <Form.Group className="data-group" controlId="mergeUndoubtedLoans">
                <Form.Label className="data-label">{local.mergeUndoubtedLoans}</Form.Label>
                <Row className={'row-nowrap'}>
                    <Col>
                        <Form.Group className="row-nowrap" style={{ padding: '20px 10px' }} controlId='mergeUndoubtedLoans'>
                            <Form.Check
                                type='radio'
                                name='mergeUndoubtedLoans'
                                data-qc='mergeUndoubtedLoans'
                                value={values.mergeUndoubtedLoans}
                                checked={values.mergeUndoubtedLoans}
                                onBlur={handleBlur}
                                onChange={(e: any) => {
                                    const val = e.currentTarget.value;
                                    if (val === true) {
                                        setFieldValue('mergeUndoubtedLoans', false)
                                    } else {
                                        setFieldValue('mergeUndoubtedLoans', true)
                                    }
                                }}
                                isInvalid={errors.mergeUndoubtedLoans && touched.mergeUndoubtedLoans}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.mergeUndoubtedLoans}
                            </Form.Control.Feedback>
                            <Form.Label className="data-check-label">{local.mergeLoans}</Form.Label>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="row-nowrap" style={{ padding: '20px 10px' }} controlId='mergeUndoubtedLoans'>
                            <Form.Check
                                type='radio'
                                name='mergeUndoubtedLoans'
                                data-qc='mergeUndoubtedLoans'
                                value={values.mergeUndoubtedLoans}
                                checked={(!values.mergeUndoubtedLoans)}
                                onBlur={handleBlur}
                                onChange={(e: any) => {
                                    const val = e.currentTarget.value;
                                    if (val === false) {
                                        setFieldValue('mergeUndoubtedLoans', true)
                                    } else {
                                        setFieldValue('mergeUndoubtedLoans', false)
                                    }
                                }}
                                isInvalid={errors.mergeUndoubtedLoans && touched.mergeUndoubtedLoans}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.mergeUndoubtedLoans}
                            </Form.Control.Feedback>
                            <Form.Label className="data-check-label">{local.mergeLoans2}</Form.Label>
                        </Form.Group>
                    </Col>
                </Row>
                {!values.mergeUndoubtedLoans && <Row>
                    <Col></Col>
                    <Col>
                        <Form.Group controlId="mergeUndoubtedLoansFees">
                            <Form.Control
                                type="number"
                                name="mergeUndoubtedLoansFees"
                                data-qc="mergeUndoubtedLoansFees"
                                value={values.mergeUndoubtedLoansFees}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={errors.mergeUndoubtedLoansFees && touched.mergeUndoubtedLoansFees}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.mergeUndoubtedLoansFees}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>}
            </Form.Group>
            <Form.Group className="data-group" controlId="mergeDoubtedLoans">
                <Form.Label className="data-label">{local.mergeDoubtedLoans}</Form.Label>
                <Row className={'row-nowrap'}>
                    <Col>
                        <Form.Group className="row-nowrap" style={{ padding: '20px 10px' }} controlId='mergeDoubtedLoans'>
                            <Form.Check
                                type='radio'
                                name='mergeDoubtedLoans'
                                data-qc='mergeDoubtedLoans'
                                value={values.mergeDoubtedLoans}
                                checked={values.mergeDoubtedLoans}
                                onBlur={handleBlur}
                                onChange={(e: any) => {
                                    const val = e.currentTarget.value;
                                    if (val === true) {
                                        setFieldValue('mergeDoubtedLoans', false)
                                    } else {
                                        setFieldValue('mergeDoubtedLoans', true)
                                    }
                                }}
                                isInvalid={errors.mergeDoubtedLoans && touched.mergeDoubtedLoans}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.mergeDoubtedLoans}
                            </Form.Control.Feedback>
                            <Form.Label className="data-check-label">{local.mergeLoans}</Form.Label>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="row-nowrap" style={{ padding: '20px 10px' }} controlId='mergeDoubtedLoans'>
                            <Form.Check
                                type='radio'
                                name='mergeDoubtedLoans'
                                data-qc='mergeDoubtedLoans'
                                value={values.mergeDoubtedLoans}
                                checked={(!values.mergeDoubtedLoans)}
                                onBlur={handleBlur}
                                onChange={(e: any) => {
                                    const val = e.currentTarget.value;
                                    if (val === false) {
                                        setFieldValue('mergeDoubtedLoans', true)
                                    } else {
                                        setFieldValue('mergeDoubtedLoans', false)
                                    }
                                }}
                                isInvalid={errors.mergeDoubtedLoans && touched.mergeDoubtedLoans}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.mergeDoubtedLoans}
                            </Form.Control.Feedback>
                            <Form.Label className="data-check-label">{local.mergeLoans2}</Form.Label>
                        </Form.Group>
                    </Col>
                </Row>
                {!values.mergeDoubtedLoans && <Row>
                    <Col></Col>
                    <Col>
                        <Form.Group controlId="mergeDoubtedLoansFees">
                            <Form.Control
                                type="number"
                                name="mergeDoubtedLoansFees"
                                data-qc="mergeDoubtedLoansFees"
                                value={values.mergeDoubtedLoansFees}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={errors.mergeDoubtedLoansFees && touched.mergeDoubtedLoansFees}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.mergeDoubtedLoansFees}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>}
            </Form.Group>
            <Col style={{ backgroundColor: '#e5e5e5', textAlign: 'right', padding: 20 }}>
                <h2 style={{ color: '#2a3390' }}>{local.push}</h2>
                <Row>
                    <Col sm={6}>
                        <Form.Group className="data-group" controlId="pushPayment">
                            <Form.Label className="data-label" style={{ color: '#2a3390' }}>{local.pushPayment}</Form.Label>
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
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group className="data-group" controlId="pushHolidays">
                            <Form.Label className="data-label" style={{ color: '#2a3390' }}>{local.pushHolidays}</Form.Label>
                            <Form.Control as="select"
                                name="pushHolidays"
                                data-qc="pushHolidays"
                                value={values.pushHolidays}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={errors.pushHolidays && touched.pushHolidays}
                            >
                                <option value='previous'>{local.previous}</option>
                                <option value='next'>{local.next}</option>
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">
                                {errors.pushHolidays}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col sm={6}>
                        {values.pushDays.map((day, i) => {
                            return (
                                <Row key={i}>
                                    <Col sm={2} style={{ margin: 'auto' }}>
                                        <span>{dayToArabic(i)}</span>
                                    </Col>
                                    <Col sm={10}>
                                        {/* <Form.Label className="data-label" style={{ color: '#2a3390' }}>{`Day${i}`}</Form.Label> */}
                                        <Form.Group className="data-group" controlId={`pushDays[${i}]`}>
                                            <Form.Control
                                                type="number"
                                                name={`pushDays[${i}]`}
                                                data-qc="pushDays"
                                                value={values.pushDays[i]}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={errors.pushDays && errors.pushDays[i] && touched.pushDays && touched.pushDays[i]}
                                            />
                                            {errors.pushDays && errors.pushDays[i] && <Form.Control.Feedback type="invalid">
                                                {errors.pushDays[i]}
                                            </Form.Control.Feedback>}
                                        </Form.Group>
                                    </Col>
                                </Row>
                            )
                        })}
                    </Col>
                    <Col sm={6}>
                        <div style={{ backgroundColor: '#efefef', padding: '30px 40px' }}>
                            <h4 style={{ color: '#2a3390' }}>{local.priority}</h4>
                            <ul>
                                <li style={{ color: '#7dc356' }}><span style={{ color: '#2a3390' }}>{local.pushPaymentPriority1}</span></li>
                                <li style={{ color: '#7dc356' }}><span style={{ color: '#2a3390' }}>{local.pushPaymentPriority2}</span></li>
                                <li style={{ color: '#7dc356' }}><span style={{ color: '#2a3390' }}>{local.pushPaymentPriority3}</span></li>
                            </ul>
                        </div>
                    </Col>
                </Row>
            </Col>
            <Form.Group className="data-check-group row-nowrap" controlId='enabled'>
                <Form.Check
                    type='checkbox'
                    name='enabled'
                    data-qc='enabled'
                    value={values.enabled}
                    checked={values.enabled}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    isInvalid={errors.enabled && touched.enabled}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.enabled}
                </Form.Control.Feedback>
                <Form.Label className="data-check-label">{local.enabledProduct}</Form.Label>
            </Form.Group>
            <Form.Group className="data-check-group row-nowrap" controlId='viceFieldManagerAndDate'>
                <Form.Check
                    type='checkbox'
                    name='viceFieldManagerAndDate'
                    data-qc='viceFieldManagerAndDate'
                    value={values.viceFieldManagerAndDate}
                    checked={values.viceFieldManagerAndDate}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    isInvalid={errors.viceFieldManagerAndDate && touched.viceFieldManagerAndDate}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.viceFieldManagerAndDate}
                </Form.Control.Feedback>
                <Form.Label className="data-check-label">{local.viceFieldManagerAndDate}</Form.Label>
            </Form.Group>
            <Form.Group className="data-check-group row-nowrap" controlId='reviewerChiefAndDate'>
                <Form.Check
                    type='checkbox'
                    name='reviewerChiefAndDate'
                    data-qc='reviewerChiefAndDate'
                    value={values.reviewerChiefAndDate}
                    checked={values.reviewerChiefAndDate}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    isInvalid={errors.reviewerChiefAndDate && touched.reviewerChiefAndDate}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.reviewerChiefAndDate}
                </Form.Control.Feedback>
                <Form.Label className="data-check-label">{local.reviewerChiefAndDate}</Form.Label>
            </Form.Group>
            <Form.Group className="data-check-group row-nowrap" controlId='branchManagerAndDate'>
                <Form.Check
                    type='checkbox'
                    name='branchManagerAndDate'
                    data-qc='branchManagerAndDate'
                    value={values.branchManagerAndDate}
                    checked={values.branchManagerAndDate}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    isInvalid={errors.branchManagerAndDate && touched.branchManagerAndDate}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.branchManagerAndDate}
                </Form.Control.Feedback>
                <Form.Label className="data-check-label">{local.branchManagerAndDate}</Form.Label>
            </Form.Group>
            <Form.Group
                as={Row}
                className={['branch-data-group']}
            >
                <Col >
                    <Button
                        className={'btn-cancel-prev'} style={{ width: '60%' }}
                        onClick={() => { props.cancel() }}
                    >{local.cancel}</Button>
                </Col>
                <Col>
                    <Button className={'btn-submit-next'} style={{ float: 'left', width: '60%' }} type="submit" data-qc="submit">{local.submit}</Button>
                </Col>
            </Form.Group>
        </Form >
    )
}