import React from 'react'

import './index.scss'

import { DefaultedCustomer } from '../../ManageLegalAffairs/defaultingCustomersList'
import local from '../../../../Shared/Assets/ar.json'
import { IPrintAction } from '../../ManageLegalAffairs/types'
import { extractLastChars } from '../../../../Shared/Services/utils'

const LegalSettlement = ({
  action,
  customer,
}: {
  action: IPrintAction
  customer: DefaultedCustomer
}) => {
  return (
    <div className="legal-settlement__container">
      <div className="headtitle">
        <div>شركة تساهيل للتمويل متناهي الصغر</div>
        <div>
          <u>فرع: المنوفيه - منوف</u>
        </div>
        <div></div>
        <div className="center">طلب {action.label}</div>
      </div>
      <div className="marginlineheight">
        <div>تحريرا في: 2020/09/01</div>
        <div>
          من الأستاذ/ --------------------------------------- مدير فرع /
          المنوفيه - منوف
        </div>
        <div>إلي الأستاذ/ مشرف المنطقة</div>
        <div>إلي الأستاذ/ مدير العمليات</div>
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
            <td rowSpan={3}>{action.label}</td>
            <td>1601</td>
            <td>2020</td>
            <td>جنح مركز منوف</td>
            <td colSpan={2}>سامح جلال ابو عطيه صقر</td>
            <td className="center" rowSpan={2}>
              <input type="checkbox" />
            </td>
            <td className="center" rowSpan={2}>
              <input type="checkbox" />
            </td>
          </tr>
          <tr>
            <td colSpan={3} rowSpan={2}>
              ايصال الأمانه/ تاريخ الجلسه 3/11/2020
              <br />
              إستئناف أول جلسه رقم المحضر 6869/2020
              <br />
              رقم الحكم الإبتدائي/
              <br />
              رقم الحكم الإستئنافي/
              <br />
              تاريخ الجلسه/
            </td>
            <td style={{ width: 'fit-content' }}>01222790490</td>
            <td></td>
          </tr>
          <tr>
            <td colSpan={2}></td>
            <td className="center">335</td>
            <td className="center">1000</td>
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
            <td>{customer.customerName}</td>
            <td>{customer.customerKey}</td>
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
        <div>المحامي : سامح جلال ابو عطيه صقر</div>
      </div>

      <div style={{ height: '10em' }}></div>

      <table>
        <thead>
          <tr className="headtitle">
            <th> رقم الحكم الابتدائي</th>
            <th>رقم الحكم الاستئنافي</th>
            <th>تاريخ الجلسة</th>
          </tr>
        </thead>
      </table>

      <div style={{ height: '5em' }}></div>

      <table>
        <thead>
          <tr className="headtitle">
            <th>مدير الفرع</th>
            <th>مشرف المنطقه</th>
            <th>مدير المنطقه</th>
            <th>المدير المالي</th>
          </tr>
        </thead>
      </table>

      <div style={{ height: '5em' }}></div>
    </div>
  )
}

export default LegalSettlement
