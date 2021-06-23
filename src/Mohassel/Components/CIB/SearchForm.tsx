import { Formik, FormikProps } from 'formik'
import React from 'react'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'

import local from '../../../Shared/Assets/ar.json'
import { BranchesDropDown } from '../dropDowns/allDropDowns'
import { SearchFormProps, SearchFormValues } from './types'

export const SearchForm = ({
  initialValues,
  handleSearch,
  setSearchFormValues,
}: SearchFormProps) => {
  return (
    <Formik<SearchFormValues>
      enableReinitialize
      initialValues={initialValues}
      onSubmit={handleSearch}
      // validationSchema={}
      validateOnBlur
      validateOnChange
    >
      {(formikProps: FormikProps<SearchFormValues>) => (
        <Form onSubmit={formikProps.handleSubmit}>
          <Row>
            <Col sm={6}>
              <InputGroup>
                <InputGroup.Append>
                  <InputGroup.Text className="bg-white border-left-0">
                    <span className="fa fa-search fa-rotate-90" />
                  </InputGroup.Text>
                </InputGroup.Append>
                <FormControl
                  type="text"
                  name="customerName"
                  data-qc="customerName"
                  className="border-right-0"
                  onChange={(e) => {
                    formikProps.setFieldValue(
                      'customerName',
                      e.currentTarget.value
                    )
                    setSearchFormValues({
                      customerName: e.currentTarget.value,
                    })
                  }}
                  placeholder={local.name}
                  value={formikProps.values.customerName}
                />
              </InputGroup>
            </Col>
            <Col sm={6}>
              <div
                className="dropdown-container"
                style={{ flex: 1, alignItems: 'center' }}
              >
                <p
                  className="dropdown-label"
                  style={{
                    alignSelf: 'normal',
                    marginLeft: 20,
                    width: 400,
                  }}
                >
                  {local.issuanceDate}
                </p>
                <span>{local.from}</span>
                <Form.Control
                  required
                  style={{ marginLeft: 20, border: 'none' }}
                  type="date"
                  name="fromDate"
                  data-qc="fromDate"
                  value={formikProps.values.fromDate}
                  onChange={(e) => {
                    formikProps.setFieldValue('fromDate', e.currentTarget.value)
                    if (e.currentTarget.value === '')
                      formikProps.setFieldValue('toDate', '')
                    setSearchFormValues({
                      fromDate: Number(e.currentTarget.value),
                    })
                  }}
                />
                <span>{local.to}</span>
                <Form.Control
                  required
                  style={{ marginRight: 20, border: 'none' }}
                  type="date"
                  name="toDate"
                  data-qc="toDate"
                  value={formikProps.values.toDate}
                  min={formikProps.values.fromDate}
                  onChange={(e) => {
                    formikProps.setFieldValue('toDate', e.currentTarget.value)
                    setSearchFormValues({
                      toDate: Number(e.currentTarget.value),
                    })
                  }}
                  disabled={!formikProps.values.fromDate}
                />
              </div>
            </Col>
            <Col sm={6} style={{ marginTop: 20 }}>
              <BranchesDropDown
                onSelectBranch={(branch) => {
                  formikProps.setFieldValue('branchId', branch._id)
                  setSearchFormValues({ branchId: branch._id })
                  // this.setState((prevState) => ({
                  //   filteredBranch: branch._id,
                  //   filteredData: prevState.data.filter(
                  //     (item) => item.loanBranch === branch._id
                  //   ),
                  // }))
                }}
              />
            </Col>
            <Col className="d-flex">
              <Button
                className="ml-auto"
                type="submit"
                style={{ width: 180, height: 50, marginTop: 20 }}
              >
                {local.search}
              </Button>
            </Col>
          </Row>
        </Form>
      )}
    </Formik>
  )
}
