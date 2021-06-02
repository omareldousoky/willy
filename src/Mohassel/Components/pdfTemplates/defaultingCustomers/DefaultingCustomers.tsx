import React from 'react'

import './style.scss'
import { ReviewedDefaultingCustomer } from '../../ManageLegalAffairs/defaultingCustomersList'
import { timeToArabicDate, timeToDate } from '../../../../Shared/Services/utils'
import local from '../../../../Shared/Assets/ar.json'

interface DefaultingCustomersTempProps {
  customers: ReviewedDefaultingCustomer[]
}

const DefaultingCustomers = ({ customers }: DefaultingCustomersTempProps) => {
  const nowTimestamp = new Date().valueOf()
  const nowDate = timeToArabicDate(nowTimestamp, false)

  const groupByKey = 'branchName'
  const customerGroups = customers.reduce(
    (hash, { [groupByKey]: value, ...rest }) => ({
      ...hash,
      [value]: (hash[value] || []).concat({ ...rest, [groupByKey]: value }),
    }),
    {}
  )

  return (
    <div className="defaulting-customers__container">
      <div className="d-flex justify-content-between align-items-center">
        <p className="headtitle text-center">
          <div className="logo-print mb-3" />
          <span>شركة تساهيل للتمويل متناهي الصغر</span>
          <br />
          <span>تحريرا في: {nowDate}</span>
        </p>
        <p className="headtitle text-center">
          <span>{timeToArabicDate(nowTimestamp, true)}</span>
        </p>
      </div>

      <p className="headtitle text-center">
        <span>
          برجاء التكرم من سيادتكم بالموافقه علي اتخاذ مايلزم من اجراءات قانونيه
          (دعوى قضائيه) ضد كل من:
        </span>
      </p>

      {Object.keys(customerGroups).map((groupKey) => (
        <table key={groupKey} className="report-container mt-3">
          <thead className="report-header">
            <tr>فرع: {groupKey}</tr>
            <tr className="header">
              <th>رقم مسلسل</th>
              <th>كود العميل</th>
              <th colSpan={2}>أسم العميل</th>
              <th>كود التمويل</th>
              <th>تاريخ الدفعه</th>
              <th>مبلغ الإيصال</th>
              <th>أقساط متأخره</th>
              <th colSpan={2}>أقساط غير مسدده</th>
            </tr>
          </thead>

          <tbody>
            {customerGroups[groupKey].map(
              (customer: ReviewedDefaultingCustomer, index: number) => (
                <>
                  <tr>
                    <td>{index + 1}</td>
                    <td>{customer.customerKey}</td>
                    <td>{customer.customerName}</td>
                    <td>{local[customer.customerType]}</td>
                    <td>{customer.loanKey}</td>
                    <td>{timeToDate(+customer.loanIssueDate)}</td>
                    <td>{customer.installmentAmount}</td>
                    <td>{customer.overdueInstallmentCount}</td>
                    <td>{customer.unpaidInstallmentCount}</td>
                    <td>{customer.unpaidInstallmentAmount}</td>
                  </tr>
                  <tr>
                    <td>العنوان</td>
                    <td colSpan={100}>{customer.customerAddress} </td>
                  </tr>
                </>
              )
            )}
          </tbody>
        </table>
      ))}

      <div className="mt-4">
        <p className="headtitle">
          <span>المحامي المسئول الاستاذ: </span>
        </p>
        <p className="headtitle d-flex justify-content-between">
          <span>مدير الفرع</span>
          <span>مشرف المنطقه</span>
          <span>مدير المنطقه</span>
          <span>المدير المالي</span>
        </p>
        <br />
      </div>
    </div>
  )
}

export default DefaultingCustomers
