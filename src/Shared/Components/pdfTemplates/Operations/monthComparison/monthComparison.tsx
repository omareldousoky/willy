import React from 'react'
import { numbersToArabic } from '../../../../Services/utils'
import Orientation from '../../../Common/orientation'
import './monthComparison.scss'
import { MonthComparisonReportResponse } from '../../../../Models/operationsReports'
import { Header } from '../../pdfTemplateCommon/header'

interface PaidArrearsProps {
  fromDate: string
  toDate: string
  data: MonthComparisonReportResponse
  isCF?: boolean
}

const MonthComparison = ({
  toDate,
  fromDate,
  data,
  isCF,
}: PaidArrearsProps) => {
  return (
    <>
      <Orientation size="landscape" />
      <div className="month-comparison" lang="ar">
        <Header
          title=" مقارنه تقرير ملخص الاقساط المستحقه (تقرير السداد الجزئي) بالشهرالسابق"
          fromDate={fromDate}
          toDate={toDate}
          showCurrentUser
          showCurrentTime
          cf={isCF}
        />
        <table>
          <thead>
            <tr>
              <th />
              <th colSpan={5}>الفترة الأولى</th>
              <th colSpan={5}>الفترة الثانية</th>
              <th colSpan={5}>الفروق</th>
            </tr>
            <tr>
              <th />
              <th colSpan={2}>المستحق</th>
              <th colSpan={2}>المسدد</th>
              <th />
              <th colSpan={2}>المستحق</th>
              <th colSpan={2}>المسدد</th>
              <th />
              <th colSpan={2}>المستحق</th>
              <th colSpan={2}>المسدد</th>
              <th />
            </tr>
            <tr>
              <th>الفرع</th>
              <th>عدد الاقساط</th>
              <th>قيمة</th>
              <th>عدد الاقساط</th>
              <th>قيمة</th>
              <th>%</th>
              <th>عدد الاقساط</th>
              <th>قيمة</th>
              <th>عدد الاقساط</th>
              <th>قيمة</th>
              <th>%</th>
              <th>عدد الاقساط</th>
              <th>قيمة</th>
              <th>عدد الاقساط</th>
              <th>قيمة</th>
              <th>%</th>
            </tr>
          </thead>
          <tbody>
            {data.response &&
              data.response.length &&
              data.response.map((row, index) => (
                <tr key={index}>
                  <td>{row.branchName}</td>
                  <td>{numbersToArabic(row.currentDueLoanCount) || '٠'}</td>
                  <td>{numbersToArabic(row.currentDueLoanAmount) || '٠'}</td>
                  <td>{numbersToArabic(row.currentPaidLoanCount) || '٠'}</td>
                  <td>{numbersToArabic(row.currentPaidLoanAmount) || '٠'}</td>
                  <td>
                    {numbersToArabic(row.currentPaymentPercentage) || '٠'}
                  </td>
                  <td>{numbersToArabic(row.previousDueLoanCount) || '٠'}</td>
                  <td>{numbersToArabic(row.previousDueLoanAmount) || '٠'}</td>
                  <td>{numbersToArabic(row.previousPaidLoanCount) || '٠'}</td>
                  <td>{numbersToArabic(row.previousPaidLoanAmount) || '٠'}</td>
                  <td>
                    {numbersToArabic(row.previousPaymentPercentage) || '٠'}
                  </td>
                  <td>{numbersToArabic(row.diffDueLoanCount) || '٠'}</td>
                  <td>{numbersToArabic(row.diffDueLoanAmount) || '٠'}</td>
                  <td>{numbersToArabic(row.diffPaidLoanCount) || '٠'}</td>
                  <td>{numbersToArabic(row.diffPaidLoanAmount) || '٠'}</td>
                  <td>{numbersToArabic(row.diffPaymentPercentage) || '٠'}</td>
                </tr>
              ))}
            <tr className="bg-grey">
              <td>الإجمالي</td>
              <td>{numbersToArabic(data.currentDueLoanCount) || '٠'}</td>
              <td>{numbersToArabic(data.currentDueLoanAmount) || '٠'}</td>
              <td>{numbersToArabic(data.currentPaidLoanCount) || '٠'}</td>
              <td>{numbersToArabic(data.currentPaidLoanAmount) || '٠'}</td>
              <td>{numbersToArabic(data.currentPaymentPercentage) || '٠'}</td>
              <td>{numbersToArabic(data.previousDueLoanCount) || '٠'}</td>
              <td>{numbersToArabic(data.previousDueLoanAmount) || '٠'}</td>
              <td>{numbersToArabic(data.previousPaidLoanCount) || '٠'}</td>
              <td>{numbersToArabic(data.previousPaidLoanAmount) || '٠'}</td>
              <td>{numbersToArabic(data.previousPaymentPercentage) || '٠'}</td>
              <td>{numbersToArabic(data.diffDueLoanCount) || '٠'}</td>
              <td>{numbersToArabic(data.diffDueLoanAmount) || '٠'}</td>
              <td>{numbersToArabic(data.diffPaidLoanCount) || '٠'}</td>
              <td>{numbersToArabic(data.diffPaidLoanAmount) || '٠'}</td>
              <td>{numbersToArabic(data.diffPaymentPercentage) || '٠'}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}

export default MonthComparison
