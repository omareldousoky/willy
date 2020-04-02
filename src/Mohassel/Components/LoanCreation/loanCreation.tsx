import React, { Component } from 'react';
import { Formik } from 'formik';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import * as local from '../../../Shared/Assets/ar.json';

interface State {
  loanCreationDate: string;
  issuingBank: string;
  safePaymentDocuments: string;
  customerData: CustomerData;
}
interface CustomerData {
  customerType: string;
  loanApplicationId: string;
  customerName: string;
  loanAppCreationDate: string;
  loanStatus: string;
  productName: string;
  loanPrinciple: string;
  loanOfficer: string;
}
interface Location {
  pathname: string;
  search: string;
  hash: string;
  state: string;
  key: string;
}
interface Props {
  history: Array<string>;
  location: Location;
};
class LoanCreation extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      loanCreationDate: '',
      issuingBank: '',
      safePaymentDocuments: '',
      customerData: {
        customerType: '',
        loanApplicationId: '',
        customerName: '',
        loanAppCreationDate: '',
        loanStatus: '',
        productName: '',
        loanPrinciple: '',
        loanOfficer: '',
      }
    }
  }
  componentDidMount() {
    const loanApplicationId = this.props.location.state;
  }
  handleSubmit = (values: object) => {
    console.log(values)
  }
  render() {
    return (
      <Container>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>{local.loanApplicationId}</th>
              <th>{local.customerName}</th>
              <th>{local.customerType}</th>
              <th>{local.loanAppCreationDate}</th>
              <th>{local.loanStatus}</th>
              <th>{local.productName}</th>
              <th>{local.loanPrinciple}</th>
              <th>{local.loanOfficer}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{this.state.customerData.customerType}</td>
              <td>{this.state.customerData.loanApplicationId}</td>
              <td>{this.state.customerData.customerName}</td>
              <td>{this.state.customerData.loanAppCreationDate}</td>
              <td>{this.state.customerData.loanStatus}</td>
              <td>{this.state.customerData.productName}</td>
              <td>{this.state.customerData.loanPrinciple}</td>
              <td>{this.state.customerData.loanOfficer}</td>
            </tr>
          </tbody>
        </Table>
        <Formik
          initialValues={this.state}
          onSubmit={this.handleSubmit}
          // validationSchema={customerCreationValidationStepOne}
          validateOnBlur
          validateOnChange
        >{(formikProps) =>
          <>
            <Form>
              <Form.Group as={Row} controlId="loanCreationDate">
                <Form.Label style={{ textAlign: 'right' }} column sm={2}>{`${local.loanCreationDate}*`}</Form.Label>
                <Col sm={6}>
                  <Form.Control
                    type="date"
                    name="loanCreationDate"
                    data-qc="loanCreationDate"
                    value={formikProps.values.loanCreationDate}
                    onChange={formikProps.handleChange}
                    onBlur={formikProps.handleBlur}
                  // isInvalid={formikProps.errors.loanCreationDate && formikProps.touched.loanCreationDate}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formikProps.errors.loanCreationDate}
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="issuingBank">
                <Form.Label style={{ textAlign: 'right' }} column sm={2}>{`${local.issuingBank}*`}</Form.Label>
                <Col sm={6}>
                  <Form.Control as="select"
                    type="select"
                    name="issuingBank"
                    data-qc="issuingBank"
                    value={formikProps.values.issuingBank}
                    onBlur={formikProps.handleBlur}
                    onChange={formikProps.handleChange}
                  // isInvalid={formikProps.errors.issuingBank && formikProps.touched.issuingBank}
                  >
                    <option value="" disabled></option>
                    <option value="bank1">Bank1</option>
                    <option value="bank2">Bank2</option>
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {formikProps.errors.issuingBank}
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="safePaymentDocuments">
                <Form.Label style={{ textAlign: 'right' }} column sm={2}>{`${local.safePaymentDocuments}*`}</Form.Label>
                <Col sm={6}>
                  <Form.Control as="select"
                    type="select"
                    name="safePaymentDocuments"
                    data-qc="safePaymentDocuments"
                    value={formikProps.values.safePaymentDocuments}
                    onBlur={formikProps.handleBlur}
                    onChange={formikProps.handleChange}
                  // isInvalid={formikProps.errors.safePaymentDocuments && formikProps.touched.safePaymentDocuments}
                  >
                    <option value="" disabled></option>
                    <option value="safe1">Safe1</option>
                    <option value="safe2">Safe2</option>
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {formikProps.errors.safePaymentDocuments}
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>
              <Button type="submit">Submit</Button>
            </Form>
          </>
          }
        </Formik>
      </Container>
    )
  }
}

export default LoanCreation;