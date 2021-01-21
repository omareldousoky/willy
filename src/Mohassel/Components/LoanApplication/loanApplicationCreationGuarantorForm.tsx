import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { Field, FieldArray } from 'formik';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import * as local from '../../../Shared/Assets/ar.json';
import CustomerSearch from '../CustomerSearch/customerSearchTable';
import InfoBox from '../userInfoBox';
import GroupInfoBox from '../LoanProfile/groupInfoBox';

export const LoanApplicationCreationGuarantorForm = (props: any) => {
    const { values, handleSubmit, handleBlur, handleChange, errors, touched, setFieldValue, setValues } = props;
    return (
        <>
            <Form style={{ textAlign: 'right', width: '90%', padding: 20 }} onSubmit={handleSubmit}>
                <fieldset disabled={!(values.state === "edit" || values.state === "under_review")}>
                {props.customer && Object.keys(props.customer).includes('_id') ? <InfoBox values={props.customer} /> :
                    <GroupInfoBox group={{individualsInGroup: values.individualDetails}} />
                }
                    <div style={{ width: '100%', margin: '20px 0' }}>
                        <h5>{local.guarantorInfo}</h5>
                        <Col style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                            {values.guarantors.map((guarantor, i) => {
                                return (
                                    <Row key={i} style={{ width: '100%' }}>
                                        <CustomerSearch
                                            source={i + 1}
                                            key={i}
                                            style={{ width: '98%' }}
                                            handleSearch={(key, query) => props.handleSearch(key, query, i)}
                                            searchResults={guarantor.searchResults}
                                            selectCustomer={(guarantor) => { props.selectGuarantor(guarantor, i, values) }}
                                            selectedCustomer={guarantor.guarantor}
                                            removeCustomer={(guarantor) => { props.removeGuarantor(guarantor, i, values) }}
                                        />
                                        {(i > values.noOfGuarantors - 1) && <span style={{ width: '2%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => props.removeGuar(guarantor, i, values)}>-</span>}
                                    </Row>
                                )
                            }
                            )}
                            <Button onClick={() => props.addGuar()}>+</Button>
                        </Col>
                    </div>
                    <div style={{ width: '100%', margin: '20px 0' }}>
                        <h5>{local.viceCustomersInfo}</h5>
                        <FieldArray
                            name="viceCustomers"
                            render={arrayHelpers => (
                                <div>
                                    {values.viceCustomers.length > 0 && values.viceCustomers.map((customer, index) => (
                                        <div key={index}>
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
                                            {index !== 0 && <Button type="button" className="mb-2" onClick={() => arrayHelpers.remove(index)}> - </Button>}
                                        </div>
                                    ))}
                                    {values.viceCustomers.length < 3 && (values.state === 'edit' || values.state === 'under_review') && <Button
                                        type="button"
                                        onClick={() => arrayHelpers.push({ name: '', phoneNumber: '' })}>+</Button>}
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
        </>
    )
}