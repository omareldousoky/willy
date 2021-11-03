import React, { useState, useEffect } from 'react'
import AsyncSelect from 'react-select/async'
import Swal from 'sweetalert2'

import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Form from 'react-bootstrap/Form'

import { searchLoanOfficer } from '../../../Shared/Services/APIs/LoanOfficers/searchLoanOfficer'
import * as local from '../../../Shared/Assets/ar.json'
import { Loader } from '../../../Shared/Components/Loader'
import Can from '../../../Shared/config/Can'
import { getCookie } from '../../../Shared/Services/getCookie'
import { getErrorMessage, parseJwt } from '../../../Shared/Services/utils'
import ability from '../../../Shared/config/ability'
import { theme } from '../../../Shared/theme'
import { getGeoAreasByBranch } from '../../../Shared/Services/APIs/geoAreas/getGeoAreas'

interface GeoDivision {
  majorGeoDivisionName: { ar: string }
  majorGeoDivisionLegacyCode: number
}
interface LoanOfficer {
  _id: string
  username: string
  name: string
}
export const StepThreeForm = (props: any) => {
  const [loading, setLoading] = useState(false)
  const [loanOfficers, setLoanOfficers] = useState<Array<any>>([])
  const [geoDivisions, setgeoDivisions] = useState<Array<GeoDivision>>([
    {
      majorGeoDivisionName: { ar: '' },
      majorGeoDivisionLegacyCode: 0,
    },
  ])
  const {
    values,
    handleSubmit,
    handleBlur,
    handleChange,
    errors,
    touched,
    setFieldValue,
    previousStep,
    edit,
    isCompany,
  } = props
  const getLoanOfficers = async (inputValue: string) => {
    const res = await searchLoanOfficer({
      from: 0,
      size: 100,
      name: inputValue,
      status: 'active',
    })
    if (res.status === 'success') {
      setLoanOfficers([
        ...res.body.data,
        {
          _id: props.representativeDetails.representative,
          name: props.representativeDetails.representativeName,
        },
      ])
      return res.body.data
    }
    setLoanOfficers([])
    Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
    return []
  }
  async function getConfig(branch) {
    setLoading(true)
    const resGeo = await getGeoAreasByBranch(branch)
    if (resGeo.status === 'success') {
      setLoading(false)
      setgeoDivisions(
        resGeo.body.data ? resGeo.body.data.filter((area) => area.active) : []
      )
    } else {
      setLoading(false)
      Swal.fire('Error !', getErrorMessage(resGeo.error.error), 'error')
    }
  }
  useEffect(() => {
    const token = getCookie('token')
    const details = parseJwt(token)
    if (!edit && details.branch?.length > 0) {
      getConfig(details.branch)
    } else if (props.branchId?.length > 0) {
      getConfig(props.branchId)
    }
  }, [])
  return (
    <Form onSubmit={handleSubmit}>
      <Loader open={loading} type="fullscreen" />
      <Row>
        <Col sm={12}>
          <Form.Group controlId="geoAreaId">
            <Form.Label className="customer-form-label">{`${local.geographicalDistribution}*`}</Form.Label>
            <Form.Control
              as="select"
              type="select"
              name="geoAreaId"
              data-qc="geoAreaId"
              value={values.geoAreaId}
              onBlur={handleBlur}
              onChange={handleChange}
              isInvalid={errors.geoAreaId && touched.geoAreaId}
            >
              <option value="" disabled />
              {geoDivisions.map((geoDivision: any, index) => {
                return (
                  <option key={index} value={geoDivision._id}>
                    {geoDivision.name}
                  </option>
                )
              })}
            </Form.Control>
            <Form.Control.Feedback type="invalid">
              {errors.geoAreaId}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col sm={6}>
          <Form.Group controlId="representative">
            <Form.Label className="customer-form-label">{`${local.representative}*`}</Form.Label>
            <Can I="updateNationalId" a="customer" passThrough>
              {() => (
                <AsyncSelect
                  className={errors.representative ? 'error' : ''}
                  name="representative"
                  data-qc="representative"
                  styles={theme.selectStyleWithBorder}
                  theme={theme.selectTheme}
                  value={loanOfficers?.find(
                    (loanOfficer) =>
                      loanOfficer._id ===
                      (typeof values.representative === 'string'
                        ? values.representative
                        : values.representative
                        ? values.representative._id
                        : '')
                  )}
                  onBlur={handleBlur}
                  onChange={(representative) => {
                    if (
                      props.edit &&
                      values.representative !== representative._id
                    ) {
                      setFieldValue('newRepresentative', representative._id)
                      setFieldValue('representative', representative._id)
                    } else setFieldValue('representative', representative._id)
                    setFieldValue('representativeName', representative.name)
                  }}
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option._id}
                  loadOptions={getLoanOfficers}
                  isDisabled={props.edit}
                  cacheOptions
                  defaultOptions
                />
              )}
            </Can>
            <div
              style={{
                width: '100%',
                marginTop: '0.25rem',
                fontSize: '80%',
                color: '#d51b1b',
              }}
            >
              {errors.representative}
            </div>
          </Form.Group>
        </Col>
        <Col sm={6}>
          <Form.Group controlId="applicationDate">
            <Form.Label className="customer-form-label">{`${local.applicationDate}*`}</Form.Label>
            <Form.Control
              type="date"
              name="applicationDate"
              data-qc="applicationDate"
              value={values.applicationDate}
              onBlur={handleBlur}
              onChange={handleChange}
              isInvalid={errors.applicationDate && touched.applicationDate}
            />
            <Form.Control.Feedback type="invalid">
              {errors.applicationDate}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      {!isCompany && (
        <Row>
          <Col sm={6}>
            <Form.Group controlId="permanentEmployeeCount">
              <Form.Label className="customer-form-label">
                {local.permanentEmployeeCount}
              </Form.Label>
              <Form.Control
                type="number"
                name="permanentEmployeeCount"
                data-qc="permanentEmployeeCount"
                value={values.permanentEmployeeCount}
                onBlur={handleBlur}
                onChange={handleChange}
                isInvalid={
                  errors.permanentEmployeeCount &&
                  touched.permanentEmployeeCount
                }
              />
              <Form.Control.Feedback type="invalid">
                {errors.permanentEmployeeCount}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col sm={6}>
            <Form.Group controlId="partTimeEmployeeCount">
              <Form.Label className="customer-form-label">
                {local.partTimeEmployeeCount}
              </Form.Label>
              <Form.Control
                type="number"
                name="partTimeEmployeeCount"
                data-qc="partTimeEmployeeCount"
                value={values.partTimeEmployeeCount}
                onBlur={handleBlur}
                onChange={handleChange}
                isInvalid={
                  errors.partTimeEmployeeCount && touched.partTimeEmployeeCount
                }
              />
              <Form.Control.Feedback type="invalid">
                {errors.partTimeEmployeeCount}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
      )}
      <Can I="updateNationalId" a="customer" passThrough>
        {(allowed) =>
          ((props.edit &&
            allowed &&
            ability.can('updateCustomerHasLoan', 'customer')) ||
            (props.edit && allowed && !props.hasLoan)) && (
            <Row>
              <Col sm={6}>
                <Form.Group style={{ textAlign: 'right' }}>
                  <Form.Check
                    name="allowGuarantorLoan"
                    id="allowGuarantorLoan"
                    data-qc="allowGuarantorLoan"
                    type="checkbox"
                    checked={values.allowGuarantorLoan}
                    value={values.allowGuarantorLoan}
                    label={local.allowGuarantorLoan}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          )
        }
      </Can>
      <Can I="updateNationalId" a="customer" passThrough>
        {(allowed) =>
          props.edit &&
          allowed && (
            <>
              <Row>
                {(ability.can('updateCustomerHasLoan', 'customer') ||
                  !props.hasLoan) && (
                  <>
                    <Col sm={6}>
                      <Form.Group controlId="maxLoansAllowed">
                        <Form.Label className="customer-form-label">{`${local.maxLoansAllowed}`}</Form.Label>
                        <Form.Control
                          type="number"
                          name="maxLoansAllowed"
                          data-qc=""
                          value={values.maxLoansAllowed}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          disabled={
                            !allowed && (props.hasLoan || props.isGuarantor)
                          }
                          isInvalid={
                            errors.maxLoansAllowed && touched.maxLoansAllowed
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.maxLoansAllowed}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col sm={6}>
                      <Form.Group controlId="guarantorMaxLoans">
                        <Form.Label className="customer-form-label">{`${local.guarantorMaxLoans}`}</Form.Label>
                        <Form.Control
                          type="number"
                          name="guarantorMaxLoans"
                          data-qc=""
                          value={values.guarantorMaxLoans}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          disabled={
                            !allowed && (props.hasLoan || props.isGuarantor)
                          }
                          isInvalid={
                            errors.guarantorMaxLoans &&
                            touched.guarantorMaxLoans
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.guarantorMaxLoans}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </>
                )}
              </Row>
              <Row>
                {(ability.can('updateCustomerHasLoan', 'customer') ||
                  !props.hasLoan) && (
                  <Col sm={6}>
                    <Form.Group controlId="maxPrincipal">
                      <Form.Label className="customer-form-label">{`${local.maxCustomerPrincipal}`}</Form.Label>
                      <Form.Control
                        type="number"
                        name="maxPrincipal"
                        data-qc="maxCustomerPrincipal"
                        value={values.maxPrincipal}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        // disabled={(!allowed && )}
                        isInvalid={errors.maxPrincipal && touched.maxPrincipal}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.maxPrincipal}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                )}
              </Row>
            </>
          )
        }
      </Can>
      <Row>
        <Col sm={12}>
          <Form.Group controlId="comments">
            <Form.Label className="customer-form-label">
              {local.comments}
            </Form.Label>
            <Can I="updateNationalId" a="customer" passThrough>
              {() => (
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="comments"
                  data-qc="comments"
                  value={values.comments}
                  onChange={handleChange}
                  isInvalid={errors.comments && touched.comments}
                />
              )}
            </Can>
            <Form.Control.Feedback type="invalid">
              {errors.comments}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <div className="d-flex justify-content-end">
        <Button
          className="mr-3"
          onClick={() => previousStep(values)}
          data-qc="previous"
        >
          {local.previous}
        </Button>
        <Button type="submit" data-qc="submit">
          {local.submit}
        </Button>
      </div>
    </Form>
  )
}
