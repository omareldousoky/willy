import React from 'react'
import { PaidArrearsResponse } from '../../../../Models/operationsReports'
import store from '../../../../redux/store'
import {
  getCurrentTime,
  timeToArabicDate,
  numbersToArabic,
} from '../../../../Services/utils'

import './paidArrears.scss'

interface PaidArrearsProps {
  fromDate: string
  toDate: string
  data: PaidArrearsResponse
}

const PaidArrears = ({ toDate, fromDate, data }: PaidArrearsProps) => {
  return (
    <div className="paid-arrears" lang="ar">
      <div className="header-wrapper">
        <span className="logo-print" role="img" />
        <p className="m-0">
          ترخيص ممارسه نشاط التمويل متناهي الصغر رقم (2) لسنه 2015
        </p>
      </div>
      <div className="header-wrapper mb-0">
        <p style={{ marginRight: '10px' }}>شركة تساهيل للتمويل متناهي الصغر</p>
        <p>{store.getState().auth.name}</p>
        <p>{getCurrentTime()}</p>
      </div>
      <div className="d-flex flex-column mx-3">
        <p className="report-title">
          تقرير ما تم تحصيله من المتأخرات : من &nbsp;
          {timeToArabicDate(new Date(fromDate).valueOf(), false)} إلى : &nbsp;
          {timeToArabicDate(new Date(toDate).valueOf(), false)}
        </p>
        <hr className="horizontal-line" />
      </div>
      <table>
        <thead>
          <tr>
            <th>غرامة مسددة</th>
            <th>أيام التأخير للقسط</th>
            <th>قيمة الحركة</th>
            <th>ت حركة السداد</th>
            <th>قيمة القسط</th>
            <th>ت الاستحقاق</th>
            <th>رقم القسط</th>
            <th>اسم العميل</th>
            <th>كود العميل</th>
            <th>كود الحركة</th>
            <th>المندوب</th>
            <th>الفرع</th>
            <th>كود الفرع</th>
          </tr>
        </thead>
        <tbody>
          {data.response &&
            data.response.length &&
            data.response.map((row) => (
              <tr key={row.transactionCode}>
                <td>{numbersToArabic(row.paidPenalties) || '٠'}</td>
                <td>{numbersToArabic(row.lateDays) || '٠'}</td>
                <td>{numbersToArabic(row.transactionAmount) || '٠'}</td>
                <td>
                  {row.paymentDate
                    ? timeToArabicDate(
                        new Date(row.paymentDate).valueOf(),
                        false
                      )
                    : 'لا يوجد'}
                </td>
                <td>{numbersToArabic(row.installmentAmount) || '٠'}</td>
                <td>
                  {row.dueDate
                    ? timeToArabicDate(new Date(row.dueDate).valueOf(), false)
                    : 'لا يوجد'}
                </td>
                <td>{numbersToArabic(row.installmentNumber) || '٠'}</td>
                <td>{row.customerName}</td>
                <td>{numbersToArabic(row.customerCode)}</td>
                <td>{numbersToArabic(row.transactionCode)}</td>
                <td>{row.representative}</td>
                <td>{row.branchName}</td>
                <td>{numbersToArabic(row.branchCode)}</td>
              </tr>
            ))}
          <tr>
            <td>{numbersToArabic(data.totalPaidPenalties) || '٠'}</td>
            <td />
            <td>{numbersToArabic(data.totalTransactionAmount) || '٠'}</td>
            <td />
            <td />
            <td />
            <td />
            <td />
            <td />
            <td />
            <td />
            <td />
            <td>الإجمالي</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default PaidArrears
