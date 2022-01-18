import React, { FC, CSSProperties } from 'react'
import {
  numbersToArabic,
  timeToArabicDateNow,
  getIndexOfGuarantorInAr,
} from 'Shared/Services/utils'
import * as local from 'Shared/Assets/ar.json'
import './commentsReport.scss'
import { CommentsReportOBJ } from 'Shared/Models/operationsReports'
import Tafgeet from 'tafgeetjs'

interface Props {
  branchName: string
  data: CommentsReportOBJ
  type: string
  subType: string
}

interface CommentsReportTable {
  title: string
  key: string
  style?: CSSProperties
  hide?: boolean
}

const CommentsReport: FC<Props> = (props) => {
  const { data, type, subType } = props

  const subTypeLocal = {
    individual: local.individual,
    group: 'الجماعي',
  }

  const tableArray: CommentsReportTable[] = [
    {
      title: local.code,
      key: 'customerKey',
      style: { minWidth: 120 },
    },
    {
      title: local.customerName,
      key: 'customerName',
    },
    {
      title: 'المشروع',
      key: 'businessActivity',
    },
    {
      title: 'تمويل سابق',
      key: 'previousLoan',
      style: { minWidth: 70 },
    },
    {
      title: 'تمويل حالي',
      key: 'principal',
      style: { minWidth: 70 },
    },
    {
      title: 'المده',
      key: 'noInstallments',
    },
    {
      title: 'سماح',
      key: 'gracePeriod',
    },
    {
      title: 'الرسوم',
      key: 'applicationFees',
    },
    {
      title: local.nationalId,
      key: 'customerNid',
      style: { minWidth: 150 },
      hide: type === 'sme',
    },
    {
      title: 'اسم الاخصائي',
      key: 'representative',
    },
    {
      title: local.branchManager,
      key: 'branchManagerName',
    },
  ]

  const isEntitled = data.entitledToSign ? 'entitledToSign' : 'guarantors'
  const isEntitledKeys = data.entitledToSign
    ? ['entitledToSignKey', 'entitledToSignName', 'entitledToSignNid']
    : ['guarantorKey', 'guarantorName', 'guarantorNid']

  return (
    <div className="comments-report m-5 border p-3" dir="rtl" lang="ar">
      <div className="logo-print-tb mb-5" />

      <div className="d-flex justify-content-between align-items-center">
        <div>
          <div className="px-5 mb-3">شركة تساهيل للتمويل متناهي الصغر</div>
          <div className="px-5">{timeToArabicDateNow(true)}</div>
        </div>
        <div className="px-5 mb-3">{props.branchName}</div>
      </div>
      <div className="d-flex m-3 justify-content-center">
        {type === 'lts' ? (
          <div className="px-5">
            ملاحظات علي حالة التمويل {subTypeLocal[subType]}
          </div>
        ) : (
          <div className="px-5">ملاحظات علي حالة تمويل الشركات</div>
        )}
      </div>
      <table className="d-flex justify-content-center">
        <tbody>
          <tr>
            {tableArray.map(
              (t, index) =>
                !t.hide && (
                  <th key={`${t.title}-${index}`} className="gray frame px-2">
                    {t.title}
                  </th>
                )
            )}
          </tr>
          <tr>
            {tableArray.map(
              (t, ti) =>
                !t.hide && (
                  <td
                    key={ti}
                    className="border px-1 py-1 text-break"
                    style={t.style ? t.style : {}}
                  >
                    {t.key === 'previousLoan' &&
                    Array.isArray(t.key) &&
                    t.key.length
                      ? data[t.key].map((v, i) => (
                          <p
                            className={
                              i + 1 < data[t.key].length ? 'border-bottom' : ''
                            }
                          >
                            {v}
                          </p>
                        ))
                      : data[t.key] || local.na}
                  </td>
                )
            )}
          </tr>
        </tbody>
      </table>

      {/* <div className="d-flex mt-2">
        <div className="gray frame px-3">اجمالي</div>
        <div className="border px-3">{numbersToArabic(data.principal)}</div>
        <div className="border px-3">
          {new Tafgeet(data.principal, 'EGP').parse()}
        </div>
      </div> */}

      <div className="d-flex justify-content-between flex-wrap mt-4">
        {data[isEntitled]?.map((g, i) => (
          <div className="d-flex">
            <div>
              {isEntitled === 'guarantors'
                ? local.guarantor
                : local.entitledToSign}{' '}
              {getIndexOfGuarantorInAr(i - 2)}:
            </div>
            {isEntitledKeys.map((key) => (
              <div className="border px-2">{g[key]}</div>
            ))}
          </div>
        ))}
      </div>

      <div className="d-flex mt-4">
        <div className="font-weight-bold mr-2">ملاحظات:</div>
        <div className="mr-3">
          {data.inReviewNotes?.map((c, i) => (
            <div key={i} className="d-flex mr-3 flex-wrap">
              {numbersToArabic(i + 1)}- {c}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CommentsReport
