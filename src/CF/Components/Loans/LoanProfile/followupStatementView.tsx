import React from 'react'
import { Branch } from '../../../../Shared/Services/interfaces'
import local from '../../../../Shared/Assets/ar.json'
import DynamicTable from '../../../../Shared/Components/DynamicTable/dynamicTable'
import { roundTo2 } from '../../../../Mohassel/Components/pdfTemplates/customerCard/customerCard'
import { timeToArabicDate } from '../../../../Shared/Services/utils'
import { IndividualWithInstallments } from './loanProfile'

interface FollowUpStatementProps {
  application: any
  branch?: Branch
  print: Function
  members: IndividualWithInstallments
}

export const FollowUpStatementView = ({
  application,
  print,
  members,
}: FollowUpStatementProps) => {
  const mappers = [
    {
      title: local.installmentNumber,
      key: 'id',
      render: (data) => data.id,
    },
    {
      title: local.dateOfPayment,
      key: 'dateOfPayment',
      render: (data) => timeToArabicDate(data.dateOfPayment, false),
    },
    {
      title: local.installmentResponse,
      key: 'installmentResponse',
      render: (data) => roundTo2(data.installmentResponse),
    },
  ]
  const membersMappers = [
    {
      title: local.customerId,
      key: 'key',
      render: (data) => data.customer.key,
    },
    {
      title: local.customerName,
      key: 'customerName',
      render: (data) => data.customer.customerName,
    },
    {
      title: local.individualLoanPrinciple,
      key: 'amount',
      render: (data) => data.amount,
    },
    {
      title: local.installmentType,
      key: 'amount',
      render: (data) => data.installmentAmount,
    },
    {
      title: local.businessActivity,
      key: 'businessActivity',
      render: (data) =>
        (data.customer.businessSector || '') +
        ' - ' +
        (data.customer.businessActivity || '') +
        ' - ' +
        (data.customer.businessSpeciality || ''),
    },
    {
      title: local.area,
      key: 'area',
      render: (data) => data.customer.district,
    },
  ]
  return (
    <div style={{ textAlign: 'right' }}>
      <div style={{ margin: '10px 0px' }}>
        <span
          style={{
            cursor: 'pointer',
            float: 'left',
            background: '#E5E5E5',
            padding: 10,
            borderRadius: 15,
          }}
          onClick={() => print()}
        >
          <span
            className="fa fa-download"
            style={{ margin: '0px 0px 0px 5px' }}
          />
          {local.downloadPDF}
        </span>
        <DynamicTable
          totalCount={0}
          pagination={false}
          data={members.installmentTable}
          mappers={mappers}
        />
      </div>
      {application.product.beneficiaryType !== 'individual' &&
      members.customerTable ? (
        <DynamicTable
          totalCount={0}
          pagination={false}
          data={members.customerTable}
          mappers={membersMappers}
        />
      ) : null}
    </div>
  )
}
