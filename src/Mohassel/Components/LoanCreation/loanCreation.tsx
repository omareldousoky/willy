import React, { Component } from 'react';
import { Formik } from 'formik';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Swal from 'sweetalert2';
import { Loader } from '../../../Shared/Components/Loader';
import { loanCreationValidation, loanIssuanceValidation } from './loanCreationValidation';
import { getApplication } from '../../Services/APIs/loanApplication/getApplication';
import { createLoan } from '../../Services/APIs/createIssueLoan/createLoan';
import { issueLoan } from '../../Services/APIs/createIssueLoan/issueLoan';
import { testCalculateApplication } from '../../Services/APIs/createIssueLoan/testCalculateApplication';
import * as local from '../../../Shared/Assets/ar.json';
import { withRouter } from 'react-router-dom';
import { timeToDateyyymmdd, beneficiaryType } from '../../Services/utils';
interface CustomerData {
  id: string;
  customerName: string;
  customerType: string;
  principal: number;
  currency: string;
  noOfInstallments: number;
  gracePeriod: number;
  periodLength: number;
  periodType: string;
  productName: string;
  entryDate: number;
  status: string;
}
interface State {
  loanCreationDate: string;
  loanIssuanceDate: string;
  customerData: CustomerData;
  id: string;
  type: string;
  loading: boolean;
  installmentsData: any;
  approvalDate: string;
  beneficiaryType: string;
  application: any;
}
export interface Location {
  pathname: string;
  search: string;
  hash: string;
  state: any;
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
      approvalDate: '',
      loanCreationDate: timeToDateyyymmdd(0),
      loanIssuanceDate: timeToDateyyymmdd(0),
      loading: false,
      customerData: {
        id: '',
        customerName: '',
        customerType: '',
        principal: 0,
        currency: '',
        noOfInstallments: 0,
        gracePeriod: 0,
        periodLength: 0,
        periodType: '',
        productName: '',
        entryDate: 0,
        status: '',
      },
      beneficiaryType: '',
      installmentsData: {},
      application: {}
    }
  }
  async componentDidMount() {
    const { id, type } = this.props.location.state;
    this.setState({ id, type, loading: true })
    if (type === "create") {
      const res = await testCalculateApplication(id, new Date(this.state.loanCreationDate).valueOf());
      if (res.status === "success") {
        this.setState({ installmentsData: res.body })
      } else console.log(res)
    }
    const res = await getApplication(id);
    if (res.status === "success") {
      this.setState({
        loading: false,
        application: res.body,
        approvalDate: res.body.approvalDate,
        loanCreationDate: res.body.creationDate? res.body.creationDate: this.state.loanCreationDate,
        beneficiaryType: res.body.product.beneficiaryType,
        customerData: {
          id: id,
          customerName: res.body.customer.customerName,
          customerType: '',
          principal: res.body.principal,
          currency: res.body.product.currency,
          noOfInstallments: res.body.product.noOfInstallments,
          gracePeriod: res.body.product.gracePeriod,
          periodLength: res.body.product.periodLength,
          periodType: res.body.product.periodType,
          productName: res.body.product.productName,
          entryDate: res.body.entryDate,
          status: res.body.status,
        }
      })
      if(type === "issue"){
        this.setState({installmentsData: res.body.installmentsObject})
      }
    } else this.setState({ loading: false })
  }
  handleSubmit = async (values) => {
    this.setState({ loading: true })
    if (this.state.type === "create") {
      const creationDate = new Date(values.loanCreationDate).valueOf()
      const res = await createLoan(this.state.id, creationDate);
      if (res.status === "success") {
        this.setState({ loading: false });
        Swal.fire('', local.loanCreationSuccess, 'success').then(() => this.props.history.push('/track-loan-applications'));
      } else {
        this.setState({ loading: false });
        Swal.fire('', local.loanCreationError, 'error');
      }
    } else {
      const res = await issueLoan(this.state.id, new Date(values.loanIssuanceDate).valueOf());
      if (res.status === "success") {
        this.setState({ loading: false });
        Swal.fire('', local.loanIssuanceSuccess, 'success').then(() => this.props.history.push('/track-loan-applications'));
      } else {
        this.setState({ loading: false });
        Swal.fire('', local.loanIssuanceError, 'error');
      }
    }
  }
  getCurrency() {
    switch(this.state.customerData.currency) {
      case 'egp': return local.egp;
      default: return '';
    }
  }
  getPeriod() {
    switch(this.state.customerData.periodType) {
      case 'days': return local.day;
      case 'months': return local.month;
      default: return '';
    }
  }
  getStatus(status: string){
    if(status === "created") return local.created;
    else return local.approved;
  }
  async handleCreationDateChange(creationDate: string) {
    const { id } = this.props.location.state;
    this.setState({ loading: true });
    const res = await testCalculateApplication(id, new Date(creationDate).valueOf());
    if (res.status === "success") {
      this.setState({ installmentsData: res.body, loading: false })
    } else this.setState({ loading: false });
  }
  render() {
    return (
      <Container>
        <Loader type="fullscreen" open={this.state.loading} />
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>{local.customerType}</th>
              <th>{local.customerName}</th>
              <th>{local.principal}</th>
              <th>{local.currency}</th>
              <th>{local.noOfInstallments}</th>
              <th>{local.periodLength}</th>
              <th>{local.every}</th>
              <th>{local.gracePeriod}</th>
              <th>{local.applicationStatus}</th>
              <th>{local.productName}</th>
              <th>{local.loanAppCreationDate}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{beneficiaryType(this.state.beneficiaryType)}</td>
              <td>{this.state.beneficiaryType === 'group' ? this.state.application.group.individualsInGroup.find(customer => customer.type === 'leader')?.customer?.customerName:this.state.customerData.customerName}</td>
              <td>{this.state.customerData.principal}</td>
              <td>{this.getCurrency()}</td>
              <td>{this.state.customerData.noOfInstallments}</td>
              <td>{this.state.customerData.periodLength}</td>
              <td>{this.getPeriod()}</td>
              <td>{this.state.customerData.gracePeriod}</td>
              <td>{this.getStatus(this.state.customerData.status)}</td>
              <td>{this.state.customerData.productName}</td>
              <td>{timeToDateyyymmdd(this.state.customerData.entryDate)}</td>
            </tr>
          </tbody>
        </Table>
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>{local.installmentNumber}</th>
              <th>{local.installmentType}</th>
              <th>{local.principalInstallment}</th>
              <th>{local.fees}</th>
              <th>{local.paymentDate}</th>
            </tr>
          </thead>
          <tbody>
            {this.state.installmentsData.installments && this.state.installmentsData.installments.map((installment, index) => {
              return (
                <tr key={index}>
                  <td>{installment.id}</td>
                  <td>{installment.installmentResponse ? installment.installmentResponse.toFixed(2) : 0}</td>
                  <td>{installment.principalInstallment ? installment.principalInstallment.toFixed(2) : 0}</td>
                  <td>{installment.feesInstallment ? installment.feesInstallment.toFixed(2) : 0}</td>
                  <td>{timeToDateyyymmdd(installment.dateOfPayment)}</td>
                </tr>
              )
            })}
          </tbody>
        </Table>
        <Formik
          enableReinitialize
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
                      onChange={(e)=> {
                        formikProps.setFieldValue('loanCreationDate', e.currentTarget.value);
                        this.handleCreationDateChange(e.currentTarget.value);
                      }}
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
              <Button type="submit">{local.submit}</Button>
            </Form>
          </>
          }
        </Formik>
      </Container>
    )
  }
}

export default  withRouter(LoanCreation);