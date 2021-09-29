import React, { FunctionComponent } from 'react'
import './earlyPayment.scss'
import * as local from '../../../../Assets/ar.json'
import {
  numbersToArabic,
  timeToArabicDateNow,
} from '../../../../Services/utils'
import DataRow from '../../pdfTemplateCommon/dataRow'
import { EarlyPaymentPDFProps } from './types'
import { EarlyPaymentInstallment } from './EarlyPaymentInstallment'
import { companies, licenses } from '../../../../Constants/pdf'

const EarlyPaymentPDF: FunctionComponent<EarlyPaymentPDFProps> = ({
  application,
  earlyPaymentPdfData,
  branchDetails,
  type = 'lts',
}) => {
  const {
    totalDaysLate,
    totalDaysEarly,
    applicationFees,
    installmentsDue,
    remainingInstallments,
    remainingPrincipal,
    earlyPaymentPrincipal,
    remainingInterest,
    remainingTotal,
    earlyPaymentInterest,
    earlyPaymentTotal,
  } = earlyPaymentPdfData

  return (
    <div className="early-payment-print" lang="ar">
      <table className="text-center my-3 mx-0 w-100">
        <tbody>
          <tr style={{ height: '10px' }} />
          <tr className="w-100 d-flex flex-row justify-content-between">
            <th colSpan={6} style={{ backgroundColor: 'white' }}>
              <div
                className={`${type === 'sme' ? 'lts' : type}-logo-print-tb`}
              />
            </th>
            <th style={{ backgroundColor: 'white' }} colSpan={6}>
              {licenses[type]}
            </th>
          </tr>
          <tr style={{ height: '10px' }} />
        </tbody>
      </table>
      <table>
        <tbody>
          <tr>
            <th style={{ width: '35%' }} className="title bold border">
              <th>{companies[type]}</th>
            </th>
            <td />
            <td className="title bold">
              {branchDetails.name} - {branchDetails.governorate}
            </td>
          </tr>
          <tr>
            <td>{timeToArabicDateNow(true)}</td>
            <td className="title2 bold">السداد المعجل</td>
            <td>1/1</td>
          </tr>
        </tbody>
      </table>
      <table className="border">
        <tbody>
          <tr>
            <td>
              العميل
              <div className="frame">
                {numbersToArabic(
                  application?.product?.beneficiaryType === 'individual'
                    ? application?.customer?.key
                    : application?.group?.individualsInGroup.find(
                        (member) => member.type === 'leader'
                      )?.customer.key
                )}
              </div>
              <div className="frame">
                {application?.product?.beneficiaryType === 'individual'
                  ? application?.customer?.customerName
                  : application?.group?.individualsInGroup.find(
                      (member) => member.type === 'leader'
                    )?.customer.customerName}
              </div>
            </td>
            <td>
              التاريخ
              <div className="frame">{timeToArabicDateNow(false)}</div>
            </td>
            <td>
              المندوب
              <div className="frame">
                {application?.product?.beneficiaryType === 'group'
                  ? application?.group?.individualsInGroup.find(
                      (member) => member.type === 'leader'
                    )?.customer.representativeName
                  : application?.customer?.representativeName}
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <table>
        <tbody>
          <tr>
            <td>
              تاريخ الحساب
              <div className="frame">{timeToArabicDateNow(false)}</div>
            </td>
            <td>
              فترة السداد
              <div className="frame">
                {application?.product?.periodType === 'days'
                  ? local.daily
                  : local.inAdvanceFromMonthly}
              </div>
            </td>
            <td>
              عدد الاقساط
              <div className="frame">
                {numbersToArabic(
                  application?.installmentsObject?.installments.length
                )}
              </div>
            </td>
            <td>
              فترة السماح
              <div className="frame">
                {numbersToArabic(application?.product?.gracePeriod)}
              </div>
              <div className="frame">
                {application?.product?.beneficiaryType === 'individual'
                  ? application?.customer?.businessActivity
                  : 'تمويل رأس المال'}
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <table>
        <tbody>
          <tr>
            <td>
              عدد ايام التأخير :
              <span className="frame">{numbersToArabic(totalDaysLate)}</span>
            </td>
            <td>
              غرامات مسددة :
              <span className="frame">
                {numbersToArabic(application?.penaltiesPaid)}
              </span>
            </td>
            <td>
              غرامات معفاة :
              <div className="frame">
                {numbersToArabic(application?.penaltiesCanceled)}
              </div>
            </td>
            <td>
              رسوم تحصيل
              <div className="frame">{numbersToArabic(applicationFees)}</div>
            </td>
          </tr>
        </tbody>
      </table>

      <EarlyPaymentInstallment
        applicationKey={application.applicationKey}
        installmentsObject={application?.installmentsObject}
        installmentsDue={installmentsDue}
        totalDaysEarly={totalDaysEarly}
        totalDaysLate={totalDaysLate}
      />

      <div style={{ border: '1px solid black' }} />

      <table className="tablestyle">
        <tbody>
          <tr>
            <td />
            <th className="border">الاجمالي</th>
            <th className="border">تكلفه التمويل</th>
            <th className="border">الأصل</th>
            <td />
            <td />
            <td />
            <td />
          </tr>
          <tr>
            <th>الرصيد</th>
            <DataRow value={remainingTotal} type="money" className="border" />
            <DataRow
              value={remainingInterest}
              type="money"
              className="border"
            />
            <DataRow
              value={remainingPrincipal}
              type="money"
              className="border"
            />
            <td />
            <td />
            <th className="border">الخصم</th>
            <DataRow
              value={remainingTotal - earlyPaymentTotal}
              type="money"
              className="border"
            />
          </tr>
          <tr>
            <td />
            <th className="border">اقساط يجب سدادها</th>
            <th className="border">الرصيد الأصل</th>
            <th className="border">
              {numbersToArabic(application?.product?.earlyPaymentFees)}% (تكلفه
              تمويل الترحيل)
            </th>
            <th className="border">إجمالي السداد المعجل</th>
            <td />
            <td />
            <td />
          </tr>
          <tr>
            <th>السداد المعجل</th>
            <DataRow
              value={remainingInstallments}
              type="money"
              className="border"
            />
            <DataRow
              value={earlyPaymentPrincipal}
              type="money"
              className="border"
            />
            <DataRow
              value={earlyPaymentInterest}
              type="money"
              className="border"
            />
            <DataRow
              value={earlyPaymentTotal}
              type="money"
              className="border"
            />
            <td />
            <td />
            <td />
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default EarlyPaymentPDF
