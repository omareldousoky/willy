import React from 'react'
import {
  beneficiaryType,
  groupBy,
  numbersToArabic,
  timeToArabicDate,
} from '../../../../Services/utils'
import Orientation from '../../../Common/orientation'
import './customersArrears.scss'
import {
  CustomersArrearsResponse,
  CustomersArrearsSingleResponse,
} from '../../../../Models/operationsReports'
import { Header } from '../../pdfTemplateCommon/header'

interface CustomersArrearsProps {
  date: string
  data: CustomersArrearsResponse
  isCF?: boolean
}
const CustomersArrears = ({ data, date, isCF }: CustomersArrearsProps) => {
  const { response } = data
  const dataGroupedByBranch: Map<string, Record<string, string>[]> = groupBy(
    response as Record<string, unknown>[],
    (row) => row.branchName
  )
  const dataGroupList = Array.from(dataGroupedByBranch.keys())
  return (
    <>
      <Orientation size="landscape" />
      <div className="customers-arrears">
        <Header
          title="متأخرات المندوب لم يستحق أو مسدد جزئي"
          toDate={date}
          showCurrentUser
          showCurrentTime
          cf={isCF}
        />
        {dataGroupList && dataGroupList.length && (
          <table
            className="customers-arrears-table"
            cellPadding="2"
            cellSpacing="2"
          >
            {dataGroupList.map((key, i) => {
              const rows = dataGroupedByBranch.get(key) || []
              const isLastItem = i + 1 === dataGroupList.length
              return (
                <React.Fragment key={`${key}-{i}`}>
                  <thead>
                    <tr>
                      <th colSpan={100}>
                        {key} (كود الفرع:
                        {numbersToArabic(rows[0].branchCode)})
                      </th>
                    </tr>
                    <tr>
                      <th colSpan={2}>تاريخ آخر حركة سداد</th>
                      <th />
                      <th colSpan={2}>الرصيد</th>
                      <th />
                      <th />
                      <th />
                      <th />
                      <th colSpan={3}>المتأخرات</th>
                      <th />
                      <th />
                      <th />
                      <th colSpan={6}>بيانات العميل</th>
                    </tr>
                    <tr>
                      <th colSpan={2}>القسط مسدد بالكامل</th>
                      <th>مرات الترحيل</th>
                      <th>مبلغ</th>
                      <th>عدد</th>
                      <th>قيمة القسط</th>
                      <th>أيام التأخير</th>
                      <th>أخر سداد</th>
                      <th>أكبر تأخير</th>
                      <th>بداية التأخير</th>
                      <th>مبلغ</th>
                      <th>عدد</th>
                      <th>عدد أقساط</th>
                      <th>قيمة التمويل</th>
                      <th>ت التمويل</th>
                      <th colSpan={2}>المندوب</th>
                      <th colSpan={2}>اسم العميل</th>
                      <th>نوع العميل</th>
                      <th>كود العميل</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.length &&
                      rows.map((row: CustomersArrearsSingleResponse, j) => {
                        const isLastRow = isLastItem && j + 1 === rows.length
                        return (
                          <>
                            <tr key={`${row.customerCode}-${j}`}>
                              <td colSpan={2}>
                                {row.latestFullPaymentDate
                                  ? timeToArabicDate(
                                      new Date(
                                        row.latestFullPaymentDate
                                      ).valueOf(),
                                      false
                                    )
                                  : 'لا يوجد'}
                              </td>
                              <td>
                                {numbersToArabic(row.tarheelatCount) || '۰'}
                              </td>
                              <td>
                                {numbersToArabic(row.raseedAmount) || '۰'}
                              </td>
                              <td>{numbersToArabic(row.raseedCount) || '۰'}</td>
                              <td>
                                {numbersToArabic(row.installmentAmount) || '۰'}
                              </td>
                              <td>{numbersToArabic(row.lateDays) || '۰'}</td>
                              <td>
                                {row.latestPaymentDate
                                  ? timeToArabicDate(
                                      new Date(row.latestPaymentDate).valueOf(),
                                      false
                                    )
                                  : 'لا يوجد'}
                              </td>
                              <td>
                                {numbersToArabic(row.longestLatePeriod) || '۰'}
                              </td>
                              <td>
                                {row.firstLateDate
                                  ? timeToArabicDate(
                                      new Date(row.firstLateDate).valueOf(),
                                      false
                                    )
                                  : 'لا يوجد'}
                              </td>
                              <td>{numbersToArabic(row.lateAmount) || '۰'}</td>
                              <td>{numbersToArabic(row.lateCount) || '۰'}</td>
                              <td>
                                {numbersToArabic(row.installmentsCount) || '۰'}
                              </td>
                              <td>
                                {numbersToArabic(row.loanPrincipal) || '۰'}
                              </td>
                              <td>
                                {row.issueDate
                                  ? timeToArabicDate(
                                      new Date(row.issueDate).valueOf(),
                                      false
                                    )
                                  : ''}
                              </td>
                              <td colSpan={2}>{row.representativeName}</td>
                              <td colSpan={2}>{row.customerName}</td>
                              <td>
                                {beneficiaryType(row.beneficiaryType || '')}
                              </td>
                              <td>
                                {numbersToArabic(row.customerCode) || '۰'}
                              </td>
                            </tr>
                            {isLastRow && (
                              <tr className="baby-blue">
                                <td colSpan={2} />
                                <td />
                                <td>
                                  {numbersToArabic(data.raseedTotalAmount) ||
                                    '۰'}
                                </td>
                                <td>
                                  {numbersToArabic(data.raseedTotalCount) ||
                                    '۰'}
                                </td>
                                <td />
                                <td />
                                <td />
                                <td />
                                <td />
                                <td>
                                  {numbersToArabic(data.lateTotalAmount) || '۰'}
                                </td>
                                <td>
                                  {numbersToArabic(data.lateTotalCount) || '۰'}
                                </td>
                                <td />
                                <td />
                                <td />
                                <td colSpan={2} />
                                <td colSpan={2} />
                                <td>
                                  {numbersToArabic(data.totalCount) || '۰'}
                                </td>
                                <td />
                              </tr>
                            )}
                          </>
                        )
                      })}
                  </tbody>
                </React.Fragment>
              )
            })}
          </table>
        )}
      </div>
    </>
  )
}

export default CustomersArrears
