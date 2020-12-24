import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { Formik } from 'formik';
import { reportsModalValidation } from './reportsModalValidation';
import { PDF } from './reports';
import { BranchesDropDown } from '../dropDowns/allDropDowns';
import * as local from '../../../Shared/Assets/ar.json';
import { Branch } from '../../../Shared/Services/interfaces';

interface InitialFormikState {
  fromDate?: string;
  toDate?: string;
  branches: Array<Branch>;
  key?: string;
}

interface Props {
  pdf: PDF;
  show: boolean;
  hideModal: () => void;
  submit: (values) => void;
  getExcel?: (values) => void;
}

const ReportsModal = (props: Props) => {
  function handleSubmit(values) {
    props.submit(values);
  }
  function getInitialValues() {
    const initValues: InitialFormikState = {branches: []}
    props.pdf.inputs?.forEach(input => {
      switch(input) {
        case 'dateFromTo': initValues.fromDate = ''; initValues.toDate = '';
        case 'branches': initValues.branches = [];
        case 'customerKey': initValues.key = ''
      }
    })
    return initValues;
  }
  return (
    <Modal size='lg' show={props.show} onHide={() => { props.hideModal() }}>
      <Formik
        initialValues={getInitialValues()}
        onSubmit={handleSubmit}
        validationSchema={reportsModalValidation}
        validateOnBlur
        validateOnChange
      >
        {(formikProps) =>
          <Form onSubmit={formikProps.handleSubmit}>
            <Modal.Header>
              <Modal.Title>{props.pdf.local}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                {props.pdf.inputs?.map((input, index) => {
                  if (input === 'dateFromTo') {
                    return (
                      <Col sm={12} key={index}>
                        <Form.Group controlId="fromToDate">
                          <div className="dropdown-container" style={{ flex: 1, alignItems: 'center' }}>
                            <p className="dropdown-label" style={{ alignSelf: 'normal', marginLeft: 20, width: 300, textAlign: 'center' }}>{local.date}</p>
                            <span>{local.from}</span>
                            <Form.Control
                              style={{ marginLeft: 20, border: 'none' }}
                              type="date"
                              name="fromDate"
                              data-qc="fromDate"
                              value={formikProps.values.fromDate}
                              isInvalid={Boolean(formikProps.errors.fromDate && formikProps.touched.fromDate)}
                              onChange={(e) => {
                                formikProps.setFieldValue("fromDate", e.currentTarget.value);
                                if (e.currentTarget.value === "") formikProps.setFieldValue("toDate", "")
                              }}
                            >
                            </Form.Control>
                            <span>{local.to}</span>
                            <Form.Control
                              style={{ marginRight: 20, border: 'none' }}
                              type="date"
                              name="toDate"
                              data-qc="toDate"
                              value={formikProps.values.toDate}
                              min={formikProps.values.fromDate}
                              onChange={formikProps.handleChange}
                              isInvalid={Boolean(formikProps.errors.toDate && formikProps.touched.toDate)}
                              disabled={!Boolean(formikProps.values.fromDate)}
                            >
                            </Form.Control>

                          </div>
                          <span style={{ color: 'red' }}>
                          {formikProps.errors.toDate}
                        </span>
                        </Form.Group>
                      </Col>
                    )
                  }
                  if (input === 'branches') {
                    return (
                      <Col key={index} sm={12} style={{ marginTop: 20 }}>
                        <BranchesDropDown multiselect={true} onSelectBranch={(branches) => {formikProps.setFieldValue('branches', branches) }} />                        
                        <span style={{ color: 'red' }}>
                          {formikProps.errors.branches}
                        </span>
                      </Col>
                    )
                  }
                  if (input === 'customerKey') {
                    return (
                      <Col sm={12} key={index} style={{ marginTop: 20 }}>
                        <Form.Group controlId="key">
                          <div className="dropdown-container">
                            <p className="dropdown-label" style={{width: 150}}>{local.customerCode}</p>
                            <Form.Control
                              className="dropdown-select"
                              name="key"
                              data-qc="key"
                              value={formikProps.values.key}
                              isInvalid={Boolean(formikProps.errors.key && formikProps.touched.key)}
                              onChange={formikProps.handleChange} />
                          </div>
                          <span style={{ color: 'red' }}>
                            {Boolean(formikProps.errors.key && formikProps.touched.key) ? formikProps.errors.key : ''}
                          </span>
                        </Form.Group>
                      </Col>
                    )
                  }
                })}
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => { props.hideModal() }}>{local.cancel}</Button>
              {props.pdf && props.pdf.key && !['customerDetails', 'loanDetails', 'cibPaymentReport'].includes(props.pdf.key) && props.getExcel && <Button variant="primary" onClick={() => { props.getExcel && props.getExcel(formikProps.values) }}>{local.downloadExcel}</Button>}
              <Button type="submit" variant="primary">{local.downloadPDF}</Button>
            </Modal.Footer>
          </Form>
        }
      </Formik>
    </Modal>
  );
}

export default ReportsModal;