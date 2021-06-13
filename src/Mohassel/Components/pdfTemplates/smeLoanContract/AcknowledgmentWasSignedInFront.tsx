import React from "react";
import {
  guarantorOrderLocal,
  orderLocal,
} from "../../../../Shared/Services/utils";
import { Header } from "../pdfTemplateCommon/header";
import { AcknowledgmentWasSignedInFrontProps } from "./types";

export const AcknowledgmentWasSignedInFront = ({
  application,
}: AcknowledgmentWasSignedInFrontProps) => {
  return (
    <>
      <div className="contract-container" dir="rtl" lang="ar">
        <Header
          title="إقرار تم التوقيع أمامي "
          showCurrentUser={false}
          showCurrentTime={false}
        />
        <p>نقر نحن الموقعان أدناه :-</p>
        <div className="d-flex justify-content-between">
          <span>الاسم / </span>
          <span> الموظف بشركة تساهيل للتمويل فرع</span>
        </div>
        <p>الوظيفة /</p>
        <div className="d-flex justify-content-between">
          <span>الاسم / </span>
          <span> الموظف بشركة تساهيل للتمويل فرع</span>
        </div>
        <p>الوظيفة /</p>
        <p>
          بأن توقيع كل من من له حق التوقيع عن النشاط والضامنين المدرجين بالجدول
          تم أمامي وأن جميع بيانات الشيكات وايصالات الامانة والسندات الأذنية الخاصة بهم صحيحة
          وتحت مسئوليتي وإنني قمت بمطابقة أصول بطاقات الرقم القومي لهم مع الصور
          المرفقة بطلب التمويل ( وش وظهر ) وإنني قمت بمطابقتها مع الاشخاص
          الحقيقيين والتأكد منهم وأتحمل مسئولية ذلك .
        </p>
        <table className="w-100">
          <tbody>
            <tr>
              <th>الاسم</th>
              <th className="w-25">الكود</th>
            </tr>
            <tr>
              <td>أسم الشركة / {application.customer?.businessName ?? ""}</td>
              <td></td>
            </tr>
            {application.entitledToSign?.map((person, index) => (
              <tr key={index}>
                <td>
                  من له حق التوقيع والاقتراض {orderLocal[index]} /{" "}
                  {person.customerName ?? ""}{" "}
                </td>
                <td></td>
              </tr>
            ))}
            {application.guarantors?.map((person, index) => (
              <tr key={index}>
                <td>
                  {guarantorOrderLocal[index]}/ {person.customerName ?? ""}{" "}
                </td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>
        <br />
        <p>القائم بالمراجعة</p>
        <p>الاسم /</p>
        <p>التوقيع /</p>
        <p>الاسم /</p>
        <p>التوقيع /</p>
      </div>
    </>
  );
};
AcknowledgmentWasSignedInFront.defaultProps = {
  application: {},
};
