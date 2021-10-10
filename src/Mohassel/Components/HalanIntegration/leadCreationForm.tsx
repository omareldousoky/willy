import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Swal from 'sweetalert2'
import { FormikErrors, FormikTouched } from 'formik'
import Button from 'react-bootstrap/Button'
import * as local from '../../../Shared/Assets/ar.json'
import { calculateAge, getErrorMessage } from '../../../Shared/Services/utils'
import {
  getBusinessSectors,
  getGovernorates,
} from '../../../Shared/Services/APIs/config'
import { Loader } from '../../../Shared/Components/Loader'
import { BusinessSector, LeadCore } from '../../../Shared/Models/common'
import { Governorate } from '../../../Shared/Models/Governorate'
import {
  getBirthdateFromNationalId,
  getGenderFromNationalId,
} from '../../../Shared/Services/nationalIdValidation'

interface LeadCreationFromProps {
  values: LeadCore
  errors: FormikErrors<LeadCore>
  touched: FormikTouched<LeadCore>
  handleSubmit: (e?: React.FormEvent<HTMLFormElement> | undefined) => void
  handleChange: (
    eventOrPath: string | React.ChangeEvent<unknown>
  ) => void | ((eventOrTextValue: string | React.ChangeEvent<unknown>) => void)
  handleBlur: (eventOrString: unknown) => void | ((e: unknown) => void)
  setFieldValue: (field: string, value: unknown) => void
}
export const LeadCreationForm: React.FC<LeadCreationFromProps> = ({
  values,
  handleSubmit,
  handleBlur,
  handleChange,
  setFieldValue,
  errors,
  touched,
}) => {
  const history = useHistory()
  const [loading, setLoading] = useState(false)
  const [businessSectors, setBusinessSectors] = useState<Array<BusinessSector>>(
    [
      {
        i18n: { ar: '' },
        id: '',
        activities: [],
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
  async function getConfig() {
    setLoading(true)
    const resGov = await getGovernorates()
    if (resGov.status === 'success') {
      setGovernorates(resGov.body.governorates)
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

  useEffect(() => {
    getConfig()
  }, [])
  return (
    <Form className="mx-3" onSubmit={handleSubmit}>
      <Loader open={loading} type="fullscreen" />
      <Form.Group controlId="customerName" as={Col}>
        <Form.Label className="data-label">{local.leadName}</Form.Label>
        <Form.Control
          type="text"
          name="customerName"
          data-qc="customerName"
          value={values.customerName}
          onBlur={handleBlur}
          onChange={handleChange}
          isInvalid={(errors.customerName && touched.customerName) as boolean}
        />
        <Form.Control.Feedback type="invalid">
          {errors.customerName}
        </Form.Control.Feedback>
      </Form.Group>
      <Row>
        <Form.Group controlId="customerNationalId" as={Col}>
          <Form.Label className="data-label">{local.nationalId}</Form.Label>
          <Form.Control
            type="text"
            name="customerNationalId"
            data-qc="customerNationalId"
            value={values.customerNationalId}
            onBlur={handleBlur}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              const re = /^\d*$/
              const { value } = event.currentTarget
              if (
                event.currentTarget.value === '' ||
                re.test(event.currentTarget.value)
              ) {
                setFieldValue('customerNationalId', value)
              }
              setFieldValue('birthDate', getBirthdateFromNationalId(value))
              setFieldValue('gender', getGenderFromNationalId(value))
            }}
            isInvalid={
              (errors.customerNationalId &&
                touched.customerNationalId) as boolean
            }
          />
          <Form.Control.Feedback type="invalid">
            {errors.customerNationalId}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="birthDate" as={Col} sm={3}>
          <Form.Label className="data-label">{`${local.birthDate}*`}</Form.Label>
          <Form.Control
            type="date"
            name="birthDate"
            data-qc="birthDate"
            value={values.birthDate}
            disabled
          />
          <Form.Control.Feedback
            type="invalid"
            style={
              calculateAge(new Date(values.birthDate as number).valueOf()) >= 67
                ? { display: 'block' }
                : {}
            }
          >
            {local.customerAgeMoreThan67}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="gender" as={Col} sm={3}>
          <Form.Label className="data-label">{`${local.gender}*`}</Form.Label>
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
      </Row>
      <Row>
        <Form.Group controlId="phoneNumber" as={Col}>
          <Form.Label className="data-label">{local.phoneNumber}</Form.Label>
          <Form.Control
            type="text"
            name="phoneNumber"
            data-qc="phoneNumber"
            value={values.phoneNumber}
            maxLength={11}
            onBlur={handleBlur}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              const re = /^\d*$/
              if (
                event.currentTarget.value === '' ||
                re.test(event.currentTarget.value)
              ) {
                setFieldValue('phoneNumber', event.currentTarget.value)
              }
            }}
            isInvalid={(errors.phoneNumber && touched.phoneNumber) as boolean}
          />
          <Form.Control.Feedback type="invalid">
            {errors.phoneNumber}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="loanAmount" as={Col}>
          <Form.Label className="data-label">{local.principal}</Form.Label>
          <Form.Control
            type="number"
            name="loanAmount"
            value={values.loanAmount}
            onBlur={handleBlur}
            onChange={handleChange}
            data-qc="loanAmount"
            isInvalid={(errors.loanAmount && touched.loanAmount) as boolean}
          />
          <Form.Control.Feedback type="invalid">
            {errors.loanAmount}
          </Form.Control.Feedback>
        </Form.Group>
      </Row>
      <Row>
        <Form.Group controlId="businessStreet" as={Col}>
          <Form.Label className="data-label">
            {local.businessAddress}
          </Form.Label>
          <Form.Control
            type="text"
            name="businessStreet"
            data-qc="businessStreet"
            value={values.businessStreet}
            onBlur={handleBlur}
            onChange={handleChange}
            isInvalid={
              (errors.businessStreet && touched.businessStreet) as boolean
            }
          />
          <Form.Control.Feedback type="invalid">
            {errors.businessStreet}
          </Form.Control.Feedback>
        </Form.Group>
      </Row>
      <Row>
        <Form.Group controlId="businessGovernate" as={Col}>
          <Form.Label className="data-label">{local.governorate}</Form.Label>
          <Form.Control
            as="select"
            type="select"
            name="businessGovernate"
            data-qc="businessGovernate"
            value={values.businessGovernate}
            onBlur={handleBlur}
            onChange={handleChange}
            isInvalid={
              (errors.businessGovernate && touched.businessGovernate) as boolean
            }
          >
            <option value="" disabled />
            {governorates.map((governorate, index) => {
              return (
                <option key={index} value={governorate.governorateName.ar}>
                  {governorate.governorateName.ar}
                </option>
              )
            })}
          </Form.Control>
          <Form.Control.Feedback type="invalid">
            {errors.businessGovernate}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="businessCity" as={Col}>
          <Form.Label className="data-label">{local.district}</Form.Label>
          <Form.Control
            as="select"
            type="select"
            name="businessCity"
            data-qc="businessCity"
            value={values.businessCity}
            onBlur={handleBlur}
            onChange={handleChange}
            isInvalid={(errors.businessCity && touched.businessCity) as boolean}
          >
            <option value="" />
            {governorates
              .find(
                (gov) => gov.governorateName.ar === values.businessGovernate
              )
              ?.districts.map((district, index) => {
                return (
                  <option key={index} value={district.districtName.ar}>
                    {district.districtName.ar}
                  </option>
                )
              })}
          </Form.Control>
          <Form.Control.Feedback type="invalid">
            {errors.businessCity}
          </Form.Control.Feedback>
        </Form.Group>
      </Row>
      <Row>
        <Form.Group controlId="businessArea" as={Col}>
          <Form.Label className="data-label">{local.village}</Form.Label>
          <Form.Control
            as="select"
            type="select"
            name="businessArea"
            data-qc="businessArea"
            value={values.businessArea}
            onBlur={handleBlur}
            onChange={handleChange}
            isInvalid={(errors.businessArea && touched.businessArea) as boolean}
          >
            <option value="" />
            {governorates
              .find(
                (gov) => gov.governorateName.ar === values.businessGovernate
              )
              ?.districts.find(
                (district) => district.districtName.ar === values.businessCity
              )
              ?.villages?.map((village, index) => {
                return (
                  <option key={index} value={village.villageName.ar}>
                    {village.villageName.ar}
                  </option>
                )
              })}
          </Form.Control>
          <Form.Control.Feedback type="invalid">
            {errors.businessArea}
          </Form.Control.Feedback>
        </Form.Group>
      </Row>
      <Row>
        <Form.Group controlId="businessSector" as={Col}>
          <Form.Label className="data-label">{local.businessSector}</Form.Label>
          <Form.Control
            as="select"
            type="select"
            name="businessSector"
            data-qc="businessSector"
            value={values.businessSector}
            onBlur={handleBlur}
            onChange={handleChange}
            isInvalid={
              (errors.businessSector && touched.businessSector) as boolean
            }
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
          <Form.Control.Feedback type="invalid">
            {errors.businessSector}
          </Form.Control.Feedback>
        </Form.Group>
      </Row>
      <Row className="d-flex justify-content-between mx-1 my-3">
        <Button
          variant="secondary"
          className="w-25"
          onClick={() => history.goBack()}
          data-qc="previous"
        >
          {local.previous}
        </Button>
        <Button className="w-25" type="submit" data-qc="submit">
          {local.submit}
        </Button>
      </Row>
    </Form>
  )
}
