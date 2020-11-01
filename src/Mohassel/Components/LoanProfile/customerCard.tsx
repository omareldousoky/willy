import React from 'react';
import DynamicTable from '../DynamicTable/dynamicTable';
import * as local from '../../../Shared/Assets/ar.json';
import { getRenderDate } from '../../Services/getRenderDate';
import { CustomerLoanDetailsBoxView } from '../LoanProfile/applicationsDetails';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { numbersToArabic } from '../../Services/utils';
interface Props {
  application: any;
  penalty?: number;
  print: () => void;
  getGeoArea?: Function;
}
function getStatus(data) {
  // const todaysDate = new Date("2020-06-30").valueOf();
  const todaysDate = new Date().valueOf();
  switch (data.status) {
    case 'unpaid':
      if (data.dateOfPayment < todaysDate)
        return <div className="status-chip late">{local.late}</div>
      else
        return <div className="status-chip unpaid">{local.unpaid}</div>
    case 'pending':
      return <div className="status-chip pending">{local.pending}</div>
    case 'rescheduled':
      return <div className="status-chip rescheduled">{local.rescheduled}</div>
    case 'partiallyPaid':
      return <div className="status-chip partially-paid">{local.partiallyPaid}</div>
    case 'cancelled':
      return <div className="status-chip cancelled">{local.cancelled}</div>
    case 'paid':
      return <div className="status-chip paid">{local.paid}</div>
    default: return null;
  }
}
export const CustomerCardView = (props: Props) => {
  const mappers = [
    {
      title: local.installmentNumber,
      key: "id",
      render: data => data.id
    },
    {
      title: local.dateOfPayment,
      key: "dateOfPayment",
      render: data => getRenderDate(data.dateOfPayment)
    },
    {
      title: local.installmentResponse,
      key: "installmentResponse",
      render: data => data.installmentResponse
    },
    {
      title: local.principalInstallment,
      key: "principalInstallment",
      render: data => data.principalInstallment
    },
    {
      title: local.feesInstallment,
      key: "feesInstallment",
      render: data => data.feesInstallment
    },
    {
      title: local.principalPaid,
      key: "principalPaid",
      render: data => data.principalPaid
    },
    {
      title: local.feesPaid,
      key: "feesPaid",
      render: data => data.feesPaid
    },
    {
      title: local.installmentStatus,
      key: "loanStatus",
      render: data => getStatus(data)
    },
    {
      title: local.statusDate,
      key: "paidAt",
      render: data => data.paidAt ? getRenderDate(data.paidAt) : ''
    },
  ]
  return (
    <div style={{ textAlign: 'right' }}>
      <span style={{ cursor: 'pointer', float: 'left', background: '#E5E5E5', padding: 10, borderRadius: 15 }}
        onClick={() => props.print()}> <span className="fa fa-download" style={{ margin: "0px 0px 0px 5px" }}></span> {local.downloadPDF}</span>
      <CustomerLoanDetailsBoxView application={props.application} getGeoArea={(area) => props.getGeoArea && props.getGeoArea(area)}/>
      {props.penalty && <div>
        <h6>{local.penalties}</h6>
        <Form style={{ margin: '20px 0' }}>
          <Form.Row>
            <Form.Group as={Col} md="3">
              <Row>
                <Form.Label style={{ color: '#6e6e6e' }}>غرامات مسددة</Form.Label>
              </Row>
              <Row>
                <Form.Label>{numbersToArabic(props.application.penaltiesPaid)}</Form.Label>
              </Row>
            </Form.Group>
            <Form.Group as={Col} md="3">
              <Row>
                <Form.Label style={{ color: '#6e6e6e' }}>غرامات مطلوبة</Form.Label>
              </Row>
              <Row>
                <Form.Label>{numbersToArabic(props.penalty)}</Form.Label>
              </Row>
            </Form.Group>
            <Form.Group as={Col} md="3">
              <Row>
                <Form.Label style={{ color: '#6e6e6e' }}>غرامات معفاة</Form.Label>
              </Row>
              <Row>
                <Form.Label>{numbersToArabic(props.application.penaltiesCanceled)}</Form.Label>
              </Row>
            </Form.Group>
          </Form.Row>
        </Form>
      </div>
      }
      <DynamicTable totalCount={0} pagination={false} data={props.application.installmentsObject.installments} mappers={mappers} />
    </div>
  )
}