import React, { Component } from 'react';
import { Formik } from 'formik';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { Loader } from '../../../Shared/Components/Loader';
import { loanCreationValidation, loanIssuanceValidation } from './loanCreationValidation';
import { createLoan } from '../../Services/APIs/createIssueLoan/createLoan';
import { issueLoan } from '../../Services/APIs/createIssueLoan/issueLoan';
import * as local from '../../../Shared/Assets/ar.json';

interface State {
  loanCreationDate: string;
  loanIssuanceDate: string;
  customerData: CustomerData;
  id: string;
  type: string;
  loading: boolean;
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
      id: '',
      type: '',
      loanCreationDate: '',
      loanIssuanceDate: '',
      loading: false,
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
    const { id, type } = JSON.parse(this.props.location.state);
    this.setState({ id, type })
    const loanApplicationId = this.props.location.state;
  }
  handleSubmit = async (values) => {
    this.setState({ loading: true })
    if (this.state.type === "create") {
      const creationDate = new Date(values.loanCreationDate).valueOf()
      const res = await createLoan(this.state.id, creationDate);
      if (res.status === "success") {
        console.log(res)
      } else {

      }
    } else {
      const res = await issueLoan(this.state.id, new Date(values.loanIssuanceDate).valueOf());
      if (res.status === "success") {
        console.log(res)
      } else {

      }
    }
  }
  render() {
    return (
      <Container>
        <Loader type="fullscreen" open={this.state.loading} />
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
          validationSchema={this.state.type === "create" ? loanCreationValidation : loanIssuanceValidation}
          validateOnBlur
          validateOnChange
        >{(formikProps) =>
          <>
            <Form onSubmit={formikProps.handleSubmit}>
              {this.state.type === "create" ?
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
                      isInvalid={Boolean(formikProps.errors.loanCreationDate) && Boolean(formikProps.touched.loanCreationDate)}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formikProps.errors.loanCreationDate}
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>
                :
                <Form.Group as={Row} controlId="loanIssuanceDate">
                  <Form.Label style={{ textAlign: 'right' }} column sm={2}>{`${local.loanIssuanceDate}*`}</Form.Label>
                  <Col sm={6}>
                    <Form.Control
                      type="date"
                      name="loanIssuanceDate"
                      data-qc="loanIssuanceDate"
                      value={formikProps.values.loanIssuanceDate}
                      onChange={formikProps.handleChange}
                      onBlur={formikProps.handleBlur}
                      isInvalid={Boolean(formikProps.errors.loanIssuanceDate) && Boolean(formikProps.touched.loanIssuanceDate)}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formikProps.errors.loanIssuanceDate}
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>
              }
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