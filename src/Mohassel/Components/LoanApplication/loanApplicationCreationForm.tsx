import React, { useState, useEffect } from 'react'
import AsyncSelect from 'react-select/async'
import Swal from 'sweetalert2'

import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import InputGroup from 'react-bootstrap/InputGroup'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'

import * as local from '../../../Shared/Assets/ar.json'
import GroupInfoBox from '../LoanProfile/groupInfoBox'
import { searchLoanOfficerAndManager } from '../../../Shared/Services/APIs/LoanOfficers/searchLoanOfficer'
import { getCookie } from '../../../Shared/Services/getCookie'
import { getErrorMessage, parseJwt } from '../../../Shared/Services/utils'
import { searchUserByAction } from '../../Services/APIs/UserByAction/searchUserByAction'
import { theme } from '../../../Shared/theme'
import { searchResearcher } from '../../Services/APIs/Researchers/searchResearcher'
import { InfoBox } from '../../../Shared/Components'
import {
  getCompanyInfo,
  getCustomerInfo,
} from '../../../Shared/Services/formatCustomersInfo'

export const LoanApplicationCreationForm = (props: any) => {
  const {
    values,
    handleSubmit,
    handleBlur,
    handleChange,
    errors,
    touched,
    setFieldValue,
  } = props
  const [enquirerOptions, setEnquirerOptions] = useState<Array<any>>([])
  const [employees, setEmployees] = useState<Array<any>>([])
  const [researcherOptions, setResearcherOptions] = useState<Array<any>>([])
  const branchId = JSON.parse(getCookie('ltsbranch'))._id
  const getOptions = async (inputValue: string) => {
    const res = await searchLoanOfficerAndManager({
      from: 0,
      size: 100,
      name: inputValue,
      branchId,
    })
    if (res.status === 'success') {
      setEnquirerOptions(res.body.data)
      return res.body.data
    }
    setEnquirerOptions([])
    Swal.fire('error', getErrorMessage(res.error.error), 'error')
    return []
  }

  const getResearcherOptions = async (inputValue: string) => {
    const res = await searchResearcher({
      from: 0,
      size: 100,
      name: inputValue,
      branchId,
    })
    if (res.status === 'success') {
      const activeResearchers = res.body.data.filter(
        (researcher) => researcher.status === 'active'
      )
      setResearcherOptions(activeResearchers)
      return activeResearchers
    }
    setResearcherOptions([])
    Swal.fire('error', getErrorMessage(res.error.error), 'error')
    return []
  }

  const getEmployees = async () => {
    const token = getCookie('token')
    const tokenData = parseJwt(token)
    const obj = {
      size: 1000,
      from: 0,
      serviceKey: 'halan.com/application',
      action: 'actBranchManager',
      branchId: tokenData?.branch,
    }
    const res = await searchUserByAction(obj)
    if (res.status === 'success') {
      setEmployees(res.body.data)
      return res.body.data
    }
    setEmployees([])
    Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
    return []
  }
  useEffect(() => {
    getEmployees()
  }, [])
  return (
    <>
      <Form
        style={{ textAlign: 'right', width: '90%', padding: 20 }}
        onSubmit={handleSubmit}
      >
        <fieldset
          disabled={
            !(values.state === 'edit' || values.state === 'under_review')
          }
        >
          {props.customer && Object.keys(props.customer).includes('_id') ? (
            <InfoBox
              info={
                props.customer.customerType === 'company'
                  ? [getCompanyInfo({ company: props.customer })]
                  : [getCustomerInfo({ customerDetails: props.customer })]
              }
            />
          ) : (
            <GroupInfoBox
              group={{ individualsInGroup: values.individualDetails }}
            />
          )}
          <div style={{ width: '100%', margin: '20px 0' }}>
            <Row>
              <Col sm={7}>
                <Form.Group controlId="productID">
                  <Form.Label>{local.productName}</Form.Label>
                  <Form.Control
                    as="select"
                    name="productID"
                    data-qc="productID"
                    value={values.productID}
                    onBlur={handleBlur}
                    onChange={(event) => {
                      if (event.currentTarget.value.length > 0) {
                        props.getSelectedLoanProduct(event.currentTarget.value)
                      } else {
                        setFieldValue('productID', '')
                      }
                    }}
                    isInvalid={errors.productID && touched.productID}
                  >
                    <option value="" disabled />
                    {console.log(props)}
                    {/* {props.products.map((product, i) => (
                      <option key={i} value={product._id}>
                        {product.productName}
                      </option>
                    ))} */}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {errors.productID}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col sm={5}>
                <Form.Group controlId="currency">
                  <Form.Label>{local.currency}</Form.Label>
                  <Form.Control
                    as="select"
                    name="currency"
                    data-qc="currency"
                    value={values.currency}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    isInvalid={errors.currency && touched.currency}
                    disabled
                  >
                    <option value="" disabled />
                    <option value="egp">{local.egp}</option>
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
                  <Form.Label>{local.calculationFormulaId}</Form.Label>
                  <Form.Control
                    as="select"
                    name="calculationFormulaId"
                    data-qc="calculationFormulaId"
                    value={values.calculationFormulaId}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    isInvalid={
                      errors.calculationFormulaId &&
                      touched.calculationFormulaId
                    }
                    disabled
                  >
                    <option value="" disabled />
                    {props.formulas.map((formula, i) => (
                      <option key={i} value={formula._id}>
                        {formula.name}
                      </option>
                    ))}
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
                  <Form.Label>{local.interest}</Form.Label>
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
                      <InputGroup.Text id="inputGroupPrepend">
                        %
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                  </InputGroup>
                  <Form.Control.Feedback type="invalid">
                    {errors.interest}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col sm={6} className="d-flex align-items-end">
                <Form.Group
                  controlId="interestPeriod"
                  style={{ width: '100%' }}
                >
                  <Form.Control
                    as="select"
                    name="interestPeriod"
                    data-qc="interestPeriod"
                    value={values.interestPeriod}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    isInvalid={errors.interestPeriod && touched.interestPeriod}
                    disabled={!values.allowInterestAdjustment}
                  >
                    <option value="" disabled />
                    <option value="yearly">{local.yearlyInterestPeriod}</option>
                    <option value="monthly">
                      {local.monthlyInterestPeriod}
                    </option>
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
                  <Form.Label>{local.inAdvanceFees}</Form.Label>
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
                      <InputGroup.Text id="inputGroupPrepend">
                        %
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                  </InputGroup>
                  <Form.Control.Feedback type="invalid">
                    {errors.inAdvanceFees}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col sm={3} className="d-flex align-items-end">
                <Form.Group controlId="inAdvanceFrom" style={{ width: '100%' }}>
                  <Form.Control
                    as="select"
                    name="inAdvanceFrom"
                    data-qc="inAdvanceFrom"
                    value={values.inAdvanceFrom}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    isInvalid={errors.inAdvanceFrom && touched.inAdvanceFrom}
                    disabled
                  >
                    <option value="" disabled />
                    <option value="principal">
                      {local.inAdvanceFromPrinciple}
                    </option>
                    <option value="monthly">
                      {local.inAdvanceFromMonthly}
                    </option>
                    <option value="yearly">{local.inAdvanceFromYearly}</option>
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {errors.inAdvanceFrom}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col sm={3} className="d-flex align-items-end">
                <Form.Group controlId="inAdvanceType" style={{ width: '100%' }}>
                  <Form.Control
                    as="select"
                    name="inAdvanceType"
                    data-qc="inAdvanceType"
                    value={values.inAdvanceType}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    isInvalid={errors.inAdvanceType && touched.inAdvanceType}
                    disabled
                  >
                    <option value="" disabled />
                    <option value="cut">{local.inAdvanceFeesCut}</option>
                    <option value="uncut">{local.inAdvanceFeesUncut}</option>
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
                  <Form.Label>{local.periodLengthEvery}</Form.Label>
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
                  <Form.Control
                    as="select"
                    name="periodType"
                    data-qc="periodType"
                    value={values.periodType}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    isInvalid={errors.periodType && touched.periodType}
                    disabled
                  >
                    <option value="" disabled />
                    <option value="months">{local.month}</option>
                    <option value="days">{local.day}</option>
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
                  <Form.Label>{local.gracePeriod}</Form.Label>
                  <Form.Control
                    type="number"
                    name="gracePeriod"
                    data-qc="gracePeriod"
                    value={values.gracePeriod}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={errors.gracePeriod && touched.gracePeriod}
                    disabled
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.gracePeriod}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group controlId="pushPayment">
                  <Form.Label>{local.pushPayment}</Form.Label>
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
            {values.beneficiaryType === 'group' && (
              <Row>
                <Col
                  style={{
                    border: '1px solid #e5e5e5',
                    backgroundColor: '#f8f8f8',
                    padding: 10,
                  }}
                >
                  <p style={{ margin: '10px 0px', color: '#2a3390' }}>
                    {local.individualLoanPrinciple}
                  </p>
                  {values.individualDetails.map((customer, i) => {
                    return (
                      <div
                        key={customer.customer._id}
                        className="d-flex justify-content-between"
                      >
                        <span style={{ color: '#7dc356' }}>{i + 1}-</span>
                        <span>{customer.customer.customerName}</span>
                        <Form.Group
                          controlId="individualDetails"
                          style={{ width: '50%' }}
                        >
                          <Form.Control
                            type="number"
                            name={`individualDetails[${i}].amount`}
                            data-qc="individualDetailsAmount"
                            value={values.individualDetails[i].amount}
                            onChange={(e) => {
                              setFieldValue(
                                `individualDetails[${i}].amount`,
                                Number(e.currentTarget.value)
                              )
                              let sum = 0
                              values.individualDetails.forEach(
                                (member, index) => {
                                  sum +=
                                    index === i
                                      ? Number(e.currentTarget.value)
                                      : Number(member.amount)
                                }
                              )
                              setFieldValue(`principal`, sum)
                            }}
                            onBlur={handleBlur}
                            isInvalid={
                              errors.individualDetails &&
                              errors.individualDetails[i] &&
                              errors.individualDetails[i].amount &&
                              touched.individualDetails &&
                              touched.individualDetails[i] &&
                              touched.individualDetails[i].amount
                            }
                          />
                          {errors.individualDetails &&
                            errors.individualDetails[i] &&
                            errors.individualDetails[i].amount && (
                              <Form.Control.Feedback type="invalid">
                                {errors.individualDetails[i].amount}
                              </Form.Control.Feedback>
                            )}
                        </Form.Group>
                      </div>
                    )
                  })}
                  <div
                    style={{ color: 'red', fontSize: '15px', margin: '10px' }}
                  >
                    {errors.principal === 'outOfRange'
                      ? `${local.mustBeinRange} ` +
                        `${values.minPrincipal} ${local.and} ${values.maxPrincipal}`
                      : errors.principal}
                  </div>
                </Col>
              </Row>
            )}
            {values.beneficiaryType === 'individual' && (
              <Row>
                <Col sm={12}>
                  <Form.Group controlId="principal">
                    <Form.Label>{local.principal}</Form.Label>
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
                      {errors.principal === 'outOfRange'
                        ? `${local.mustBeinRange} ` +
                          `${values.minPrincipal} ${local.and} ${values.maxPrincipal}`
                        : errors.principal}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
            )}
            <Row>
              <Col sm={6}>
                <Form.Group controlId="noOfInstallments">
                  <Form.Label>{local.noOfInstallments}</Form.Label>
                  <Form.Control
                    type="number"
                    name="noOfInstallments"
                    data-qc="noOfInstallments"
                    value={values.noOfInstallments}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={
                      errors.noOfInstallments && touched.noOfInstallments
                    }
                    disabled={values.productType === 'nano'}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.noOfInstallments === 'outOfRange'
                      ? `${local.mustBeinRange} ` +
                        `${values.minInstallment} ${local.and} ${values.maxInstallment}`
                      : errors.noOfInstallments}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              {values.beneficiaryType === 'individual' && (
                <Col sm={6}>
                  <Form.Group controlId="applicationFee">
                    <Form.Label>{local.applicationFee}</Form.Label>
                    <Form.Control
                      type="number"
                      name="applicationFee"
                      data-qc="applicationFee"
                      value={values.applicationFee}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={
                        errors.applicationFee && touched.applicationFee
                      }
                      disabled={
                        !values.allowApplicationFeeAdjustment ||
                        values.applicationFeePercent > 0
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.applicationFee}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              )}
              {values.beneficiaryType === 'group' && (
                <Col sm={6}>
                  <Form.Group controlId="individualApplicationFee">
                    <Form.Label>{local.individualApplicationFee}</Form.Label>
                    <Form.Control
                      type="number"
                      name="individualApplicationFee"
                      data-qc="individualApplicationFee"
                      value={values.individualApplicationFee}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={
                        errors.individualApplicationFee &&
                        touched.individualApplicationFee
                      }
                      disabled={
                        !values.allowApplicationFeeAdjustment ||
                        values.applicationFeePercentPerPerson > 0
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.individualApplicationFee}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              )}
            </Row>
            {values.beneficiaryType === 'individual' && (
              <Row>
                <Col sm={6}>
                  <Form.Group controlId="applicationFeePercent">
                    <Form.Label>{local.applicationFeePercent}</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="number"
                        name="applicationFeePercent"
                        data-qc="applicationFeePercent"
                        value={values.applicationFeePercent}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={
                          errors.applicationFeePercent &&
                          touched.applicationFeePercent
                        }
                        disabled={
                          !values.allowApplicationFeeAdjustment ||
                          values.applicationFee > 0
                        }
                      />
                      <InputGroup.Prepend>
                        <InputGroup.Text id="inputGroupPrepend">
                          %
                        </InputGroup.Text>
                      </InputGroup.Prepend>
                    </InputGroup>
                    <Form.Control.Feedback type="invalid">
                      {errors.applicationFeePercent}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col sm={6} className="d-flex align-items-end">
                  <Form.Group
                    controlId="applicationFeeType"
                    style={{ width: '100%' }}
                  >
                    <Form.Control
                      as="select"
                      name="applicationFeeType"
                      data-qc="applicationFeeType"
                      value={values.applicationFeeType}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      isInvalid={
                        errors.applicationFeeType && touched.applicationFeeType
                      }
                      disabled={
                        !values.allowApplicationFeeAdjustment ||
                        values.applicationFee > 0
                      }
                    >
                      <option value="" disabled />
                      <option value="principal">
                        {local.inAdvanceFromPrinciple}
                      </option>
                      <option value="monthly">
                        {local.inAdvanceFromMonthly}
                      </option>
                      <option value="yearly">
                        {local.inAdvanceFromYearly}
                      </option>
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {errors.applicationFeeType}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
            )}
            {values.beneficiaryType === 'group' && (
              <Row>
                <Col sm={6}>
                  <Form.Group controlId="applicationFeePercentPerPerson">
                    <Form.Label>
                      {local.applicationFeePercentPerPerson}
                    </Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="number"
                        name="applicationFeePercentPerPerson"
                        data-qc="applicationFeePercentPerPerson"
                        value={values.applicationFeePercentPerPerson}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={
                          errors.applicationFeePercentPerPerson &&
                          touched.applicationFeePercentPerPerson
                        }
                        disabled={
                          !values.allowApplicationFeeAdjustment ||
                          values.individualApplicationFee > 0
                        }
                      />
                      <InputGroup.Prepend>
                        <InputGroup.Text id="inputGroupPrepend">
                          %
                        </InputGroup.Text>
                      </InputGroup.Prepend>
                    </InputGroup>
                    <Form.Control.Feedback type="invalid">
                      {errors.applicationFeePercentPerPerson}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col sm={6} className="d-flex align-items-end">
                  <Form.Group
                    controlId="applicationFeePercentPerPersonType"
                    style={{ width: '100%' }}
                  >
                    <Form.Control
                      as="select"
                      name="applicationFeePercentPerPersonType"
                      data-qc="applicationFeePercentPerPersonType"
                      value={values.applicationFeePercentPerPersonType}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      isInvalid={
                        errors.applicationFeePercentPerPersonType &&
                        touched.applicationFeePercentPerPersonType
                      }
                      disabled={
                        !values.allowApplicationFeeAdjustment ||
                        values.individualApplicationFee > 0
                      }
                    >
                      <option value="" disabled />
                      <option value="principal">
                        {local.inAdvanceFromPrinciple}
                      </option>
                      <option value="monthly">
                        {local.inAdvanceFromMonthly}
                      </option>
                      <option value="yearly">
                        {local.inAdvanceFromYearly}
                      </option>
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {errors.applicationFeePercentPerPersonType}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
            )}
            <Row>
              <Col sm={6}>
                <Form.Group controlId="representativeFees">
                  <Form.Label>{local.representativeFees}</Form.Label>
                  <Form.Control
                    type="number"
                    name="representativeFees"
                    data-qc="representativeFees"
                    value={values.representativeFees}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={
                      errors.representativeFees && touched.representativeFees
                    }
                    disabled={!values.allowRepresentativeFeesAdjustment}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.representativeFees}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group controlId="stamps">
                  <Form.Label>{local.stamps}</Form.Label>
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
                      <InputGroup.Text id="inputGroupPrepend">
                        %
                      </InputGroup.Text>
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
                  <Form.Label>{local.adminFees}</Form.Label>
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
                  <Form.Label>{local.entryDate}</Form.Label>
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
                <Form.Label>{local.usage}</Form.Label>
                <Form.Control
                  as="select"
                  type="select"
                  name="usage"
                  data-qc="usage"
                  value={values.usage}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  isInvalid={errors.usage && touched.usage}
                >
                  <option value="" disabled />
                  {props.loanUsage.map((usage) => (
                    <option key={usage.id} value={usage.id}>
                      {usage.name}
                    </option>
                  ))}
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  {errors.usage}
                </Form.Control.Feedback>
              </Col>
            </Form.Group>
            {values.beneficiaryType !== 'group' && (
              <Form.Group as={Row} controlId="representative">
                <Col sm={12}>
                  <Form.Label>{local.representative}</Form.Label>
                  <Form.Control
                    type="string"
                    name="representative"
                    data-qc="representative"
                    value={values.representativeName}
                    disabled
                  />
                </Col>
              </Form.Group>
            )}
            <Row>
              {props.customer.customerType === 'company' ? (
                <Col sm={6}>
                  <Form.Group controlId="researcherId">
                    <Form.Label>{local.researcher}</Form.Label>
                    <AsyncSelect
                      name="researcherId"
                      data-qc="researcherId"
                      value={researcherOptions.filter(
                        (researcher) => researcher._id === values.researcherId
                      )}
                      onChange={(event: any) => {
                        setFieldValue('researcherId', event._id)
                      }}
                      type="text"
                      styles={theme.selectStyleWithBorder}
                      theme={theme.selectTheme}
                      getOptionLabel={(option) => option.name}
                      getOptionValue={(option) => option._id}
                      loadOptions={getResearcherOptions}
                      cacheOptions
                      defaultOptions
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.researcherId}
                    </Form.Control.Feedback>
                    <div
                      style={{
                        color: '#d51b1b',
                        fontSize: '80%',
                        margin: '10px',
                      }}
                    >
                      {errors.researcherId}
                    </div>
                  </Form.Group>
                </Col>
              ) : (
                <Col sm={6}>
                  <Form.Group controlId="enquirorId">
                    <Form.Label>{local.enquiror}</Form.Label>
                    <AsyncSelect
                      name="enquirorId"
                      data-qc="enquirorId"
                      value={enquirerOptions.filter(
                        (lo) => lo._id === values.enquirorId
                      )}
                      onChange={(event: any) => {
                        setFieldValue('enquirorId', event._id)
                      }}
                      type="text"
                      styles={theme.selectStyleWithBorder}
                      theme={theme.selectTheme}
                      getOptionLabel={(option) => option.name}
                      getOptionValue={(option) => option._id}
                      loadOptions={getOptions}
                      cacheOptions
                      defaultOptions
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.enquirorId}
                    </Form.Control.Feedback>
                    <div
                      style={{
                        color: '#d51b1b',
                        fontSize: '80%',
                        margin: '10px',
                      }}
                    >
                      {errors.enquirorId}
                    </div>
                  </Form.Group>
                </Col>
              )}
              <Col sm={6}>
                <Form.Group controlId="visitationDate">
                  <Form.Label>{local.visitationDate}</Form.Label>
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
            <Row>
              <Col sm={6}>
                <Form.Group controlId="branchManagerId">
                  <Form.Label>{`${local.branchManager}`}</Form.Label>
                  <Form.Control
                    as="select"
                    name="branchManagerId"
                    data-qc="branchManagerId"
                    onChange={handleChange}
                    value={values.branchManagerId}
                    onBlur={handleBlur}
                    isInvalid={
                      Boolean(errors.branchManagerId) &&
                      Boolean(touched.branchManagerId)
                    }
                  >
                    <option value="" />
                    {employees.map((employee, index) => {
                      return (
                        <option
                          key={index}
                          value={employee._id}
                          data-qc={employee._id}
                        >
                          {employee.name}
                        </option>
                      )
                    })}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {errors.branchManagerId}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group controlId="managerVisitDate">
                  <Form.Label>{`${local.branchManagerVisitation}`}</Form.Label>
                  <Form.Control
                    type="date"
                    name="managerVisitDate"
                    data-qc="managerVisitDate"
                    value={values.managerVisitDate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={
                      Boolean(errors.managerVisitDate) &&
                      Boolean(touched.managerVisitDate)
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.managerVisitDate}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
          </div>
        </fieldset>
        <div className="d-flex justify-content-between py-4">
          <Button
            className="btn-cancel-prev w-25"
            onClick={() => {
              props.step('backward')
            }}
          >
            {local.previous}
          </Button>
          <Button
            variant="primary"
            className="w-25"
            type="button"
            data-qc="submit"
            onClick={handleSubmit}
          >
            {values.beneficiaryType === 'group' ? local.submit : local.next}
          </Button>
        </div>
      </Form>
    </>
  )
}
