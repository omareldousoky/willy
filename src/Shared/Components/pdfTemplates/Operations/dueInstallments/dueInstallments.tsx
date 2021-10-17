import React from 'react'
import { DueInstallmentsResponse } from '../../../../Models/operationsReports'
import { numbersToArabic } from '../../../../Services/utils'
import { Header } from '../../pdfTemplateCommon/header'

import './dueInstallments.scss'

interface DueInstallmentsProps {
  fromDate: string
  toDate: string
  data: DueInstallmentsResponse
  isCF?: boolean
}

const DueInstallments = (props: DueInstallmentsProps) => {
  const { fromDate, toDate, data, isCF } = props
  return (
    <div className="due-installments">
      <Header
        title="ملخص الاقساط المستحقة"
        fromDate={fromDate}
        toDate={toDate}
        showCurrentDate
        showCurrentUser
        cf={isCF}
      />
      <table className="body">
        <thead>
          <tr>
            <th colSpan={2} className="border-0 bg-white" />
            <th colSpan={3}>المستحق</th>
            <th colSpan={3}>إجمالى المسدد</th>
            <th className="empty" />
            <th colSpan={2}>المتبقى من المسدد جزئى</th>
            <th colSpan={3}>إجمالى الاقساط الغير مسددة</th>
          </tr>
          <tr>
            <th colSpan={2} className="border-0 bg-white" />
            <th colSpan={2}>عدد العملاء / اقساط</th>
            <th>قيمة</th>
            <th>عدد</th>
            <th>قيمة</th>
            <th>%</th>
            <th className="empty" />
            <th>عدد</th>
            <th>قيمة</th>
            <th colSpan={2}>عدد العملاء / اقساط</th>
            <th>قيمة</th>
          </tr>
        </thead>
        <tbody>
          {data.response ? (
            data.response.map((inst) => {
              return (
                <tr
                  key={inst.branchName || Math.random().toString(36).substr(7)}
                >
                  <td colSpan={2} dir="rtl">
                    {inst.branchName || 'لا يوجد'}
                  </td>
                  <td>{numbersToArabic(inst.mostahakCustomers) || '۰'}</td>
                  <td>{numbersToArabic(inst.mostahakCount) || '۰'}</td>
                  <td>{numbersToArabic(inst.mostahakValue) || '۰'}</td>
                  <td>{numbersToArabic(inst.mosadadCount) || '۰'}</td>
                  <td>{numbersToArabic(inst.mosadadValue) || '۰'}</td>
                  <td>{numbersToArabic(inst.mosadadPercent) || '۰'}</td>
                  <td className="empty" />
                  <td>
                    {numbersToArabic(inst.motabakyMosadadGoz2yCount) || '۰'}
                  </td>
                  <td>
                    {numbersToArabic(inst.motabakyMosadadGoz2yValue) || '۰'}
                  </td>
                  <td>{numbersToArabic(inst.gheerMosadadCustomers) || '۰'}</td>
                  <td>{numbersToArabic(inst.gheerMosadadCount) || '۰'}</td>
                  <td>{numbersToArabic(inst.gheerMosadadValue) || '۰'}</td>
                </tr>
              )
            })
          ) : (
            <tr />
          )}
          <tr />
          <tr>
            <td colSpan={100} className="border-0">
              <hr className="horizontal-line bold m-1" />
            </td>
          </tr>
          <tr>
            <td colSpan={2} className="border-0" dir="rtl">
              : الإجمالى العام
            </td>
            <td colSpan={2} className="bg-grey">
              عدد العملاء / اقساط
            </td>
            <td className="bg-grey">قيمة</td>
            <td className="bg-grey">عدد</td>
            <td className="bg-grey">قيمة</td>
            <td className="bg-grey">%</td>
            <td className="empty bg-grey" />
            <td className="bg-grey">عدد</td>
            <td className="bg-grey">قيمة</td>
            <td colSpan={2} className="bg-grey">
              عدد العملاء / اقساط
            </td>
            <td className="bg-grey">قيمة</td>
          </tr>
          <tr>
            <td colSpan={2} className="border-0" />
            <td colSpan={3} className="bg-grey">
              المستحق
            </td>
            <td colSpan={3} className="bg-grey">
              إجمالى المسدد
            </td>
            <td className="empty" />
            <td colSpan={2} className="bg-grey">
              المتبقى من المسدد جزئى
            </td>
            <td colSpan={3} className="bg-grey">
              إجمالى الاقساط الغير مسددة
            </td>
          </tr>
          <tr>
            <td colSpan={2} className="border-0" />
            <td>{numbersToArabic(data.totalMostahakCustomers) || '۰'}</td>
            <td>{numbersToArabic(data.totalMostahakCount) || '۰'}</td>
            <td>{numbersToArabic(data.totalMostahakValue) || '۰'}</td>
            <td>{numbersToArabic(data.totalMosadadCount) || '۰'}</td>
            <td>{numbersToArabic(data.totalMosadadValue) || '۰'}</td>
            <td>{numbersToArabic(data.totalMosadadPercent) || '۰'}</td>
            <td className="empty" />
            <td>
              {numbersToArabic(data.totalMotabakyMosadadGoz2yCount) || '۰'}
            </td>
            <td>
              {numbersToArabic(data.totalMotabakyMosadadGoz2yValue) || '۰'}
            </td>
            <td>{numbersToArabic(data.totalGheerMosadadCustomers) || '۰'}</td>
            <td>{numbersToArabic(data.totalGheerMosadadCount) || '۰'}</td>
            <td>{numbersToArabic(data.totalGheerMosadadValue) || '۰'}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default DueInstallments
