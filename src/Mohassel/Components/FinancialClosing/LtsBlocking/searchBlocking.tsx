import { Col, Row, InputGroup, DropdownButton, Dropdown } from 'react-bootstrap'
import React, { Component, useEffect } from 'react'
import * as local from '../../../../Shared/Assets/ar.json'
import Select, { ValueType } from 'react-select'
import { connect } from "react-redux"
import { Formik, Field, FormikValues, Form, useFormikContext } from 'formik'
import * as Yup from 'yup'
import { theme } from '../../../../theme'
import DateField from '../../Common/FormikFields/dateField'
import { search, searchFilters } from '../../../../Shared/redux/search/actions'
import { loading } from '../../../../Shared/redux/loading/actions'
import { getTimestamp } from '../../../../Shared/Services/utils'
import TextField from '../../Common/FormikFields/textField'

interface Props {
    size: number;
    from: number;
    search: (data) => void;
    searchFilters: (data) => void;
    setLoading: (data) => void;
}
interface Option {
    label: string;
    value: string;
}
interface BlockingObj {
    from: number;
    size: number;
    branchCode: number;
    branchName: string;
    status: string;
    blockDate: number | string;
    blockDateFilter: string;
}
interface State {
    dropDownValue: string;
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
const today: Date = new Date();
const blockingValidationSchema = Yup.object().shape({
    blockDate: Yup.string().test('block date cant be in the future', local.dateCantBeInFuture, (value: string) => {
        return value ? new Date(value).valueOf() <= today.valueOf() : true;
    }),
    branchName: Yup.string().trim(),
    branchCode: Yup.number(),
    blockDateFilter: Yup.string().trim(),
    status: Yup.string().trim()

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
  handleSubmit = async(values: BlockingObj) =>{
    const obj = {
      status: !values.blockDateFilter ? values.status : '',
      blockDate: getTimestamp(values.blockDate as string),
      blockDateFilter: values.blockDateFilter,
      branchCode: values.branchCode,
      branchName: values.branchName,
    }
    if(obj){
    this.props.searchFilters(obj)
    console.log(obj)
    this.props.search({
        ...obj,
        from: this.props.from,
        size: this.props.size,
        url: 'block'
    })
   }  
  }

  render() {
    return (
      <Formik
       className="mx-2 my-0"
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
          <Form className="w-100 py-3 m-2">
            <Row>
              <Col sm={5} className="my-2">
                <p>{local.chooseOperationType}</p>
                <div className="dropdown-container" style={{ flex: 2 }}>
                  <Select<Option>
                    isClearable
                    styles={theme.selectStyleWithoutBorder}
                    theme={theme.selectTheme}
                    className="full-width"
                    placeholder={local.chooseOperationType}
                    onChange={(event: ValueType<Option> | Option) => {
                      if (event) {
                        const { value } = event as Option
                        formikProps.setFieldValue('status', value)
                      }
                    }}
                    options={[
                      { label: local.all, value: '' },
                      { label: local.ltsBlocking, value: 'unblocked' },
                      { label: local.ltsUnblocking, value: 'blocked' },
                    ]}
                    isDisabled={!!formikProps.values.blockDateFilter}
                  />
                </div>
              </Col>
              <Col sm={5} className="my-5">
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
            </Row>
            <Row>
              <Col sm={5} className="my-5 mx-0 p-0">
                <Field
                  type="date"
                  name="blockDate"
                  key="blockDate"
                  value={formikProps.values.blockDate}
                  component={DateField}
                  className="m-0"
                  label={local.blockDate}
                  id="blockDate"
                />
              </Col>
              <Col sm={5} className="my-2">
                <p>{local.blockDateFilter}</p>
                <div className="dropdown-container" style={{ flex: 2 }}>
                  <Select<Option>
                    isClearable
                    styles={theme.selectStyleWithoutBorder}
                    theme={theme.selectTheme}
                    className="full-width"
                    placeholder={local.blockDateFilter}
                    onChange={(event: ValueType<Option> | Option) => {
                      if (event) {
                        const { value } = event as Option
                        formikProps.setFieldValue('blockDateFilter', value)
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
              </Col>
            </Row>
            <ValueChangeListener />
          </Form>
        )}
      </Formik>
    )
  }
}
const addSearchToProps = (dispatch) => {
  return {
    search: (data) => dispatch(search(data)),
    searchFilters: (data) => dispatch(searchFilters(data)),
    setLoading: (data) => dispatch(loading(data)),
  }
}

export default connect(null, addSearchToProps)(SearchBlocking)
