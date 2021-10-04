import React from 'react'
import { Header } from '../../../../Shared/Components/pdfTemplates/pdfTemplateCommon/header'
import {
  guarantorOrderLocal,
  orderLocal,
  timeToArabicDate,
} from '../../../../Shared/Services/utils'
import { AcknowledgmentWasSignedInFrontProps } from './types'

export const AcknowledgmentWasSignedInFront = ({
  application,
  branchDetails,
}: AcknowledgmentWasSignedInFrontProps) => {
  return (
    <>
      <div className="contract-container" dir="rtl" lang="ar">
        <Header
          title="إقرار تم التوقيع أمامي "
          showCurrentUser={false}
          showCurrentTime={false}
          sme
        />
        <p>التاريخ : {timeToArabicDate(application.creationDate, false)} </p>
        <p>نقر نحن الموقعان أدناه :-</p>
        <div className="d-flex justify-content-between">
          <span>الاسم / </span>
          <span>
            الموظف بشركة تساهيل للتمويل متناهي الصغر فرع {branchDetails?.name}
          </span>
        </div>
        <p>الوظيفة /</p>
        <div className="d-flex justify-content-between">
          <span>الاسم / </span>
          <span>
            الموظف بشركة تساهيل للتمويل متناهي الصغر فرع {branchDetails?.name}
          </span>
        </div>
        <p>الوظيفة /</p>
        <p>
          بأن توقيع كل من من له حق التوقيع عن النشاط والضامنين المدرجين بالجدول
          تم أمامي وأن جميع بيانات الشيكات والسندات لأمر واذن وكافة المستندات
          والعقود وأوراق القبض بكافة أنواعها والكفالة التضامنية الخاصة بهم صحيحة
          وتحت مسئوليتي وإنني قمت بمطابقة أصول بطاقات الرقم القومي لهم مع الصور
          المرفقة بطلب التمويل ( وش وظهر ) وإنني قمت بمطابقتها مع الاشخاص
          الحقيقيين والتأكد منهم وأتحمل كافة المسئوليات بهذا الشأن .
        </p>
        <table className="w-100">
          <tbody>
            <tr>
              <th>الاسم</th>
              <th className="w-25">الكود</th>
            </tr>
            <tr>
              <td>أسم الشركة / {application.customer?.businessName ?? ''}</td>
              <td>{application.customer?.key}</td>
            </tr>
            {application.entitledToSign?.map((person, index) => (
              <tr key={index}>
                <td>
                  من له حق التوقيع والاقتراض {orderLocal[index]} /{' '}
                  {person.customer.customerName ?? ''}{' '}
                </td>
                <td>{person.customer.key} </td>
              </tr>
            ))}
            {application.guarantors?.map((person, index) => (
              <tr key={index}>
                <td>
                  {guarantorOrderLocal[index]}/ {person.customerName ?? ''}{' '}
                </td>
                <td>{person.key}</td>
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
      </div>
    </>
  )
}
AcknowledgmentWasSignedInFront.defaultProps = {
  application: {},
}
