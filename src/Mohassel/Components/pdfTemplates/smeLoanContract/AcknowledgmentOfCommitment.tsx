import React from "react";
import { Application } from "../../../../Shared/Services/interfaces";
import { guarantorOrderLocal } from "../../../../Shared/Services/utils";
import { Header } from "../pdfTemplateCommon/header";

export const AcknowledgmentOfCommitment = ({
  application,
}: {
  application: Application;
}) => {
  return (
    <>
      <div className="contract-container" dir="rtl" lang="ar">
        <Header
          title="إقرار بالالتزام"
          showCurrentUser={false}
          showCurrentTime={false}
        />
        <p>أقر أنا / -</p>
        <p>الممثل القانوني لشركة / {application.customer?.businessName}</p>
        {application.guarantors?.map((person, index) => (
          <div key={index} className="d-flex justify-content-between">
            <span>
              {guarantorOrderLocal[index]}/ {person.customerName ?? ""}{" "}
            </span>
          </div>
        ))}
        <div className="d-flex justify-content-between">
          <span>
            نوع النشاط/ {application.customer?.businessActivity ?? ""}{" "}
          </span>
          <span> فرع التعامل/ </span>
        </div>
        <p>
          بأنني قد تسلمت تمويل قدره {application.principal} جم
          (_______________________________________________)
        </p>
        <p>
          من شركة تساهيل للتمويل بتاريخ &emsp;/&emsp;/ &emsp; &emsp; &emsp; وذلك
          بهدف تطوير وزيادة رأس مال النشاط وانني غير متضرر من الظروف الحالية
          والتي لها تأثير عام علي جميع الانشطة الاقتصادية والمشروعات وقد ينتج عن
          هذه الاحداث ركود في حركات البيع والشراء .
        </p>
        <p>
          لذا وبناء علي رغبتي أرفض عمل أي جدولة للتمويل أو تأجيل للاقساط أو
          الحصول علي فترة سماح لاي أقساط مستحقة طوال فترة التمويل وبأنني ملتزم
          بسداد الاقساط طبقا لجدول الاقساط المسلم لي من الشركة .
        </p>
        <p>المقر بما فيه</p>
        <p>شركة / {application.customer?.businessName}</p>
        <p>التوقيع/</p>

        {application.guarantors?.map((person, index) => (
          <p key={index}>
            {guarantorOrderLocal[index]}/ {person.customerName ?? ""}{" "}
          </p>
        ))}
      </div>
    </>
  );
};
AcknowledgmentOfCommitment.defaultProps = {
  application: {},
};
