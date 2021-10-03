import React from 'react'
import { LeakedCustomersReportResponse } from '../../../../Models/operationsReports'
import { timeToArabicDate } from '../../../../Services/utils'

import './leakedCustomers.scss'

type Props = {
  data: LeakedCustomersReportResponse
  fromDate: string
  toDate: string
}

const LeakedCustomersPDF = ({ data, fromDate, toDate }: Props) => {
  const from = new Date(fromDate).valueOf()
  const to = new Date(toDate).valueOf()
  return (
    <div className="leaked-customers">
      {data.response?.map((branchCustomers, index) => {
        return (
          <table key={index}>
            <thead>
              <tr>
                <th colSpan={4} className="noborder">
                  شركة تساهيل للتمويل متناهي الصغر
                </th>
                <th colSpan={9} className="noborder">
                  العملاء المتسربون عن الفتره من {timeToArabicDate(from, false)}
                  الي {timeToArabicDate(to, false)}
                </th>
                <th colSpan={2} className="noborder">
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
