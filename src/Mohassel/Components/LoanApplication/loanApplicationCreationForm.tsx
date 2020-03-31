import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import * as local from '../../../Shared/Assets/ar.json';
import CustomerSearch from '../CustomerSearch/customerSearchTable';
export const LoanApplicationCreationForm = (props: any) => {
    const { values, handleSubmit, handleBlur, handleChange, errors, touched, setFieldValue, setValues } = props;
    return (
        <Form style={{ justifyContent: 'center', alignItems: 'flex-start', display: 'flex', flexDirection: 'column' }} onSubmit={handleSubmit}>
            <div style={{ border: '1px solid black', width: '100%' }}>
                <p style={{ textAlign: 'right' }}>{local.mainInfo}</p>
                <div className="d-flex flex-row">
                    <div className="d-flex flex-column" style={{ width: '50%', textAlign: 'right' }}>
                        <div className="d-flex flex-row">
                            <p style={{ width: '50%', borderTop: '1px solid black', borderBottom: '1px solid black' }}>{local.name}</p>
                            <p style={{ width: '50%', borderTop: '1px solid black', borderBottom: '1px solid black' }}>{values.customerName}</p>
                        </div>
                        <div className="d-flex flex-row">
                            <p style={{ width: '50%', borderTop: '1px solid black', borderBottom: '1px solid black' }}>{local.customerCode}</p>
                            <p style={{ width: '50%', borderTop: '1px solid black', borderBottom: '1px solid black' }}>{values.customerCode}</p>
                        </div>
                        <div className="d-flex flex-row">
                            <p style={{ width: '50%', borderTop: '1px solid black', borderBottom: '1px solid black' }}>{local.nationalId}</p>
                            <p style={{ width: '50%', borderTop: '1px solid black', borderBottom: '1px solid black' }}>{values.nationalId}</p>
                        </div>
                        <div className="d-flex flex-row">
                            <p style={{ width: '50%', borderTop: '1px solid black', borderBottom: '1px solid black' }}>{local.birthDate}</p>
                            <p style={{ width: '50%', borderTop: '1px solid black', borderBottom: '1px solid black' }}>{values.birthDate}</p>
                        </div>
                        <div className="d-flex flex-row">
                            <p style={{ width: '50%', borderTop: '1px solid black', borderBottom: '1px solid black' }}>{local.gender}</p>
                            <p style={{ width: '50%', borderTop: '1px solid black', borderBottom: '1px solid black' }}>{values.gender}</p>
                        </div>
                        <div className="d-flex flex-row">
                            <p style={{ width: '50%', borderTop: '1px solid black', borderBottom: '1px solid black' }}>{local.nationalIdIssueDate}</p>
                            <p style={{ width: '50%', borderTop: '1px solid black', borderBottom: '1px solid black' }}>{values.nationalIdIssueDate}</p>
                        </div>
                    </div>
                    <div className="d-flex flex-column" style={{ width: '50%', textAlign: 'right' }}>
                        <div className="d-flex flex-row">
                            <p style={{ width: '50%', borderTop: '1px solid black', borderBottom: '1px solid black' }}>{local.businessSector}</p>
                            <p style={{ width: '50%', borderTop: '1px solid black', borderBottom: '1px solid black' }}>{values.businessSector}</p>
                        </div>
                        <div className="d-flex flex-row">
                            <p style={{ width: '50%', borderTop: '1px solid black', borderBottom: '1px solid black' }}>{local.businessActivity}</p>
                            <p style={{ width: '50%', borderTop: '1px solid black', borderBottom: '1px solid black' }}>{values.businessActivity}</p>
                        </div>
                        <div className="d-flex flex-row">
                            <p style={{ width: '50%', borderTop: '1px solid black', borderBottom: '1px solid black' }}>{local.businessSpeciality}</p>
                            <p style={{ width: '50%', borderTop: '1px solid black', borderBottom: '1px solid black' }}>{values.businessSpeciality}</p>
                        </div>
                        <div className="d-flex flex-row">
                            <p style={{ width: '50%', borderTop: '1px solid black', borderBottom: '1px solid black' }}>{local.permanentEmployeeCount}</p>
                            <p style={{ width: '50%', borderTop: '1px solid black', borderBottom: '1px solid black' }}>{values.permanentEmployeeCount}</p>
                        </div>
                        <div className="d-flex flex-row">
                            <p style={{ width: '50%', borderTop: '1px solid black', borderBottom: '1px solid black' }}>{local.partTimeEmployeeCount}</p>
                            <p style={{ width: '50%', borderTop: '1px solid black', borderBottom: '1px solid black' }}>{values.partTimeEmployeeCount}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div style={{ width: '100%' }}>
                <p style={{ textAlign: 'right' }}>{local.loanInfo}</p>
                <div>
                    <Form.Group as={Row} controlId="productID">
                        <Form.Label style={{ textAlign: 'right' }} column sm={4}>{local.productName}</Form.Label>
                        <Col sm={6}>
                            <Form.Control as="select"
                                name="productID"
                                data-qc="productID"
                                value={values.productID}
                                onBlur={handleBlur}
                                onChange={(event) => {
                                    if(event.currentTarget.value.length>0){
                                        props.getSelectedLoanProduct(event.currentTarget.value, setValues, values);
                                    }else{
                                        setFieldValue('productID','')
                                    }
                                }}
                                isInvalid={errors.productID && touched.productID}
                            >
                                <option value=''></option>
                                {props.products.map((product, i) =>
                                    <option key={i} value={product._id}>{product.productName}</option>
                                )}
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">
                                {errors.productID}
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
                                disabled
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
                                disabled
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
                                disabled
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
                                disabled
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
                                disabled
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
                        </Col>
                        <Col sm={3}>
                            <Form.Control as="select"
                                name="periodType"
                                data-qc="periodType"
                                value={values.periodType}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                isInvalid={errors.periodType && touched.periodType}
                                disabled
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
                    <Form.Group as={Row} controlId="individualApplicationFee">
                        <Form.Label style={{ textAlign: 'right' }} column sm={4}>{local.individualApplicationFee}</Form.Label>
                        <Col sm={6}>
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
                        <Col sm={6}>
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
                        <Col sm={6}>
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
                    <Form.Group as={Row} controlId="representativeFees">
                        <Form.Label style={{ textAlign: 'right' }} column sm={4}>{local.representativeFees}</Form.Label>
                        <Col sm={6}>
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
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="stamps">
                        <Form.Label style={{ textAlign: 'right' }} column sm={4}>{local.stamps}</Form.Label>
                        <Col sm={6}>
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
                            <Form.Control.Feedback type="invalid">
                                {errors.stamps}
                            </Form.Control.Feedback>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="adminFees">
                        <Form.Label style={{ textAlign: 'right' }} column sm={4}>{local.adminFees}</Form.Label>
                        <Col sm={6}>
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
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="entryDate">
                        <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.entryDate}</Form.Label>
                        <Col sm={6}>
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
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="usage">
                        <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.usage}</Form.Label>
                        <Col sm={6}>
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
                                <option value="finance">Finance</option>
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">
                                {errors.usage}
                            </Form.Control.Feedback>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="representative">
                        <Form.Label style={{ textAlign: 'right' }} column sm={4}>{local.representative}</Form.Label>
                        <Col sm={6}>
                            <Form.Control
                                type="string"
                                name="representative"
                                data-qc="representative"
                                value={values.representative}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={errors.representative && touched.representative}
                                disabled
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.representative}
                            </Form.Control.Feedback>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="enquirorId">
                        <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.enquiror}</Form.Label>
                        <Col sm={6}>
                            <Form.Control as="select"
                                type="select"
                                name="enquirorId"
                                data-qc="enquirorId"
                                value={values.enquirorId}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                isInvalid={errors.enquirorId && touched.enquirorId}
                            >
                                <option value="" disabled></option>
                                <option value="4321234">WillyEnq</option>
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">
                                {errors.enquirorId}
                            </Form.Control.Feedback>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="visitationDate">
                        <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.visitationDate}</Form.Label>
                        <Col sm={6}>
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
                        </Col>
                    </Form.Group>
                </div>
            </div>
            <div style={{ border: '1px solid black', width: '100%' }}>
                <p style={{ textAlign: 'right' }}>{local.guarantorInfo}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                    <CustomerSearch
                        source='1'
                        style={{width: '48%'}}
                        handleSearch={(query) => props.handleSearch(query, 'guarantor1Res')}
                        searchResults={props.searchResults1}
                        selectCustomer={(guarantor) => { props.selectGuarantor(guarantor, 'guarantor1') }}
                        selectedGuarantor={props.guarantorOne}
                    />
                    {Object.keys(props.guarantorOne).length > 0 && <CustomerSearch
                        source='2'
                        style={{width: '48%'}}
                        handleSearch={(query) => props.handleSearch(query, 'guarantor2Res')}
                        searchResults={props.searchResults2}
                        selectCustomer={(guarantor) => { props.selectGuarantor(guarantor, 'guarantor2') }}
                        selectedGuarantor={props.guarantorTwo}
                    />}
                </div>
            </div>
            <div style={{ width: '100%' }}>
                <p style={{ textAlign: 'right' }}>{local.viceCustomersInfo}</p>
                {props.viceCustomers.map((vice,i) =>
                    <div key={i}>
                        <Form.Group as={Row} controlId="viceCustomerName">
                            <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.name}</Form.Label>
                            <Col sm={6}>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    data-qc="viceCustomerName"
                                    value={props.viceCustomers[i].viceCustomerName}
                                    onBlur={handleBlur}
                                    onChange={(e)=>{
                                        e.preventDefault();
                                        props.updateViceCustomer(e.currentTarget.name,e.currentTarget.value,i,false)
                                    }}
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="viceCustomerNumber">
                            <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.phoneNumber}</Form.Label>
                            <Col sm={6}>
                                <Form.Control
                                    type="text"
                                    name="phoneNumber"
                                    data-qc="viceCustomerNumber"
                                    value={props.viceCustomers[i].viceCustomerNumber}
                                    onBlur={handleBlur}
                                    onChange={(e)=>{
                                        e.preventDefault();
                                        props.updateViceCustomer(e.currentTarget.name,e.currentTarget.value,i,false)
                                    }}
                                />
                            </Col>
                        </Form.Group>
                        {i !== 0 && <Button type='button' onClick={()=>props.updateViceCustomer(null,null,i,true)}>-</Button>}
                    </div>)}
                    {props.viceCustomers.filter(item => item !== undefined).length<3 && <Button type='button' onClick={()=>props.updateViceCustomer(null,null,null,true)}>+</Button>}
            </div>
            <Button type="button" style={{ margin: 10 }} onClick={handleSubmit}>{local.submit}</Button>
        </Form >
    )
}