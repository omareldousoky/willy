import React from 'react'
import { AcknowledgmentWasSignedInFrontProps } from '../../../../Models/consumerContract'
import {
  timeToArabicDate,
  numbersToArabic,
  guarantorOrderLocal,
} from '../../../../Services/utils'
import { Header } from '../../pdfTemplateCommon/header'

import './styles.scss'

export const AcknowledgmentWasSignedInFront = ({
  customerName,
  nationalId,
  customerCreationDate,
  customerGuarantors,
  isCF,
}: AcknowledgmentWasSignedInFrontProps) => {
  return (
    <>
      <div className="contract-container" dir="rtl" lang="ar">
        <table>
          <Header
            title=""
            showCurrentUser={false}
            showCurrentTime={false}
            cf={isCF}
          />
          <div>
            <p className="head-title">إقرار تم التوقيع امامي</p>
          </div>
          <p>التاريخ : {timeToArabicDate(customerCreationDate, false)} </p>
          <p>نقر نحن الموقعان أدناه :-</p>
          <div className="d-flex justify-content-between">
            <span>الاسم / </span>
            <span>الموظف بشركة (تساهيل أو مشروعي)</span>
          </div>
          <p>الوظيفة /</p>
          <div className="d-flex justify-content-between">
            <span>الاسم / </span>
            <span>الموظف بشركة (تساهيل أو مشروعي)</span>
          </div>
          <p>الوظيفة /</p>
          <p>
            بأن توقيع
            {customerGuarantors?.length === 1
              ? 'كل من العميل و الضامن المدرجين'
              : customerGuarantors?.length === 2
              ? 'كل من العميل و الضامنين المدرجين'
              : 'العميل المدرج'}
            &nbsp; بالجدول قد تم امامي و أن جميع بيانات و مستندات و عقود و أوراق
            العميل و عقد الوديعة و السندات لأمر و إذن صحيحة و تحت مسئوليتي و
            أنني قمت بمطابقة أصل بطاقة الرقم القومي له مع الصور المرفقة بطلب
            التمويل (وجه و ظهر) و أنني قمت بمطابقتها معه و التأكد منه و أتحمل
            كافة المسئوليات بهذا الشأن .
          </p>
          <table className="w-100">
            <tbody>
              <tr>
                {customerGuarantors && customerGuarantors?.length > 0 && (
                  <th>الصفة</th>
                )}
                <th>اسم العميل</th>
                <th className="w-25">الرقم القومي</th>
              </tr>
              <tr>
                {customerGuarantors && customerGuarantors?.length > 0 && (
                  <td>العميل</td>
                )}
                <td>{customerName}</td>
                <td>{numbersToArabic(nationalId)}</td>
              </tr>
              {customerGuarantors?.map((person, index) => (
                <tr key={index}>
                  <td>{guarantorOrderLocal[index]}</td>
                  <td>{person.customerName ?? ''} </td>
                  <td>{numbersToArabic(person.nationalId)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <br />
          <p>القائم بالمراجعة</p>
          <p className="py-2">الاسم /</p>
          <p className="py-2">التوقيع /</p>
          <hr />
          <p className="py-2">الاسم /</p>
          <p className="py-2"> التوقيع /</p>
        </table>
      </div>
    </>
  )
}
