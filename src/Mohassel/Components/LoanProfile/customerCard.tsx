import React from 'react';
import DynamicTable from '../DynamicTable/dynamicTable';
import * as local from '../../../Shared/Assets/ar.json';
import { getRenderDate } from '../../Services/getRenderDate';
import { CustomerLoanDetailsBoxView } from '../LoanProfile/applicationsDetails';
interface Props {
    application: any;
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
                  title: local.installmentResponse,
                  key: "installmentResponse",
                  render: data => data.installmentResponse
                },
                {
                  title: local.dateOfPayment,
                  key: "dateOfPayment",
                  render: data => getRenderDate(data.dateOfPayment)
                },
                {
                  title: local.installmentStatus,
                  key: "loanStatus",
                  render: data => getStatus(data)
                },
              ]
    return (
        <div style={{textAlign:'right'}}>
            <CustomerLoanDetailsBoxView application={props.application} />
            <DynamicTable totalCount={0} pagination={false} data={props.application.installmentsObject.installments} mappers={mappers} />
        </div>
    )
}