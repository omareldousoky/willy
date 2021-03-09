import React, { ChangeEvent, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import { Field, Formik, FormikProps } from 'formik'
import { Dropdown, DropdownButton, InputGroup } from 'react-bootstrap'
import { reportsModalValidation } from './reportsModalValidation'
import { PDF } from './reports'
import {
  AsyncBranchGeoAreasDropDown,
  AsyncLoanOfficersDropDown,
  BranchesDropDown,
} from '../dropDowns/allDropDowns'
import * as local from '../../../Shared/Assets/ar.json'
import { Branch } from '../../../Shared/Services/interfaces'
import DateField from '../Common/FormikFields/dateField'
import { required } from '../../../Shared/validations'
import { DateFromToField } from './Fields/dateFromTo'
import TextField from '../Common/FormikFields/textField'
import { getFullCustomerKey } from '../../../Shared/Services/utils'

interface InitialFormikState {
  fromDate?: string
  toDate?: string
  quarterYear?: string
  branches: Array<Branch>
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
}

interface Props {
  pdf: PDF
  show: boolean
  hideModal: () => void
  submit: (values) => void
  getExcel?: (values) => void
}

const ReportsModal = (props: Props) => {
  const [customerDropDownValue, setCustomerDropDownValue] = useState(
    props.pdf.inputs?.includes('customerKey') ? 'customerKey' : undefined
  )
  const getIds = (list: Record<string, string>[]): string[] =>
    list?.length ? list.map((item) => item._id) : []
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
    const initValues: InitialFormikState = props.pdf.inputs?.forEach(
      (input) => {
        switch (input) {
          case 'dateFromTo':
            initValues.fromDate = ''
            initValues.toDate = ''
            break
          case 'branches':
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
          default:
            initValues.branches = []
        }
      }
    ) || { branches: [] }
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
                    if (input === 'branches') {
                      return (
                        <Col key={input} sm={12}>
                          <BranchesDropDown
                            isMulti
                            onlyValidBranches
                            onSelectBranch={(branches) => {
                              formikProps.setFieldValue('branches', branches)
                              formikProps.setFieldValue('representatives', [])
                            }}
                          />
                          <span className="text-danger">
                            {formikProps.errors.branches}
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
                        <Col sm={12} key={input}>
                          <Form.Group controlId="monthComparisonFromToDate">
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
                                name="fromDate"
                                data-qc="fromDate"
                                value={formikProps.values.fromDate}
                                isInvalid={Boolean(
                                  formikProps.errors.fromDate &&
                                    formikProps.touched.fromDate
                                )}
                                onChange={(e) => {
                                  formikProps.setFieldValue(
                                    'fromDate',
                                    e.currentTarget.value
                                  )
                                  if (e.currentTarget.value === '')
                                    formikProps.setFieldValue('toDate', '')
                                }}
                                min="2021-02-01"
                                required
                              />
                              <span>{local.to}</span>
                              <Form.Control
                                style={{ marginRight: 20, border: 'none' }}
                                type="date"
                                name="toDate"
                                data-qc="toDate"
                                value={formikProps.values.toDate}
                                min={formikProps.values.fromDate}
                                max={getMaxToMonthComparison(
                                  formikProps.values.fromDate
                                )}
                                onChange={formikProps.handleChange}
                                isInvalid={Boolean(
                                  formikProps.errors.toDate &&
                                    formikProps.touched.toDate
                                )}
                                disabled={!formikProps.values.fromDate}
                                required
                              />
                            </div>
                            <span className="text-danger">
                              {formikProps.errors.fromDate ||
                                formikProps.errors.toDate}
                            </span>
                          </Form.Group>
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
                      onClick={() => {
                        props.getExcel && props.getExcel(formikProps.values)
                      }}
                    >
                      {local.downloadExcel}
                    </Button>
                  )}
                <Button type="submit" variant="primary">
                  {local.downloadPDF}
                </Button>
              </Modal.Footer>
            </Form>
          )
        }}
      </Formik>
    </Modal>
  )
}

export default ReportsModal
