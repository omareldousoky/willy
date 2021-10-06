import React from 'react'
import { LeakedCustomersReportResponse } from '../../../../Models/operationsReports'
import { Header } from '../../pdfTemplateCommon/header'

import './leakedCustomers.scss'

type Props = {
  data: LeakedCustomersReportResponse
  fromDate: string
  toDate: string
  isCF?: boolean
}

const LeakedCustomersPDF = ({ data, fromDate, toDate, isCF }: Props) => {
  const from = new Date(fromDate).valueOf()
  const to = new Date(toDate).valueOf()
  return (
    <div className="leaked-customers">
      <Header
        title="لعملاء المتسربون عن الفتره"
        fromDate={from}
        toDate={to}
        cf={isCF}
      />
      {data.response?.map((branchCustomers, index) => {
        return (
          <table key={index}>
            <thead>
              <tr>
                <th className="font-weight-bold ml-auto pr-2">
                  فرع: {branchCustomers.branchName}
                </th>
              </tr>
              <tr>
                <th>م</th>
                <th>كود العميل</th>
                <th>اسم العميل</th>
                <th>النوع</th>
                <th colSpan={2}>ارقام التليفون</th>
                <th>المندوب</th>
                <th>أخر تمويل</th>
                <th>أخر سداد</th>
                <th>أخر تمويل</th>
                <th>اقساط</th>
                <th>تأخير</th>
                <th>غرامات مسدده</th>
                <th>تبكير</th>
                <th>منطقة العمل</th>
              </tr>
            </thead>
            <tbody>
              {branchCustomers.data.map((customer, customerIndex) => {
                return (
                  <tr key={customerIndex}>
                    <td>{customerIndex + 1}</td>
                    <td>{customer.customerCode}</td>
                    <td>{customer.customerName}</td>
                    <td>{customer.beneficiaryType}</td>
                    <td>{customer.mobilePhoneNumber}</td>
                    <td>{customer.homePhoneNumber}</td>
                    <td>{customer.representative}</td>
                    <td>{customer.latestIssueDate}</td>
                    <td>{customer.latestPaymentDate}</td>
                    <td>{customer.latestIssuedPrincipal}</td>
                    <td>{customer.installmentsCount}</td>
                    <td>{customer.lateDays}</td>
                    <td>{customer.paidPenalties}</td>
                    <td>{customer.earlyDays}</td>
                    <td>{customer.workArea}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )
      })}
    </div>
  )
}

export default LeakedCustomersPDF
