import React from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import * as local from '../../../Shared/Assets/ar.json';

export const LoanFormulaCreationForm = (props: any) => {
    const { values, handleSubmit, handleBlur, handleChange, errors, touched, setFieldValue } = props;
    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group as={Row} controlId="loanCalculationFormulaName">
                <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.loanCalculationFormulaName}</Form.Label>
                <Col sm={6}>
                    <Form.Control
                        type="text"
                        name="loanCalculationFormulaName"
                        data-qc="loanCalculationFormulaName"
                        value={values.loanCalculationFormulaName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={errors.loanCalculationFormulaName && touched.loanCalculationFormulaName}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.loanCalculationFormulaName}
                    </Form.Control.Feedback>
                </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="interestType">
                <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.interestType}</Form.Label>
                <Col sm={6}>
                    <Form.Control as="select"
                        name="interestType"
                        data-qc="interestType"
                        value={values.interestType}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        isInvalid={errors.interestType && touched.interestType}
                        maxLength={14}
                    >
                        <option value="flat">مصاريف متساويه محسوبه من إجمالى أصل القرض</option>
                        <option value="reducing">مصاريف متناقصه محسوبه من المتبقى من أصل القرض</option>
                        {/* <option value="3">مصاريف متساوية محولة الي مصاريف متناقصه</option> */}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                        {errors.interestType}
                    </Form.Control.Feedback>
                </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="installmentType">
                <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.installmentType}</Form.Label>
                <Col sm={6}>
                    <Form.Control as="select"
                        name="installmentType"
                        data-qc="installmentType"
                        value={values.installmentType}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        isInvalid={errors.installmentType && touched.installmentType}
                        maxLength={14}
                    >
                        <option value="included">تتضمن أصل و مصاريف</option>
                        <option value="isntIncluded">أقساط بالمصاريف فقط اولا ثم بعد ذلك الأصل</option>
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                        {errors.installmentType}
                    </Form.Control.Feedback>
                </Col>
            </Form.Group>
            <Form.Group as={Row} controlId='gracePeriodFees'>
                <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.gracePeriodFees}</Form.Label>
                <Col sm={6}>
                    <Form.Check
                        type='checkbox'
                        name='gracePeriodFees'
                        data-qc='gracePeriodFees'
                        value={values.gracePeriodFees}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        isInvalid={errors.gracePeriodFees && touched.gracePeriodFees}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.gracePeriodFees}
                    </Form.Control.Feedback>
                </Col>
            </Form.Group>
            <Form.Group as={Row} controlId='rounding'>
                <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.rounding}</Form.Label>
                <Col sm={6}>
                    <Form.Check
                        type='checkbox'
                        name='rounding'
                        data-qc='rounding'
                        value={values.rounding}
                        checked={values.rounding}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        isInvalid={errors.rounding && touched.rounding}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.rounding}
                    </Form.Control.Feedback>
                </Col>
            </Form.Group>
            <Col style={{ width: '60%', border: '1px solid black', borderRadius: '9px' }}>
                <Form.Group as={Row} controlId="roundDirection">
                    <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.roundDirection}</Form.Label>
                    <Col sm={6}>
                        <Form.Control as="select"
                            name="roundDirection"
                            data-qc="roundDirection"
                            value={values.roundDirection}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            isInvalid={errors.roundDirection && touched.roundDirection}
                            disabled={!values.rounding}
                        >
                            <option value="down">تقريب للإصغر</option>
                            <option value="up">تقريب للأكبر</option>
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                            {errors.roundDirection}
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="roundTo">
                    <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.roundTo}</Form.Label>
                    <Col sm={6}>
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
                    </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="roundWhat">
                    <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.roundWhat}</Form.Label>
                    <Col sm={6}>
                        <Form.Control as="select"
                            name="roundWhat"
                            data-qc="roundWhat"
                            value={values.roundWhat}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            isInvalid={errors.roundWhat && touched.roundWhat}
                            disabled={!values.rounding}>
                            <option value="principal">تقريب الأصل فقط</option>
                            <option value="fees">تقريب المصاريف فقط</option>
                            <option value="prinicpalAndFees">تقريب الأصل و المصاريف</option>
                            <option value="installmentAndPrincipal">تقريب إجمالى قيمه القسط و الأصل</option>
                            <option value="installmentAndFees">تقريب إجمالى قيمه القسط و المصاريف</option>
                            <option value="installment">تقريب إجمالى قيمه القسط فقط</option>
                            <option value="principalAndTotalFees">تقريب الأصل وإجمالى قيمه المصاريف</option>
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                            {errors.roundWhat}
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} controlId='equalInstallmentsTrue'>
                    <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.equalInstallmentsTrue}</Form.Label>
                    <Col sm={6}>
                        <Form.Check
                            type='checkbox'
                            name='equalInstallments'
                            data-qc='equalInstallments'
                            value={values.equalInstallments}
                            checked={values.equalInstallments}
                            onBlur={handleBlur}
                            disabled={!values.rounding}
                            onChange={(e: any) => {
                                const val = e.currentTarget.value;
                                if (val === true) {
                                    setFieldValue('equalInstallments', false)
                                } else {
                                    setFieldValue('equalInstallments', true)
                                }
                            }}
                            isInvalid={errors.equalInstallments && touched.equalInstallments}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.equalInstallments}
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} controlId='equalInstallmentsFalse'>
                    <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.equalInstallmentsFalse}</Form.Label>
                    <Col sm={6}>
                        <Form.Check
                            type='checkbox'
                            name='equalInstallments'
                            data-qc='equalInstallments'
                            value={values.equalInstallments}
                            checked={(!values.equalInstallments)}
                            onBlur={handleBlur}
                            disabled={!values.rounding}
                            onChange={(e: any) => {
                                const val = e.currentTarget.value;
                                if (val === false) {
                                    setFieldValue('equalInstallments', true)
                                } else {
                                    setFieldValue('equalInstallments', false)
                                }
                            }}
                            isInvalid={errors.equalInstallments && touched.equalInstallments}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.equalInstallments}
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>

            </Col>
            <Button type="button" onClick={handleSubmit}>{local.submit}</Button>
        </Form >
    )
}
