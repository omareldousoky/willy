import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import * as local from '../../../Shared/Assets/ar.json'
import InputGroup from 'react-bootstrap/InputGroup';
import GroupInfoBox from '../LoanProfile/groupInfoBox';
import InfoBox from '../userInfoBox';
import Select from 'react-select';

export const LoanApplicationCreationForm = (props: any) => {
    const { values, handleSubmit, handleBlur, handleChange, errors, touched, setFieldValue, setValues } = props;
    return (
        <>
            <Form style={{ textAlign: 'right', width: '90%', padding: 20 }} onSubmit={handleSubmit}>
                <fieldset disabled={!(values.state === "edit" || values.state === "under_review")}>
                    {props.customer && Object.keys(props.customer).includes('_id') ? <InfoBox values={props.customer} /> :
                        <GroupInfoBox group={{ individualsInGroup: values.individualDetails }} />
                    }
                    <div style={{ width: '100%', margin: '20px 0' }}>
                        <Row>
                            <Col sm={7}>
                                <Form.Group controlId="productID">
                                    <Form.Label column sm={4}>{local.productName}</Form.Label>
                                    <Form.Control as="select"
                                        name="productID"
                                        data-qc="productID"
                                        value={values.productID}
                                        onBlur={handleBlur}
                                        onChange={(event) => {
                                            if (event.currentTarget.value.length > 0) {
                                                props.getSelectedLoanProduct(event.currentTarget.value);
                                            } else {
                                                setFieldValue('productID', '')
                                            }
                                        }}
                                        isInvalid={errors.productID && touched.productID}
                                    >
                                        <option value="" disabled></option>
                                        {props.products.map((product, i) =>
                                            <option key={i} value={product._id}>{product.productName}</option>
                                        )}
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.productID}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col sm={5}>
                                <Form.Group controlId="currency">
                                    <Form.Label column sm={4}>{local.currency}</Form.Label>
                                    <Form.Control as="select"
                                        name="currency"
                                        data-qc="currency"
                                        value={values.currency}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        isInvalid={errors.currency && touched.currency}
                                        disabled
                                    >
                                        <option value="" disabled></option>
                                        <option value='egp'>{local.egp}</option>
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.currency}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={12}>
                                <Form.Group controlId="calculationFormulaId">
                                    <Form.Label column sm={4}>{local.calculationFormulaId}</Form.Label>
                                    <Form.Control as="select"
                                        name="calculationFormulaId"
                                        data-qc="calculationFormulaId"
                                        value={values.calculationFormulaId}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        isInvalid={errors.calculationFormulaId && touched.calculationFormulaId}
                                        disabled
                                    >
                                        <option value="" disabled></option>
                                        {props.formulas.map((formula, i) =>
                                            <option key={i} value={formula._id}>{formula.name}</option>
                                        )}
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.calculationFormulaId}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={6}>
                                <Form.Group controlId="interest">
                                    <Form.Label column sm={6}>{local.interest}</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            type="number"
                                            name="interest"
                                            data-qc="interest"
                                            value={values.interest}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isInvalid={errors.interest && touched.interest}
                                            disabled={!values.allowInterestAdjustment}
                                        />
                                        <InputGroup.Prepend>
                                            <InputGroup.Text id="inputGroupPrepend">%</InputGroup.Text>
                                        </InputGroup.Prepend>
                                    </InputGroup>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.interest}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col sm={6} className="d-flex align-items-end">
                                <Form.Group controlId="interestPeriod" style={{ width: '100%' }}>
                                    <Form.Control as="select"
                                        name="interestPeriod"
                                        data-qc="interestPeriod"
                                        value={values.interestPeriod}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        isInvalid={errors.interestPeriod && touched.interestPeriod}
                                        disabled={!values.allowInterestAdjustment}
                                    >
                                        <option value="" disabled></option>
                                        <option value='yearly'>{local.yearlyInnterestPeriod}</option>
                                        <option value='monthly'>{local.monthlyInnterestPeriod}</option>
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.interestPeriod}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={6}>
                                <Form.Group controlId="inAdvanceFees">
                                    <Form.Label column sm={6}>{local.inAdvanceFees}</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            type="number"
                                            name="inAdvanceFees"
                                            data-qc="inAdvanceFees"
                                            value={values.inAdvanceFees}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isInvalid={errors.inAdvanceFees && touched.inAdvanceFees}
                                            disabled
                                        />
                                        <InputGroup.Prepend>
                                            <InputGroup.Text id="inputGroupPrepend">%</InputGroup.Text>
                                        </InputGroup.Prepend>
                                    </InputGroup>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.inAdvanceFees}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col sm={3} className="d-flex align-items-end">
                                <Form.Group controlId="inAdvanceFrom" style={{ width: '100%' }}>
                                    <Form.Control as="select"
                                        name="inAdvanceFrom"
                                        data-qc="inAdvanceFrom"
                                        value={values.inAdvanceFrom}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        isInvalid={errors.inAdvanceFrom && touched.inAdvanceFrom}
                                        disabled
                                    >
                                        <option value="" disabled></option>
                                        <option value='principal'>{local.inAdvanceFromPrinciple}</option>
                                        <option value='monthly'>{local.inAdvanceFromMonthly}</option>
                                        <option value='yearly'>{local.inAdvanceFromYearly}</option>
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.inAdvanceFrom}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col sm={3} className="d-flex align-items-end">
                                <Form.Group controlId="inAdvanceType" style={{ width: '100%' }}>
                                    <Form.Control as="select"
                                        name="inAdvanceType"
                                        data-qc="inAdvanceType"
                                        value={values.inAdvanceType}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        isInvalid={errors.inAdvanceType && touched.inAdvanceType}
                                        disabled
                                    >
                                        <option value="" disabled></option>
                                        <option value='cut'>{local.inAdvanceFeesCut}</option>
                                        <option value='uncut'>{local.inAdvanceFeesUncut}</option>
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.inAdvanceType}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={6}>
                                <Form.Group controlId="periodLength">
                                    <Form.Label column sm={6}>{local.periodLengthEvery}</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="periodLength"
                                        data-qc="periodLength"
                                        value={values.periodLength}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        isInvalid={errors.periodLength && touched.periodLength}
                                        disabled
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.periodLength}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col sm={6} className="d-flex align-items-end">
                                <Form.Group controlId="periodType" style={{ width: '100%' }}>
                                    <Form.Control as="select"
                                        name="periodType"
                                        data-qc="periodType"
                                        value={values.periodType}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        isInvalid={errors.periodType && touched.periodType}
                                        disabled
                                    >
                                        <option value="" disabled></option>
                                        <option value='months'>{local.month}</option>
                                        <option value='days'>{local.day}</option>
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.periodType}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={6}>
                                <Form.Group controlId="gracePeriod">
                                    <Form.Label column sm={6}>{local.gracePeriod}</Form.Label>
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
                            </Col>
                            <Col sm={6}>
                                <Form.Group controlId="pushPayment">
                                    <Form.Label column sm={6}>{local.pushPayment}</Form.Label>
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
                        </Row>
                        {(values.beneficiaryType === "group") && <Row>
                            <Col style={{ border: '1px solid #e5e5e5', backgroundColor: '#f8f8f8', padding: 10 }}>
                                <p style={{ margin: '10px 0px', color: '#2a3390' }}>{local.individualLoanPrinciple}</p>
                                {values.individualDetails.map((customer, i) => {
                                    return (
                                        <div key={customer.customer._id} className="d-flex justify-content-between">
                                            <span style={{ color: '#7dc356' }}>{i + 1}-</span>
                                            <span>{customer.customer.customerName}</span>
                                            <Form.Group controlId="individualDetails" style={{ width: '50%' }}>
                                                <Form.Control
                                                    type="number"
                                                    name={`individualDetails[${i}].amount`}
                                                    data-qc="individualDetailsAmount"
                                                    value={values.individualDetails[i].amount}
                                                    onChange={(e) => {
                                                        setFieldValue(`individualDetails[${i}].amount`, Number(e.currentTarget.value))
                                                        let sum = 0;
                                                        values.individualDetails.forEach((member, index) => sum += (index === i) ? Number(e.currentTarget.value) : Number(member.amount))
                                                        setFieldValue(`principal`, sum)
                                                    }}
                                                    onBlur={handleBlur}
                                                    isInvalid={errors.individualDetails && errors.individualDetails[i] && errors.individualDetails[i].amount && touched.individualDetails && touched.individualDetails[i] && touched.individualDetails[i].amount}
                                                />
                                                {errors.individualDetails && errors.individualDetails[i] && errors.individualDetails[i].amount && <Form.Control.Feedback type="invalid">
                                                    {errors.individualDetails[i].amount}
                                                </Form.Control.Feedback>}
                                            </Form.Group>
                                        </div>
                                    )
                                })}
                                <div style={{ color: 'red', fontSize: '15px', margin: '10px' }}>
                                    {(errors.principal === 'outOfRange') ? `${local.mustBeinRange} ` + `${values.minPrincipal} ${local.and} ${values.maxPrincipal}` : errors.principal}
                                </div>
                            </Col>
                        </Row>}
                        {(values.beneficiaryType === "individual") && <Row>
                            <Col sm={12}>
                                <Form.Group controlId="principal">
                                    <Form.Label column sm={6}>{local.principal}</Form.Label>
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
                                        {(errors.principal === 'outOfRange') ? `${local.mustBeinRange} ` + `${values.minPrincipal} ${local.and} ${values.maxPrincipal}` : errors.principal}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>}
                        <Row>
                            <Col sm={6}>
                                <Form.Group controlId="noOfInstallments">
                                    <Form.Label column sm={6}>{local.noOfInstallments}</Form.Label>
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
                            {(values.beneficiaryType === "individual") &&
                                <Col sm={6}>
                                    <Form.Group controlId="applicationFee">
                                        <Form.Label column sm={10}>{local.applicationFee}</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="applicationFee"
                                            data-qc="applicationFee"
                                            value={values.applicationFee}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isInvalid={errors.applicationFee && touched.applicationFee}
                                            disabled={!values.allowApplicationFeeAdjustment || values.applicationFeePercent > 0}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.applicationFee}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            }
                            {(values.beneficiaryType === "group") &&
                                <Col sm={6}>
                                    <Form.Group controlId="individualApplicationFee">
                                        <Form.Label column sm={10}>{local.individualApplicationFee}</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="individualApplicationFee"
                                            data-qc="individualApplicationFee"
                                            value={values.individualApplicationFee}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isInvalid={errors.individualApplicationFee && touched.individualApplicationFee}
                                            disabled={!values.allowApplicationFeeAdjustment || values.applicationFeePercentPerPerson > 0}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.individualApplicationFee}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            }
                        </Row>
                        {(values.beneficiaryType === "individual") &&
                            <Row>
                                <Col sm={6}>
                                    <Form.Group controlId="applicationFeePercent">
                                        <Form.Label column sm={10}>{local.applicationFeePercent}</Form.Label>
                                        <InputGroup>
                                            <Form.Control
                                                type="number"
                                                name="applicationFeePercent"
                                                data-qc="applicationFeePercent"
                                                value={values.applicationFeePercent}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={errors.applicationFeePercent && touched.applicationFeePercent}
                                                disabled={!values.allowApplicationFeeAdjustment || values.applicationFee > 0}
                                            />
                                            <InputGroup.Prepend>
                                                <InputGroup.Text id="inputGroupPrepend">%</InputGroup.Text>
                                            </InputGroup.Prepend>
                                        </InputGroup>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.applicationFeePercent}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col sm={6} className="d-flex align-items-end">
                                    <Form.Group controlId="applicationFeeType" style={{ width: '100%' }}>
                                        <Form.Control as="select"
                                            name="applicationFeeType"
                                            data-qc="applicationFeeType"
                                            value={values.applicationFeeType}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            isInvalid={errors.applicationFeeType && touched.applicationFeeType}
                                            disabled={!values.allowApplicationFeeAdjustment || values.applicationFee > 0}
                                        >
                                            <option value="" disabled></option>
                                            <option value='principal'>{local.inAdvanceFromPrinciple}</option>
                                            <option value='monthly'>{local.inAdvanceFromMonthly}</option>
                                            <option value='yearly'>{local.inAdvanceFromYearly}</option>
                                        </Form.Control>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.applicationFeeType}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>
                        }
                        {(values.beneficiaryType === "group") &&
                            <Row>
                                <Col sm={6}>
                                    <Form.Group controlId="applicationFeePercentPerPerson">
                                        <Form.Label column sm={10}>{local.applicationFeePercentPerPerson}</Form.Label>
                                        <InputGroup>
                                            <Form.Control
                                                type="number"
                                                name="applicationFeePercentPerPerson"
                                                data-qc="applicationFeePercentPerPerson"
                                                value={values.applicationFeePercentPerPerson}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={errors.applicationFeePercentPerPerson && touched.applicationFeePercentPerPerson}
                                                disabled={!values.allowApplicationFeeAdjustment || values.individualApplicationFee > 0}
                                            />
                                            <InputGroup.Prepend>
                                                <InputGroup.Text id="inputGroupPrepend">%</InputGroup.Text>
                                            </InputGroup.Prepend>
                                        </InputGroup>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.applicationFeePercentPerPerson}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col sm={6} className="d-flex align-items-end">
                                    <Form.Group controlId="applicationFeePercentPerPersonType" style={{ width: '100%' }}>
                                        <Form.Control as="select"
                                            name="applicationFeePercentPerPersonType"
                                            data-qc="applicationFeePercentPerPersonType"
                                            value={values.applicationFeePercentPerPersonType}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            isInvalid={errors.applicationFeePercentPerPersonType && touched.applicationFeePercentPerPersonType}
                                            disabled={!values.allowApplicationFeeAdjustment || values.individualApplicationFee > 0}
                                        >
                                            <option value="" disabled></option>
                                            <option value='principal'>{local.inAdvanceFromPrinciple}</option>
                                            <option value='monthly'>{local.inAdvanceFromMonthly}</option>
                                            <option value='yearly'>{local.inAdvanceFromYearly}</option>
                                        </Form.Control>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.applicationFeePercentPerPersonType}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>
                        }
                        <Row>
                            <Col sm={6}>
                                <Form.Group controlId="representativeFees">
                                    <Form.Label column sm={6}>{local.representativeFees}</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="representativeFees"
                                        data-qc="representativeFees"
                                        value={values.representativeFees}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        isInvalid={errors.representativeFees && touched.representativeFees}
                                        disabled={!values.allowRepresentativeFeesAdjustment}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.representativeFees}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col sm={6}>
                                <Form.Group controlId="stamps">
                                    <Form.Label column sm={6}>{local.stamps}</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            type="number"
                                            name="stamps"
                                            data-qc="stamps"
                                            value={values.stamps}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isInvalid={errors.stamps && touched.stamps}
                                            disabled={!values.allowStampsAdjustment}
                                        />
                                        <InputGroup.Prepend>
                                            <InputGroup.Text id="inputGroupPrepend">%</InputGroup.Text>
                                        </InputGroup.Prepend>
                                    </InputGroup>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.stamps}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={6}>
                                <Form.Group controlId="adminFees">
                                    <Form.Label column sm={10}>{local.adminFees}</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="adminFees"
                                        data-qc="adminFees"
                                        value={values.adminFees}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        isInvalid={errors.adminFees && touched.adminFees}
                                        disabled={!values.allowAdminFeesAdjustment}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.adminFees}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col sm={6}>
                                <Form.Group controlId="entryDate">
                                    <Form.Label column sm={6}>{local.entryDate}</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="entryDate"
                                        data-qc="entryDate"
                                        value={values.entryDate}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        isInvalid={errors.entryDate && touched.entryDate}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.entryDate}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group as={Row} controlId="usage">
                            <Col sm={12}>
                                <Form.Label column sm={6}>{local.usage}</Form.Label>
                                <Form.Control as="select"
                                    type="select"
                                    name="usage"
                                    data-qc="usage"
                                    value={values.usage}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    isInvalid={errors.usage && touched.usage}
                                >
                                    <option value="" disabled></option>
                                    {props.loanUsage.map((usage) => <option key={usage.id} value={usage.id}>{usage.name}</option>)}
                                </Form.Control>
                                <Form.Control.Feedback type="invalid">
                                    {errors.usage}
                                </Form.Control.Feedback>
                            </Col>
                        </Form.Group>
                        {(values.beneficiaryType !== "group") && <Form.Group as={Row} controlId="representative">
                            <Col sm={12}>
                                <Form.Label column sm={6}>{local.representative}</Form.Label>
                                <Form.Control
                                    type="string"
                                    name="representative"
                                    data-qc="representative"
                                    value={values.representativeName}
                                    disabled
                                />
                            </Col>
                        </Form.Group>}
                        <Row>
                            <Col sm={6}>
                                <Form.Group controlId="enquirorId">
                                    <Form.Label column sm={6}>{local.enquiror}</Form.Label>
                                    <Select
                                        name="enquirorId"
                                        data-qc="enquirorId"
                                        value={props.loanOfficers.filter((lo) => lo._id === values.enquirorId)}
                                        enableReinitialize={false}
                                        onChange={(event: any) => { console.log(event, values); setFieldValue('enquirorId', event._id) }}
                                        type='text'
                                        getOptionLabel={(option) => option.name}
                                        getOptionValue={(option) => option._id}
                                        options={props.loanOfficers}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.enquirorId}
                                    </Form.Control.Feedback>
                                    <div style={{ color: '#d51b1b', fontSize: '80%', margin: '10px' }}>
                                        {errors.enquirorId}
                                    </div>
                                </Form.Group>
                            </Col>
                            <Col sm={6}>
                                <Form.Group controlId="visitationDate">
                                    <Form.Label column sm={6}>{local.visitationDate}</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="visitationDate"
                                        data-qc="visitationDate"
                                        value={values.visitationDate}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        isInvalid={errors.visitationDate && touched.visitationDate}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.visitationDate}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                    </div>
                </fieldset>
                <div className="d-flex" style={{ justifyContent: 'space-evenly', margin: '10px 0px' }}>
                    <Button type='button' className='btn-cancel-prev' style={{ width: '20%' }} onClick={() => { props.step('backward') }}>{local.previous}</Button>
                    <Button type="button" className='btn-submit-next' style={{ float: 'left', width: '20%' }} onClick={handleSubmit}>{values.beneficiaryType === "group" ? local.submit : local.next}</Button>
                </div>
            </Form >
        </>
    )
}