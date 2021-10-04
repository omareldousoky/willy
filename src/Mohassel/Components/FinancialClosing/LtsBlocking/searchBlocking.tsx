import React, { Component, useEffect } from 'react'

import InputGroup from 'react-bootstrap/InputGroup'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Col from 'react-bootstrap/Col'
import Dropdown from 'react-bootstrap/Dropdown'

import Select, { ValueType } from 'react-select'
import { connect } from 'react-redux'
import { Formik, Field, FormikValues, Form, useFormikContext } from 'formik'
import * as Yup from 'yup'
import Swal from 'sweetalert2'
import * as local from '../../../../Shared/Assets/ar.json'
import { DateField } from '../../../../Shared/Components/Common/FormikFields/dateField'
import { search, searchFilters } from '../../../../Shared/redux/search/actions'
import { loading } from '../../../../Shared/redux/loading/actions'
import { getErrorMessage } from '../../../../Shared/Services/utils'
import TextField from '../../../../Shared/Components/Common/FormikFields/textField'
import { theme } from '../../../../Shared/theme'

interface Props {
  size: number
  from: number
  search: (data) => Promise<void>
  error: string
  searchFilters: (data) => void
  setLoading: (data) => void
  onSubmit: () => void
}
interface Option {
  label: string
  value: string
}
export interface BlockingObj {
  from: number
  size: number
  branchCode: number
  branchName: string
  status: string
  blockDate: number | string
  blockDateFilter: string
}
interface State {
  dropDownValue: string
}
const ValueChangeListener = () => {
  const { submitForm, values } = useFormikContext<FormikValues>()

  useEffect(() => {
    if (values) {
      submitForm()
    }
  }, [values, submitForm])

  return null
}
const today: Date = new Date()
const blockingValidationSchema = Yup.object().shape({
  blockDate: Yup.string().test(
    'block date cant be in the future',
    local.dateCantBeInFuture,
    (value: string) => {
      return value ? new Date(value).valueOf() <= today.valueOf() : true
    }
  ),
  branchName: Yup.string().trim(),
  branchCode: Yup.number(),
  blockDateFilter: Yup.string().when('blockDate', {
    is: (blockDate) => !!blockDate,
    then: Yup.string().required(local.required),
    otherwise: Yup.string(),
  }),
  status: Yup.string().trim(),
})
class SearchBlocking extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      dropDownValue: 'branchName',
    }
  }

  getArValue(key: string) {
    const arDropDownValue = {
      branchName: local.branchName,
      branchCode: local.partialCode,
      default: '',
    }
    return arDropDownValue[key]
  }

  handleSubmit = async (values: BlockingObj) => {
    const obj = {
      status: values.status,
      blockDate: values.blockDateFilter
        ? new Date(values.blockDate as string)
            .setHours(23, 59, 59, 999)
            .valueOf()
        : 0,
      blockDateFilter: values.blockDateFilter,
      branchCode: values.branchCode,
      branchName: values.branchName,
    }
    if (obj) {
      this.props.searchFilters(obj)
      this.props
        .search({
          ...obj,
          from: this.props.from,
          size: this.props.size,
          url: 'block',
        })
        .then(() => {
          if (this.props.error)
            Swal.fire('Error !', getErrorMessage(this.props.error), 'error')
          else this.props.onSubmit()
        })
    }
  }

  render() {
    return (
      <Formik
        enableReinitialize
        initialValues={
          {
            status: '',
            branchName: '',
            blockDate: '',
            blockDateFilter: '',
          } as BlockingObj
        }
        onSubmit={this.handleSubmit}
        validationSchema={blockingValidationSchema}
        validateOnBlur
        validateOnChange
      >
        {(formikProps) => (
          <Form className="w-100">
            <div className="d-flex">
              <Col sm={6} className="my-2">
                <div className="dropdown-container">
                  <p className="dropdown-label">{local.operationType}</p>
                  <Select<Option>
                    isClearable
                    styles={theme.selectStyleWithoutBorder}
                    theme={theme.selectTheme}
                    className="full-width"
                    placeholder={local.chooseOperationType}
                    isDisabled={!!formikProps.values.blockDate}
                    onChange={(event: ValueType<Option> | Option) => {
                      if (event) {
                        const { value } = event as Option
                        formikProps.setFieldValue('status', value)
                        formikProps.setFieldValue('blockDateFilter', '')
                        formikProps.setFieldValue('blockDate', '')
                      } else {
                        formikProps.setFieldValue('status', '')
                      }
                    }}
                    options={[
                      { label: local.all, value: '' },
                      { label: local.ltsBlocking, value: 'unblocked' },
                      { label: local.ltsUnblocking, value: 'blocked' },
                    ]}
                  />
                </div>
              </Col>
              <Col sm={6} className="my-2">
                <InputGroup>
                  <DropdownButton
                    as={InputGroup.Append}
                    variant="outline-secondary"
                    color="black"
                    title={this.getArValue(this.state.dropDownValue)}
                    id="input-group-dropdown-2"
                    data-qc="search-dropdown"
                  >
                    {['branchName', 'branchCode'].map((key, index) => (
                      <Dropdown.Item
                        key={index}
                        data-qc={key}
                        onClick={() => {
                          this.setState({ dropDownValue: key })
                        }}
                      >
                        {this.getArValue(key)}
                      </Dropdown.Item>
                    ))}
                  </DropdownButton>
                  <Field
                    type="text"
                    name={this.state.dropDownValue}
                    data-qc="searchKeyword"
                    onChange={formikProps.handleChange}
                    placeholder={local.searchByBranchNameOrCode}
                    className="m-0"
                    component={TextField}
                    onlyField
                    value={formikProps.values[this.state.dropDownValue]}
                  />
                </InputGroup>
              </Col>
            </div>
            <div className="d-flex">
              <Col sm={6} className="mx-0 p-0">
                <Field
                  type="date"
                  name="blockDate"
                  key="blockDate"
                  value={formikProps.values.blockDate}
                  component={DateField}
                  className="m-0 full-width"
                  label={local.blockDate}
                  isClearable
                  onClear={() => {
                    formikProps.setFieldValue('blockDate', '')
                  }}
                  id="blockDate"
                />
              </Col>
              <Col sm={6}>
                <div className="dropdown-container">
                  <p className="dropdown-label">{local.branchesStatus}</p>
                  <Select<Option>
                    isClearable
                    styles={theme.selectStyleWithoutBorder}
                    theme={theme.selectTheme}
                    className="full-width"
                    placeholder={local.blockDateFilter}
                    isDisabled={!formikProps.values.blockDate}
                    onChange={(event: ValueType<Option> | Option) => {
                      if (event) {
                        const { value } = event as Option
                        formikProps.setFieldValue('blockDateFilter', value)
                        formikProps.setFieldValue('status', '')
                      } else {
                        formikProps.setFieldValue('blockDateFilter', '')
                      }
                    }}
                    options={[
                      { label: local.exactDateFilter, value: 'exact' },
                      { label: local.beforeDateFilter, value: 'before' },
                      { label: local.afterDateFilter, value: 'after' },
                    ]}
                  />
                </div>
                {formikProps.errors.blockDateFilter &&
                  !!formikProps.values.blockDate && (
                    <div className="errorMsg">
                      {formikProps.errors.blockDateFilter}
                    </div>
                  )}
              </Col>
            </div>
            <ValueChangeListener />
          </Form>
        )}
      </Formik>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    error: state.search.error,
  }
}
const addSearchToProps = (dispatch) => {
  return {
    search: (data) => dispatch(search(data)),
    searchFilters: (data) => dispatch(searchFilters(data)),
    setLoading: (data) => dispatch(loading(data)),
  }
}

export default connect(mapStateToProps, addSearchToProps)(SearchBlocking)
