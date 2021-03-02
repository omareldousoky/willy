import React from 'react'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import * as local from '../../../Shared/Assets/ar.json'

export const LoanFormulaCreationForm = (props: any) => {
  const {
    values,
    handleSubmit,
    handleBlur,
    handleChange,
    errors,
    touched,
    setFieldValue,
  } = props
  return (
    <Form style={{ textAlign: 'right' }} onSubmit={handleSubmit}>
      <Col sm={12}>
        <Form.Group
          className="data-group"
          controlId="loanCalculationFormulaName"
        >
          <Form.Label>{local.loanCalculationFormulaName}</Form.Label>
          <Form.Control
            type="text"
            name="loanCalculationFormulaName"
            data-qc="loanCalculationFormulaName"
            value={values.loanCalculationFormulaName}
            onChange={handleChange}
            onBlur={handleBlur}
            isInvalid={
              errors.loanCalculationFormulaName &&
              touched.loanCalculationFormulaName
            }
          />
          <Form.Control.Feedback type="invalid">
            {errors.loanCalculationFormulaName}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>
      <Col sm={12}>
        <Form.Group className="data-group" controlId="interestType">
          <Form.Label style={{ textAlign: 'right' }} column sm={8}>
            {local.interestType}
          </Form.Label>
          <Form.Control
            as="select"
            name="interestType"
            data-qc="interestType"
            value={values.interestType}
            onBlur={handleBlur}
            onChange={handleChange}
            isInvalid={errors.interestType && touched.interestType}
          >
            <option value="flat">{local.interestTypeFlat}</option>
            <option value="reducing">{local.interestTypeReducing}</option>
            {/* <option value="3">تكلفه التمويل متساوية محولة الي تكلفه تمويل متناقصه</option> */}
          </Form.Control>
          <Form.Control.Feedback type="invalid">
            {errors.interestType}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>
      <Col sm={12}>
        <Form.Group className="data-group" controlId="installmentType">
          <Form.Label style={{ textAlign: 'right' }} column sm={8}>
            {local.installmentType}
          </Form.Label>
          <Form.Control
            as="select"
            name="installmentType"
            data-qc="installmentType"
            value={values.installmentType}
            onBlur={handleBlur}
            onChange={handleChange}
            isInvalid={errors.installmentType && touched.installmentType}
          >
            <option value="principalAndFees">
              {local.installmentTypePrincipalAndFees}
            </option>
            <option value="feesFirst">{local.installmentTypeFeesFirst}</option>
          </Form.Control>
          <Form.Control.Feedback type="invalid">
            {errors.installmentType}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>
      <Form.Group className="data-group" as={Row} controlId="gracePeriodFees">
        <Form.Label style={{ textAlign: 'right' }} column sm={8}>
          {local.gracePeriodFees}
        </Form.Label>
        <Form.Check
          type="checkbox"
          name="gracePeriodFees"
          data-qc="gracePeriodFees"
          value={values.gracePeriodFees}
          onBlur={handleBlur}
          onChange={handleChange}
          isInvalid={errors.gracePeriodFees && touched.gracePeriodFees}
        />
        <Form.Control.Feedback type="invalid">
          {errors.gracePeriodFees}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="data-group" as={Row} controlId="rounding">
        <Form.Label style={{ textAlign: 'right' }} column sm={8}>
          {local.rounding}
        </Form.Label>
        <Form.Check
          type="checkbox"
          name="rounding"
          data-qc="rounding"
          value={values.rounding}
          checked={values.rounding}
          onBlur={handleBlur}
          onChange={handleChange}
          isInvalid={errors.rounding && touched.rounding}
        />
        <Form.Control.Feedback type="invalid">
          {errors.rounding}
        </Form.Control.Feedback>
      </Form.Group>
      <Col sm={12}>
        <Form.Group className="data-group" controlId="roundDirection">
          <Form.Label style={{ textAlign: 'right' }} column sm={8}>
            {local.roundDirection}
          </Form.Label>
          <Form.Control
            as="select"
            name="roundDirection"
            data-qc="roundDirection"
            value={values.roundDirection}
            onBlur={handleBlur}
            onChange={handleChange}
            isInvalid={errors.roundDirection && touched.roundDirection}
            disabled={!values.rounding}
          >
            <option value="down">{local.roundDown}</option>
            <option value="up">{local.roundUp}</option>
          </Form.Control>
          <Form.Control.Feedback type="invalid">
            {errors.roundDirection}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>
      <Col sm={12}>
        <Form.Group className="data-group" controlId="roundTo">
          <Form.Label style={{ textAlign: 'right' }} column sm={8}>
            {local.roundTo}
          </Form.Label>
          <Form.Control
            type="number"
            name="roundTo"
            data-qc="roundTo"
            value={values.roundTo}
            onChange={handleChange}
            onBlur={handleBlur}
            isInvalid={errors.roundTo && touched.roundTo}
            disabled={!values.rounding}
          />
          <Form.Control.Feedback type="invalid">
            {errors.roundTo}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>
      <Col sm={12}>
        <Form.Group className="data-group" controlId="roundWhat">
          <Form.Label style={{ textAlign: 'right' }} column sm={8}>
            {local.roundWhat}
          </Form.Label>
          <Form.Control
            as="select"
            name="roundWhat"
            data-qc="roundWhat"
            value={values.roundWhat}
            onBlur={handleBlur}
            onChange={handleChange}
            isInvalid={errors.roundWhat && touched.roundWhat}
            disabled={!values.rounding}
          >
            <option value="principal">{local.roundPrincipal}</option>
            <option value="fees">{local.roundFees}</option>
            <option value="principalAndFees">
              {local.roundPrincipalAndFees}
            </option>
            <option value="installmentAndPrincipal">
              {local.roundInstallmentAndPrincipal}
            </option>
            <option value="installmentAndFees">
              {local.roundInstallmentAndFees}
            </option>
            <option value="installment">{local.roundInstallment}</option>
            <option value="principalAndTotalFees">
              {local.roundPrincipalAndTotalFees}
            </option>
          </Form.Control>
          <Form.Control.Feedback type="invalid">
            {errors.roundWhat}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>
      <Form.Group
        className="data-group"
        as={Row}
        controlId="equalInstallmentsTrue"
      >
        <Form.Label style={{ textAlign: 'right' }} column sm={8}>
          {local.equalInstallmentsTrue}
        </Form.Label>
        <Form.Check
          type="checkbox"
          name="equalInstallments"
          data-qc="equalInstallments"
          value={values.equalInstallments}
          checked={values.equalInstallments}
          onBlur={handleBlur}
          disabled={!values.rounding || values.roundLastInstallment}
          onChange={handleChange}
          isInvalid={errors.equalInstallments && touched.equalInstallments}
        />
        <Form.Control.Feedback type="invalid">
          {errors.equalInstallments}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group
        className="data-group"
        as={Row}
        controlId="roundLastInstallment"
      >
        <Form.Label style={{ textAlign: 'right' }} column sm={8}>
          {local.roundLastInstallment}
        </Form.Label>
        <Form.Check
          type="checkbox"
          name="roundLastInstallment"
          data-qc="roundLastInstallment"
          value={values.roundLastInstallment}
          checked={values.roundLastInstallment}
          onBlur={handleBlur}
          disabled={!values.rounding || values.equalInstallments}
          onChange={handleChange}
          isInvalid={
            errors.roundLastInstallment && touched.roundLastInstallment
          }
        />
        <Form.Control.Feedback type="invalid">
          {errors.roundLastInstallment}
        </Form.Control.Feedback>
      </Form.Group>
      <div className="d-flex justify-content-end">
        <Button type="button" onClick={handleSubmit}>
          {local.submit}
        </Button>
      </div>
    </Form>
  )
}
