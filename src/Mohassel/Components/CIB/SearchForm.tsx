import { Field, Formik, FormikProps } from 'formik'
import React, { ChangeEvent } from 'react'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import InputGroup from 'react-bootstrap/InputGroup'
import Button from 'react-bootstrap/Button'

import local from '../../../Shared/Assets/ar.json'
import { BranchesDropDown } from '../dropDowns/allDropDowns'
import { SearchFormProps, SearchFormValues } from './types'
import TextField from '../Common/FormikFields/textField'
import { DateFromToField } from '../Reports/Fields/dateFromTo'
import { required } from '../../../Shared/validations'

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
      validateOnBlur
      validateOnChange
    >
      {(formik: FormikProps<SearchFormValues>) => (
        <Form onSubmit={formik.handleSubmit}>
          <Row>
            <Col sm={6}>
              <InputGroup>
                <InputGroup.Append>
                  <InputGroup.Text className="bg-white border-left-0">
                    <span className="fa fa-search fa-rotate-90" />
                  </InputGroup.Text>
                </InputGroup.Append>
                <Field
                  onlyField
                  type="text"
                  name="customerName"
                  data-qc="customerName"
                  id="customerName"
                  onChange={formik.handleChange}
                  placeholder={local.name}
                  className="border-right-0"
                  component={TextField}
                  value={formik.values.customerName}
                />
              </InputGroup>
            </Col>
            <DateFromToField
              id="cibDateFromTo"
              name={local.issuanceDate}
              cols={6}
              from={{
                name: 'fromDate',
                onChange: (e: ChangeEvent<HTMLInputElement>) => {
                  const fromDateValue = e.currentTarget.value
                  formik.setFieldValue('fromDate', fromDateValue)
                  if (fromDateValue === '') formik.setFieldValue('toDate', '')
                  setSearchFormValues({
                    fromDate: fromDateValue,
                  })
                },
                value: formik.values.fromDate || undefined,
                error: formik.errors.fromDate,
                // to avoid Warning: Received `false` for a non-boolean attribute
                touched: formik.touched.fromDate ? 1 : 0,
                isInvalid: !!(
                  formik.errors.fromDate && formik.touched.fromDate
                ),
                validate: required,
              }}
              to={{
                name: 'toDate',
                min: formik.values.fromDate,
                onChange: (e: ChangeEvent<HTMLInputElement>) => {
                  const toDateValue = e.currentTarget.value
                  formik.setFieldValue('toDate', toDateValue)
                  setSearchFormValues({
                    toDate: toDateValue,
                  })
                },
                value: formik.values.toDate || undefined,
                error: formik.errors.toDate,
                touched: formik.touched.toDate ? 1 : 0,
                isInvalid: !!(formik.errors.toDate && formik.touched.toDate),
                disabled: !formik.values.fromDate,
                validate: required,
              }}
            />
            <Col sm={6} style={{ marginTop: 20 }}>
              <BranchesDropDown
                value={formik.values.branchId}
                onSelectBranch={(branch) => {
                  formik.setFieldValue('branchId', branch._id)
                  setSearchFormValues({ branchId: branch._id })
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
