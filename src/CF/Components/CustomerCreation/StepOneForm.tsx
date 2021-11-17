import React, { useEffect, useState, BaseSyntheticEvent } from 'react'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Swal from 'sweetalert2'
import { LtsIcon } from 'Shared/Components'
import InputGroup from 'react-bootstrap/InputGroup'
import { Loader } from '../../../Shared/Components/Loader'
import {
  checkIssueDate,
  getErrorMessage,
  numbersToArabic,
} from '../../../Shared/Services/utils'
import {
  getBirthdateFromNationalId,
  getGenderFromNationalId,
} from '../../../Shared/Services/nationalIdValidation'
import Map from '../../../Shared/Components/Map/map'
import * as local from '../../../Shared/Assets/ar.json'
import Can from '../../../Shared/config/Can'
import ability from '../../../Shared/config/ability'
import { District, Governorate } from '../../../Shared/Models/Governorate'
import { checkDuplicates } from '../../../Shared/Services/APIs/customer/checkNationalIdDup'
import { getGovernorates } from '../../../Shared/Services/APIs/config'
import { getCustomerLimitFromMonthlyIncome } from '../../../Shared/Services/APIs/customer/getCustomerConsumerLimit'

export const StepOneForm = (props: any) => {
  const {
    values,
    handleSubmit,
    handleBlur,
    handleChange,
    errors,
    touched,
    setFieldValue,
    consumerFinanceLimitStatus,
    limits,
    changeMobileNumber,
    setEditMobileNumber,
    editMobileNumber,
  } = props

  const [mapState, setMapState] = useState(false)
  const [loading, setLoading] = useState(false)
  const [governorates, setGovernorates] = useState<Governorate[]>([])
  const policeStations: District[] =
    governorates.find(
      (governorate) =>
        governorate.governorateName.ar === values.currHomeAddressGov
    )?.districts || []
  const [tempMobile, setTempMobile] = useState('')
  const fetchGovernorates = async () => {
    setLoading(true)
    const resGov = await getGovernorates()
    setLoading(false)

    if (resGov.status === 'success') {
      setGovernorates(resGov.body.governorates)
    } else {
      Swal.fire('Error !', getErrorMessage(resGov.error.error), 'error')
    }
  }
  const editMobilePermission =
    ((values.initialConsumerFinanceLimit === 0 &&
      ability.can('updateCustomer', 'customer') &&
      consumerFinanceLimitStatus !== 'approved') ||
      ability.can('editPhoneNumber', 'customer')) &&
    props.edit
  const getCustomerLimitFromIncome = async (income) => {
    setLoading(true)
    const limitRes = await getCustomerLimitFromMonthlyIncome(income)
    if (limitRes.status === 'success') {
      setFieldValue(
        'customerConsumerFinanceMaxLimit',
        limitRes.body.maximumCFLimit
      )
      setLoading(false)
    } else {
      Swal.fire('Error !', getErrorMessage(limitRes.error.error), 'error')
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGovernorates()
  }, [])

  const handleGovernorateChange = (event: BaseSyntheticEvent) => {
    setFieldValue('policeStation', '')
    handleChange(event)
  }

  return (
    <Form onSubmit={handleSubmit}>
      {mapState && (
        <Map
          show={mapState}
          handleClose={() => setMapState(false)}
          save={(customerAddressLatLong: { lat: number; lng: number }) => {
            setFieldValue(
              'customerAddressLatLongNumber',
              customerAddressLatLong
            )
            setMapState(false)
          }}
          location={props.values.customerAddressLatLongNumber}
          header={local.customerHomeAddressLocationTitle}
        />
      )}
      <Row>
        <Col sm={12}>
          <Form.Group controlId="customerName">
            <Form.Label
              className="customer-form-label"
              column
            >{`${local.name}*`}</Form.Label>
            <Can I="updateCustomerHasLoan" a="customer" passThrough>
              {(allowed) => (
                <Form.Control
                  type="text"
                  name="customerName"
                  data-qc="customerName"
                  value={values.customerName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={errors.customerName && touched.customerName}
                  disabled={
                    (!allowed && props.edit && props.hasLoan) ||
                    (props.edit &&
                      !ability.can('updateNationalId', 'customer') &&
                      !props.hasLoan)
                  }
                />
              )}
            </Can>
            <Form.Control.Feedback type="invalid">
              {errors.customerName}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col sm={5}>
          <Form.Group controlId="nationalId">
            <Form.Label className="customer-form-label">{`${local.nationalId}*`}</Form.Label>
            <Can I="updateCustomerHasLoan" a="customer" passThrough>
              {(allowed) => (
                <Form.Control
                  type="text"
                  name="nationalId"
                  data-qc="nationalId"
                  value={values.nationalId}
                  onBlur={handleBlur}
                  onChange={async (
                    event: React.ChangeEvent<HTMLInputElement>
                  ) => {
                    const re = /^\d*$/
                    const { value } = event.currentTarget
                    if (
                      event.currentTarget.value === '' ||
                      re.test(event.currentTarget.value)
                    ) {
                      setFieldValue('nationalId', value)
                    }
                    if (value.length === 14) {
                      setLoading(true)
                      const res = await checkDuplicates('nationalId', value)
                      if (res.status === 'success') {
                        setLoading(false)
                        setFieldValue('nationalIdChecker', res.body.Exists)
                        if (res.body.Exists) {
                          setFieldValue(
                            'nationalIdCheckerDupKey',
                            res.body.CustomerKey
                          )
                        }
                        setFieldValue(
                          'birthDate',
                          getBirthdateFromNationalId(value)
                        )
                        setFieldValue('gender', getGenderFromNationalId(value))
                      } else {
                        setLoading(false)
                        Swal.fire(
                          'Error !',
                          getErrorMessage(res.error.error),
                          'error'
                        )
                      }
                    }
                  }}
                  isInvalid={errors.nationalId && touched.nationalId}
                  maxLength={14}
                  disabled={
                    (!allowed && props.edit && props.hasLoan) ||
                    (props.edit &&
                      !ability.can('updateNationalId', 'customer') &&
                      !props.hasLoan)
                  }
                />
              )}
            </Can>
            <Form.Control.Feedback type="invalid">
              {errors.nationalId === local.duplicateNationalIdMessage
                ? local.duplicateNationalIdMessage +
                  local.withCode +
                  values.nationalIdCheckerDupKey
                : errors.nationalId}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col sm={1} style={{ marginTop: 35 }}>
          <Loader type="inline" open={loading} />
        </Col>
        <Col sm={3}>
          <Form.Group controlId="birthDate">
            <Form.Label className="customer-form-label">{`${local.birthDate}*`}</Form.Label>
            <Form.Control
              type="date"
              name="birthDate"
              data-qc="birthDate"
              value={values.birthDate}
              disabled
            />
            <Form.Control.Feedback type="invalid" className="d-block">
              {errors.birthDate}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col sm={3}>
          <Form.Group controlId="gender">
            <Form.Label className="customer-form-label">{`${local.gender}*`}</Form.Label>
            <Form.Control
              as="select"
              type="select"
              name="gender"
              data-qc="gender"
              value={values.gender}
              disabled
            >
              <option value="" disabled />
              <option value="male">{local.male}</option>
              <option value="female">{local.female}</option>
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col sm={5}>
          <Form.Group controlId="nationalIdIssueDate">
            <Form.Label className="customer-form-label">{`${local.nationalIdIssueDate}*`}</Form.Label>
            <Can I="updateCustomerHasLoan" a="customer" passThrough>
              {(allowed) => (
                <Form.Control
                  type="date"
                  name="nationalIdIssueDate"
                  data-qc="nationalIdIssueDate"
                  value={values.nationalIdIssueDate}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  isInvalid={
                    errors.nationalIdIssueDate && touched.nationalIdIssueDate
                  }
                  disabled={!allowed && props.edit && props.hasLoan}
                />
              )}
            </Can>
            <Form.Control.Feedback
              type="invalid"
              style={
                checkIssueDate(values.nationalIdIssueDate) !== ''
                  ? { display: 'block' }
                  : {}
              }
            >
              {errors.nationalIdIssueDate ||
                checkIssueDate(values.nationalIdIssueDate)}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col sm={6}>
          <Form.Group controlId="monthlyIncome">
            <Form.Label className="customer-form-label">
              {`${local.monthlyIncome}*`}
            </Form.Label>
            <Form.Control
              type="number"
              name="monthlyIncome"
              data-qc="monthlyIncome"
              value={values.monthlyIncome}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setFieldValue(
                  'monthlyIncome',
                  Number(event.currentTarget.value)
                )
                if (event.currentTarget.value >= limits.DBRPercentLowStart)
                  getCustomerLimitFromIncome(event.currentTarget.value)
              }}
              required
              onBlur={handleBlur}
              isInvalid={errors.monthlyIncome && touched.monthlyIncome}
              disabled={
                props.edit &&
                !ability.can('editCFLimit', 'customer') &&
                consumerFinanceLimitStatus === 'approved'
              }
            />
            {values.customerConsumerFinanceMaxLimit > 0 && (
              <div className="valid-feedback d-block">
                {local.maxConsumerFinanceLimit}{' '}
                {numbersToArabic(values.customerConsumerFinanceMaxLimit)}
              </div>
            )}
            <Form.Control.Feedback type="invalid">
              {errors.monthlyIncome}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col sm={6}>
          <Form.Group controlId="initialConsumerFinanceLimit">
            <Form.Label className="customer-form-label">
              {`${local.initialConsumerFinanceLimit}*`}
            </Form.Label>
            <Form.Control
              type="number"
              name="initialConsumerFinanceLimit"
              data-qc="initialConsumerFinanceLimit"
              value={values.initialConsumerFinanceLimit}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={
                values.customerConsumerFinanceMaxLimit === 0 ||
                (props.edit &&
                  !ability.can('editCFLimit', 'customer') &&
                  consumerFinanceLimitStatus === 'approved')
              }
              isInvalid={
                errors.initialConsumerFinanceLimit &&
                touched.initialConsumerFinanceLimit
              }
            />
            <Form.Control.Feedback type="invalid">
              {errors.initialConsumerFinanceLimit}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Group controlId="customerHomeAddress">
            <Form.Label className="customer-form-label">{`${local.customerHomeAddress}*`}</Form.Label>
            <Form.Control
              type="text"
              name="customerHomeAddress"
              data-qc="customerHomeAddress"
              value={values.customerHomeAddress}
              onChange={handleChange}
              isInvalid={
                errors.customerHomeAddress && touched.customerHomeAddress
              }
            />
            <Form.Control.Feedback type="invalid">
              {errors.customerHomeAddress}
            </Form.Control.Feedback>
            <Col sm={3} />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Group controlId="currentHomeAddress">
            <Form.Label className="customer-form-label">
              {local.detailedAddress}
            </Form.Label>
            <Form.Control
              type="text"
              name="currentHomeAddress"
              data-qc="currentHomeAddress"
              value={values.currentHomeAddress}
              onChange={handleChange}
              isInvalid={
                errors.currentHomeAddress && touched.currentHomeAddress
              }
            />
            <Form.Control.Feedback type="invalid">
              {errors.currentHomeAddress}
            </Form.Control.Feedback>
            <Col sm={3} />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col sm={6}>
          <Form.Group controlId="currHomeAddressGov">
            <Form.Label className="customer-form-label">
              {local.currHomeAddressGov}
            </Form.Label>
            <Form.Control
              as="select"
              type="select"
              name="currHomeAddressGov"
              data-qc="currHomeAddressGov"
              defaultValue=""
              value={values.currHomeAddressGov}
              onChange={handleGovernorateChange}
            >
              <option value="" disabled />
              {governorates.map(
                ({ governorateName, governorateLegacyCode }) => (
                  <option
                    key={governorateLegacyCode}
                    value={governorateName.ar}
                    selected={values.currHomeAddressGov === governorateName.ar}
                  >
                    {governorateName.ar}
                  </option>
                )
              )}
            </Form.Control>
          </Form.Group>
        </Col>

        <Col sm={6}>
          <Form.Group controlId="policeStation">
            <Form.Label className="customer-form-label">
              {local.legalPoliceStation}
            </Form.Label>
            <Form.Control
              as="select"
              type="select"
              name="policeStation"
              data-qc="policeStation"
              defaultValue=""
              value={values.policeStation}
              onChange={handleChange}
              disabled={!policeStations.length}
            >
              <option value="" disabled />
              {policeStations.map(({ districtName, districtLegacyCode }) => (
                <option
                  key={districtLegacyCode}
                  value={districtName.ar}
                  selected={values.policeStation === districtName.ar}
                >
                  {districtName.ar}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col sm={6}>
          <Form.Group controlId="customerHomeAddressLocation">
            <Form.Label className="customer-form-label">
              {local.customerHomeAddressLocationTitle}
            </Form.Label>
            <Form.Control
              type="text"
              name="customerHomeAddressLocation"
              data-qc="customerHomeAddressLocation"
              style={{
                cursor: 'pointer',
                color: '#7dc356',
                textDecoration: 'underline',
              }}
              value={
                values.customerAddressLatLongNumber?.lat !== 0 &&
                values.customerAddressLatLongNumber?.lng !== 0
                  ? local.addressChosen
                  : local.chooseCustomerAddress
              }
              // value={values.customerHomeAddressLocationTitle}
              onClick={() => setMapState(true)}
            />
          </Form.Group>
        </Col>
        <Col sm={6}>
          <Form.Group controlId="homePostalCode">
            <Form.Label className="customer-form-label">
              {local.homePostalCode}
            </Form.Label>
            <Form.Control
              type="text"
              name="homePostalCode"
              data-qc="homePostalCode"
              value={values.homePostalCode}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const re = /^\d*$/
                if (
                  event.currentTarget.value === '' ||
                  re.test(event.currentTarget.value)
                ) {
                  setFieldValue('homePostalCode', event.currentTarget.value)
                }
              }}
              maxLength={5}
              onBlur={handleBlur}
              isInvalid={errors.homePostalCode && touched.homePostalCode}
            />
            <Form.Control.Feedback type="invalid">
              {errors.homePostalCode}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col sm={6}>
          <Form.Group controlId="homePhoneNumber">
            <Form.Label className="customer-form-label">
              {local.homePhoneNumber}
            </Form.Label>
            <Form.Control
              type="text"
              name="homePhoneNumber"
              data-qc="homePhoneNumber"
              value={values.homePhoneNumber}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const re = /^\d*$/
                if (
                  event.currentTarget.value === '' ||
                  re.test(event.currentTarget.value)
                ) {
                  setFieldValue('homePhoneNumber', event.currentTarget.value)
                }
              }}
              onBlur={handleBlur}
              maxLength={10}
              isInvalid={errors.homePhoneNumber && touched.homePhoneNumber}
            />
            <Form.Control.Feedback type="invalid">
              {errors.homePhoneNumber}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col sm={6}>
          <Form.Group controlId="faxNumber">
            <Form.Label className="customer-form-label">
              {local.faxNumber}
            </Form.Label>
            <Form.Control
              type="text"
              name="faxNumber"
              data-qc="faxNumber"
              value={values.faxNumber}
              onBlur={handleBlur}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const re = /^\d*$/
                if (
                  event.currentTarget.value === '' ||
                  re.test(event.currentTarget.value)
                ) {
                  setFieldValue('faxNumber', event.currentTarget.value)
                }
              }}
              maxLength={11}
              minLength={10}
              isInvalid={errors.faxNumber && touched.faxNumber}
            />
            <Form.Control.Feedback type="invalid">
              {errors.faxNumber}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Form.Group controlId="mobilePhoneNumber">
        <Form.Label className="customer-form-label">
          {local.cfMobileNumber}*
        </Form.Label>
        <InputGroup>
          <Form.Control
            type="text"
            name="mobilePhoneNumber"
            data-qc="mobilePhoneNumber"
            value={values.mobilePhoneNumber}
            onBlur={handleBlur}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              const re = /^\d*$/
              if (
                event.currentTarget.value === '' ||
                re.test(event.currentTarget.value)
              ) {
                setFieldValue('mobilePhoneNumber', event.currentTarget.value)
              }
            }}
            maxLength={11}
            isInvalid={errors.mobilePhoneNumber && touched.mobilePhoneNumber}
            disabled={!editMobileNumber}
          />
          {editMobilePermission && !editMobileNumber && (
            <InputGroup.Prepend>
              <Button
                size="sm"
                variant="outline-primary"
                onClick={() => {
                  setEditMobileNumber(true)
                  setTempMobile(values.mobilePhoneNumber)
                }}
                className="d-flex"
              >
                <LtsIcon name="edit" tooltipText={local.edit} />
              </Button>
            </InputGroup.Prepend>
          )}
          {editMobilePermission && editMobileNumber && (
            <>
              <InputGroup.Append>
                <Button
                  size="sm"
                  variant="outline-primary"
                  onClick={() => {
                    changeMobileNumber(values.mobilePhoneNumber)
                  }}
                  className="d-flex"
                  disabled={
                    values.mobilePhoneNumber === tempMobile ||
                    errors.mobilePhoneNumber
                  }
                >
                  <LtsIcon name="edit" tooltipText={local.edit} />
                </Button>
              </InputGroup.Append>
              <InputGroup.Prepend>
                <Button
                  size="sm"
                  variant="outline-primary"
                  onClick={() => {
                    setEditMobileNumber(false)
                    setFieldValue('mobilePhoneNumber', tempMobile)
                  }}
                  className="d-flex"
                >
                  <LtsIcon name="remove" tooltipText={local.cancel} />
                </Button>
              </InputGroup.Prepend>
            </>
          )}
          <Form.Control.Feedback type="invalid">
            {errors.mobilePhoneNumber}
          </Form.Control.Feedback>
        </InputGroup>
      </Form.Group>
      <Form.Group controlId="emailAddress">
        <Form.Label className="customer-form-label">
          {local.emailAddress}
        </Form.Label>
        <Form.Control
          type="text"
          name="emailAddress"
          data-qc="emailAddress"
          value={values.emailAddress}
          onChange={handleChange}
          onBlur={handleBlur}
          isInvalid={errors.emailAddress && touched.emailAddress}
        />
        <Form.Control.Feedback type="invalid">
          {errors.emailAddress}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group controlId="customerWebsite">
        <Form.Label className="customer-form-label">
          {local.customerWebsite}
        </Form.Label>
        <Form.Control
          type="text"
          name="customerWebsite"
          data-qc="customerWebsite"
          value={values.customerWebsite}
          onChange={handleChange}
          onBlur={handleBlur}
          isInvalid={errors.customerWebsite && touched.customerWebsite}
        />
        <Form.Control.Feedback type="invalid">
          {errors.customerWebsite}
        </Form.Control.Feedback>
      </Form.Group>
      <div className="d-flex justify-content-end">
        <Button disabled className="mr-3">
          {local.previous}
        </Button>
        <Button
          type="submit"
          data-qc="next"
          disabled={props.edit && editMobileNumber}
        >
          {local.next}
        </Button>
      </div>
    </Form>
  )
}
