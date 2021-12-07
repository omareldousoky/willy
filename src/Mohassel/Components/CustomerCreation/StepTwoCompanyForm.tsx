import React, { useState, useEffect } from 'react'
import AsyncSelect from 'react-select/async'
import Select from 'react-select'
import Swal from 'sweetalert2'

import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Form from 'react-bootstrap/Form'

import { searchLoanOfficer } from '../../../Shared/Services/APIs/LoanOfficers/searchLoanOfficer'
import * as local from '../../../Shared/Assets/ar.json'
import { Loader } from '../../../Shared/Components/Loader'
import Can from '../../config/Can'
import { getCookie } from '../../../Shared/Services/getCookie'
import { getErrorMessage, parseJwt } from '../../../Shared/Services/utils'
import ability from '../../config/ability'
import { theme } from '../../../Shared/theme'
import { getGeoAreasByBranch } from '../../../Shared/Services/APIs/geoAreas/getGeoAreas'
import { searchUsers } from '../../../Shared/Services/APIs/Users/searchUsers'
import { searchCbeCode } from '../../Services/APIs/CbeCodes/CbeCodes'
import { checkDuplicates } from '../../../Shared/Services/APIs/customer/checkNationalIdDup'
import { getUserDetails } from '../../../Shared/Services/APIs/Users/userDetails'
import useDebounce from '../../../Shared/hooks/useDebounce'

interface GeoDivision {
  majorGeoDivisionName: { ar: string }
  majorGeoDivisionLegacyCode: number
}
interface LoanOfficer {
  _id: string
  username: string
  name: string
}
interface Option {
  label: string
  value: string
}
export const StepTwoCompanyForm = (props: any) => {
  const [loading, setLoading] = useState(false)
  const [loanOfficers, setLoanOfficers] = useState<Array<any>>([])
  const [systemUsers, setSystemUsers] = useState<Array<any>>([])
  const [cbeCode, setCbeCode] = useState<Array<any>>([])
  const [geoDivisions, setGeoDivisions] = useState<Array<GeoDivision>>([
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
    companyKey,
  } = props

  const debouncedSearchTerm = useDebounce(values.cbeCode, 300)

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

  const getMissingUser = async (id: string): Promise<void> => {
    const res = await getUserDetails(id)
    if (res.status === 'success') {
      setSystemUsers((prevUsers) => [...prevUsers, res.body.user])
    }
  }

  const getSystemUsers = async (inputValue: string) => {
    const res = await searchUsers({
      from: 0,
      size: 100,
      name: inputValue,
      status: 'active',
    })
    if (res.status === 'success') {
      setSystemUsers(res.body.data)
      return res.body.data
    }
    Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
    return []
  }
  async function getConfig(branch) {
    setLoading(true)
    const resGeo = await getGeoAreasByBranch(branch)
    if (resGeo.status === 'success') {
      setLoading(false)
      setGeoDivisions(
        resGeo.body.data ? resGeo.body.data.filter((area) => area.active) : []
      )
    } else {
      setLoading(false)
      Swal.fire('Error !', getErrorMessage(resGeo.error.error), 'error')
    }
  }
  const getCbeCode = async (name) => {
    if (name) {
      const res = await searchCbeCode({
        from: 0,
        size: 100,
        name,
        type: 'company',
      })
      if (res.status === 'success') {
        setCbeCode(res.body.data)
        res.body.data.length === 1 &&
          setFieldValue('cbeCode', res.body.data[0].cbeCode)
      } else {
        Swal.fire('Error !', getErrorMessage(res.error?.error), 'error')
        setCbeCode([])
      }
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
    getCbeCode(values.businessName)
  }, [])

  useEffect(() => {
    const getUser = systemUsers?.find((user) => user._id === values.smeSourceId)
    if (!getUser && values.smeSourceId) {
      getMissingUser(values.smeSourceId)
    }
  }, [systemUsers])

  useEffect(() => {
    ;(async () => {
      if (debouncedSearchTerm) {
        setLoading(true)
        const res = await checkDuplicates('cbeCode', values.cbeCode)

        if (res.status === 'success') {
          setLoading(false)
          if (res.body.Exists && res.body.CustomerKey === companyKey) return
          setFieldValue('cbeCodeChecker', res.body.Exists)
          setFieldValue('cbeCodeDupKey', res.body.CustomerKey)
        } else {
          setLoading(false)
          Swal.fire(local.error, getErrorMessage(res.error.error), 'error')
        }
      } else {
        setLoading(false)
      }
    })()
  }, [debouncedSearchTerm])
  return (
    <Form onSubmit={handleSubmit}>
      <Loader open={loading} type="fullscreen" />
      <Row>
        <Col sm={6}>
          <Form.Group controlId="cbeCode">
            <Form.Label>{local.cbeCode}</Form.Label>
            {cbeCode.length > 1 ? (
              <Select<Option>
                styles={theme.selectStyleWithBorder}
                name="cbeCode"
                theme={theme.selectTheme}
                placeholder={local.cbeCode}
                onChange={(event: any) => {
                  const value = event?.value || ' '

                  setFieldValue('cbeCode', value)
                }}
                options={cbeCode.map((company) => ({
                  label: `${company.name} | ${company.cbeCode}`,
                  value: company.cbeCode,
                }))}
                isOptionSelected={(option) => option.value === values.cbeCode}
                defaultValue={cbeCode
                  .filter((company) => company.cbeCode === values.cbeCode)
                  .map((foundCbe) => ({
                    label: `${foundCbe.name} | ${foundCbe.cbeCode}`,
                    value: foundCbe.cbeCode,
                  }))}
                isClearable
              />
            ) : (
              <Form.Control
                type="text"
                name="cbeCode"
                value={
                  cbeCode?.length === 0 ? values.cbeCode : cbeCode[0]?.cbeCode
                }
                onBlur={handleBlur}
                onChange={handleChange}
                isInvalid={errors.cbeCode && touched.cbeCode}
              />
            )}
            {errors.cbeCode && (
              <div
                style={{
                  width: '100%',
                  marginTop: '0.25rem',
                  fontSize: '80%',
                  color: '#d51b1b',
                }}
              >
                {errors.cbeCode === local.duplicateCbeCodeMessage
                  ? local.duplicateCbeCodeMessage +
                    local.withCode +
                    values.cbeCodeDupKey
                  : errors.cbeCode}
              </div>
            )}
          </Form.Group>
        </Col>
        <Col sm={6}>
          <Form.Group controlId="geoAreaId">
            <Form.Label>{`${local.geographicalDistribution}*`}</Form.Label>
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
            <Form.Label>{`${local.representative}*`}</Form.Label>
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
            <Form.Label>{`${local.applicationDate}*`}</Form.Label>
            <Form.Control
              type="date"
              name="applicationDate"
              data-qc=""
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
      <Row>
        <Col sm={6}>
          <Form.Group controlId="smeSourceId">
            <Form.Label>{local.smeSourceId}</Form.Label>
            <AsyncSelect
              className={errors.smeSourceId ? 'error' : ''}
              name="smeSourceId"
              data-qc="smeSourceId"
              styles={theme.selectStyleWithBorder}
              theme={theme.selectTheme}
              value={systemUsers?.find(
                (user) => user._id === values.smeSourceId
              )}
              onBlur={handleBlur}
              onChange={(user) => {
                if (props.edit && values.smeSourceId !== user._id) {
                  setFieldValue('newUser', user._id)
                  setFieldValue('smeSourceId', user._id)
                } else setFieldValue('smeSourceId', user._id)
                setFieldValue('userName', user.name)
              }}
              getOptionLabel={(option) => option.name}
              getOptionValue={(option) => option._id}
              loadOptions={getSystemUsers}
              cacheOptions
              defaultOptions
            />

            <div
              style={{
                width: '100%',
                marginTop: '0.25rem',
                fontSize: '80%',
                color: '#d51b1b',
              }}
            >
              {errors.smeSourceId}
            </div>
          </Form.Group>
        </Col>
        <Col sm={6}>
          <Form.Group controlId="permanentEmployeeCount">
            <Form.Label>{`${local.permanentEmployeeCount} *`}</Form.Label>
            <Form.Control
              type="number"
              name="permanentEmployeeCount"
              data-qc="permanentEmployeeCount"
              value={values.permanentEmployeeCount}
              onBlur={handleBlur}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const re = /^\d*$/
                if (
                  event.currentTarget.value === '' ||
                  re.test(event.currentTarget.value)
                ) {
                  setFieldValue(
                    'permanentEmployeeCount',
                    event.currentTarget.value
                  )
                }
              }}
              isInvalid={
                errors.permanentEmployeeCount && touched.permanentEmployeeCount
              }
            />
            <Form.Control.Feedback type="invalid">
              {errors.permanentEmployeeCount}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col sm={6}>
          <Form.Group controlId="establishmentDate">
            <Form.Label>{`${local.establishmentDate}*`}</Form.Label>
            <Form.Control
              type="date"
              name="establishmentDate"
              value={values.establishmentDate}
              onBlur={handleBlur}
              onChange={handleChange}
              isInvalid={errors.establishmentDate && touched.establishmentDate}
            />
            <Form.Control.Feedback type="invalid">
              {errors.establishmentDate}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col sm={6}>
          <Form.Group controlId="paidCapital">
            <Form.Label>{`${local.paidCapital} *`}</Form.Label>
            <Form.Control
              type="number"
              name="paidCapital"
              value={values.paidCapital}
              onBlur={handleBlur}
              onChange={handleChange}
              isInvalid={errors.paidCapital && touched.paidCapital}
            />
            <Form.Control.Feedback type="invalid">
              {errors.paidCapital}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
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
                        <Form.Label>{`${local.maxLoansAllowed}`}</Form.Label>
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
                        <Form.Label>{`${local.guarantorMaxLoans}`}</Form.Label>
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
                <Col>
                  <Form.Group controlId="guarantorMaxCustomers">
                    <Form.Label className="customer-form-label">{`${local.noOfGuarantorMaxCustomers}`}</Form.Label>
                    <Form.Control
                      type="number"
                      name="guarantorMaxCustomers"
                      data-qc="guarantorMaxCustomers"
                      value={values.guarantorMaxCustomers}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      disabled={
                        !allowed && (props.hasLoan || props.isGuarantor)
                      }
                      isInvalid={
                        errors.guarantorMaxCustomers &&
                        touched.guarantorMaxCustomers
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.guarantorMaxCustomers}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
            </>
          )
        }
      </Can>

      <Row>
        <Col sm={6}>
          <Form.Group controlId="smeBankName">
            <Form.Label>{`${local.smeBankName} *`}</Form.Label>
            <Form.Control
              type="text"
              name="smeBankName"
              value={values.smeBankName}
              onBlur={handleBlur}
              onChange={handleChange}
              isInvalid={errors.smeBankName && touched.smeBankName}
            />
            <Form.Control.Feedback type="invalid">
              {errors.smeBankName}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col sm={6}>
          <Form.Group controlId="smeBankBranch">
            <Form.Label>{`${local.smeBankBranch} *`}</Form.Label>
            <Form.Control
              type="text"
              name="smeBankBranch"
              value={values.smeBankBranch}
              onBlur={handleBlur}
              onChange={handleChange}
              isInvalid={errors.smeBankBranch && touched.smeBankBranch}
            />
            <Form.Control.Feedback type="invalid">
              {errors.smeBankBranch}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col sm={6}>
          <Form.Group controlId="smeBankAccountNumber">
            <Form.Label>{`${local.smeBankAccountNumber} *`}</Form.Label>
            <Form.Control
              type="text"
              name="smeBankAccountNumber"
              value={values.smeBankAccountNumber}
              onBlur={handleBlur}
              onChange={handleChange}
              isInvalid={
                errors.smeBankAccountNumber && touched.smeBankAccountNumber
              }
            />
            <Form.Control.Feedback type="invalid">
              {errors.smeBankAccountNumber}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col sm={6}>
          <Form.Group controlId="smeIbanNumber">
            <Form.Label>{`${local.smeIbanNumber} *`}</Form.Label>
            <Form.Control
              type="text"
              name="smeIbanNumber"
              value={values.smeIbanNumber}
              onBlur={handleBlur}
              onChange={handleChange}
              isInvalid={errors.smeIbanNumber && touched.smeIbanNumber}
            />
            <Form.Control.Feedback type="invalid">
              {errors.smeIbanNumber}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col sm={12}>
          <Form.Group controlId="comments">
            <Form.Label>{local.comments}</Form.Label>
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
