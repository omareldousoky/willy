import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { Field, FieldArray } from 'formik';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import * as local from '../../../Shared/Assets/ar.json';
import CustomerSearch from '../CustomerSearch/customerSearchTable';

export const LoanApplicationCreationGuarantorForm = (props: any) => {
    const { values, handleSubmit, handleBlur, handleChange, errors, touched, setFieldValue, setValues } = props;
    return (
        <>
            <Form style={{ textAlign: 'right', width: '100%' }} onSubmit={handleSubmit}>
                <fieldset disabled={!(values.state === "edit" || values.state === "under_review")}>
                    <div style={{ width: '100%', margin: '20px 0' }}>
                        <h5>{local.guarantorInfo}</h5>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                            {values.guarantors.map((guarantor, i) =>
                                <CustomerSearch
                                    source={i + 1}
                                    key={i}
                                    style={{ width: '48%' }}
                                    handleSearch={(query) => props.handleSearch(query, i)}
                                    searchResults={guarantor.searchResults}
                                    selectCustomer={(guarantor) => { props.selectGuarantor(guarantor, i, values) }}
                                    selectedCustomer={guarantor.guarantor}
                                    removeCustomer={(guarantor) => { props.removeGuarantor(guarantor, i, values) }}
                                />
                            )}
                            {/* <Button onClick={()=>props.addGuar()}>+</Button> */}
                        </div>
                    </div>
                    <div style={{ width: '100%', margin: '20px 0' }}>
                        <h5>{local.viceCustomersInfo}</h5>
                        <FieldArray
                            name="viceCustomers"
                            render={arrayHelpers => (
                                <div>
                                    {values.viceCustomers.length > 0 && values.viceCustomers.map((customer, index) => (
                                        <div key={index}>
                                            {/* <Field name={`viceCustomers[${index}].name`} /> */}
                                            <Form.Group as={Row} controlId="name">
                                                <Form.Label column sm={4}>{local.name}</Form.Label>
                                                <Col sm={6}>
                                                    <Form.Control
                                                        type="text"
                                                        name={`viceCustomers[${index}].name`}
                                                        data-qc="name"
                                                        value={values.viceCustomers[index].name}
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                    />
                                                    {errors.viceCustomers && errors.viceCustomers[index] && errors.viceCustomers[index].name && <Form.Control.Feedback type="invalid" style={{ display: 'block' }}>
                                                        {errors.viceCustomers[index].name}
                                                    </Form.Control.Feedback>}
                                                </Col>
                                            </Form.Group>
                                            <Form.Group as={Row} controlId="phoneNumber">
                                                <Form.Label column sm={4}>{local.phoneNumber}</Form.Label>
                                                <Col sm={6}>
                                                    <Form.Control
                                                        type="text"
                                                        name={`viceCustomers.${index}.phoneNumber`}
                                                        data-qc="phoneNumber"
                                                        value={values.viceCustomers[index].phoneNumber}
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                    />
                                                    {errors.viceCustomers && errors.viceCustomers[index] && errors.viceCustomers[index].phoneNumber && <Form.Control.Feedback type="invalid" style={{ display: 'block' }}>
                                                        {errors.viceCustomers[index].phoneNumber}
                                                    </Form.Control.Feedback>}
                                                </Col>
                                            </Form.Group>
                                            {index !== 0 && <button type="button" onClick={() => arrayHelpers.remove(index)}> - </button>}
                                        </div>
                                    ))}
                                    {values.viceCustomers.length < 3 && (values.state === 'edit' || values.state === 'under_review') && <button
                                        type="button"
                                        onClick={() => arrayHelpers.push({ name: '', phoneNumber: '' })}>+</button>}
                                </div>
                            )}
                        />
                    </div>
                </fieldset>
                <div className="d-flex" style={{ justifyContent: 'space-evenly', margin: '10px 0px' }}>
                    <Button type='button' className='btn-cancel-prev' style={{ width: '20%' }} onClick={() => { props.step('backward') }}>{local.previous}</Button>
                    {(values.state === 'edit' || values.state === 'under_review') && <Button type="button" className='btn-submit-next' style={{ float: 'left', width: '20%' }} onClick={handleSubmit}>{(values.state === 'under_review') ? local.submit : local.edit}</Button>}
                </div>
            </Form >
            {/* {!(values.state === 'edit' || values.state === 'under_review') && <div style={{ margin: '20px 0', border: '1px solid black', padding: 10, borderRadius: 4 }}>
                <StatusHelper status={values.state} id={values.id} handleStatusChange={(values, status) => { props.handleStatusChange(values, status) }} application={values} />
            </div>} */}
        </>
    )
}