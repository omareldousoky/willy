import React from 'react'
import './paymentsDone.scss'
import {
  timeToArabicDate,
  getInstallmentStatus,
  timeToArabicDateNow,
} from '../../../../Services/utils'
import * as local from '../../../../Assets/ar.json'
import Orientation from '../../../Common/orientation'
import { Header } from '../../pdfTemplateCommon/header'

export const PaymentsDone = ({
  isCF = false,
  data: { financialLeasing, to, from, days },
}) => {
  return (
    <>
      <Orientation size="portrait" />
      <div className="payments-done" lang="ar">
        <Header
          cf={isCF}
          fl={financialLeasing}
          title="قائمة حركات السداد المنفذه"
          fromDate={from}
          toDate={to}
        />
        <table className="report-container">
          <thead className="report-header">
            <tr className="headtitle">
              <th colSpan={4}>المركز الرئيسي</th>
            </tr>
            <tr className="headtitle">
              <th colSpan={4}>{timeToArabicDateNow(true)}</th>
              <th colSpan={6}>جنيه مصري</th>
            </tr>
            <tr>
              <th colSpan={100} className="horizontal-line" />
            </tr>
            <tr>
              <th>رقم مسلسل</th>
              <th>كود الحركه</th>
              <th>مسلسل القسط</th>
              <th colSpan={2.5}>أسم العميل</th>
              <th colSpan={1.5}>قيمة القسط</th>
              <th colSpan={2}>تاريخ الإستحقاق</th>
              <th colSpan={1.5}>حالة القسط</th>
              <th>أصل</th>
              <th>تكلفه التمويل المسدده</th>
              <th>إجمالي</th>
              <th colSpan={1.5}>حالة الحركة</th>
              <th>نوع القرض</th>
            </tr>
            <tr>
              <th colSpan={100} className="horizontal-line" />
            </tr>
          </thead>

          {days.map((day, x) => (
            <React.Fragment key={x}>
              <tbody>
                <tr>
                  <th className="gray frame" colSpan={2}>
                    تاريخ الحركه
                  </th>
                  <th className="gray frame" colSpan={2}>
                    {timeToArabicDate(new Date(day.day).valueOf(), false)}
                  </th>
                </tr>
              </tbody>
              {day.branches.map((branch, i) => (
                <tbody key={i}>
                  <tr>
                    <th className="gray frame" colSpan={2}>
                      بنك / خرينه
                    </th>
                    <th className="gray frame" colSpan={2}>
                      {branch.branchName}
                    </th>
                  </tr>
                  {branch.rows.map((transaction, z) => (
                    <tr key={z}>
                      <td>{z + 1}</td>
                      <td>{transaction.transactionCode}</td>
                      <td>{transaction.installmentSerial}</td>
                      <td colSpan={2.5}>{transaction.customerName}</td>
                      <td colSpan={1.5}>{transaction.totalInstallment}</td>
                      <td colSpan={2}>
                        {timeToArabicDate(
                          new Date(transaction.dateOfPayment).valueOf(),
                          false
                        )}
                      </td>
                      <td colSpan={1.5}>
                        {getInstallmentStatus(transaction.instStatus)}
                      </td>
                      <td>{transaction.transactionPrincipal}</td>
                      <td>{transaction.transactionInterest}</td>
                      <td>{transaction.transactionAmount}</td>
                      <td colSpan={1.5}>
                        {transaction.canceled === '1'
                          ? local.cancelledTransaction
                          : null}
                      </td>
                      <td>{transaction?.loanType || ''}</td>
                    </tr>
                  ))}
                  <tr>
                    <th colSpan={100} className="horizontal-line" />
                  </tr>
                  <tr>
                    <td className="frame" colSpan={2}>
                      إجمالي فرع
                    </td>
                    <td className="frame" colSpan={2}>
                      {branch.branchName}
                    </td>
                    <td className="frame" colSpan={1}>
                      {timeToArabicDate(new Date(day.day).valueOf(), false)}
                    </td>
                    <td className="frame">{branch.numTrx}</td>
                    <td />
                    <td />
                    <td className="frame">إجمالي المبلغ</td>
                    <td className="frame">{branch.totalPrincipal}</td>
                    <td className="frame">{branch.totalFees}</td>
                    <td className="frame">{branch.totalPaid}</td>
                  </tr>

                  <tr>
                    <td colSpan={8} />
                    <td className="frame">القيمة الملغاه</td>
                    <td className="frame">{branch.branchRbPrincipal}</td>
                    <td className="frame">{branch.branchRbFees}</td>
                    <td className="frame">{branch.branchRbTotal}</td>
                  </tr>
                  <tr>
                    <td colSpan={8} />
                    <td className="frame">صافي المبلغ</td>
                    <td className="frame">{branch.branchNetTotal}</td>
                    <td className="frame">{branch.branchNetFees}</td>
                    <td className="frame">{branch.branchNetTotal}</td>
                  </tr>
                  <tr>
                    <th colSpan={100} className="horizontal-line" />
                  </tr>
                </tbody>
              ))}

              {/* <tr style={{ height: "1em" }}></tr> */}

              <tbody className="tbodyborder">
                <tr>
                  <td className="gray frame" colSpan={2}>
                    إجمالي تاريخ الحركه
                  </td>
                  <td className="gray frame">
                    {timeToArabicDate(new Date(day.day).valueOf(), false)}
                  </td>
                  <td className="frame" colSpan={2}>
                    إجمالي عدد الحركات
                  </td>
                  <td className="frame">{day.numTrx}</td>
                  <td />
                  <td />
                  <td className="frame">إجمالي المبلغ</td>
                  <td className="frame">{day.totalPrincipal}</td>
                  <td className="frame">{day.totalFees}</td>
                  <td className="frame">{day.totalPaid}</td>
                </tr>

                <tr>
                  <td colSpan={8} />
                  <td className="frame">القيمة الملغاه</td>
                  <td className="frame">{day.dayRbPrincipal}</td>
                  <td className="frame">{day.dayRbFees}</td>
                  <td className="frame">{day.dayRbTotal}</td>
                </tr>
                <tr>
                  <td colSpan={8} />
                  <td className="frame">صافي المبلغ</td>
                  <td className="frame">{day.dayNetPrincipal}</td>
                  <td className="frame">{day.dayNetFees}</td>
                  <td className="frame">{day.dayNetTotal}</td>
                </tr>
              </tbody>
            </React.Fragment>
          ))}

          {/* <tr style={{ height: "1em" }}></tr> */}

          {/* <tbody className="tbodyborder">
                    <tr>
                        <td className="gray frame" colSpan={2}>إجمالي بالعمله</td>
                        <td className="gray frame">جنيه مصري</td>
                        <td className="frame" colSpan={2}>إجمالي عدد الحركات</td>
                        <td className="frame">162</td>
                        <td></td>
                        <td></td>
                        <td className="frame">إجمالي المبلغ</td>
                        <td className="frame">22840.00</td>
                        <td className="frame">9393.00</td>
                        <td className="frame">32233.00</td>
                    </tr>

                    <tr>
                        <td colSpan={8}></td>
                        <td className="frame">القيمة الملغاه</td>
                        <td className="frame">0.00</td>
                        <td className="frame">0.00</td>
                        <td className="frame">0.00</td>
                    </tr>
                    <tr>
                        <td colSpan={8}></td>
                        <td className="frame">صافي المبلغ</td>
                        <td className="frame">22840.00</td>
                        <td className="frame">9393.00</td>
                        <td className="frame">32233.00</td>
                    </tr>
                </tbody> */}
        </table>
      </div>
    </>
  )
}
