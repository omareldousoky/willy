import React from 'react'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import * as local from '../../../Shared/Assets/ar.json'

export const LoanFormulaTestForm = (props: any) => {
  const {
    values,
    handleSubmit,
    handleBlur,
    handleChange,
    errors,
    touched,
  } = props
  return (
    <Form style={{ padding: '2rem' }} onSubmit={handleSubmit}>
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
                errors.calculationFormulaId && touched.calculationFormulaId
              }
            >
              <option value="" />
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
              {errors.principal}
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
              isInvalid={errors.noOfInstallments && touched.noOfInstallments}
            />
            <Form.Control.Feedback type="invalid">
              {errors.noOfInstallments}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
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
            />
            <Form.Control.Feedback type="invalid">
              {errors.gracePeriod}
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
            >
              <option value="months">شهر</option>
              <option value="days">يوم</option>
            </Form.Control>
            <Form.Control.Feedback type="invalid">
              {errors.periodType}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col sm={6}>
          <Form.Group controlId="interest">
            <Form.Label>{local.interest}</Form.Label>
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
        <Col sm={6} className="d-flex align-items-end">
          <Form.Group controlId="interestPeriod" style={{ width: '100%' }}>
            <Form.Control
              as="select"
              name="interestPeriod"
              data-qc="interestPeriod"
              value={values.interestPeriod}
              onBlur={handleBlur}
              onChange={handleChange}
              isInvalid={errors.interestPeriod && touched.interestPeriod}
            >
              <option value="yearly">نسبه سنويه</option>
              <option value="monthly">نسبه شهريه</option>
            </Form.Control>
            <Form.Control.Feedback type="invalid">
              {errors.periodType}
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
            />
            <Form.Control.Feedback type="invalid">
              {errors.adminFees}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col sm={6}>
          <Form.Group controlId="loanStartDate">
            <Form.Label>{local.loanStartDate}</Form.Label>
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
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col sm={6}>
          <Form.Group controlId="pushHolidays">
            <Form.Label>{local.pushHolidays}</Form.Label>
            <Form.Control
              as="select"
              name="pushHolidays"
              data-qc="pushHolidays"
              value={values.pushHolidays}
              onBlur={handleBlur}
              onChange={handleChange}
              isInvalid={errors.pushHolidays && touched.pushHolidays}
            >
              <option value="previous">السابق</option>
              <option value="next">التالى</option>
            </Form.Control>
            <Form.Control.Feedback type="invalid">
              {errors.pushHolidays}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col sm={3}>
          <Form.Group controlId="inAdvanceFees">
            <Form.Label>{local.inAdvanceFees}</Form.Label>
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
          </Form.Group>
        </Col>
        <Col sm={3} className="d-flex align-items-end">
          <Form.Group controlId="inAdvanceFrom" className="w-100">
            <Form.Control
              as="select"
              name="inAdvanceFrom"
              data-qc="inAdvanceFrom"
              value={values.inAdvanceFrom}
              onBlur={handleBlur}
              onChange={handleChange}
              isInvalid={errors.inAdvanceFrom && touched.inAdvanceFrom}
            >
              <option value="principal">نسبة من قيمة القرض</option>
              <option value="monthly">شهري</option>
              <option value="yearly">سنوي</option>
            </Form.Control>
            <Form.Control.Feedback type="invalid">
              {errors.inAdvanceFrom}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col sm={12}>
          <Form.Group controlId="inAdvanceType">
            <Form.Label>{local.inAdvanceType}</Form.Label>
            <Form.Control
              as="select"
              name="inAdvanceType"
              data-qc="inAdvanceType"
              value={values.inAdvanceType}
              onBlur={handleBlur}
              onChange={handleChange}
              isInvalid={errors.inAdvanceType && touched.inAdvanceType}
            >
              <option value="uncut">{local.inAdvanceFeesUncut}</option>
              <option value="cut">{local.inAdvanceFeesCut}</option>
            </Form.Control>
            <Form.Control.Feedback type="invalid">
              {errors.inAdvanceType}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <div className="d-flex justify-content-end">
        <Button type="button" className="big-btn" onClick={handleSubmit}>
          {local.test}
        </Button>
      </div>
    </Form>
  )
}
