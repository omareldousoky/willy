import React from 'react'
import {
  EarlyPaymentsResponse,
  EarlyPaymentsSingleResponse,
} from '../../../Models/LaundryReports'
import Orientation from '../../Common/orientation'
import '../Operations/customersArrears/customersArrears.scss'
import { Header } from '../pdfTemplateCommon/header'
import DataRow from '../pdfTemplateCommon/dataRow'

interface EarlyPaymentsProps {
  toDate: string
  fromDate: string
  data: EarlyPaymentsResponse
  is4Months?: boolean
}

export const EarlyPayments = ({
  data,
  toDate,
  fromDate,
  is4Months,
}: EarlyPaymentsProps) => {
  const { response } = data
  return (
    <>
      <Orientation size="landscape" />
      <div className="customers-arrears">
        <Header
          toDate={toDate}
          fromDate={fromDate}
          title={`تقرير السداد المعجل ${is4Months ? ' خلال ٤ أشهر' : ''}`}
        />
        <hr className="horizontal-line" />
        <table
          className="customers-arrears-table"
          cellPadding="2"
          cellSpacing="2"
        >
          <thead>
            <tr>
              <th rowSpan={2}>م</th>
              <th rowSpan={2}>الفرع</th>
              <th rowSpan={2}>
                كود المجموعة
                <br /> (كود العميل)
              </th>
              <th rowSpan={2}>
                اسم المجموعة
                <br /> (اسم العميل)
              </th>
              <th rowSpan={2}>
                كود العضوة
                <br /> (كود العميل)
              </th>
              <th rowSpan={2}>
                اسم العضوة
                <br /> (اسم العميل)
              </th>
              <th rowSpan={2}>مبلغ القرض</th>
              <th rowSpan={2}>المدة</th>
              <th rowSpan={2}>تاريخ القرض</th>
              <th rowSpan={2}>نشاط العميل</th>
              <th rowSpan={2}>قيمة التكييش</th>
              <th rowSpan={2}>تاريخ التكييش</th>
              <th rowSpan={2}>
                عدد أقساط التي
                <br /> تم تكييشها
              </th>
              <th rowSpan={2}>اسم القائم بالتكييش</th>
            </tr>
          </thead>
          <tbody>
            {response.length &&
              response.map((row: EarlyPaymentsSingleResponse) => {
                return (
                  <tr key={row.index ?? Math.random().toString(36).substr(7)}>
                    <DataRow value={row.index} type="number" />
                    <DataRow value={row.branch} type="string" />
                    <DataRow
                      value={row.groupCode}
                      type="number"
                      placeholderType="string"
                    />
                    <DataRow value={row.groupName} type="string" />
                    <DataRow
                      value={row.customerCode}
                      type="number"
                      placeholderType="string"
                    />
                    <DataRow value={row.customerName} type="string" />
                    <DataRow value={row.amount} type="money" />
                    <DataRow
                      value={row.duration}
                      type="number"
                      placeholderType="string"
                    />
                    <DataRow value={row.loanDate} type="date" />
                    <DataRow value={row.customerActivity} type="string" />
                    <DataRow value={row.cashoutAmount} type="number" />
                    <DataRow value={row.cashoutDate} type="date" />
                    <DataRow value={row.cashedoutInstallments} type="number" />
                    <DataRow value={row.cashingoutCustomerName} type="string" />
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>
    </>
  )
}
