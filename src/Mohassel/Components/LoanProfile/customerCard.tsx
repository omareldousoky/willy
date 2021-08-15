import React from 'react'

import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

import DynamicTable from '../../../Shared/Components/DynamicTable/dynamicTable'
import * as local from '../../../Shared/Assets/ar.json'
import { CustomerLoanDetailsBoxView } from './applicationsDetails'
import { numbersToArabic, getRenderDate } from '../../../Shared/Services/utils'

interface Props {
  application: any
  penalty?: number
  print: () => void
  getGeoArea?: Function
  rescheduled: boolean
}
export function getStatus(data) {
  // const todaysDate = new Date("2020-06-30").valueOf();
  const todaysDate = new Date().valueOf()
  switch (data.status) {
    case 'unpaid':
      if (data.dateOfPayment < todaysDate)
        return <div className="status-chip late">{local.late}</div>
      return <div className="status-chip unpaid">{local.unpaid}</div>
    case 'pending':
      return <div className="status-chip pending">{local.pending}</div>
    case 'rescheduled':
      return (
        <div
          className="status-chip rescheduled"
          style={
            data.earlyPaymentReschedule
              ? { flexDirection: 'column', minHeight: 50 }
              : {}
          }
        >
          <span>{local.rescheduled}</span>
          {data.earlyPaymentReschedule ? (
            <span> ({local.earlyPayment})</span>
          ) : null}
        </div>
      )
    case 'partiallyPaid':
      return (
        <div className="status-chip partially-paid">{local.partiallyPaid}</div>
      )
    case 'cancelled':
      return <div className="status-chip cancelled">{local.cancelled}</div>
    case 'paid':
      return <div className="status-chip paid">{local.paid}</div>
    default:
      return null
  }
}
export const CustomerCardView = (props: Props) => {
  const renderPaidAt = (data) => {
    if (data.paidAt) {
      return <div style={{ width: '100px' }}>{getRenderDate(data.paidAt)}</div>
    }
    return ''
  }
  const mappers = [
    {
      title: local.installmentNumber,
      key: 'id',
      render: (data) => data.id,
    },
    {
      title: local.dateOfPayment,
      key: 'dateOfPayment',
      render: (data) => getRenderDate(data.dateOfPayment),
    },
    {
      title: local.installmentResponse,
      key: 'installmentResponse',
      render: (data) => data.installmentResponse,
    },
    {
      title: local.principalInstallment,
      key: 'principalInstallment',
      render: (data) => data.principalInstallment,
    },
    {
      title: local.feesInstallment,
      key: 'feesInstallment',
      render: (data) => data.feesInstallment,
    },
    {
      title: local.principalPaid,
      key: 'principalPaid',
      render: (data) => data.principalPaid,
    },
    {
      title: local.feesPaid,
      key: 'feesPaid',
      render: (data) => data.feesPaid,
    },
    {
      title: local.installmentStatus,
      key: 'loanStatus',
      render: (data) => getStatus(data),
    },
    {
      title: local.statusDate,
      key: 'paidAt',
      render: (data) => renderPaidAt(data),
    },
  ]
  return (
    <div style={{ textAlign: 'right' }}>
      <Button
        variant="primary"
        disabled={props.rescheduled}
        style={{ float: 'left' }}
        onClick={() => props.print()}
      >
        <span
          className="fa fa-download"
          style={{ margin: '0px 0px 0px 5px' }}
        />
        {local.downloadPDF}
      </Button>
      <CustomerLoanDetailsBoxView
        application={props.application}
        getGeoArea={(area) => props.getGeoArea && props.getGeoArea(area)}
      />
      {props.penalty && (
        <div>
          <h6>{local.penalties}</h6>
          <Form style={{ margin: '20px 0' }}>
            <Form.Row className="col">
              <Form.Group as={Col} md="3" className="d-flex flex-column">
                <Form.Label style={{ color: '#6e6e6e' }}>
                  غرامات مسددة
                </Form.Label>
                <Form.Label>
                  {numbersToArabic(props.application.penaltiesPaid)}
                </Form.Label>
              </Form.Group>
              <Form.Group as={Col} md="3" className="d-flex flex-column">
                <Form.Label style={{ color: '#6e6e6e' }}>
                  غرامات مطلوبة
                </Form.Label>
                <Form.Label>{numbersToArabic(props.penalty)}</Form.Label>
              </Form.Group>
              <Form.Group as={Col} md="3" className="d-flex flex-column">
                <Form.Label style={{ color: '#6e6e6e' }}>
                  غرامات معفاة
                </Form.Label>
                <Form.Label>
                  {numbersToArabic(props.application.penaltiesCanceled)}
                </Form.Label>
              </Form.Group>
            </Form.Row>
          </Form>
        </div>
      )}
      <DynamicTable
        totalCount={0}
        pagination={false}
        data={props.application.installmentsObject.installments}
        mappers={mappers}
      />
    </div>
  )
}
