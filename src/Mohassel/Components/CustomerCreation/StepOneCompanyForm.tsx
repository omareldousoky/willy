import React, { useState, useEffect, BaseSyntheticEvent } from 'react'
import Swal from 'sweetalert2'

import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Form from 'react-bootstrap/Form'

import Map from '../../../Shared/Components/Map/map'
import local from '../../../Shared/Assets/ar.json'
import { Loader } from '../../../Shared/Components/Loader'
import Can from '../../config/Can'
import { getErrorMessage } from '../../../Shared/Services/utils'
import { IscoreAuthority } from '../../../Shared/Services/interfaces'
import {
  getBusinessSectors,
  getGovernorates,
  getIscoreIssuingAuthorities,
} from '../../../Shared/Services/APIs/config'
import { checkDuplicates } from '../../../Shared/Services/APIs/customer/checkNationalIdDup'
import { BusinessSector, District, Governorate } from './StepTwoForm'
import { legalConstitutionRoles, smeCategories } from './utils'

export const StepOneCompanyForm = (props: any) => {
  const {
    values,
    handleSubmit,
    handleBlur,
    handleChange,
    errors,
    touched,
    setFieldValue,
    previousStep,
  } = props
  const [mapState, openCloseMap] = useState(false)
  const [loading, setLoading] = useState(false)
  const [businessSectors, setBusinessSectors] = useState<Array<BusinessSector>>(
    [
      {
        i18n: { ar: '' },
        legacyCode: 0,
        activities: [
          {
            i18n: { ar: '' },
            legacyCode: 0,
            specialties: [{ businessSpecialtyName: { ar: '' }, legacyCode: 0 }],
          },
        ],
      },
    ]
  )
  const [governorates, setGovernorates] = useState<Array<Governorate>>([
    {
      governorateName: { ar: '' },
      governorateLegacyCode: 0,
      districts: [
        {
          districtName: { ar: '' },
          districtLegacyCode: 0,
          villages: [{ villageName: { ar: '' }, villageLegacyCode: 0 }],
        },
      ],
    },
  ])
  const [authorities, setAuthorities] = useState<Array<IscoreAuthority>>([])
  const policeStations: District[] =
    governorates.find(
      (governorate) =>
        governorate.governorateName.ar === values.currHomeAddressGov
    )?.districts || []
  async function getConfig() {
    setLoading(true)
    const resGov = await getIscoreIssuingAuthorities()

    if (resGov.status === 'success') {
      setAuthorities(resGov.body.data)
    } else Swal.fire('Error !', getErrorMessage(resGov.error.error), 'error')

    const resBS = await getBusinessSectors()
    if (resBS.status === 'success') {
      setLoading(false)
      setBusinessSectors(resBS.body.sectors)
    } else {
      setLoading(false)
      Swal.fire('Error !', getErrorMessage(resBS.error.error), 'error')
    }
  }
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
  useEffect(() => {
    fetchGovernorates()
    getConfig()
  }, [])
  const handleGovernorateChange = (event: BaseSyntheticEvent) => {
    setFieldValue('policeStation', '')
    handleChange(event)
  }
  return (
    <Form onSubmit={handleSubmit}>
      <Loader open={loading} type="fullscreen" />
      {mapState && (
        <Map
          show={mapState}
          handleClose={() => openCloseMap(false)}
          save={(businessAddressLatLong: { lat: number; lng: number }) => {
            setFieldValue(
              'businessAddressLatLongNumber',
              businessAddressLatLong
            )
            openCloseMap(false)
          }}
          location={props.values.businessAddressLatLongNumber}
          header={local.customerWorkAddressLocationTitle}
        />
      )}
      <Row>
        <Col sm={12}>
          <Form.Group controlId="businessName">
            <Form.Label className="customer-form-label">
              {local.companyName}
            </Form.Label>
            <Form.Control
              type="text"
              name="businessName"
              data-qc="businessName"
              value={values.businessName}
              onChange={handleChange}
              isInvalid={errors.businessName && touched.businessName}
              onBlur={handleBlur}
            />
            <Form.Control.Feedback type="invalid">
              {errors.businessName}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col sm={12}>
          <Form.Group controlId="businessAddress">
            <Form.Label className="customer-form-label">
              {local.companyAddress}
            </Form.Label>
            <Form.Control
              type="text"
              name="businessAddress"
              data-qc="businessAddress"
              value={values.businessAddress}
              onChange={handleChange}
              isInvalid={errors.businessAddress && touched.businessAddress}
              onBlur={handleBlur}
            />
            <Form.Control.Feedback type="invalid">
              {errors.businessAddress}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col sm={6}>
          <Form.Group controlId="businessCharacteristic">
            <Form.Label className="customer-form-label">{`${local.businessCharacteristic}*`}</Form.Label>
            <Form.Control
              type="text"
              name="businessCharacteristic"
              data-qc="businessCharacteristic"
              value={values.businessCharacteristic}
              onChange={handleChange}
              isInvalid={
                errors.businessCharacteristic && touched.businessCharacteristic
              }
              onBlur={handleBlur}
            />
            <Form.Control.Feedback type="invalid">
              {errors.businessCharacteristic}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col sm={6}>
          <Form.Group controlId="governorate">
            <Form.Label className="customer-form-label">
              {`${local.iscoreIssuingAuthorities} *`}
            </Form.Label>
            <Form.Control
              as="select"
              type="select"
              name="governorate"
              data-qc="governorate"
              value={values.governorate}
              onBlur={handleBlur}
              onChange={handleChange}
              isInvalid={errors.governorate && touched.governorate}
            >
              <option value="" disabled />
              {authorities.map((authority, index) => {
                return (
                  <option key={index} value={authority.code}>
                    {authority.nameArabic}
                  </option>
                )
              })}
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col sm={12}>
          <Form.Group controlId="businessActivityDetails">
            <Form.Label className="customer-form-label">{`${local.businessActivityDetails}*`}</Form.Label>
            <Form.Control
              as="textarea"
              name="businessActivityDetails"
              data-qc="businessActivityDetails"
              value={values.businessActivityDetails}
              onBlur={handleBlur}
              onChange={handleChange}
              maxLength={500}
              isInvalid={
                errors.businessActivityDetails &&
                touched.businessActivityDetails
              }
            />
            <Form.Control.Feedback type="invalid">
              {errors.businessActivityDetails}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col sm={12}>
          <Form.Group controlId="businessSector">
            <Form.Label className="customer-form-label">{`${local.businessSector}*`}</Form.Label>
            <Can I="updateCustomerHasLoan" a="customer" passThrough>
              {(allowed) => (
                <Form.Control
                  as="select"
                  type="select"
                  name="businessSector"
                  data-qc="businessSector"
                  value={values.businessSector}
                  onBlur={handleBlur}
                  onChange={(e) => {
                    setFieldValue('businessSector', e.currentTarget.value)
                    setFieldValue('businessActivity', '')
                    setFieldValue('businessSpeciality', '')
                  }}
                  isInvalid={errors.businessSector && touched.businessSector}
                  disabled={!allowed && props.edit && props.hasLoan}
                >
                  <option value="" disabled />
                  {businessSectors?.map((businessSector, index) => {
                    return (
                      <option key={index} value={businessSector.i18n.ar}>
                        {businessSector.i18n.ar}
                      </option>
                    )
                  })}
                </Form.Control>
              )}
            </Can>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col sm={6}>
          <Form.Group controlId="businessLicenseNumber">
            <Form.Label className="customer-form-label">
              {local.businessLicenseNumber + '*'}
            </Form.Label>
            <Form.Control
              type="text"
              name="businessLicenseNumber"
              data-qc="businessLicenseNumber"
              value={values.businessLicenseNumber}
              onBlur={handleBlur}
              maxLength={100}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const re = /^\d*$/
                if (
                  event.currentTarget.value === '' ||
                  re.test(event.currentTarget.value)
                ) {
                  setFieldValue(
                    'businessLicenseNumber',
                    event.currentTarget.value
                  )
                }
              }}
              isInvalid={
                errors.businessLicenseNumber && touched.businessLicenseNumber
              }
            />
            <Form.Control.Feedback type="invalid">
              {errors.businessLicenseNumber}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col sm={6}>
          <Form.Group controlId="commercialRegisterNumber">
            <Form.Label className="customer-form-label">
              {local.commercialRegisterNumber + '*'}
            </Form.Label>
            <Form.Control
              type="text"
              name="commercialRegisterNumber"
              data-qc="commercialRegisterNumber"
              value={values.commercialRegisterNumber}
              onBlur={handleBlur}
              maxLength={100}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const re = /^\d*$/
                if (
                  event.currentTarget.value === '' ||
                  re.test(event.currentTarget.value)
                ) {
                  setFieldValue(
                    'commercialRegisterNumber',
                    event.currentTarget.value
                  )
                }
              }}
              isInvalid={
                errors.commercialRegisterNumber &&
                touched.commercialRegisterNumber
              }
            />
            <Form.Control.Feedback type="invalid">
              {errors.commercialRegisterNumber}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col sm={6}>
          <Form.Group controlId="legalConstitution">
            <Form.Label className="customer-form-label">{`${local.legalConstitution} *`}</Form.Label>
            <Form.Control
              as="select"
              type="select"
              name="legalConstitution"
              data-qc="legalConstitution"
              onBlur={handleBlur}
              onChange={handleChange}
              isInvalid={errors.legalConstitution && touched.legalConstitution}
            >
              {legalConstitutionRoles.map((role) => (
                <option
                  key={role}
                  value={role}
                  selected={
                    values.legalConstitution === role || role === 'other'
                  }
                >
                  {local[role]}
                </option>
              ))}
            </Form.Control>
            <Form.Control.Feedback type="invalid">
              {errors.legalConstitution}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col sm={6}>
          <Form.Group controlId="commercialRegisterExpiryDate">
            <Form.Label className="customer-form-label">{`${local.commercialRegisterExpiryDate} *`}</Form.Label>
            <Form.Control
              type="date"
              name="commercialRegisterExpiryDate"
              data-qc="commercialRegisterExpiryDate"
              value={values.commercialRegisterExpiryDate}
              onBlur={handleBlur}
              onChange={handleChange}
              isInvalid={
                errors.commercialRegisterExpiryDate &&
                touched.commercialRegisterExpiryDate
              }
            />
            <Form.Control.Feedback type="invalid">
              {errors.commercialRegisterExpiryDate}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col sm={6}>
          <Form.Group controlId="smeCategory">
            <Form.Label className="customer-form-label">{`${local.smeCategory} *`}</Form.Label>
            <Form.Control
              as="select"
              type="select"
              name="smeCategory"
              data-qc="smeCategory"
              onBlur={handleBlur}
              onChange={handleChange}
              isInvalid={errors.smeCategory && touched.smeCategory}
            >
              {smeCategories.map((category) => (
                <option
                  key={category}
                  value={category}
                  selected={
                    values.smeCategory === category || category === 'other'
                  }
                >
                  {local[category]}
                </option>
              ))}
            </Form.Control>
            <Form.Control.Feedback type="invalid">
              {errors.smeCategory}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col sm={6}>
          <Form.Group controlId="businessLicenseIssueDate">
            <Form.Label className="customer-form-label">
              {local.businessLicenseIssueDate + '*'}
            </Form.Label>
            <Form.Control
              type="date"
              name="businessLicenseIssueDate"
              data-qc="businessLicenseIssueDate"
              value={values.businessLicenseIssueDate}
              onBlur={handleBlur}
              onChange={handleChange}
              isInvalid={
                errors.businessLicenseIssueDate &&
                touched.businessLicenseIssueDate
              }
            />
            <Form.Control.Feedback type="invalid">
              {errors.businessLicenseIssueDate}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col sm={12}>
          <Form.Group controlId="taxCardNumber">
            <Form.Label className="customer-form-label">
              {local.taxCardNumber + '*'}
            </Form.Label>
            <Form.Control
              type="text"
              name="taxCardNumber"
              data-qc="taxCardNumber"
              value={values.taxCardNumber}
              onBlur={handleBlur}
              maxLength={100}
              onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                const re = /^\d*$/
                const { value } = event.currentTarget

                if (value === '' || re.test(value)) {
                  setFieldValue('taxCardNumber', value)
                }
                if (value.length === 9) {
                  setLoading(true)
                  const res = await checkDuplicates('taxCardNumber', value)
                  if (res.status === 'success') {
                    setLoading(false)
                    setFieldValue('taxCardNumberChecker', res.body.Exists)
                    if (res.body.Exists) {
                      setFieldValue('taxCardNumberDupKey', res.body.CustomerKey)
                    }
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
              isInvalid={errors.taxCardNumber && touched.taxCardNumber}
            />
            <Form.Control.Feedback type="invalid">
              {errors.taxCardNumber === local.duplicateCompanyNumberMessage
                ? local.duplicateCompanyNumberMessage +
                  local.withCode +
                  values.taxCardNumberDupKey
                : errors.taxCardNumber}
            </Form.Control.Feedback>
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
      <div className="d-flex justify-content-end">
        <Button
          className="mr-3"
          onClick={() => previousStep(values)}
          data-qc="previous"
          disabled={!previousStep}
        >
          {local.previous}
        </Button>
        <Button type="submit" data-qc="next">
          {local.next}
        </Button>
      </div>
    </Form>
  )
}
