import React from 'react'
import { Table } from 'react-bootstrap'

import local from '../../../../Shared/Assets/ar.json'
import { numbersToArabic } from '../../../../Shared/Services/utils'
import { Header } from '../pdfTemplateCommon/header'

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
}: {
  data: RaseedyTransactionsModel[]
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
  ]

  return (
    <>
      <Header title="" showCurrentUser={false} showCurrentTime={false} />

      <Table striped bordered className="horizontal-table">
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
          {data.map((transaction, index) => (
            <tr key={index}>
              {tableColumns.map((item, index) => (
                <td key={index}>
                  {item.type === 'number'
                    ? numbersToArabic(transaction[item.key])
                    : transaction[item.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  )
}

export default RaseedyTransactionsReport
