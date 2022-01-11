import React, { FC } from 'react'
import { numbersToArabic, timeToArabicDateNow } from 'Shared/Services/utils'
import * as local from 'Shared/Assets/ar.json'
import './commentsReport.scss'

interface Props {
  branchName: string
}

const CommentsReport: FC<Props> = (props) => {
  const comments = [
    [
      'توقيع العميل و الضامنين علي الاقرار',
      'الاستعلام الجيد و معاينه مشرف المنطقه و مدير المنطقه',
    ],
    [
      'كتابه العنوان تفصيليا علي ايصال المرافق الخاص بنشاط العميل من قبل مدير الفرع و التوقيع عليه بالاطلاع',
      'اثبات سكن الضامن الاول بايصال مرافق حديث',
    ],
  ]

  const data = [
    {
      customerCode: '123376457344',
      customerName: 'fjajsdfjadsf feetr',
      loanUsage: 'fjkajsdfjasdj jewjjrjngf jfg',
      previousLoan: '0',
      currentLoan: '50,000',
      loanTime: '12',
      allowance: '0',
      fees: '500',
      nationalId: '234727482147871',
      officerName: 'fjjasdfj jadfjeurtjfg dfgg',
      branchManger: 'jasdjfad jerjeurnf',
    },
    {
      customerCode: '123376457344',
      customerName: 'fjajsdfjadsf feetr',
      loanUsage: 'fjkajsdfjasdj jewjjrjngf jfg',
      previousLoan: '0',
      currentLoan: '50,000',
      loanTime: '12',
      allowance: '0',
      fees: '500',
      nationalId: '234727482147871',
      officerName: 'fjjasdfj jadfjeurtjfg dfgg',
      branchManger: 'jasdjfad jerjeurnf',
    },
  ]

  const tableArray = [
    {
      title: local.code,
      key: 'customerCode',
    },
    {
      title: local.customerName,
      key: 'customerName',
    },
    {
      title: 'المشروع',
      key: 'loanUsage',
    },
    {
      title: 'تمويل سابق',
      key: 'previousLoan',
    },
    {
      title: 'تمويل حالي',
      key: 'currentLoan',
    },
    {
      title: 'المده',
      key: 'loanTime',
    },
    {
      title: 'سماح',
      key: 'allowance',
    },
    {
      title: 'الرسوم',
      key: 'fees',
    },
    {
      title: local.nationalId,
      key: 'nationalId',
    },
    {
      title: 'اسم الاخصائي',
      key: 'officerName',
    },
    {
      title: local.branchManager,
      key: 'branchManger',
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
        <div className="px-5">ملاحظات علي حالة التمويل الفردي</div>
      </div>
      <table className="d-flex justify-content-center">
        <tbody>
          <tr>
            <tr>
              {tableArray.map((t, index) => (
                <th key={index} className="gray frame px-1">
                  {t.title}
                </th>
              ))}
            </tr>
            {data.map((d, di) => (
              <tr key={di} className="border">
                {tableArray.map((t, ti) => (
                  <td key={ti} className="border-left border-bottom px-1">
                    {d[t.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tr>
          <tr>
            <div className="d-flex w-100 border">
              <div className="gray frame px-4">test</div>
              <div className="border-left px-3">1</div>
              <div className="border-left px-3">50,000</div>
              <div className="border-left px-3">50,000</div>
              <div className="px-2">50,000</div>
            </div>
          </tr>
          <tr>
            <div className="d-flex justify-content-between w-100 mt-2">
              <div>test</div>
              <div>test</div>
            </div>
          </tr>
          <tr>
            <div className="d-flex mt-4">
              <div className="font-weight-bold mr-2">ملاحظات:</div>
              <div className="mr-3">
                {comments.map((c, i) => (
                  <div key={i} className="d-flex flex-row">
                    {c.map((d, t) => (
                      <div
                        key={t}
                        className="justify-content-evenly mr-3 flex-wrap"
                      >
                        {numbersToArabic(i + 1 + (t + i))}- {d}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default CommentsReport
