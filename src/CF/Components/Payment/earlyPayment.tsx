import React, { useState } from 'react'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import AsyncSelect from 'react-select/async'
import Swal from 'sweetalert2'
import { useDispatch } from 'react-redux'
import { payment } from '../../../Shared/redux/payment/actions'
import local from '../../../Shared/Assets/ar.json'
import { getErrorMessage } from '../../../Shared/Services/utils'
import { theme } from '../../../Shared/theme'
import { Employee } from '../../../Mohassel/Components/Payment/payment'
import { searchUserByAction } from '../../../Mohassel/Services/APIs/UserByAction/searchUserByAction'
import { EarlyPaymentProps } from './types'

export const EarlyPayment = ({
  remainingPrincipal,
  earlyPaymentFees,
  requiredAmount,
  installments,
  application,
  setPayerType,
  formikProps,
}: EarlyPaymentProps) => {
  const [employees, setEmployees] = useState<Employee[]>()

  const dispatch = useDispatch()
  const { changePaymentState } = {
    changePaymentState: (data) => dispatch(payment(data)),
  }

  const getInstallmentsRemaining = () => {
    const installmentsRemaining: Array<number> = []
    installments.forEach((installment) => {
      if (installment.status !== 'paid')
        installmentsRemaining.push(installment.id)
    })
    return installmentsRemaining.toString()
  }

  const getUsersByAction = async (input: string) => {
    const obj = {
      size: 100,
      from: 0,
      serviceKey: 'halan.com/application',
      action: 'acceptPayment',
      name: input,
    }
    const res = await searchUserByAction(obj)
    if (res.status === 'success') {
      setEmployees(res.body.data)
      setPayerType('employee')
      return res.body.data
    }
    setEmployees(undefined)
    Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
    return []
  }

  return (
    <Form onSubmit={formikProps.handleSubmit}>
      <Form.Group as={Row} style={{ marginTop: 45 }}>
        <Form.Group as={Col} controlId="installmentsRemaining">
          <Form.Label
            className="pr-0"
            column
          >{`${local.installmentsRemaining}`}</Form.Label>
          <Form.Control
            name="installmentsRemaining"
            value={getInstallmentsRemaining()}
            disabled
          />
        </Form.Group>
        <Form.Group as={Col} controlId="installmentsRemaining">
          <Form.Label
            className="pr-0"
            column
          >{`${local.remainingPrincipal}`}</Form.Label>
          <Form.Control
            name="installmentsRemaining"
            value={remainingPrincipal}
            disabled
          />
        </Form.Group>
      </Form.Group>
      <Form.Group as={Row}>
        <Form.Group as={Col} controlId="earlyPaymentFees">
          <Form.Label
            className="pr-0"
            column
          >{`${local.earlyPaymentFees}`}</Form.Label>
          <Form.Control
            name="earlyPaymentFees"
            value={earlyPaymentFees}
            disabled
          />
        </Form.Group>
        <Form.Group as={Col} controlId="requiredAmount">
          <Form.Label
            className="pr-0"
            column
          >{`${local.requiredAmount}`}</Form.Label>
          <Form.Control
            type="number"
            name="requiredAmount"
            value={requiredAmount}
            disabled
          />
        </Form.Group>
      </Form.Group>
      <Form.Group as={Row}>
        <Form.Group as={Col} md={6} controlId="truthDate">
          <Form.Label
            className="pr-0"
            column
          >{`${local.truthDate}`}</Form.Label>
          <Form.Control
            type="date"
            name="truthDate"
            data-qc="truthDate"
            value={formikProps.values.truthDate}
            disabled
          />
        </Form.Group>
        <Form.Group as={Col} md={6} controlId="whoPaid">
          <Form.Label
            className="pr-0"
            column
          >{`${local.whoMadeThePayment}`}</Form.Label>
          <Form.Control
            as="select"
            name="payerType"
            data-qc="payerType"
            value={formikProps.values.payerType}
            onChange={formikProps.handleChange}
            onBlur={formikProps.handleBlur}
            isInvalid={
              Boolean(formikProps.errors.payerType) &&
              Boolean(formikProps.touched.payerType)
            }
          >
            <option value="" />
            <option value="beneficiary" data-qc="beneficiary">
              {local.customer}
            </option>
            <option value="employee" data-qc="employee">
              {local.employee}
            </option>
            <option value="family" data-qc="family">
              {local.familyMember}
            </option>
            <option value="nonFamily" data-qc="nonFamily">
              {local.nonFamilyMember}
            </option>
          </Form.Control>
          <Form.Control.Feedback type="invalid">
            {formikProps.errors.payerType}
          </Form.Control.Feedback>
        </Form.Group>
        {formikProps.values.payerType === 'beneficiary' &&
          application.product.beneficiaryType === 'group' && (
            <Form.Group as={Col} md={6} controlId="customer">
              <Form.Label
                className="pr-0"
                column
              >{`${local.customer}`}</Form.Label>
              <Form.Control
                as="select"
                name="payerId"
                data-qc="payerId"
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                isInvalid={
                  Boolean(formikProps.errors.payerId) &&
                  Boolean(formikProps.touched.payerId)
                }
              >
                <option value="" />
                {application?.group?.individualsInGroup?.map(
                  (member, index) => {
                    return (
                      <option key={index} value={member.customer._id}>
                        {member.customer.customerName}
                      </option>
                    )
                  }
                )}
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {formikProps.errors.payerId}
              </Form.Control.Feedback>
            </Form.Group>
          )}
        {formikProps.values.payerType === 'employee' && (
          <Form.Group as={Col} md={6} controlId="whoPaid">
            <Form.Label
              className="pr-0"
              column
            >{`${local.employee}`}</Form.Label>
            <AsyncSelect
              className={formikProps.errors.payerId ? 'error' : ''}
              name="payerId"
              data-qc="payerId"
              styles={theme.selectStyleWithBorder}
              theme={theme.selectTheme}
              value={employees?.find(
                (employee) => employee._id === formikProps.values.payerId
              )}
              onBlur={formikProps.handleBlur}
              onChange={(employee: any) =>
                formikProps.setFieldValue('payerId', employee._id)
              }
              getOptionLabel={(option) => option.name}
              getOptionValue={(option) => option._id}
              loadOptions={getUsersByAction}
              cacheOptions
              defaultOptions
            />
            {formikProps.touched.payerId && (
              <div
                style={{
                  width: '100%',
                  marginTop: '0.25rem',
                  fontSize: '80%',
                  color: '#d51b1b',
                }}
              >
                {formikProps.errors.payerId}
              </div>
            )}
          </Form.Group>
        )}
        {(formikProps.values.payerType === 'family' ||
          formikProps.values.payerType === 'nonFamily') && (
          <>
            <Form.Group as={Col} md={6} controlId="whoPaid">
              <Form.Label className="pr-0" column>{`${local.name}`}</Form.Label>
              <Form.Control
                name="payerName"
                data-qc="payerName"
                value={formikProps.values.payerName.toString()}
                onBlur={formikProps.handleBlur}
                onChange={formikProps.handleChange}
                isInvalid={
                  Boolean(formikProps.errors.payerName) &&
                  Boolean(formikProps.touched.payerName)
                }
              />
              <Form.Control.Feedback type="invalid">
                {formikProps.errors.payerName}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md={6} controlId="whoPaid">
              <Form.Label
                className="pr-0"
                column
              >{`${local.nationalId}`}</Form.Label>
              <Form.Control
                type="text"
                name="payerNationalId"
                data-qc="payerNationalId"
                maxLength={14}
                value={formikProps.values.payerNationalId.toString()}
                onBlur={formikProps.handleBlur}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  const re = /^\d*$/
                  if (
                    event.currentTarget.value === '' ||
                    re.test(event.currentTarget.value)
                  ) {
                    formikProps.setFieldValue(
                      'payerNationalId',
                      event.currentTarget.value
                    )
                  }
                }}
                isInvalid={
                  Boolean(formikProps.errors.payerNationalId) &&
                  Boolean(formikProps.touched.payerNationalId)
                }
              />
              <Form.Control.Feedback type="invalid">
                {formikProps.errors.payerNationalId}
              </Form.Control.Feedback>
            </Form.Group>
          </>
        )}
      </Form.Group>
      <div className="payments-buttons-container">
        <Button
          variant="secondary"
          data-qc="cancel"
          onClick={() => changePaymentState(0)}
        >
          {local.cancel}
        </Button>
        <Button variant="primary" data-qc="submit" type="submit">
          {local.submit}
        </Button>
      </div>
    </Form>
  )
}
