import React from 'react'
import Tafgeet from 'tafgeetjs'
import { Header } from '../../../../Shared/Components/pdfTemplates/pdfTemplateCommon/header'
import {
  guarantorOrderLocal,
  timeToArabicDate,
} from '../../../../Shared/Services/utils'
import { AcknowledgmentOfCommitmentProps } from './types'

export const AcknowledgmentOfCommitment = ({
  application,
  branchDetails,
}: AcknowledgmentOfCommitmentProps) => {
  return (
    <>
      <div className="contract-container" dir="rtl" lang="ar">
        <Header
          title="إقرار بالالتزام بمديونية"
          showCurrentUser={false}
          showCurrentTime={false}
          sme
        />
        <p>التاريخ : {timeToArabicDate(application.creationDate, false)} </p>
        {application.entitledToSign?.map((person, index) => (
          <p key={index}>
            {!index
              ? ` اقر انا / ${person.customer.customerName} `
              : `و ${person.customer.customerName}`}
          </p>
        ))}
        <p>الممثل القانوني لشركة / {application.customer?.businessName}</p>
        {application.guarantors?.map((person, index) => (
          <div key={index} className="d-flex justify-content-between">
            <span>
              {guarantorOrderLocal[index]}/ {person.customerName ?? ''}{' '}
            </span>
          </div>
        ))}
        <div className="d-flex justify-content-between">
          <span>نوع النشاط/ {application.customer?.businessSector ?? ''} </span>
          <span> فرع التعامل/ {branchDetails?.name}</span>
        </div>
        <p>
          بأنني قد تسلمت تمويل قدره {application.principal} جم (
          {new Tafgeet(application.principal, 'EGP').parse()})
        </p>
        <p>
          من شركة تساهيل للتمويل متناهي الصغر بتاريخ
          {timeToArabicDate(application.creationDate, false)} وذلك بهدف تطوير
          وزيادة رأس مال النشاط وانني غير متضرر من الظروف الحالية والتي لها
          تأثير عام علي جميع الانشطة الاقتصادية والمشروعات وقد ينتج عن هذه
          الاحداث ركود في حركات البيع والشراء .
        </p>
        <p>
          لذا وبناء علي رغبتي أرفض عمل أي جدولة للتمويل أو تأجيل للاقساط أو
          الحصول علي فترة سماح لاي أقساط مستحقة طوال فترة التمويل وبأنني ملتزم
          بسداد الاقساط طبقا لجدول الاقساط المسلم لي من الشركة .
        </p>
        <p>
          كما نقر ونقرر بالمديونية المستحقة علينا بأجمالي المبلغ سالف الذكر
          عالية لصالح الشركة.
        </p>
        <p style={{ textAlign: 'center' }}>وهذا أقرار منا بذلك</p>
        <p>المقرين بما فيه</p>
        <p>شركة / {application.customer?.businessName}</p>
        {application.entitledToSign?.map((entitledToSign) => (
          <>
            <p>الاسم / {entitledToSign.customer?.customerName} </p>
            <p className="py-3">التوقيع/</p>
          </>
        ))}
        {application.guarantors?.map((person, index) => (
          <div key={index}>
            <p>
              {guarantorOrderLocal[index]}/ {person.customerName ?? ''}{' '}
            </p>
            <p className="py-3">التوقيع/</p>
          </div>
        ))}
      </div>
    </>
  )
}
AcknowledgmentOfCommitment.defaultProps = {
  application: {},
}
