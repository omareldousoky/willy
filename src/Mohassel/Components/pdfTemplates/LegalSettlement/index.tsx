import React from 'react'

import './index.scss'

import local from '../../../../Shared/Assets/ar.json'
import {
  extractLastChars,
  timeToArabicDateNow,
} from '../../../../Shared/Services/utils'
import { SettledCustomer } from '../../ManageLegalAffairs/LegalCustomersList'
import { Managers } from '../../managerHierarchy/branchBasicsCard'

const LegalSettlement = ({
  customer,
  branchName,
  managers,
}: {
  customer: SettledCustomer
  branchName: string
  managers: Managers
}) => {
  const customerSettlement = customer.settlement

  return (
    <div className="legal-settlement__container">
      <div className="headtitle">
        <div className="d-flex justify-content-between">
          <div>
            <span>شركة تساهيل للتمويل متناهي الصغر</span> <br />
            <u>فرع: {branchName}</u>
          </div>

          <div>
            <span>{timeToArabicDateNow(true)}</span> <br />
            <span>تمت المراجعه</span>
          </div>
        </div>

        <div className="center">
          طلب ({local[customerSettlement.settlementType]})
        </div>
      </div>
      <div className="marginlineheight">
        <div>تحريرا في: {timeToArabicDateNow(false)}</div>
        <div>
          من الأستاذ/ {managers.branchManager?.name} مدير فرع /{branchName}
        </div>
        <div>إلي الأستاذ/ مشرف المنطقة {managers.areaSupervisor?.name}</div>
        <div>إلي الأستاذ/ مدير العمليات {managers.operationsManager?.name}</div>
        <div>إلي الأستاذ/ المدير المالي</div>
        <div>
          يرجي الموافقه علي الإجراء المطلوب للعميل/ {customer.customerName}، حسب
          البيان التالي
        </div>
      </div>

      <table className="procedure">
        <thead>
          <tr>
            <th>الإجراء المطلوب</th>
            <th colSpan={3}>بيانات القضيه</th>
            <th colSpan={2}>المحامي</th>
            <th>سداد الغرامه</th>
            <th>سداد مصاريف قضائيه</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td rowSpan={3}>{local[customerSettlement.settlementType]}</td>
            <td>{customerSettlement.caseNumber}</td>
            <td>{customerSettlement.caseYear}</td>
            <td>{customerSettlement.court}</td>
            <td colSpan={2}>{customerSettlement.lawyerName}</td>
            <td className="center" rowSpan={2}>
              <input
                type="checkbox"
                defaultChecked={customerSettlement.penaltiesPaid}
              />
            </td>
            <td className="center" rowSpan={2}>
              <input
                type="checkbox"
                defaultChecked={customerSettlement.courtFeesPaid}
              />
            </td>
          </tr>
          <tr>
            <td colSpan={3} rowSpan={2}>
              {customerSettlement.courtDetails}
            </td>
            <td style={{ width: 'fit-content' }}>
              {customerSettlement.lawyerPhoneNumberOne}
            </td>
            <td>{customerSettlement.lawyerPhoneNumberTwo}</td>
          </tr>
          <tr>
            <td colSpan={2}>{customerSettlement.lawyerPhoneNumberThree}</td>
            <td className="center">{customerSettlement.penaltyFees}</td>
            <td className="center">{customerSettlement.courtFees}</td>
          </tr>
        </tbody>

        <tbody>
          <tr>
            <td rowSpan={2}>بيانات التمويل:</td>
            <th colSpan={3}>عميل / ضامن / عضو</th>
            <th>كود التمويل</th>
            <th colSpan={3}>العميل الفردي / المجموعه</th>
          </tr>

          <tr>
            <td>{local[customer.customerType]}</td>
            <td>{customer.customerKey}</td>
            <td>{customer.customerName}</td>
            <td>{extractLastChars(customer.loanKey + '', 3)}</td>
            <td>{customer.customerKey}</td>
            <td colSpan={2}>{customer.customerName}</td>
          </tr>
        </tbody>
      </table>

      <div className="marginlineheight">
        <div>
          <u>التفاصيل:</u>
        </div>
      </div>

      <div style={{ height: '10em' }}></div>

      <table>
        <thead>
          <tr className="headtitle center">
            <th>مدير الفرع</th>
            <th>مشرف المنطقه</th>
            <th>مدير المنطقه</th>
            <th>المدير المالي</th>
          </tr>
        </thead>

        <div style={{ height: '1.5em' }}></div>

        <tbody>
          <tr className="center">
            <td>------------------</td>
            <td>------------------</td>
            <td>------------------</td>
            <td>------------------</td>
          </tr>
        </tbody>
      </table>

      <div style={{ height: '10em' }}></div>

      <footer className="d-flex">
        <span className="mr-3">** يجب إرفاق الاتى :</span>
        <span className="mr-5 d-flex align-items-center">
          <input className="mr-1" type="checkbox" /> <span>صوره من الحكم</span>
        </span>
        <span className="mr-5 d-flex align-items-center">
          <input className="mr-1" type="checkbox" />
          <span>شهادة من الجدول الجنائى ببيانات القضيه</span>
        </span>
        <span className="d-flex align-items-center">
          <input className="mr-1" type="checkbox" />
          <span>صورة من كارنيه المحامى المراد إصدار التوكيل له</span>
        </span>
      </footer>
    </div>
  )
}

export default LegalSettlement
