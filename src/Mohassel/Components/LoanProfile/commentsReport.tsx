import React, { FC, CSSProperties } from 'react'
import {
  numbersToArabic,
  timeToArabicDateNow,
  getIndexOfGuarantorInAr,
} from 'Shared/Services/utils'
import * as local from 'Shared/Assets/ar.json'
import './commentsReport.scss'
import {
  CommentsReportOBJ,
  CommentsReportApplication,
} from 'Shared/Models/operationsReports'
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
  render?: (data: CommentsReportApplication[]) => JSX.Element[] | string
}

const CommentsReport: FC<Props> = (props) => {
  const { data, type, subType } = props

  const activeLoan = data.applications?.find((app) => app.active === true)

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
      render: () =>
        `${activeLoan?.businessSector || ''} ${
          activeLoan?.businessActivity
            ? `- ${activeLoan?.businessActivity}`
            : ''
        } ${
          activeLoan?.businessSpeciality
            ? `- ${activeLoan?.businessSpeciality}`
            : ''
        }`,
    },
    {
      title: 'تمويل سابق',
      key: 'previousLoan',
      style: { minWidth: 100 },
      render: (applications) => {
        const previous = applications.filter((app) => !app.active)
        return previous.length
          ? previous.map((app, index) => (
              <div
                key={index}
                className={`${index > 0 && 'border-top'}`}
              >{`${app.principal}/${app.noInstallments}`}</div>
            ))
          : local.na
      },
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
              (row, index) =>
                !row.hide && (
                  <th key={`${row.title}-${index}`} className="gray frame px-2">
                    {row.title}
                  </th>
                )
            )}
          </tr>
          <tr>
            {tableArray.map(
              (row, index) =>
                !row.hide && (
                  <td
                    key={`${row.key}-${index}`}
                    className="border px-1 py-1 text-break"
                    style={row.style || {}}
                  >
                    {row.render
                      ? row.render(data.applications || [])
                      : activeLoan?.[row.key]}
                  </td>
                )
            )}
          </tr>
        </tbody>
      </table>

      <div className="d-flex mt-2">
        <div className="gray frame px-3">{local.totalGeneral}</div>
        <div className="border px-3">
          {numbersToArabic(activeLoan?.principal)}
        </div>
        <div className="border px-3">
          {new Tafgeet(activeLoan?.principal, 'EGP').parse()}
        </div>
      </div>

      <div className="d-flex justify-content-between flex-wrap mt-4">
        {data.entitledToSign &&
          data.entitledToSign.map((key, i) => (
            <div key={`${i}-${key.entitledToSignKey}`} className="d-flex">
              <div>
                {local.entitledToSign} {getIndexOfGuarantorInAr(i - 2)}:
              </div>
              <div className="border px-2">
                {key.entitledToSignKey || local.na}
              </div>
              <div className="border px-2">
                {key.entitledToSignName || local.na}
              </div>
              <div className="border px-2">
                {key.entitledToSignNid || local.na}
              </div>
            </div>
          ))}
      </div>

      <div className="d-flex justify-content-between flex-wrap mt-4">
        {data.guarantors &&
          data.guarantors.map((key, i) => (
            <div key={`${i}-${key.guarantorKey}`} className="d-flex">
              <div>
                {local.guarantor} {getIndexOfGuarantorInAr(i - 2)}:
              </div>
              <div className="border px-2">{key.guarantorKey || local.na}</div>
              <div className="border px-2">{key.guarantorName || local.na}</div>
              <div className="border px-2">{key.guarantorNid || local.na}</div>
            </div>
          ))}
      </div>

      {data.inReviewNotes?.length && (
        <div className="d-flex mt-4">
          <div className="font-weight-bold mr-2">{local.comments}:</div>
          <div className="mr-3 w-50">
            {data.inReviewNotes?.map((note, i) => (
              <div key={i} className="mr-3 text-break">
                {numbersToArabic(i + 1)}- {note}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default CommentsReport
