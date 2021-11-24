import React, { ChangeEvent, useState } from 'react'
import {
  Field,
  Formik,
  FormikProps,
  FormikTouched,
  setNestedObjectValues,
} from 'formik'

import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import InputGroup from 'react-bootstrap/InputGroup'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import { reportsModalValidation } from './reportsModalValidation'
import {
  AsyncBranchGeoAreasDropDown,
  AsyncLoanOfficersDropDown,
  AsyncManagersDropDown,
  BranchesDropDown,
} from '../dropDowns/allDropDowns'
import * as local from '../../Assets/ar.json'
import { Branch } from '../../Services/interfaces'
import { required } from '../../Validations/common'
import TextField from '../Common/FormikFields/textField'

import { generateArrayOfYears, getFullCustomerKey } from '../../Services/utils'
import { PDF } from '../PdfList/types'
import { CurrentHierarchiesSingleResponse } from '../../Models/OfficerProductivity/OfficerProductivityReport'
import { DateField, DateFromToField } from '../Common/FormikFields/dateField'

interface InitialFormikState {
  fromDate?: string
  toDate?: string
  quarterYear?: string
  branches?: Array<Branch>
  quarterNumber?: string
  customerKeyword?: string
  loanOfficers?: Array<string>
  date?: string
  loanOfficerIds?: Array<string>
  representatives?: Array<string>
  gracePeriod?: number
  geoAreas?: Array<string>
  creationDateFrom?: string
  creationDateTo?: string
  loanApplicationKey?: string
  defaultingCustomerStatus?: string
  managers?: Array<CurrentHierarchiesSingleResponse>
  loanType?: 'sme' | 'micro' | 'all'
  year?: number
  creditInquiryStatus?: string
}

interface Props {
  pdf: PDF
  show: boolean
  isCF?: boolean
  hideModal: () => void
  submit: (values) => void
  getExcel?: (values) => void
  submitButtonText?: string
}

const ReportsModal = (props: Props) => {
  const [customerDropDownValue, setCustomerDropDownValue] = useState(
    props.pdf.inputs?.includes('customerKey') ? 'customerKey' : undefined
  )
  const defaultingCustomerStatuses = [
    {
      value: 'branchManagerReview',
      text: local.branchManagerReview,
      permission: 'branchManagerReview',
      key: 'legal',
    },
    {
      value: 'areaSupervisorReview',
      text: local.areaSupervisorReview,
      permission: 'areaSupervisorReview',
      key: 'legal',
    },
    {
      value: 'areaManagerReview',
      text: local.areaManagerReview,
      permission: 'areaManagerReview',
      key: 'legal',
    },
    {
      value: 'financialManagerReview',
      text: local.financialManagerReview,
      permission: 'financialManagerReview',
      key: 'legal',
    },
  ]

  const creditInquiryStatuses = [
    { value: 'underReview', label: local.underReview },
    { value: 'reviewed', label: local.reviewed },
    { value: 'secondReview', label: local.secondReviewed },
    { value: 'thirdReview', label: local.thirdReviewed },
    { value: 'approved', label: local.approved },
    { value: 'created', label: local.created },
    { value: 'issued', label: local.issued },
    { value: 'not_associated', label: local.newCustomer },
  ]

  const getIds = (list: Record<string, string>[]): string[] =>
    list?.length ? list.map((item) => item._id || item.id) : []
  const getCustomerKey = (key?: string): string | undefined => {
    if (!customerDropDownValue || key === undefined) return undefined
    return customerDropDownValue === 'customerKey'
      ? key
      : getFullCustomerKey(key)?.toString()
  }
  function handleSubmit(values) {
    props.submit({
      ...values,
      representatives: getIds(values.representatives),
      loanOfficers: getIds(values.representatives),
      loanOfficerIds: getIds(values.representatives),
      geoAreas: getIds(values.geoAreas),
      key: getCustomerKey(values.customerKeyword),
    })
  }
  function getInitialValues() {
    const initValues: InitialFormikState = {}
    props.pdf.inputs?.forEach((input) => {
      switch (input) {
        case 'dateFromTo':
          initValues.fromDate = ''
          initValues.toDate = ''
          break
        case 'branches':
        case 'branch':
          initValues.branches = []
          break
        case 'customerKey':
          initValues.customerKeyword = ''
          break
        case 'quarterYear':
          initValues.quarterYear = ''
          break
        case 'quarterNumber':
          initValues.quarterNumber = '01'
          break
        case 'date':
          initValues.date = ''
          break
        case 'representatives':
          initValues.representatives = []
          initValues.loanOfficers = []
          initValues.loanOfficerIds = []
          break
        case 'gracePeriod':
          initValues.gracePeriod = 0
          break
        case 'geoAreas':
          initValues.geoAreas = []
          break
        case 'creationDateFromTo':
          initValues.creationDateFrom = ''
          initValues.creationDateTo = ''
          break
        case 'applicationKey':
          initValues.loanApplicationKey = ''
          break
        case 'defaultingCustomerStatus':
          initValues.defaultingCustomerStatus =
            defaultingCustomerStatuses[0].value
          break
        case 'managers':
          initValues.managers = []
          break
        case 'loanType':
          initValues.loanType = 'all'
          break
        case 'loanTypeWithoutAll':
          initValues.loanType = 'micro'
          break
        case 'month':
          initValues.date = ''
          break
        case 'creditInquiryStatus':
          initValues.creditInquiryStatus = creditInquiryStatuses[0].value
          break
        case 'year':
          initValues.year = new Date().getFullYear()
          break
        default:
          break
      }
    })

    return initValues
  }

  const getMaxToMonthComparison = (from?: string): string => {
    if (!from) return '0'
    const fromDate = new Date(from)
    // last day of month extracted from `fromDate`
    const lastDayOfMonth = new Date(
      fromDate.getFullYear(),
      fromDate.getMonth() + 1,
      0
    ).getDate()
    const month =
      fromDate.getMonth() > 8
        ? fromDate.getMonth() + 1
        : `0${fromDate.getMonth() + 1}`
    return `${fromDate.getFullYear()}-${month}-${lastDayOfMonth}`
  }
  // TODO: refactor out
  const arDropDownValue = {
    customerKey: local.customerCode,
    customerShortenedCode: local.customerShortenedCode,
    default: '',
  }

  return (
    <Modal
      size="lg"
      show={props.show}
      onHide={() => {
        props.hideModal()
      }}
    >
      <Formik
        initialValues={getInitialValues()}
        onSubmit={handleSubmit}
        validationSchema={reportsModalValidation}
      >
        {(formikProps: FormikProps<InitialFormikState>) => {
          return (
            <Form onSubmit={formikProps.handleSubmit}>
              <Modal.Header>
                <Modal.Title>{props.pdf.local}</Modal.Title>
              </Modal.Header>
              <Modal.Body className="report-modal">
                <Row>
                  {props.pdf.inputs?.map((input) => {
                    if (input === 'dateFromTo') {
                      return (
                        <DateFromToField
                          key={input}
                          id={input}
                          name={local.date}
                          from={{
                            name: 'fromDate',
                            onChange: (e: ChangeEvent<HTMLInputElement>) => {
                              formikProps.setFieldValue(
                                'fromDate',
                                e.currentTarget.value
                              )
                              if (e.currentTarget.value === '')
                                formikProps.setFieldValue('toDate', '')
                            },
                            value: formikProps.values.fromDate,
                            error: formikProps.errors.fromDate,
                            // to avoid Warning: Received `false` for a non-boolean attribute
                            touched: formikProps.touched.fromDate ? 1 : 0,
                            isInvalid: !!(
                              formikProps.errors.fromDate &&
                              formikProps.touched.fromDate
                            ),
                            validate: required,
                          }}
                          to={{
                            name: 'toDate',
                            min: formikProps.values.fromDate,
                            onChange: formikProps.handleChange,
                            value: formikProps.values.toDate,
                            error: formikProps.errors.toDate,
                            touched: formikProps.touched.toDate ? 1 : 0,
                            isInvalid: !!(
                              formikProps.errors.toDate &&
                              formikProps.touched.toDate
                            ),
                            disabled: !formikProps.values.fromDate,
                            validate: required,
                          }}
                        />
                      )
                    }
                    if (input === 'branches' || input === 'branch') {
                      return (
                        <Col key={input} sm={12}>
                          <BranchesDropDown
                            isMulti={input === 'branches'}
                            onlyValidBranches
                            onSelectBranch={(branches) => {
                              if (branches === null) {
                                formikProps.setFieldValue('branches', [])
                              } else {
                                formikProps.setFieldValue('branches', branches)
                              }

                              formikProps.setFieldValue('representatives', [])
                            }}
                          />
                          <span className="text-danger">
                            {formikProps.touched.branches &&
                              formikProps.errors.branches}
                          </span>
                        </Col>
                      )
                    }
                    if (input === 'customerKey') {
                      return (
                        <Col sm={12} key={input} style={{ marginTop: 10 }}>
                          <InputGroup>
                            <DropdownButton
                              as={InputGroup.Append}
                              variant="outline-secondary"
                              title={
                                arDropDownValue[customerDropDownValue || '']
                              }
                              id="input-group-dropdown-2"
                              data-qc="input-group-dropdown-customer"
                            >
                              {['customerKey', 'customerShortenedCode'].map(
                                (key) => (
                                  <Dropdown.Item
                                    key={key}
                                    data-qc={key}
                                    onClick={() => {
                                      setCustomerDropDownValue(key)
                                      formikProps.setFieldValue(key, '')
                                    }}
                                  >
                                    {arDropDownValue[key]}
                                  </Dropdown.Item>
                                )
                              )}
                            </DropdownButton>
                            <Form.Control
                              type="text"
                              name="customerKeyword"
                              data-qc="customerKeyword"
                              onChange={formikProps.handleChange}
                              style={{
                                borderRight: 0,
                                padding: 22,
                              }}
                              value={formikProps.values.customerKeyword}
                            />
                          </InputGroup>
                        </Col>
                      )
                    }
                    if (input === 'quarterYear') {
                      return (
                        <Col sm={12} key={input}>
                          <Form.Group controlId="quarterYear">
                            <div
                              className="dropdown-container"
                              style={{ flex: 1, alignItems: 'center' }}
                            >
                              <p
                                className="dropdown-label"
                                style={{
                                  alignSelf: 'normal',
                                  marginLeft: 20,
                                  width: 300,
                                  textAlign: 'center',
                                }}
                              >
                                {local.date}
                              </p>
                              <span>{local.from}</span>
                              <Form.Control
                                style={{ marginLeft: 20, border: 'none' }}
                                type="date"
                                name="quarterYear"
                                data-qc="quarterYear"
                                value={formikProps.values.quarterYear}
                                isInvalid={Boolean(
                                  formikProps.errors.quarterYear &&
                                    formikProps.touched.quarterYear
                                )}
                                onBlur={formikProps.handleBlur}
                                onChange={(e) => {
                                  formikProps.setFieldValue(
                                    'quarterYear',
                                    e.currentTarget.value
                                  )
                                  if (e.currentTarget.value === '')
                                    formikProps.setFieldValue('quarterYear', '')
                                }}
                              />
                              <Form.Control.Feedback type="invalid">
                                {formikProps.errors.quarterYear}
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>
                      )
                    }
                    if (input === 'quarterNumber') {
                      return (
                        <Col key={input} sm={6}>
                          <div
                            className="dropdown-container"
                            style={{ flex: 1, alignItems: 'center' }}
                          >
                            <p
                              className="dropdown-label"
                              style={{
                                alignSelf: 'normal',
                                marginLeft: 20,
                                width: 300,
                                textAlign: 'center',
                              }}
                            >
                              {local.noOfQuarter}
                            </p>
                            <Form.Control
                              as="select"
                              className="dropdown-select"
                              data-qc="quarterNumber"
                              name="quarterNumber"
                              value={formikProps.values.quarterNumber}
                              onChange={(e) => {
                                formikProps.setFieldValue(
                                  'quarterNumber',
                                  e.currentTarget.value
                                )
                              }}
                            >
                              <option value="01" data-qc="approved">
                                1
                              </option>
                              <option value="02" data-qc="created">
                                2
                              </option>
                              <option value="03" data-qc="rejected">
                                3
                              </option>
                              <option value="04" data-qc="canceled">
                                4
                              </option>
                            </Form.Control>
                          </div>
                        </Col>
                      )
                    }
                    if (input === 'date') {
                      return (
                        <Field
                          type="date"
                          name="date"
                          id="date"
                          value={formikProps.values.date}
                          onChange={formikProps.handleChange}
                          isInvalid={
                            !!(
                              formikProps.errors.date &&
                              formikProps.touched.date
                            )
                          }
                          component={DateField}
                          key={input}
                          validate={required}
                        />
                      )
                    }
                    if (input === 'representatives') {
                      return (
                        <Col key={input} sm={12}>
                          <AsyncLoanOfficersDropDown
                            isMulti
                            onSelectOption={(loanOfficers) => {
                              formikProps.setFieldValue(
                                'representatives',
                                Array.isArray(loanOfficers)
                                  ? loanOfficers
                                  : [loanOfficers]
                              )
                            }}
                            branchId={
                              (formikProps.values.branches &&
                                formikProps.values.branches.length === 1 &&
                                formikProps.values.branches[0]._id) ||
                              undefined
                            }
                            isDisabled={
                              !formikProps.values.branches ||
                              (formikProps.values.branches &&
                                (!formikProps.values.branches.length ||
                                  formikProps.values.branches.length > 1))
                            }
                          />
                          <span className="text-danger">
                            {formikProps.errors.representatives}
                          </span>
                        </Col>
                      )
                    }
                    if (input === 'gracePeriod') {
                      return (
                        <Field
                          name="gracePeriod"
                          id="gracePeriod"
                          type="number"
                          min={0}
                          displayName={local.gracePeriod}
                          value={formikProps.values.gracePeriod}
                          onChange={formikProps.handleChange}
                          isInvalid={
                            !!(
                              formikProps.errors.gracePeriod &&
                              formikProps.touched.gracePeriod
                            )
                          }
                          component={TextField}
                          key={input}
                        />
                      )
                    }
                    if (input === 'geoAreas') {
                      return (
                        <Col key={input} sm={12}>
                          <AsyncBranchGeoAreasDropDown
                            isMulti
                            onSelectOption={(geoAreas) => {
                              formikProps.setFieldValue(
                                'geoAreas',
                                Array.isArray(geoAreas) ? geoAreas : [geoAreas]
                              )
                            }}
                            branchId={
                              (formikProps.values.branches &&
                                formikProps.values.branches.length === 1 &&
                                formikProps.values.branches[0]?._id) ||
                              undefined
                            }
                            // disable for non-selected branch, all branches, multi selected branches
                            isDisabled={
                              !formikProps.values.branches ||
                              (formikProps.values.branches &&
                                (!formikProps.values.branches.length ||
                                  formikProps.values.branches.length > 1 ||
                                  (!!formikProps.values.branches.length &&
                                    !formikProps.values.branches[0]?._id)))
                            }
                          />
                          <span className="text-danger">
                            {formikProps.errors.geoAreas}
                          </span>
                        </Col>
                      )
                    }
                    if (input === 'creationDateFromTo') {
                      return (
                        <DateFromToField
                          key={input}
                          id={input}
                          name={local.creationDate}
                          from={{
                            name: 'creationDateFrom',
                            onChange: (e: ChangeEvent<HTMLInputElement>) => {
                              formikProps.setFieldValue(
                                'creationDateFrom',
                                e.currentTarget.value
                              )
                              if (e.currentTarget.value === '')
                                formikProps.setFieldValue('creationDateTo', '')
                            },
                            value: formikProps.values.creationDateFrom,
                            error: formikProps.errors.creationDateFrom,
                            // to avoid Warning: Received `false` for a non-boolean attribute
                            touched: formikProps.touched.creationDateFrom
                              ? 1
                              : 0,
                            isInvalid: !!(
                              formikProps.errors.creationDateFrom &&
                              formikProps.touched.creationDateFrom
                            ),
                          }}
                          to={{
                            name: 'creationDateTo',
                            min: formikProps.values.creationDateFrom,
                            onChange: formikProps.handleChange,
                            value: formikProps.values.creationDateTo,
                            error: formikProps.errors.creationDateTo,
                            touched: formikProps.touched.creationDateTo ? 1 : 0,
                            isInvalid: !!(
                              formikProps.errors.creationDateTo &&
                              formikProps.touched.creationDateTo
                            ),
                            disabled: !formikProps.values.creationDateFrom,
                          }}
                        />
                      )
                    }
                    if (input === 'applicationKey') {
                      return (
                        <Col sm={12} key={input} style={{ marginTop: 10 }}>
                          <Form.Group controlId="loanApplicationKey">
                            <div className="dropdown-container">
                              <p
                                className="dropdown-label"
                                style={{ width: 150, whiteSpace: 'nowrap' }}
                              >
                                {local.applicationCode}
                              </p>
                              <Form.Control
                                className="dropdown-select"
                                name="loanApplicationKey"
                                data-qc="loanApplicationKey"
                                value={formikProps.values.loanApplicationKey}
                                isInvalid={Boolean(
                                  formikProps.errors.loanApplicationKey &&
                                    formikProps.touched.loanApplicationKey
                                )}
                                onChange={formikProps.handleChange}
                              />
                            </div>
                            <span style={{ color: 'red' }}>
                              {formikProps.errors.loanApplicationKey &&
                              formikProps.touched.loanApplicationKey
                                ? formikProps.errors.loanApplicationKey
                                : ''}
                            </span>
                          </Form.Group>
                        </Col>
                      )
                    }
                    if (input === 'monthComparisonDateFromTo') {
                      return (
                        <DateFromToField
                          key={input}
                          id={input}
                          name={local.date}
                          from={{
                            name: 'fromDate',
                            min: '2021-02-01',
                            onChange: (e: ChangeEvent<HTMLInputElement>) => {
                              formikProps.setFieldValue(
                                'fromDate',
                                e.currentTarget.value
                              )
                              if (e.currentTarget.value === '')
                                formikProps.setFieldValue('toDate', '')
                            },
                            value: formikProps.values.fromDate,
                            error: formikProps.errors.fromDate,
                            // to avoid Warning: Received `false` for a non-boolean attribute
                            touched: formikProps.touched.fromDate ? 1 : 0,
                            isInvalid: !!(
                              formikProps.errors.fromDate &&
                              formikProps.touched.fromDate
                            ),
                            validate: required,
                          }}
                          to={{
                            name: 'toDate',
                            min: formikProps.values.fromDate,
                            max: getMaxToMonthComparison(
                              formikProps.values.fromDate
                            ),
                            onChange: formikProps.handleChange,
                            value: formikProps.values.toDate,
                            error: formikProps.errors.toDate,
                            touched: formikProps.touched.toDate ? 1 : 0,
                            isInvalid: !!(
                              formikProps.errors.toDate &&
                              formikProps.touched.toDate
                            ),
                            disabled: !formikProps.values.fromDate,
                            validate: required,
                          }}
                        />
                      )
                    }
                    if (input === 'managers') {
                      return (
                        <Col key={input} sm={12}>
                          <AsyncManagersDropDown
                            isMulti
                            onSelectOption={(managers) => {
                              formikProps.setFieldValue('managers', managers)
                            }}
                          />
                          <span className="text-danger">
                            {formikProps.errors.managers}
                          </span>
                        </Col>
                      )
                    }
                    if (input === 'defaultingCustomerStatus') {
                      return (
                        <Col key={input} sm={12}>
                          <div className="dropdown-container">
                            <p className="dropdown-label">{local.status}</p>
                            <Form.Control
                              as="select"
                              className="dropdown-select"
                              data-qc="status"
                              name="defaultingCustomerStatus"
                              value={
                                formikProps.values.defaultingCustomerStatus
                              }
                              onChange={formikProps.handleChange}
                            >
                              {defaultingCustomerStatuses.map((option) => (
                                <option
                                  key={option.value}
                                  value={option.value}
                                  data-qc={option.text}
                                >
                                  {option.text}
                                </option>
                              ))}
                            </Form.Control>
                          </div>
                        </Col>
                      )
                    }
                    if (!props.isCF && input === 'loanType') {
                      return (
                        <Col key={input} sm={12}>
                          <div className="dropdown-container">
                            <p className="dropdown-label">{local.loanType}</p>
                            <Form.Control
                              as="select"
                              className="dropdown-select"
                              data-qc="loanType"
                              name="loanType"
                              value={formikProps.values.loanType}
                              onChange={formikProps.handleChange}
                            >
                              {[
                                { value: 'all', text: local.all },
                                { value: 'sme', text: 'sme' },
                                { value: 'micro', text: 'micro' },
                              ].map(({ value, text }) => (
                                <option
                                  key={value}
                                  value={value}
                                  data-qc={value}
                                >
                                  {text}
                                </option>
                              ))}
                            </Form.Control>
                          </div>
                          <span className="text-danger">
                            {formikProps.errors.loanType}
                          </span>
                        </Col>
                      )
                    }
                    if (!props.isCF && input === 'loanTypeWithoutAll') {
                      return (
                        <Col key={input} sm={12}>
                          <div className="dropdown-container">
                            <p className="dropdown-label">{local.loanType}</p>
                            <Form.Control
                              as="select"
                              className="dropdown-select"
                              data-qc="loanType"
                              name="loanType"
                              value={formikProps.values.loanType}
                              onChange={formikProps.handleChange}
                            >
                              {[
                                { value: 'sme', text: 'sme' },
                                { value: 'micro', text: 'micro' },
                              ].map(({ value, text }) => (
                                <option
                                  key={value}
                                  value={value}
                                  data-qc={value}
                                >
                                  {text}
                                </option>
                              ))}
                            </Form.Control>
                          </div>
                          <span className="text-danger">
                            {formikProps.errors.loanType}
                          </span>
                        </Col>
                      )
                    }
                    if (input === 'month') {
                      return (
                        <Field
                          type="month"
                          name="date"
                          id="date"
                          value={formikProps.values.date}
                          onChange={formikProps.handleChange}
                          isInvalid={
                            !!(
                              formikProps.errors.date &&
                              formikProps.touched.date
                            )
                          }
                          component={DateField}
                          key={input}
                          validate={required}
                        />
                      )
                    }
                    if (input === 'creditInquiryStatus') {
                      return (
                        <Col key={input} sm={12}>
                          <div className="dropdown-container">
                            <p className="dropdown-label">{local.status}</p>
                            <Form.Control
                              as="select"
                              className="dropdown-select"
                              data-qc="creditInquiryStatus"
                              name="creditInquiryStatus"
                              value={formikProps.values.creditInquiryStatus}
                              onChange={formikProps.handleChange}
                            >
                              {creditInquiryStatuses.map((option) => (
                                <option
                                  key={option.value}
                                  value={option.value}
                                  data-qc={option.label}
                                >
                                  {option.label}
                                </option>
                              ))}
                            </Form.Control>
                          </div>
                        </Col>
                      )
                    }
                    if (input === 'year') {
                      return (
                        <Col key={input} sm={6}>
                          <div className="dropdown-container">
                            <p className="dropdown-label mr-2 text-center">
                              {local.year}
                            </p>
                            <Form.Control
                              as="select"
                              className="dropdown-select"
                              data-qc="year"
                              name="year"
                              value={formikProps.values.year}
                              onChange={(e) => {
                                formikProps.setFieldValue(
                                  'year',
                                  e.currentTarget.value
                                )
                              }}
                            >
                              {generateArrayOfYears().map((option) => (
                                <option
                                  key={option}
                                  value={option}
                                  data-qc={option}
                                >
                                  {option}
                                </option>
                              ))}
                            </Form.Control>
                          </div>
                        </Col>
                      )
                    }
                  })}
                </Row>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => {
                    props.hideModal()
                  }}
                >
                  {local.cancel}
                </Button>
                {props.pdf &&
                  props.pdf.key &&
                  ![
                    'customerDetails',
                    'loanDetails',
                    'cibPaymentReport',
                    'customerTransactionReport',
                  ].includes(props.pdf.key) &&
                  props.getExcel && (
                    <Button
                      disabled={!!formikProps.errors.quarterYear}
                      variant="primary"
                      onClick={async () => {
                        // Manual revalidate formik: https://github.com/formium/formik/issues/2734
                        const errors = await formikProps.validateForm()
                        if (Object.keys(errors).length === 0) {
                          props.getExcel && props.getExcel(formikProps.values)
                        } else {
                          formikProps.setTouched(
                            setNestedObjectValues<
                              FormikTouched<InitialFormikState>
                            >(errors, true)
                          )
                        }
                      }}
                    >
                      {local.downloadExcel}
                    </Button>
                  )}
                {props.pdf.key !== 'creditInquiryRequests' && (
                  <Button type="submit" variant="primary">
                    {props.submitButtonText || local.downloadPDF}
                  </Button>
                )}
              </Modal.Footer>
            </Form>
          )
        }}
      </Formik>
    </Modal>
  )
}

export default ReportsModal
