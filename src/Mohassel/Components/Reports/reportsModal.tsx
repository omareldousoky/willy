import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { Formik } from 'formik';
import { reportsModalValidation } from './reportsModalValidation';
import { PDF } from './reports';
import { BranchesDropDown } from '../dropDowns/allDropDowns';
import * as local from '../../../Shared/Assets/ar.json';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';

interface Props {
  pdf: PDF;
  show: boolean;
  hideModal: () => void;
}

const ReportsModal = (props: Props) => {
  function handleSubmit(values) {
    console.log(values)
  }
  return (
    <Modal size='lg' show={props.show} onHide={() => { props.hideModal() }}>
      <Formik
        initialValues={{ fromDate: '', toDate: '', branches: [], code: '' }}
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
                            {console.log(formikProps.errors.toDate, formikProps.touched.toDate)}

                          </div>
                          <Form.Control.Feedback type="invalid">
                            {formikProps.errors.toDate}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    )
                  }
                  if (input === 'branches') {
                    return (
                      <Col key={index} sm={12} style={{ marginTop: 20 }}>
                        <BranchesDropDown multiselect={true} onSelectBranch={(branch) => { formikProps.setFieldValue('branches', branch) }} />
                        <span style={{ color: 'red' }}>
                          {formikProps.values.branches.length > 0 ? local.required : null}
                        </span>
                      </Col>
                    )
                  }
                  if (input === 'customerCode') {
                    return (
                      <Col sm={12} key={index} style={{ marginTop: 20 }}>
                        <Form.Group controlId="code">
                          <div className="dropdown-container">
                            <p className="dropdown-label">{local.code}</p>
                            <Form.Control
                              className="dropdown-select"
                              name="code"
                              data-qc="code"
                              value={formikProps.values.code}
                              isInvalid={Boolean(formikProps.errors.code && formikProps.touched.code)}
                              onChange={formikProps.handleChange} />
                          </div>
                          <span style={{ color: 'red' }}>
                            {Boolean(formikProps.errors.code && formikProps.touched.code) ? formikProps.errors.code : ''}
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
              <Button type="submit" variant="primary">{local.submit}</Button>
            </Modal.Footer>
          </Form>
        }
      </Formik>
    </Modal>
  );
}

export default ReportsModal;