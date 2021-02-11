import React from 'react';
import { Branch } from '../../../Shared/Services/interfaces';
import local from '../../../Shared/Assets/ar.json';
import { getRenderDate } from '../../Services/getRenderDate';
import DynamicTable from '../../../Shared/Components/DynamicTable/dynamicTable';
import { getStatus } from './customerCard';
import { shareInGroup } from '../pdfTemplates/customerCard/customerCard';
import { timeToArabicDate } from '../../../Shared/Services/utils';
import { dateShift, shiftDaysBackAvoidingWeeekend, twoWeekGroupShift } from '../pdfTemplates/followUpStatment/followUpStatement';
import { IndividualWithInstallments } from './loanProfile';

interface FollowUpStatementProps {
    application: any;
    branch?: Branch;
    print: Function;
    members: IndividualWithInstallments[];
}

export const FollowUpStatementView = ({ application, branch, print, members }: FollowUpStatementProps) => {
    const mappers = [
        {
            title: local.installmentNumber,
            key: "id",
            render: data => data.id
        },
        {
            title: local.dateOfPayment,
            key: "dateOfPayment",
            render: data => timeToArabicDate(application.product.beneficiaryType !== "individual" ? (application.product.periodLength === 1 && application.product.periodType === 'months') ? dateShift(application.creationDate, data.id - 1) : (application.product.periodLength === 14 && application.product.periodType === 'days') ? twoWeekGroupShift(data.dateOfPayment) : (data.dateOfPayment - (5 * 24 * 60 * 60 * 1000))
                : (application.product.periodLength === 1 && application.product.periodType === 'months') ? dateShift(application.creationDate, data.id - 1) : shiftDaysBackAvoidingWeeekend(data.dateOfPayment - 3 * (5 * 24 * 60 * 60 * 1000)), false)
        },
        {
            title: local.installmentResponse,
            key: "installmentResponse",
            render: data => data.installmentResponse
        }
    ]
    const membersMappers = [
        {
            title: local.customerId,
            key: "key",
            render: data => data.customer.key
        },
        {
            title: local.customerName,
            key: "customerName",
            render: data => data.customer.customerName
        },
        {
            title: local.individualLoanPrinciple,
            key: "amount",
            render: data => data.amount
        },
        {
            title: local.installmentType,
            key: "amount",
            render: data => shareInGroup(members, data.customer._id)
        },
        {
            title: local.businessActivity,
            key: "businessActivity",
            render: data => data.customer.businessSector + "-" + data.customer.businessActivity + "-" + data.customer.businessSpeciality
        },
        {
            title: local.area,
            key: "area",
            render: data => data.customer.district
        }
    ]
    return (
        <div style={{ textAlign: 'right' }}>
            <div style={{ margin: '10px 0px' }}>
                <span style={{ cursor: 'pointer', float: 'left', background: '#E5E5E5', padding: 10, borderRadius: 15 }}
                    onClick={() => print()}> <span className="fa fa-download" style={{ margin: "0px 0px 0px 5px" }}></span> {local.downloadPDF}</span>
                <DynamicTable totalCount={0} pagination={false} data={application.installmentsObject.installments} mappers={mappers} />
            </div>
            {application.product.beneficiaryType !== "individual" ?
                <DynamicTable totalCount={0} pagination={false} data={application.group.individualsInGroup} mappers={membersMappers} />
                : null}
        </div>
    )
}