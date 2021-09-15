import React from 'react'
import Table from 'react-bootstrap/Table'

import local from '../../../Assets/ar.json'
import { Header } from '../pdfTemplateCommon/header'
import { numbersToArabic, timeToArabicDate } from '../../../Services/utils'

interface RaseedyTransactionsModel {
  customerCode: string
  customerKey: string
  customerName: string
  installmentNumber: string
  nationalId: string
  transactionAmount: string
}

const RaseedyTransactionsReport = ({
  data,
  isCF,
}: {
  data: { result: RaseedyTransactionsModel[]; transactionAmountSum: number }
  isCF?: boolean
}) => {
  const tableColumns = [
    {
      key: 'customerKey',
      label: local.customerCode,
    },
    {
      key: 'customerName',
      label: local.customerName,
    },
    {
      key: 'nationalId',
      label: local.nationalId,
    },
    {
      key: 'installmentNumber',
      label: local.installmentNumber,
      type: 'number',
    },
    {
      key: 'transactionAmount',
      label: local.transactionAmount,
      type: 'number',
    },
    {
      key: 'branchName',
      label: local.branchName,
    },
    {
      key: 'branchCode',
      label: local.branchCode,
    },
    {
      key: 'officerName',
      label: 'اسم الاخصائي',
    },
    {
      key: 'customerPhone',
      label: 'رقم تليفون القائم بالسداد',
    },
    {
      key: 'transactionDate',
      label: 'تاريخ سداد القسط (الحركة)',
      type: 'date',
    },
  ]

  return (
    <>
      <Header
        title=""
        showCurrentUser={false}
        showCurrentTime={false}
        cf={isCF}
      />

      <Table striped bordered>
        <thead>
          <tr>
            {tableColumns.map((item, index) => (
              <th key={index} className="text-left">
                {item.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.result.map((transaction, i) => (
            <tr key={i}>
              {tableColumns.map((item, j) => (
                <td key={j}>
                  {item.type === 'number'
                    ? numbersToArabic(transaction[item.key])
                    : item.type === 'date'
                    ? timeToArabicDate(Number(transaction[item.key]), true)
                    : transaction[item.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="mt-4">
        <span className="font-weight-bold h4">{local.transactionsSum}: </span>
        <span className="h4">{numbersToArabic(data.transactionAmountSum)}</span>
      </div>
    </>
  )
}

export default RaseedyTransactionsReport
