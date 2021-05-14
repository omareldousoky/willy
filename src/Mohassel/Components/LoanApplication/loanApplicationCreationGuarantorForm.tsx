import React from 'react'
import { FieldArray } from 'formik'
import { Button, Col, Form, Row } from 'react-bootstrap'
import * as local from '../../../Shared/Assets/ar.json'
import CustomerSearch from '../CustomerSearch/customerSearchTable'
import GroupInfoBox from '../LoanProfile/groupInfoBox'
import { guarantorOrderLocal, orderLocal } from '../../../Shared/Services/utils'
import { InfoBox } from '../../../Shared/Components'
import {
  getCompanyInfo,
  getCustomerInfo,
} from '../../../Shared/Services/formatCustomersInfo'

export const LoanApplicationCreationGuarantorForm = (props: any) => {
  const { values, handleSubmit, handleBlur, handleChange, errors } = props
  const companyCheck = props.customer.customerType === 'company'
  return (
    <>
      <Form style={{ width: '90%', padding: 20 }} onSubmit={handleSubmit}>
        <fieldset
          disabled={
            !(values.state === 'edit' || values.state === 'under_review')
          }
        >
          {props.customer && Object.keys(props.customer).includes('_id') ? (
            <InfoBox
              info={
                props.customer.customerType === 'company'
                  ? [getCompanyInfo({ company: props.customer })]
                  : [getCustomerInfo({ customerDetails: props.customer })]
              }
            />
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
                    {i > values.noOfGuarantors - 1 && (
                      <div className="d-flex col-1 p-0">
                        <Button
                          variant="danger"
                          className="m-auto"
                          onClick={() => props.removeGuar(guarantor, i, values)}
                        >
                          -
                        </Button>
                      </div>
                    )}
                    <CustomerSearch
                      source={text}
                      key={i}
                      className="col-11 p-0"
                      handleSearch={(key, query) =>
                        props.handleSearch(
                          key,
                          query,
                          i,
                          guarantor.isCompany ?? false
                        )
                      }
                      searchResults={guarantor.searchResults}
                      selectCustomer={(item) => {
                        props.selectGuarantor(item, i, values)
                      }}
                      selectedCustomer={guarantor.guarantor}
                      removeCustomer={(item) => {
                        props.removeGuarantor(item, i, values)
                      }}
                      header={text}
                      sme={guarantor.isCompany}
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
              <Button onClick={() => props.addGuar()}>
                +{companyCheck && ' ' + local.individual}
              </Button>
              {companyCheck && (
                <Button
                  className="ml-5"
                  onClick={() => props.addGuar('company')}
                >
                  + {local.company}
                </Button>
              )}
            </Col>
          </div>
          {companyCheck ? (
            <div style={{ width: '100%', margin: '20px 0' }}>
              <h5>{local.SMEviceCustomersInfo}</h5>
              <Col
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}
              >
                {values.entitledToSign.map((customer, i) => {
                  const text = orderLocal[i && i > 10 ? 'default' : i]
                  return (
                    <Row key={i} className="col-12 text-nowrap">
                      {i > values.noOfGuarantors - 1 && (
                        <div className="d-flex col-1 p-0">
                          <Button
                            variant="danger"
                            className="m-auto"
                            onClick={() =>
                              props.removeEntitledToSignRow(customer, i, values)
                            }
                          >
                            -
                          </Button>
                        </div>
                      )}
                      <CustomerSearch
                        source={text}
                        key={i}
                        className="col-11 p-0"
                        handleSearch={(key, query) =>
                          props.handleSearchEntitledToSign(key, query, i)
                        }
                        searchResults={customer.searchResults}
                        selectCustomer={(cust) => {
                          props.selectEntitledToSign(cust, i, values)
                        }}
                        selectedCustomer={customer.entitledToSign}
                        removeCustomer={(cust) => {
                          props.removeEntitledToSign(cust, i, values)
                        }}
                        header={text}
                      />
                    </Row>
                  )
                })}
                <Button onClick={() => props.addEntitledToSignRow()}>+</Button>
                {errors.entitledToSignIds && (
                  <Form.Control.Feedback
                    type="invalid"
                    style={{ display: 'block' }}
                  >
                    {errors.entitledToSignIds}
                  </Form.Control.Feedback>
                )}
              </Col>
            </div>
          ) : (
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
                              -
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
          )}
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
