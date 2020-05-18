import React from 'react';
import DynamicTable from '../DynamicTable/dynamicTable';
import * as local from '../../../Shared/Assets/ar.json';
import { getRenderDate } from '../../Services/getRenderDate';
import { CustomerLoanDetailsBoxView } from '../LoanProfile/applicationsDetails';
interface Props {
    application: any;
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
                  title: local.loanStatus,
                  key: "loanStatus",
                  render: data => data.status
                },
              ]
    return (
        <div style={{textAlign:'right'}}>
            <CustomerLoanDetailsBoxView application={props.application} />
            <DynamicTable totalCount={0} pagination={false} data={props.application.installmentsObject.installments} mappers={mappers} />
        </div>
    )
}