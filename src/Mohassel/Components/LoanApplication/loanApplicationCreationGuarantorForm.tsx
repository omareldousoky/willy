import React from 'react'
import Form from 'react-bootstrap/Form'
import { FieldArray } from 'formik'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import * as local from '../../../Shared/Assets/ar.json'
import CustomerSearch from '../CustomerSearch/customerSearchTable'
import InfoBox from '../userInfoBox'
import GroupInfoBox from '../LoanProfile/groupInfoBox'
import { guarantorOrderLocal } from '../../../Shared/Services/utils'

export const LoanApplicationCreationGuarantorForm = (props: any) => {
  const {
    values,
    handleSubmit,
    handleBlur,
    handleChange,
    errors,
    touched,
    setFieldValue,
    setValues,
  } = props
  return (
    <>
      <Form style={{ width: '90%', padding: 20 }} onSubmit={handleSubmit}>
        <fieldset
          disabled={
            !(values.state === 'edit' || values.state === 'under_review')
          }
        >
          {props.customer && Object.keys(props.customer).includes('_id') ? (
            <InfoBox values={props.customer} />
          ) : (
            <GroupInfoBox
              group={{ individualsInGroup: values.individualDetails }}
            />
          )}
          <div style={{ width: '100%', margin: '20px 0' }}>
            <h5>{local.guarantorInfo}</h5>
            <Col
              style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              {values.guarantors.map((guarantor, i) => {
                const text = guarantorOrderLocal[i && i > 10 ? 'default' : i]
                return (
                  <Row key={i} className="col-12 text-nowrap">
                    <CustomerSearch
                      source={text}
                      key={i}
                      className="col-11 p-0"
                      handleSearch={(key, query) =>
                        props.handleSearch(key, query, i)
                      }
                      searchResults={guarantor.searchResults}
                      selectCustomer={(guarantor) => {
                        props.selectGuarantor(guarantor, i, values)
                      }}
                      selectedCustomer={guarantor.guarantor}
                      removeCustomer={(guarantor) => {
                        props.removeGuarantor(guarantor, i, values)
                      }}
                      header={text}
                    />
                    {i > values.noOfGuarantors - 1 && (
                      <div className="d-flex col-1 p-0">
                        <Button
                          variant="primary"
                          className="m-auto"
                          onClick={() => props.removeGuar(guarantor, i, values)}
                        >
                          -
                        </Button>
                      </div>
                    )}
                  </Row>
                )
              })}
              <Button onClick={() => props.addGuar()}>+</Button>
            </Col>
          </div>
          <div style={{ width: '100%', margin: '20px 0' }}>
            <h5>{local.viceCustomersInfo}</h5>
            <FieldArray
              name="viceCustomers"
              render={(arrayHelpers) => (
                <div>
                  {values.viceCustomers.length > 0 &&
                    values.viceCustomers.map((customer, index) => (
                      <div key={index}>
                        <Form.Group as={Row} controlId="name">
                          <Form.Label column sm={4}>
                            {local.name}
                          </Form.Label>
                          <Col sm={6}>
                            <Form.Control
                              type="text"
                              name={`viceCustomers[${index}].name`}
                              data-qc="name"
                              value={values.viceCustomers[index].name}
                              onBlur={handleBlur}
                              onChange={handleChange}
                            />
                            {errors.viceCustomers &&
                              errors.viceCustomers[index] &&
                              errors.viceCustomers[index].name && (
                                <Form.Control.Feedback
                                  type="invalid"
                                  style={{ display: 'block' }}
                                >
                                  {errors.viceCustomers[index].name}
                                </Form.Control.Feedback>
                              )}
                          </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="phoneNumber">
                          <Form.Label column sm={4}>
                            {local.phoneNumber}
                          </Form.Label>
                          <Col sm={6}>
                            <Form.Control
                              type="text"
                              name={`viceCustomers.${index}.phoneNumber`}
                              data-qc="phoneNumber"
                              value={values.viceCustomers[index].phoneNumber}
                              onBlur={handleBlur}
                              onChange={handleChange}
                            />
                            {errors.viceCustomers &&
                              errors.viceCustomers[index] &&
                              errors.viceCustomers[index].phoneNumber && (
                                <Form.Control.Feedback
                                  type="invalid"
                                  style={{ display: 'block' }}
                                >
                                  {errors.viceCustomers[index].phoneNumber}
                                </Form.Control.Feedback>
                              )}
                          </Col>
                        </Form.Group>
                        {index !== 0 && (
                          <Button
                            type="button"
                            className="mb-2"
                            onClick={() => arrayHelpers.remove(index)}
                          >
                            {' '}
                            -{' '}
                          </Button>
                        )}
                      </div>
                    ))}
                  {values.viceCustomers.length < 3 &&
                    (values.state === 'edit' ||
                      values.state === 'under_review') && (
                      <Button
                        type="button"
                        onClick={() =>
                          arrayHelpers.push({ name: '', phoneNumber: '' })
                        }
                      >
                        +
                      </Button>
                    )}
                </div>
              )}
            />
          </div>
        </fieldset>
        <div className="d-flex justify-content-between py-4">
          <Button
            className="btn-cancel-prev w-25"
            onClick={() => {
              props.step('backward')
            }}
          >
            {local.previous}
          </Button>
          {(values.state === 'edit' || values.state === 'under_review') && (
            <Button
              variant="primary"
              type="button"
              className="w-25"
              onClick={handleSubmit}
            >
              {values.state === 'under_review' ? local.submit : local.edit}
            </Button>
          )}
        </div>
      </Form>
    </>
  )
}
